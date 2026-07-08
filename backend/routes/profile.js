// ═══════════════════════════════════════════════════════════
// routes/profile.js — Gestión de Perfiles de Usuario por Rol
// ═══════════════════════════════════════════════════════════

import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// ── GET /api/profile/:userId ────────────────────────────
// Obtiene el perfil completo de un usuario
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Obtener datos base del usuario y su rol
    const userResult = await query(
      `SELECT u.id_usuario, u.nombres, u.apellidos, u.email, u.telefono, u.genero, u.numero_identidad, u.fecha_nacimiento, u.fecha_registro, r.tipo_rol, u.foto_perfil
       FROM t_usuarios u
       JOIN t_roles r ON u.id_rol = r.id_rol
       WHERE u.id_usuario = $1
       LIMIT 1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No se encontró el usuario especificado.',
      });
    }

    const userData = userResult.rows[0];

    // 2. Obtener dirección principal
    const locationResult = await query(
      `SELECT direccion, ciudad, departamento
       FROM t_ubicaciones
       WHERE id_usuario = $1
       ORDER BY es_principal DESC, id_ubicacion ASC
       LIMIT 1`,
      [userId]
    );

    const locationData = locationResult.rows[0] || {
      direccion: '',
      ciudad: '',
      departamento: ''
    };

    // 3. Obtener datos de rol específicos
    let roleSpecificData = {};

    if (userData.tipo_rol === 'Tienda' || userData.tipo_rol === 'Tendero') {
      const storeResult = await query(
        `SELECT nombre_establecimiento, nit, direccion_local, banco, numero_cuenta, tipo_cuenta, tiene_domicilio_propio
         FROM t_datos_tienda
         WHERE id_usuario = $1
         LIMIT 1`,
        [userId]
      );
      if (storeResult.rows.length > 0) {
        roleSpecificData = storeResult.rows[0];
      } else {
        // Fallback si no existía el registro específico
        roleSpecificData = {
          nombre_establecimiento: '',
          nit: '',
          direccion_local: '',
          banco: '',
          numero_cuenta: '',
          tipo_cuenta: '',
          tiene_domicilio_propio: false
        };
      }
    } else if (userData.tipo_rol === 'Domiciliario' || userData.tipo_rol === 'Transportador') {
      const delivererResult = await query(
        `SELECT no_documento, direccion_residencia, banco, numero_cuenta, tipo_cuenta, tipo_repartidor
         FROM t_datos_domiciliario
         WHERE id_usuario = $1
         LIMIT 1`,
        [userId]
      );
      if (delivererResult.rows.length > 0) {
        roleSpecificData = delivererResult.rows[0];
      } else {
        roleSpecificData = {
          no_documento: '',
          direccion_residencia: '',
          banco: '',
          numero_cuenta: '',
          tipo_cuenta: '',
          tipo_repartidor: ''
        };
      }
    } else if (userData.tipo_rol === 'Fundación') {
      const foundationResult = await query(
        `SELECT nombre_fundacion, tiene_transporte_propio
         FROM t_datos_fundacion
         WHERE id_usuario = $1
         LIMIT 1`,
        [userId]
      );
      if (foundationResult.rows.length > 0) {
        roleSpecificData = foundationResult.rows[0];
      } else {
        roleSpecificData = {
          nombre_fundacion: '',
          tiene_transporte_propio: false
        };
      }
    }

    // 4. Unificar toda la información
    const profile = {
      ...userData,
      direccion: locationData.direccion,
      ciudad: locationData.ciudad,
      departamento: locationData.departamento,
      ...roleSpecificData
    };

    res.status(200).json({
      status: 'ok',
      data: profile
    });

  } catch (err) {
    console.error('❌ Error al obtener perfil:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Error interno al obtener la información de perfil.',
      detail: err.message
    });
  }
});

// ── PUT /api/profile/:userId ────────────────────────────
// Actualiza el perfil de un usuario
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      nombres,
      apellidos,
      email,
      telefono,
      genero,
      direccion,
      ciudad,
      foto_perfil,
      fecha_nacimiento,
      // Tienda specific
      nombre_establecimiento,
      direccion_local,
      banco,
      numero_cuenta,
      tipo_cuenta,
      tiene_domicilio_propio,
      // Domiciliario specific
      direccion_residencia,
      tipo_repartidor,
      // Fundación specific
      nombre_fundacion,
      tiene_transporte_propio
    } = req.body;

    // 1. Obtener rol
    const userRoleResult = await query(
      `SELECT r.tipo_rol 
       FROM t_usuarios u
       JOIN t_roles r ON u.id_rol = r.id_rol
       WHERE u.id_usuario = $1
       LIMIT 1`,
      [userId]
    );

    if (userRoleResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No se encontró el usuario a actualizar.',
      });
    }

    const { tipo_rol } = userRoleResult.rows[0];

    // 2. Actualizar tabla base t_usuarios
    await query(
      `UPDATE t_usuarios
       SET nombres = $1, apellidos = $2, email = $3, telefono = $4, genero = $5, foto_perfil = $6, fecha_nacimiento = $7
       WHERE id_usuario = $8`,
      [
        nombres?.trim() || null,
        apellidos?.trim() || null,
        email?.trim() || null,
        telefono?.trim() || null,
        genero?.trim() || null,
        foto_perfil || null,
        fecha_nacimiento || null,
        userId
      ]
    );

    // 3. Actualizar o Insertar t_ubicaciones
    const locationCheck = await query(
      `SELECT id_ubicacion FROM t_ubicaciones WHERE id_usuario = $1 LIMIT 1`,
      [userId]
    );

    if (locationCheck.rows.length > 0) {
      await query(
        `UPDATE t_ubicaciones
         SET direccion = $1, ciudad = $2
         WHERE id_usuario = $3`,
        [direccion?.trim() || 'Sin dirección', ciudad?.trim() || 'Bogotá', userId]
      );
    } else {
      await query(
        `INSERT INTO t_ubicaciones (id_usuario, direccion, ciudad, departamento, es_principal)
         VALUES ($1, $2, $3, 'Sin especificar', true)`,
        [userId, direccion?.trim() || 'Sin dirección', ciudad?.trim() || 'Bogotá']
      );
    }

    // 4. Actualizar tablas de rol específicas
    if (tipo_rol === 'Tienda' || tipo_rol === 'Tendero') {
      const storeCheck = await query(`SELECT id_tienda FROM t_datos_tienda WHERE id_usuario = $1`, [userId]);
      if (storeCheck.rows.length > 0) {
        await query(
          `UPDATE t_datos_tienda
           SET nombre_establecimiento = $1, direccion_local = $2, banco = $3, numero_cuenta = $4, tipo_cuenta = $5, tiene_domicilio_propio = $6
           WHERE id_usuario = $7`,
          [
            nombre_establecimiento?.trim() || 'Establecimiento',
            direccion_local?.trim() || direccion?.trim() || null,
            banco?.trim() || null,
            numero_cuenta?.trim() || null,
            tipo_cuenta?.trim() || null,
            tiene_domicilio_propio || false,
            userId
          ]
        );
      } else {
        await query(
          `INSERT INTO t_datos_tienda (id_usuario, nombre_establecimiento, nit, direccion_local, banco, numero_cuenta, tipo_cuenta, tiene_domicilio_propio)
           VALUES ($1, $2, 'Sin NIT', $3, $4, $5, $6, $7)`,
          [
            userId,
            nombre_establecimiento?.trim() || 'Establecimiento',
            direccion_local?.trim() || direccion?.trim() || null,
            banco?.trim() || null,
            numero_cuenta?.trim() || null,
            tipo_cuenta?.trim() || null,
            tiene_domicilio_propio || false
          ]
        );
      }
    } else if (tipo_rol === 'Domiciliario' || tipo_rol === 'Transportador') {
      const delivererCheck = await query(`SELECT id_domiciliario FROM t_datos_domiciliario WHERE id_usuario = $1`, [userId]);
      if (delivererCheck.rows.length > 0) {
        await query(
          `UPDATE t_datos_domiciliario
           SET direccion_residencia = $1, banco = $2, numero_cuenta = $3, tipo_cuenta = $4, tipo_repartidor = $5
           WHERE id_usuario = $6`,
          [
            direccion_residencia?.trim() || direccion?.trim() || null,
            banco?.trim() || null,
            numero_cuenta?.trim() || null,
            tipo_cuenta?.trim() || null,
            tipo_repartidor?.trim() || null,
            userId
          ]
        );
      } else {
        await query(
          `INSERT INTO t_datos_domiciliario (id_usuario, no_documento, direccion_residencia, banco, numero_cuenta, tipo_cuenta, tipo_repartidor)
           VALUES ($1, 'Sin Documento', $2, $3, $4, $5, $6)`,
          [
            userId,
            direccion_residencia?.trim() || direccion?.trim() || null,
            banco?.trim() || null,
            numero_cuenta?.trim() || null,
            tipo_cuenta?.trim() || null,
            tipo_repartidor?.trim() || null
          ]
        );
      }
    } else if (tipo_rol === 'Fundación') {
      const foundationCheck = await query(`SELECT id_fundacion FROM t_datos_fundacion WHERE id_usuario = $1`, [userId]);
      if (foundationCheck.rows.length > 0) {
        await query(
          `UPDATE t_datos_fundacion
           SET nombre_fundacion = $1, tiene_transporte_propio = $2
           WHERE id_usuario = $3`,
          [nombre_fundacion?.trim() || 'Fundación', tiene_transporte_propio || false, userId]
        );
      } else {
        await query(
          `INSERT INTO t_datos_fundacion (id_usuario, nombre_fundacion, tiene_transporte_propio)
           VALUES ($1, $2, $3)`,
          [userId, nombre_fundacion?.trim() || 'Fundación', tiene_transporte_propio || false]
        );
      }
    }

    console.log(`👤 Perfil actualizado con éxito para el usuario ID: ${userId}`);

    res.status(200).json({
      status: 'ok',
      message: '¡Tu perfil ha sido actualizado con éxito!',
    });

  } catch (err) {
    console.error('❌ Error al actualizar perfil:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Error interno al actualizar la información de perfil.',
      detail: err.message
    });
  }
});

export default router;
