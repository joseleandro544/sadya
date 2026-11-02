// ═══════════════════════════════════════════════════════════
// middleware/auth.js — Sesiones con JWT
// ═══════════════════════════════════════════════════════════
// El login y el registro devuelven un token firmado. Las rutas
// privadas exigen ese token en el encabezado:
//   Authorization: Bearer <token>
// y toman el id del usuario del token, NO del cuerpo de la petición.
// ═══════════════════════════════════════════════════════════

import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

let secret = process.env.JWT_SECRET;
if (!secret) {
  // Sin JWT_SECRET se usa una clave aleatoria: funciona, pero las sesiones
  // se cierran cada vez que el servidor se reinicia. Configúrala en producción.
  secret = crypto.randomBytes(48).toString('hex');
  console.warn('⚠️  JWT_SECRET no está configurado: se usará una clave temporal.');
}

const TOKEN_TTL = '30d';

export function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, secret, { expiresIn: TOKEN_TTL });
}

// Exige un token válido y deja el id del usuario en req.userId
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Debes iniciar sesión para continuar.' });
  }
  try {
    const payload = jwt.verify(token, secret);
    req.userId = Number(payload.sub);
    next();
  } catch {
    return res.status(401).json({ status: 'error', message: 'Tu sesión expiró. Inicia sesión de nuevo.' });
  }
}

// Solo permite actuar sobre el propio usuario (:userId de la URL)
export function requireSelf(req, res, next) {
  if (Number(req.params.userId) !== req.userId) {
    return res.status(403).json({ status: 'error', message: 'No tienes permiso para ver o modificar esta cuenta.' });
  }
  next();
}

// Agrega un token a toda respuesta exitosa que identifique a un usuario
// (login, verificación de código, login social y registros).
export function attachTokenOnSuccess(_req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (body?.status === 'ok' && body.data?.id && res.statusCode < 300) {
      body.data.token = signToken(body.data.id);
    }
    return originalJson(body);
  };
  next();
}
