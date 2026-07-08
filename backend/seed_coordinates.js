import 'dotenv/config';
import { query } from './db.js';

async function seed() {
  try {
    console.log('⏳ Seeding coordinates into t_ubicaciones using PostGIS...');

    // 1. Ensure PostGIS is enabled
    await query('CREATE EXTENSION IF NOT EXISTS postgis;');
    console.log('✅ PostGIS extension checked/enabled.');

    // 2. Set coordinates for users in t_ubicaciones
    // Bogota reference: lat = 4.632, lng = -74.068
    const coordsMap = {
      1: { lat: 4.620, lng: -74.080 }, // Carlos (Productor)
      2: { lat: 4.630, lng: -74.065 }, // María (Tendero/Cliente)
      8: { lat: 4.625, lng: -74.072 }, // Pedro José (Campesino) - 0.9 km
      9: { lat: 4.650, lng: -74.050 }, // María Elena (Campesino) - 2.8 km
      10: { lat: 4.675, lng: -74.085 }, // Carlos Andrés (Tienda) - 5.0 km
      11: { lat: 4.635, lng: -74.060 }, // Leandro (Cliente)
      14: { lat: 4.615, lng: -74.090 }, // campesino prueba (Campesino) - 3.1 km
      15: { lat: 4.640, lng: -74.060 }, // Teo Prueba (Tienda) - 1.2 km
      19: { lat: 4.635, lng: -74.075 }, // campesino prueba2 (Campesino) - 0.8 km
      22: { lat: 4.632, lng: -74.068 }, // Juan Pérez (Cliente)
      23: { lat: 4.631, lng: -74.067 }, // María Gómez (Cliente)
    };

    for (const [userId, coords] of Object.entries(coordsMap)) {
      // Check if location exists for user
      const res = await query('SELECT id_ubicacion FROM t_ubicaciones WHERE id_usuario = $1 LIMIT 1', [userId]);
      if (res.rows.length > 0) {
        await query(
          `UPDATE t_ubicaciones 
           SET coordenadas = ST_SetSRID(ST_MakePoint($1, $2), 4326) 
           WHERE id_usuario = $3`,
          [coords.lng, coords.lat, userId]
        );
        console.log(`📍 Coordenadas actualizadas para id_usuario: ${userId} (${coords.lat}, ${coords.lng})`);
      } else {
        // Insert new location with coordinates
        await query(
          `INSERT INTO t_ubicaciones (id_usuario, direccion, ciudad, departamento, es_principal, coordenadas)
           VALUES ($1, 'Dirección Sembrada', 'Bogotá', 'Bogotá D.C.', true, ST_SetSRID(ST_MakePoint($2, $3), 4326))`,
          [userId, coords.lng, coords.lat]
        );
        console.log(`➕ Ubicación con coordenadas insertada para id_usuario: ${userId}`);
      }
    }

    console.log('✅ Coordenadas sembradas exitosamente.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error sembrando coordenadas:', err.message);
    process.exit(1);
  }
}

seed();
