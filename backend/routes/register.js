// ═══════════════════════════════════════════════════════════
// routes/register.js — Endpoints de Registro de Usuarios
// ═══════════════════════════════════════════════════════════

import { Router } from 'express';
import bcrypt from 'bcrypt';
import { query } from '../db.js';

const router = Router();

// ── POST /api/register/farmer ───────────────────────────
// Registra un Campesino/Productor con PIN de 4 números
router.post('/register/farmer', async (req, res) => {
  try {
    const { nombreCompleto, direccion, telefono, pin, password } = req.body;

    // ── Validaciones ──
    if (!nombreCompleto || nombreCompleto.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre completo es obligatorio.',
      });
    }
    if (!telefono || telefono.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'El teléfono es obligatorio.',
      });
    }

    const clave = pin || password;
    if (!clave || !/^\d{4}$/.test(String(clave).trim())) {
      return res.status(400).json({
        status: 'error',
        message: 'Debes ingresar una clave (PIN de 4 números).',
      });
    }

    // ── Buscar el id_rol del Campesino/Productor ──
    // Intentamos con "Campesino" primero, si no existe usamos "Productor"
    let rolResult = await query(
      `SELECT id_rol FROM t_roles WHERE tipo_rol = 'Campesino' LIMIT 1`
    );
    if (rolResult.rows.length === 0) {
      rolResult = await query(
        `SELECT id_rol FROM t_roles WHERE tipo_rol = 'Productor' LIMIT 1`
      );
    }
    if (rolResult.rows.length === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'No se encontró el rol de Campesino/Productor en la BD.',
      });
    }

    const idRol = rolResult.rows[0].id_rol;

    // ── Verificar si el teléfono ya está registrado ──
    const existingUser = await query(
      `SELECT id_usuario FROM t_usuarios WHERE telefono = $1`,
      [telefono.trim()]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Este número de teléfono ya está registrado.',
      });
    }

    // ── Separar nombre completo en nombres y apellidos ──
    const partes = nombreCompleto.trim().split(/\s+/);
    let nombres, apellidos;
    if (partes.length <= 2) {
      nombres = partes[0];
      apellidos = partes.slice(1).join(' ') || null;
    } else {
      // Asumimos: primeras 2 palabras = nombres, resto = apellidos
      nombres = partes.slice(0, 2).join(' ');
      apellidos = partes.slice(2).join(' ');
    }

    // ── Encriptar el PIN (Clave) con bcrypt ──
    const hashedPassword = await bcrypt.hash(String(clave).trim(), 10);

    // ── Insertar usuario ──
    const userResult = await query(
      `INSERT INTO t_usuarios (id_rol, nombres, apellidos, telefono, password, metodo_registro)
       VALUES ($1, $2, $3, $4, $5, 'Local')
       RETURNING id_usuario, nombres, apellidos, telefono, fecha_registro`,
      [idRol, nombres, apellidos, telefono.trim(), hashedPassword]
    );

    const newUser = userResult.rows[0];

    // ── Insertar ubicación (dirección de la finca) si se proporcionó ──
    if (direccion && direccion.trim() !== '') {
      await query(
        `INSERT INTO t_ubicaciones (id_usuario, direccion, ciudad, departamento, es_principal)
         VALUES ($1, $2, 'Sin especificar', 'Sin especificar', true)`,
        [newUser.id_usuario, direccion.trim()]
      );
    }

    console.log(`✅ Nuevo campesino registrado: ${nombres} ${apellidos || ''} (ID: ${newUser.id_usuario})`);

    res.status(201).json({
      status: 'ok',
      message: '¡Registro de campesino exitoso!',
      data: {
        id: newUser.id_usuario,
        nombres: newUser.nombres,
        apellidos: newUser.apellidos,
        telefono: newUser.telefono,
        fechaRegistro: newUser.fecha_registro,
      },
    });

  } catch (err) {
    console.error('❌ Error al registrar campesino:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Error interno al registrar el campesino.',
      detail: err.message,
    });
  }
});

// ── POST /api/register/store ────────────────────────────
// Registra una Tienda (con email, contraseña, NIT, datos de tienda)
router.post('/register/store', async (req, res) => {
  try {
    const { nombres, apellidos, email, telefono, password, nombreTienda, nitOrDocumento, hasOwnDelivery, direccion, ciudad } = req.body;

    if (!nombres?.trim() || !apellidos?.trim()) {
      return res.status(400).json({ status: 'error', message: 'Nombres y apellidos son obligatorios.' });
    }
    if (!email?.trim()) {
      return res.status(400).json({ status: 'error', message: 'El correo electrónico es obligatorio.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ status: 'error', message: 'La contraseña debe tener mínimo 8 caracteres.' });
    }
    if (!nombreTienda?.trim()) {
      return res.status(400).json({ status: 'error', message: 'El nombre de la tienda es obligatorio.' });
    }
    if (!nitOrDocumento?.trim()) {
      return res.status(400).json({ status: 'error', message: 'El NIT o Documento es obligatorio.' });
    }

    // Check duplicate email
    const dup = await query('SELECT id_usuario FROM t_usuarios WHERE email = $1', [email.trim()]);
    if (dup.rows.length > 0) {
      return res.status(409).json({ status: 'error', message: 'Este correo electrónico ya está registrado.' });
    }

    // Find role
    let rolResult = await query(`SELECT id_rol FROM t_roles WHERE tipo_rol = 'Tienda' LIMIT 1`);
    if (rolResult.rows.length === 0) {
      rolResult = await query(`SELECT id_rol FROM t_roles WHERE tipo_rol = 'Tendero' LIMIT 1`);
    }
    if (rolResult.rows.length === 0) {
      return res.status(500).json({ status: 'error', message: 'No se encontró el rol de Tienda en la BD.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await query(
      `INSERT INTO t_usuarios (id_rol, nombres, apellidos, email, telefono, password, metodo_registro)
       VALUES ($1, $2, $3, $4, $5, $6, 'Local')
       RETURNING id_usuario, nombres, apellidos, fecha_registro`,
      [rolResult.rows[0].id_rol, nombres.trim(), apellidos.trim(), email.trim(), telefono?.trim() || null, hashedPassword]
    );

    const newUser = userResult.rows[0];

    // Insert store-specific data
    await query(
      `INSERT INTO t_datos_tienda (id_usuario, nombre_establecimiento, nit, tiene_domicilio_propio, direccion_local)
       VALUES ($1, $2, $3, $4, $5)`,
      [newUser.id_usuario, nombreTienda.trim(), nitOrDocumento.trim(), hasOwnDelivery || false, direccion?.trim() || null]
    );

    // Insert into t_ubicaciones
    if (direccion?.trim()) {
      await query(
        `INSERT INTO t_ubicaciones (id_usuario, direccion, ciudad, departamento, es_principal)
         VALUES ($1, $2, $3, 'Sin especificar', true)`,
        [newUser.id_usuario, direccion.trim(), ciudad?.trim() || 'Bogotá D.C.']
      );
    }

    console.log(`✅ Nueva tienda registrada: ${nombreTienda} (Usuario ID: ${newUser.id_usuario})`);

    res.status(201).json({
      status: 'ok',
      message: '¡Tienda registrada con éxito!',
      data: { id: newUser.id_usuario, nombres: newUser.nombres, apellidos: newUser.apellidos },
    });

  } catch (err) {
    console.error('❌ Error al registrar tienda:', err.message);
    res.status(500).json({ status: 'error', message: 'Error interno al registrar la tienda.', detail: err.message });
  }
});

// ── POST /api/register/foundation ───────────────────────
// Registra una Fundación receptora
router.post('/register/foundation', async (req, res) => {
  try {
    const { nombres, apellidos, email, telefono, password, nombreFundacion, tieneTransporte, direccion, ciudad } = req.body;

    if (!nombres?.trim() || !apellidos?.trim()) {
      return res.status(400).json({ status: 'error', message: 'Nombres y apellidos son obligatorios.' });
    }
    if (!email?.trim()) {
      return res.status(400).json({ status: 'error', message: 'El correo electrónico es obligatorio.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ status: 'error', message: 'La contraseña debe tener mínimo 8 caracteres.' });
    }
    if (!nombreFundacion?.trim()) {
      return res.status(400).json({ status: 'error', message: 'El nombre de la fundación es obligatorio.' });
    }

    const dup = await query('SELECT id_usuario FROM t_usuarios WHERE email = $1', [email.trim()]);
    if (dup.rows.length > 0) {
      return res.status(409).json({ status: 'error', message: 'Este correo electrónico ya está registrado.' });
    }

    let rolResult = await query(`SELECT id_rol FROM t_roles WHERE tipo_rol = 'Fundación' LIMIT 1`);
    if (rolResult.rows.length === 0) {
      rolResult = await query(`SELECT id_rol FROM t_roles WHERE tipo_rol = 'Fundacion' LIMIT 1`);
    }
    if (rolResult.rows.length === 0) {
      return res.status(500).json({ status: 'error', message: 'No se encontró el rol de Fundación en la BD.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await query(
      `INSERT INTO t_usuarios (id_rol, nombres, apellidos, email, telefono, password, metodo_registro)
       VALUES ($1, $2, $3, $4, $5, $6, 'Local')
       RETURNING id_usuario, nombres, apellidos, fecha_registro`,
      [rolResult.rows[0].id_rol, nombres.trim(), apellidos.trim(), email.trim(), telefono?.trim() || null, hashedPassword]
    );

    const newUser = userResult.rows[0];

    await query(
      `INSERT INTO t_datos_fundacion (id_usuario, nombre_fundacion, tiene_transporte_propio)
       VALUES ($1, $2, $3)`,
      [newUser.id_usuario, nombreFundacion.trim(), tieneTransporte === 'si']
    );

    // Save actual address as location
    if (direccion?.trim()) {
      await query(
        `INSERT INTO t_ubicaciones (id_usuario, direccion, ciudad, departamento, es_principal)
         VALUES ($1, $2, $3, 'Sin especificar', true)`,
        [newUser.id_usuario, direccion.trim(), ciudad?.trim() || 'Bogotá D.C.']
      );
    }

    console.log(`✅ Nueva fundación registrada: ${nombreFundacion} (Usuario ID: ${newUser.id_usuario})`);

    res.status(201).json({
      status: 'ok',
      message: '¡Fundación registrada con éxito!',
      data: { id: newUser.id_usuario, nombres: newUser.nombres, apellidos: newUser.apellidos },
    });

  } catch (err) {
    console.error('❌ Error al registrar fundación:', err.message);
    res.status(500).json({ status: 'error', message: 'Error interno al registrar la fundación.', detail: err.message });
  }
});

// ── POST /api/register/deliverer ────────────────────────
// Registra un Domiciliario / Transportador
router.post('/register/deliverer', async (req, res) => {
  try {
    const { nombre, apellido, email, ciudad, whatsapp, password, vehiculo, noDocumento, direccion } = req.body;

    if (!nombre?.trim() || !apellido?.trim()) {
      return res.status(400).json({ status: 'error', message: 'Nombre y apellido son obligatorios.' });
    }
    if (!email?.trim()) {
      return res.status(400).json({ status: 'error', message: 'El correo electrónico es obligatorio.' });
    }
    if (!whatsapp?.trim()) {
      return res.status(400).json({ status: 'error', message: 'El número de WhatsApp es obligatorio.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ status: 'error', message: 'La contraseña debe tener mínimo 8 caracteres.' });
    }
    if (!noDocumento?.trim()) {
      return res.status(400).json({ status: 'error', message: 'El número de documento es obligatorio.' });
    }
    if (!direccion?.trim()) {
      return res.status(400).json({ status: 'error', message: 'La dirección de residencia es obligatoria.' });
    }

    const dup = await query('SELECT id_usuario FROM t_usuarios WHERE email = $1', [email.trim()]);
    if (dup.rows.length > 0) {
      return res.status(409).json({ status: 'error', message: 'Este correo electrónico ya está registrado.' });
    }

    let rolResult = await query(`SELECT id_rol FROM t_roles WHERE tipo_rol = 'Domiciliario' LIMIT 1`);
    if (rolResult.rows.length === 0) {
      return res.status(500).json({ status: 'error', message: 'No se encontró el rol de Domiciliario en la BD.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await query(
      `INSERT INTO t_usuarios (id_rol, nombres, apellidos, email, telefono, password, metodo_registro)
       VALUES ($1, $2, $3, $4, $5, $6, 'Local')
       RETURNING id_usuario, nombres, apellidos, fecha_registro`,
      [rolResult.rows[0].id_rol, nombre.trim(), apellido.trim(), email.trim(), whatsapp.trim(), hashedPassword]
    );

    const newUser = userResult.rows[0];

    // Save actual address as location
    if (direccion?.trim()) {
      await query(
        `INSERT INTO t_ubicaciones (id_usuario, direccion, ciudad, departamento, es_principal)
         VALUES ($1, $2, $3, 'Sin especificar', true)`,
        [newUser.id_usuario, direccion.trim(), ciudad?.trim() || 'Bogotá D.C.']
      );
    }

    // Save details to t_datos_domiciliario
    await query(
      `INSERT INTO t_datos_domiciliario (id_usuario, no_documento, direccion_residencia, tipo_repartidor, foto_cedula_url, foto_rostro_url, estado_verificacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        newUser.id_usuario,
        noDocumento.trim(),
        direccion.trim(),
        vehiculo?.trim() || 'moto',
        'uploads/cedula_pending.jpg',
        'uploads/selfie_pending.jpg',
        'Pendiente'
      ]
    );

    console.log(`✅ Nuevo domiciliario registrado: ${nombre} ${apellido} (ID: ${newUser.id_usuario})`);

    res.status(201).json({
      status: 'ok',
      message: '¡Domiciliario registrado con éxito!',
      data: { id: newUser.id_usuario, nombres: newUser.nombres, apellidos: newUser.apellidos },
    });

  } catch (err) {
    console.error('❌ Error al registrar domiciliario:', err.message);
    res.status(500).json({ status: 'error', message: 'Error interno al registrar el domiciliario.', detail: err.message });
  }
});

// ── POST /api/register/merchant ─────────────────────────
// Registra un Comercio (MerchantRegisterPage — formulario alterno de tienda)
router.post('/register/merchant', async (req, res) => {
  try {
    const { nombreTienda, nitOrRut, direccion, nombreContacto, apellidoContacto, email, celular, password, ciudad } = req.body;

    if (!nombreContacto?.trim() || !apellidoContacto?.trim()) {
      return res.status(400).json({ status: 'error', message: 'Nombre y apellido del contacto son obligatorios.' });
    }
    if (!email?.trim()) {
      return res.status(400).json({ status: 'error', message: 'El correo electrónico es obligatorio.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ status: 'error', message: 'La contraseña debe tener mínimo 8 caracteres.' });
    }
    if (!nombreTienda?.trim()) {
      return res.status(400).json({ status: 'error', message: 'El nombre del establecimiento es obligatorio.' });
    }
    if (!nitOrRut?.trim()) {
      return res.status(400).json({ status: 'error', message: 'El NIT o RUT es obligatorio.' });
    }

    const dup = await query('SELECT id_usuario FROM t_usuarios WHERE email = $1', [email.trim()]);
    if (dup.rows.length > 0) {
      return res.status(409).json({ status: 'error', message: 'Este correo electrónico ya está registrado.' });
    }

    let rolResult = await query(`SELECT id_rol FROM t_roles WHERE tipo_rol = 'Tienda' LIMIT 1`);
    if (rolResult.rows.length === 0) {
      rolResult = await query(`SELECT id_rol FROM t_roles WHERE tipo_rol = 'Tendero' LIMIT 1`);
    }
    if (rolResult.rows.length === 0) {
      return res.status(500).json({ status: 'error', message: 'No se encontró el rol de Tienda en la BD.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await query(
      `INSERT INTO t_usuarios (id_rol, nombres, apellidos, email, telefono, password, metodo_registro)
       VALUES ($1, $2, $3, $4, $5, $6, 'Local')
       RETURNING id_usuario, nombres, apellidos, fecha_registro`,
      [rolResult.rows[0].id_rol, nombreContacto.trim(), apellidoContacto.trim(), email.trim(), celular?.trim() || null, hashedPassword]
    );

    const newUser = userResult.rows[0];

    await query(
      `INSERT INTO t_datos_tienda (id_usuario, nombre_establecimiento, nit, direccion_local)
       VALUES ($1, $2, $3, $4)`,
      [newUser.id_usuario, nombreTienda.trim(), nitOrRut.trim(), direccion?.trim() || null]
    );

    if (ciudad?.trim()) {
      await query(
        `INSERT INTO t_ubicaciones (id_usuario, direccion, ciudad, departamento, es_principal)
         VALUES ($1, $2, $3, 'Sin especificar', true)`,
        [newUser.id_usuario, direccion?.trim() || 'Sin especificar', ciudad.trim()]
      );
    }

    console.log(`✅ Nuevo comercio registrado: ${nombreTienda} (Usuario ID: ${newUser.id_usuario})`);

    res.status(201).json({
      status: 'ok',
      message: '¡Comercio registrado con éxito!',
      data: { id: newUser.id_usuario, nombres: newUser.nombres, apellidos: newUser.apellidos },
    });

  } catch (err) {
    console.error('❌ Error al registrar comercio:', err.message);
    res.status(500).json({ status: 'error', message: 'Error interno al registrar el comercio.', detail: err.message });
  }
});

// ── POST /api/register/client ───────────────────────────
// Registra un Cliente (registro implícito vía Login SSO o signup sencillo)
router.post('/register/client', async (req, res) => {
  try {
    const { nombres, apellidos, email, telefono, password, genero } = req.body;

    if (!email?.trim() && !telefono?.trim()) {
      return res.status(400).json({ status: 'error', message: 'Se necesita al menos un correo o teléfono.' });
    }

    if (email?.trim()) {
      const dup = await query('SELECT id_usuario FROM t_usuarios WHERE email = $1', [email.trim()]);
      if (dup.rows.length > 0) {
        return res.status(409).json({ status: 'error', message: 'Este correo electrónico ya está registrado.' });
      }
    }

    let rolResult = await query(`SELECT id_rol FROM t_roles WHERE tipo_rol = 'Cliente' LIMIT 1`);
    if (rolResult.rows.length === 0) {
      return res.status(500).json({ status: 'error', message: 'No se encontró el rol de Cliente en la BD.' });
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const userResult = await query(
      `INSERT INTO t_usuarios (id_rol, nombres, apellidos, email, telefono, password, metodo_registro, genero)
       VALUES ($1, $2, $3, $4, $5, $6, 'Local', $7)
       RETURNING id_usuario, nombres, fecha_registro`,
      [rolResult.rows[0].id_rol, nombres?.trim() || 'Cliente', apellidos?.trim() || null, email?.trim() || null, telefono?.trim() || null, hashedPassword, genero?.trim() || null]
    );

    console.log(`✅ Nuevo cliente registrado (ID: ${userResult.rows[0].id_usuario})`);

    res.status(201).json({
      status: 'ok',
      message: '¡Cliente registrado con éxito!',
      data: { id: userResult.rows[0].id_usuario, nombres: userResult.rows[0].nombres },
    });

  } catch (err) {
    console.error('❌ Error al registrar cliente:', err.message);
    res.status(500).json({ status: 'error', message: 'Error interno al registrar el cliente.', detail: err.message });
  }
});

export default router;
