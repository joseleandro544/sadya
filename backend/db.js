// ═══════════════════════════════════════════════════════════
// db.js — Pool de Conexiones a PostgreSQL
// ═══════════════════════════════════════════════════════════
// Usa un Pool (NO conexiones individuales) para manejar
// múltiples usuarios concurrentes sin colapsar la BD.
// ═══════════════════════════════════════════════════════════

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Máximo de conexiones simultáneas en el pool
  max: 20,

  // Tiempo máximo que una conexión puede estar inactiva antes de cerrarse (ms)
  idleTimeoutMillis: 30_000,

  // Tiempo máximo de espera para obtener una conexión del pool (ms)
  connectionTimeoutMillis: 5_000,
});

// ── Manejo de errores en clientes idle ──────────────────
// Si un cliente del pool emite un error inesperado mientras
// está inactivo, lo capturamos aquí para evitar crashes.
pool.on('error', (err) => {
  console.error('⚠️  Error inesperado en cliente idle del pool PostgreSQL:', err.message);
});

// ── Log de conexión exitosa (solo en desarrollo) ────────
pool.on('connect', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🟢 Nueva conexión establecida con PostgreSQL');
  }
});

// ── Helper para ejecutar queries ────────────────────────
// Uso: const { rows } = await query('SELECT * FROM tabla WHERE id = $1', [id]);
export const query = (text, params) => pool.query(text, params);

// Exportar el pool por si se necesita acceso directo (transacciones, etc.)
export default pool;
