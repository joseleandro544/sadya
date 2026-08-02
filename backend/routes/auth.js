// ═══════════════════════════════════════════════════════════
// routes/auth.js — Endpoints de Autenticación (Login)
// ═══════════════════════════════════════════════════════════

import { Router } from 'express';
import bcrypt from 'bcrypt';
import { query } from '../db.js';
import { sendSMS, sendEmail } from '../services/notificationService.js';

const router = Router();

// Stores for codes in memory (useful for validation and development testing)
const otpStore = new Map();
const forgotPasswordStore = new Map();

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
      `SELECT u.id_usuario, u.nombres, u.apellidos, u.email, u.telefono, u.password, r.tipo_rol, u.foto_perfil, ub.direccion
       FROM t_usuarios u
       JOIN t_roles r ON u.id_rol = r.id_rol
       LEFT JOIN t_ubicaciones ub ON (ub.id_usuario = u.id_usuario AND ub.es_principal = true)
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
        direccion: user.direccion || '',
        rol: user.tipo_rol,
        foto_perfil: user.foto_perfil,
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
// Busca al usuario por teléfono y envía código por SMS real (si está configurado) o simulación
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

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(celular.trim(), generatedOtp);

    let smsSent = false;
    try {
      smsSent = await sendSMS(
        celular.trim(),
        `SADYA: Tu codigo de inicio de sesion es ${generatedOtp}. Valido por 5 minutos.`
      );
    } catch (smsErr) {
      console.error(`❌ Error al enviar SMS OTP a ${celular.trim()}:`, smsErr.message);
    }

    res.status(200).json({
      status: 'ok',
      message: smsSent 
        ? 'Código de verificación enviado por Mensaje de Texto (SMS).' 
        : 'Código de verificación generado (Simulación).',
      debugCode: (process.env.NODE_ENV === 'development' || !smsSent) ? generatedOtp : undefined,
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

    // Validate length
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        status: 'error',
        message: 'El código debe ser de 6 dígitos.',
      });
    }

    // Verify code matching
    const storedOtp = otpStore.get(celular.trim());
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({
        status: 'error',
        message: 'El código de verificación ingresado es incorrecto o expiró.',
      });
    }

    const userResult = await query(
      `SELECT u.id_usuario, u.nombres, u.apellidos, u.telefono, u.email, r.tipo_rol, u.foto_perfil, ub.direccion
       FROM t_usuarios u
       JOIN t_roles r ON u.id_rol = r.id_rol
       LEFT JOIN t_ubicaciones ub ON (ub.id_usuario = u.id_usuario AND ub.es_principal = true)
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

    // Clean code once validated
    otpStore.delete(celular.trim());

    console.log(`✅ Login OTP exitoso: ${user.nombres} ${user.apellidos || ''} (${user.tipo_rol})`);

    res.status(200).json({
      status: 'ok',
      message: `¡Bienvenido de nuevo, ${user.nombres}!`,
      data: {
        id: user.id_usuario,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono,
        direccion: user.direccion || '',
        rol: user.tipo_rol,
        foto_perfil: user.foto_perfil,
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

// ── POST /api/auth/forgot-password ──────────────────────
// Envía un correo con código de recuperación
router.post('/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor ingresa tu correo electrónico.',
      });
    }

    const userResult = await query(
      `SELECT id_usuario, nombres, email FROM t_usuarios WHERE email = $1 LIMIT 1`,
      [email.trim().toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No se encontró ninguna cuenta registrada con este correo electrónico.',
      });
    }

    const user = userResult.rows[0];

    // Generate random 6-digit recovery token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    forgotPasswordStore.set(email.trim().toLowerCase(), resetToken);

    let emailSent = false;
    try {
      const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #f1f5f9; border-radius: 16px;">
          <h2 style="color: #2563eb; font-weight: 800;">Hola, ${user.nombres}</h2>
          <p>Has solicitado restablecer la contraseña de tu cuenta en la plataforma SADYA.</p>
          <p>Tu código de seguridad temporal es:</p>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-radius: 12px; border: 1px solid #e2e8f0; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: 900; letter-spacing: 4px; color: #1e293b;">${resetToken}</span>
          </div>
          <p style="color: #64748b; font-size: 12px;">Este código es de un solo uso y vencerá en 10 minutos. Si no solicitaste este cambio, por favor ignora este correo.</p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">SADYA Marketplace — Alimentando el futuro, evitando el desperdicio.</p>
        </div>
      `;
      emailSent = await sendEmail(
        user.email,
        'SADYA — Código de recuperación de contraseña',
        emailHtml
      );
    } catch (mailErr) {
      console.error(`❌ Error al enviar correo de recuperación a ${user.email}:`, mailErr.message);
    }

    res.status(200).json({
      status: 'ok',
      message: emailSent
        ? 'Se ha enviado un correo con tu código de recuperación de contraseña.'
        : 'Código de recuperación generado en consola (Simulación).',
      debugCode: (process.env.NODE_ENV === 'development' || !emailSent) ? resetToken : undefined,
    });

  } catch (err) {
    console.error('❌ Error en forgot-password:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Error interno al procesar la recuperación de contraseña.',
      detail: err.message,
    });
  }
});

// ── POST /api/auth/reset-password ───────────────────────
// Restablece la contraseña usando el código recibido
router.post('/auth/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email?.trim() || !code?.trim() || !newPassword?.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son obligatorios.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'La nueva contraseña debe tener al menos 8 caracteres de longitud.',
      });
    }

    const storedCode = forgotPasswordStore.get(email.trim().toLowerCase());
    if (!storedCode || storedCode !== code.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'El código de seguridad ingresado es incorrecto o ha expirado.',
      });
    }

    // Encrypt new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update in database
    const updateResult = await query(
      `UPDATE t_usuarios SET password = $1 WHERE email = $2 RETURNING id_usuario`,
      [hashedPassword, email.trim().toLowerCase()]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No se pudo actualizar la contraseña. El usuario no existe.',
      });
    }

    // Clean reset token
    forgotPasswordStore.delete(email.trim().toLowerCase());

    console.log(`🔒 Contraseña actualizada correctamente para usuario con email: ${email}`);

    res.status(200).json({
      status: 'ok',
      message: '¡Contraseña restablecida con éxito! Ya puedes iniciar sesión con tus nuevas credenciales.',
    });

  } catch (err) {
    console.error('❌ Error en reset-password:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Error interno al restablecer la contraseña.',
      detail: err.message,
    });
  }
});

// ── POST /api/auth/social ───────────────────────────────
// Login y Registro Social (Google, Apple, Facebook)
router.post('/auth/social', async (req, res) => {
  try {
    const { email, nombres, apellidos, idSocial, metodoRegistro, rol } = req.body;

    if (!idSocial || !metodoRegistro) {
      return res.status(400).json({
        status: 'error',
        message: 'El idSocial y metodoRegistro son obligatorios para inicio de sesión social.',
      });
    }

    // 1. Check if user already exists with this social ID
    let userResult = await query(
      `SELECT u.id_usuario, u.nombres, u.apellidos, u.email, u.telefono, r.tipo_rol, u.foto_perfil
       FROM t_usuarios u
       JOIN t_roles r ON u.id_rol = r.id_rol
       WHERE u.id_social = $1 AND u.metodo_registro = $2
       LIMIT 1`,
      [idSocial, metodoRegistro]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log(`✅ Login social exitoso (${metodoRegistro}): ${user.nombres} (${user.tipo_rol})`);
      return res.status(200).json({
        status: 'ok',
        message: `¡Bienvenido de nuevo, ${user.nombres}!`,
        data: {
          id: user.id_usuario,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email,
          telefono: user.telefono,
          rol: user.tipo_rol,
          foto_perfil: user.foto_perfil,
        },
      });
    }

    // 2. If email exists in DB, link account to this social login
    if (email) {
      const emailResult = await query(
        `SELECT id_usuario FROM t_usuarios WHERE email = $1 LIMIT 1`,
        [email.trim().toLowerCase()]
      );
      if (emailResult.rows.length > 0) {
        const userId = emailResult.rows[0].id_usuario;
        await query(
          `UPDATE t_usuarios 
           SET id_social = $1, metodo_registro = $2 
           WHERE id_usuario = $3`,
          [idSocial, metodoRegistro, userId]
        );

        // Fetch updated user details
        userResult = await query(
          `SELECT u.id_usuario, u.nombres, u.apellidos, u.email, u.telefono, r.tipo_rol, u.foto_perfil
           FROM t_usuarios u
           JOIN t_roles r ON u.id_rol = r.id_rol
           WHERE u.id_usuario = $1
           LIMIT 1`,
          [userId]
        );
        const user = userResult.rows[0];
        console.log(`✅ Cuenta vinculada y login social exitoso (${metodoRegistro}): ${user.nombres}`);
        return res.status(200).json({
          status: 'ok',
          message: `Hemos vinculado tu cuenta de ${metodoRegistro} con éxito.`,
          data: {
            id: user.id_usuario,
            nombres: user.nombres,
            apellidos: user.apellidos,
            email: user.email,
            telefono: user.telefono,
            rol: user.tipo_rol,
            foto_perfil: user.foto_perfil,
          },
        });
      }
    }

    // 3. Register as new user via social credentials
    const roleName = rol || 'Cliente';
    const roleResult = await query(`SELECT id_rol FROM t_roles WHERE tipo_rol = $1 LIMIT 1`, [roleName]);
    const id_rol = roleResult.rows.length > 0 ? roleResult.rows[0].id_rol : 3; // Defaults to Cliente

    userResult = await query(
      `INSERT INTO t_usuarios (
        nombres, apellidos, email, id_rol, id_social, metodo_registro, fecha_creacion
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id_usuario, nombres, apellidos, email, telefono, foto_perfil`,
      [
        nombres || 'Usuario',
        apellidos || null,
        email ? email.trim().toLowerCase() : null,
        id_rol,
        idSocial,
        metodoRegistro,
      ]
    );

    const newUser = userResult.rows[0];
    console.log(`✅ Nuevo registro de usuario vía Social (${metodoRegistro}): ${newUser.nombres} (ID: ${newUser.id_usuario})`);

    return res.status(201).json({
      status: 'ok',
      message: `¡Registro con ${metodoRegistro} exitoso! Bienvenido a SADYA.`,
      data: {
        id: newUser.id_usuario,
        nombres: newUser.nombres,
        apellidos: newUser.apellidos,
        email: newUser.email,
        telefono: newUser.telefono,
        rol: roleName,
        foto_perfil: newUser.foto_perfil,
      },
    });

  } catch (err) {
    console.error('❌ Error en login/registro social:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Error interno al procesar el inicio de sesión social.',
      detail: err.message,
    });
  }
});

export default router;
