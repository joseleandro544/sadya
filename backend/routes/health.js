// ═══════════════════════════════════════════════════════════
// routes/health.js — Endpoint de Health Check
// ═══════════════════════════════════════════════════════════
// GET /api/health  →  Verifica la conexión con PostgreSQL
// ═══════════════════════════════════════════════════════════

import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// ── GET /api/health ─────────────────────────────────────
router.get('/health', async (_req, res) => {
  try {
    // Consulta simple para verificar la conexión
    const result = await query('SELECT NOW() AS server_time');
    const serverTime = result.rows[0].server_time;

    res.status(200).json({
      status: 'ok',
      message: 'Conexión a PostgreSQL exitosa ✅',
      serverTime,
      environment: process.env.NODE_ENV || 'unknown',
    });
  } catch (err) {
    console.error('❌ Error en health check:', err.message);

    res.status(500).json({
      status: 'error',
      message: 'No se pudo conectar a PostgreSQL',
      detail: err.message,
    });
  }
});

export default router;
