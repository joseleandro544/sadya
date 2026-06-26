// ═══════════════════════════════════════════════════════════
// routes/products.js — Endpoints para Productos y Donaciones
// ═══════════════════════════════════════════════════════════

import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

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

export default router;
