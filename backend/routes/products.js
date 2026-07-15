// ═══════════════════════════════════════════════════════════
// routes/products.js — Endpoints para Productos y Donaciones
// ═══════════════════════════════════════════════════════════

import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// ── GET /api/products/catalog ───────────────────────────
// Obtiene todos los productos activos para el catálogo general,
// calcula la distancia real o asigna distancia simulada.
router.get('/products/catalog', async (req, res) => {
  try {
    const lng = parseFloat(req.query.lng) || -74.068;
    const lat = parseFloat(req.query.lat) || 4.632;

    const viewerRole = (req.query.role || '').toLowerCase();
    const isTendero = viewerRole === 'tienda' || viewerRole === 'tendero';

    let queryStr = `
      SELECT p.id_producto as id, 
              p.id_usuario, 
              p.nombre_producto as name, 
              p.costo_original as original_price, 
              p.costo_con_descuento as price, 
              p.cantidad_disponible as stock, 
              p.fecha_vencimiento, 
              p.categoria, 
              p.descripcion, 
              p.imagen_url as image,
              COALESCE(t.nombre_establecimiento, u.nombres || \' \' || COALESCE(u.apellidos, \'\')) AS store,
              COALESCE(
                ST_DistanceSphere(ubi.coordenadas::geometry, ST_SetSRID(ST_MakePoint($1, $2), 4326)) / 1000.0,
                (1.5 + (p.id_usuario % 10) * 0.4)
              ) AS distance,
              EXTRACT(DAY FROM (p.fecha_vencimiento::timestamp - CURRENT_TIMESTAMP)) AS dias_para_vencer,
              r_sel.tipo_rol AS seller_role,
              u.foto_perfil AS store_logo
       FROM t_productos p
       JOIN t_usuarios u ON p.id_usuario = u.id_usuario
       JOIN t_roles r_sel ON u.id_rol = r_sel.id_rol
       LEFT JOIN t_datos_tienda t ON p.id_usuario = t.id_usuario
       LEFT JOIN t_ubicaciones ubi ON p.id_usuario = ubi.id_usuario AND ubi.es_principal = true
       WHERE p.id_estado IN (1, 4, 6) AND p.cantidad_disponible > 0 AND p.fecha_vencimiento::date >= CURRENT_DATE
    `;

    if (!isTendero) {
      queryStr += ` AND r_sel.tipo_rol NOT IN ('Campesino', 'Productor')`;
    }

    queryStr += ` ORDER BY distance ASC`;

    const result = await query(queryStr, [lng, lat]);

    const mapCategoryToKey = (categoryName) => {
      const cat = (categoryName || '').toLowerCase().trim();
      if (cat.includes('fruta')) return 'frutas';
      if (cat.includes('verdura') || cat.includes('vegetal') || cat.includes('tuberculo') || cat.includes('tubérculo')) return 'verduras';
      if (cat.includes('grano')) return 'granos';
      if (cat.includes('carne') || cat.includes('carniceria') || cat.includes('carnicería')) return 'carnes';
      if (cat.includes('lacteo') || cat.includes('lácteo')) return 'lacteos';
      if (cat.includes('panaderia') || cat.includes('panadería') || cat.includes('pan')) return 'panaderia';
      if (cat.includes('postre') || cat.includes('dulce')) return 'postres';
      if (cat.includes('comida rapida') || cat.includes('comida rápida') || cat.includes('rapida') || cat.includes('rápida')) return 'rapida';
      return cat;
    };

    const formattedData = result.rows.map(row => {
      const price = parseFloat(row.price || row.original_price);
      const originalPrice = parseFloat(row.original_price);
      const discount = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
      
      const diasParaVencer = Math.ceil(row.dias_para_vencer);
      let expiryText = 'Vence Hoy';
      if (diasParaVencer < 0) {
        expiryText = 'Vencido';
      } else if (diasParaVencer === 0) {
        expiryText = 'Vence Hoy';
      } else if (diasParaVencer === 1) {
        expiryText = 'Vence Mañana';
      } else {
        expiryText = `Vence en ${diasParaVencer} días`;
      }

      return {
        id: row.id,
        name: row.name.toUpperCase(),
        store: row.store,
        category: row.categoria.toUpperCase(),
        categoryKey: mapCategoryToKey(row.categoria),
        distance: parseFloat(parseFloat(row.distance).toFixed(1)),
        image: row.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
        price: price,
        originalPrice: originalPrice,
        discount: discount,
        expiryText: expiryText,
        diasParaVencer: diasParaVencer,
        storeLogo: row.store_logo
      };
    });

    res.status(200).json({ status: 'ok', data: formattedData });
  } catch (err) {
    console.error('❌ Error al obtener catálogo de productos:', err.message);
    res.status(500).json({ status: 'error', message: 'Error al obtener catálogo de productos.', detail: err.message });
  }
});

// ── GET /api/products/seller/:userId ────────────────────
// Obtiene todos los productos de un vendedor (campesino o tienda)
router.get('/products/seller/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await query(
      `SELECT p.*, e.nombre_estado 
       FROM t_productos p
       JOIN t_estados_producto e ON p.id_estado = e.id_estado
       WHERE p.id_usuario = $1
       ORDER BY p.fecha_creacion DESC`,
      [userId]
    );
    res.status(200).json({ status: 'ok', data: result.rows });
  } catch (err) {
    console.error('❌ Error al obtener productos del vendedor:', err.message);
    res.status(500).json({ status: 'error', message: 'Error al obtener productos.', detail: err.message });
  }
});

// ── POST /api/products ──────────────────────────────────
// Publica un nuevo producto en el catálogo real
router.post('/products', async (req, res) => {
  try {
    const {
      id_usuario,
      nombre_producto,
      costo_original,
      costo_con_descuento,
      cantidad_disponible,
      fecha_vencimiento,
      categoria,
      descripcion,
      imagen_url
    } = req.body;

    // Validaciones de negocio
    if (!id_usuario) {
      return res.status(400).json({ status: 'error', message: 'El id_usuario es obligatorio.' });
    }
    if (!nombre_producto || nombre_producto.trim() === '') {
      return res.status(400).json({ status: 'error', message: 'El nombre del producto es obligatorio.' });
    }
    if (!costo_original || isNaN(costo_original) || Number(costo_original) <= 0) {
      return res.status(400).json({ status: 'error', message: 'El costo original debe ser un número positivo.' });
    }
    if (!cantidad_disponible || isNaN(cantidad_disponible) || Number(cantidad_disponible) < 0) {
      return res.status(400).json({ status: 'error', message: 'El stock disponible debe ser un número no negativo.' });
    }
    if (!fecha_vencimiento) {
      return res.status(400).json({ status: 'error', message: 'La fecha de vencimiento es obligatoria.' });
    }
    if (!categoria || categoria.trim() === '') {
      return res.status(400).json({ status: 'error', message: 'La categoría es obligatoria.' });
    }

    // Por defecto, se crea en estado 'Inventario' (id_estado = 1) para que aparezca en el catálogo
    const id_estado = 1;

    const result = await query(
      `INSERT INTO t_productos (
         id_usuario, id_estado, nombre_producto, costo_original, costo_con_descuento, 
         cantidad_disponible, fecha_vencimiento, categoria, descripcion, imagen_url, fecha_creacion
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       RETURNING *`,
      [
        id_usuario,
        id_estado,
        nombre_producto.trim(),
        costo_original,
        costo_con_descuento || null,
        cantidad_disponible,
        fecha_vencimiento,
        categoria.trim(),
        descripcion?.trim() || null,
        imagen_url?.trim() || null
      ]
    );

    res.status(201).json({ status: 'ok', message: '¡Producto publicado con éxito en el catálogo!', data: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al crear producto:', err.message);
    res.status(500).json({ status: 'error', message: 'Error al publicar el producto.', detail: err.message });
  }
});

// ── POST /api/products/donate ───────────────────────────
// Registra una donación en t_donaciones y marca el producto como Donado
router.post('/products/donate', async (req, res) => {
  try {
    const { id_producto, id_usuario, cantidad } = req.body;

    if (!id_producto || !id_usuario || !cantidad) {
      return res.status(400).json({ status: 'error', message: 'ID del producto, ID de usuario y cantidad son obligatorios.' });
    }

    // 1. Obtener detalles del producto y validar stock
    const prodResult = await query(
      `SELECT costo_original, costo_con_descuento, cantidad_disponible 
       FROM t_productos 
       WHERE id_producto = $1 AND id_usuario = $2
       LIMIT 1`,
      [id_producto, id_usuario]
    );

    if (prodResult.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado o no pertenece a este usuario.' });
    }

    const prod = prodResult.rows[0];
    const qtyToDonate = Math.min(cantidad, prod.cantidad_disponible);

    if (qtyToDonate <= 0) {
      return res.status(400).json({ status: 'error', message: 'No hay stock disponible en el producto para donar.' });
    }

    const priceUnit = prod.costo_con_descuento || prod.costo_original;
    const priceTotal = qtyToDonate * priceUnit;

    // 2. Insertar el registro en t_donaciones
    await query(
      `INSERT INTO t_donaciones (
         id_producto, cantidad, precio_unidad, precio_total, estado_certificado, fecha_creacion
       ) VALUES ($1, $2, $3, $4, 'Pendiente', NOW())`,
      [id_producto, qtyToDonate, priceUnit, priceTotal]
    );

    // 3. Actualizar estado del producto a 3 (Donado) y restar cantidad
    await query(
      `UPDATE t_productos 
       SET id_estado = 3, cantidad_disponible = cantidad_disponible - $1
       WHERE id_producto = $2`,
      [qtyToDonate, id_producto]
    );

    res.status(200).json({ status: 'ok', message: '¡El producto vencido ha sido donado con éxito a la Fundación!' });
  } catch (err) {
    console.error('❌ Error en donación de producto:', err.message);
    res.status(500).json({ status: 'error', message: 'Error interno al procesar la donación.', detail: err.message });
  }
});

// ── POST /api/products/discard ──────────────────────────
// Descarta un producto vencido (lo marca como Agotado y stock a 0)
router.post('/products/discard', async (req, res) => {
  try {
    const { id_producto, id_usuario } = req.body;

    if (!id_producto || !id_usuario) {
      return res.status(400).json({ status: 'error', message: 'ID del producto y de usuario son obligatorios.' });
    }

    const result = await query(
      `UPDATE t_productos 
       SET id_estado = 5, cantidad_disponible = 0 
       WHERE id_producto = $1 AND id_usuario = $2
       RETURNING *`,
      [id_producto, id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado o no pertenece a este usuario.' });
    }

    res.status(200).json({ status: 'ok', message: 'El producto vencido ha sido descartado y retirado con éxito.' });
  } catch (err) {
    console.error('❌ Error al descartar producto:', err.message);
    res.status(500).json({ status: 'error', message: 'Error interno al descartar el producto.', detail: err.message });
  }
});

export default router;
