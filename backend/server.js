// ═══════════════════════════════════════════════════════════
// server.js — Punto de entrada del Backend SADYA
// ═══════════════════════════════════════════════════════════

// 1. Cargar variables de entorno ANTES de cualquier otra cosa
import 'dotenv/config';

import express from 'express';
import cors from 'cors';

// Importar rutas
import healthRoutes from './routes/health.js';
import registerRoutes from './routes/register.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';

// ── Inicializar Express ─────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares Globales ────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://tu-dominio.com'           // En producción, restringir al dominio real
    : 'http://localhost:5185',            // En desarrollo, solo el frontend Vite
  credentials: true,
}));

app.use(express.json());                 // Parsear body JSON en peticiones POST/PUT

// ── Registrar Rutas ─────────────────────────────────────
app.use('/api', healthRoutes);           // GET /api/health
app.use('/api', registerRoutes);         // POST /api/register/*
app.use('/api', authRoutes);             // POST /api/auth/*
app.use('/api', productRoutes);          // GET/POST /api/products/*

// ── Ruta raíz informativa ───────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    app: 'SADYA Backend API',
    version: '1.0.0',
    docs: 'Visita /api/health para verificar la conexión con la BD.',
  });
});

// ── Arrancar Servidor ───────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log(`🚀  SADYA Backend corriendo en http://localhost:${PORT}`);
  console.log(`📦  Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️   BD: ${process.env.DATABASE_URL ? 'Configurada' : '⚠️  SIN CONFIGURAR'}`);
  console.log('═══════════════════════════════════════════════');
  console.log('');
});
