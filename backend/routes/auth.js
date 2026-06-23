// ═══════════════════════════════════════════════════════════
// routes/auth.js — Endpoints de Autenticación (Login)
// ═══════════════════════════════════════════════════════════

import { Router } from 'express';
import bcrypt from 'bcrypt';
import { query } from '../db.js';

const router = Router();

// ── POST /api/auth/login ────────────────────────────────
// Login con contraseña (correo o teléfono + password)
router.post('/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier?.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor ingresa tu correo electrónico o número de celular.',
      });
    }
    if (!password?.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor ingresa tu contraseña.',
      });
    }

    // Search by email OR phone
    const userResult = await query(
      `SELECT u.id_usuario, u.nombres, u.apellidos, u.email, u.telefono, u.password, r.tipo_rol
       FROM t_usuarios u
       JOIN t_roles r ON u.id_rol = r.id_rol
       WHERE u.email = $1 OR u.telefono = $1
       LIMIT 1`,
      [identifier.trim()]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'No se encontró una cuenta con ese correo o teléfono.',
      });
    }

    const user = userResult.rows[0];

    // Verify password with bcrypt
    if (!user.password) {
      return res.status(401).json({
        status: 'error',
        message: 'Esta cuenta no tiene contraseña. Usa el modo "Código" para iniciar sesión.',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Contraseña incorrecta.',
      });
    }

    console.log(`✅ Login exitoso: ${user.nombres} ${user.apellidos || ''} (${user.tipo_rol})`);

    res.status(200).json({
      status: 'ok',
      message: `¡Bienvenido de nuevo, ${user.nombres}!`,
      data: {
        id: user.id_usuario,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono,
        rol: user.tipo_rol,
      },
    });

  } catch (err) {
    console.error('❌ Error en login:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Error interno al iniciar sesión.',
      detail: err.message,
    });
  }
});

// ── POST /api/auth/login-code ───────────────────────────
// Login sin contraseña (solo teléfono — para Campesinos)
// Busca al usuario por teléfono y devuelve si existe
router.post('/auth/login-code', async (req, res) => {
  try {
    const { celular } = req.body;

    if (!celular?.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor ingresa tu número de celular.',
      });
    }

    const userResult = await query(
      `SELECT u.id_usuario, u.nombres, u.apellidos, u.telefono, r.tipo_rol
       FROM t_usuarios u
       JOIN t_roles r ON u.id_rol = r.id_rol
       WHERE u.telefono = $1
       LIMIT 1`,
      [celular.trim()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No se encontró una cuenta con ese número de celular.',
      });
    }

    const user = userResult.rows[0];

    // In production, this is where you'd send an actual OTP via WhatsApp API
    // For now, we just confirm the user exists and simulate OTP sent
    console.log(`📲 Código OTP solicitado para: ${user.nombres} (Tel: ${user.telefono})`);

    res.status(200).json({
      status: 'ok',
      message: 'Código enviado por WhatsApp.',
      data: {
        id: user.id_usuario,
        nombres: user.nombres,
      },
    });

  } catch (err) {
    console.error('❌ Error en login-code:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Error interno al verificar el número.',
      detail: err.message,
    });
  }
});

// ── POST /api/auth/verify-otp ───────────────────────────
// Verifica el OTP y completa el login del campesino
router.post('/auth/verify-otp', async (req, res) => {
  try {
    const { celular, otp } = req.body;

    if (!celular?.trim() || !otp?.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Celular y código OTP son obligatorios.',
      });
    }

    // In production: validate actual OTP from cache/DB
    // For now: accept any 6-digit code
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        status: 'error',
        message: 'El código debe ser de 6 dígitos.',
      });
    }

    const userResult = await query(
      `SELECT u.id_usuario, u.nombres, u.apellidos, u.telefono, r.tipo_rol
       FROM t_usuarios u
       JOIN t_roles r ON u.id_rol = r.id_rol
       WHERE u.telefono = $1
       LIMIT 1`,
      [celular.trim()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No se encontró una cuenta con ese número.',
      });
    }

    const user = userResult.rows[0];

    console.log(`✅ Login OTP exitoso: ${user.nombres} ${user.apellidos || ''} (${user.tipo_rol})`);

    res.status(200).json({
      status: 'ok',
      message: `¡Bienvenido de nuevo, ${user.nombres}!`,
      data: {
        id: user.id_usuario,
        nombres: user.nombres,
        apellidos: user.apellidos,
        telefono: user.telefono,
        rol: user.tipo_rol,
      },
    });

  } catch (err) {
    console.error('❌ Error en verify-otp:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Error interno al verificar el código.',
      detail: err.message,
    });
  }
});

export default router;
