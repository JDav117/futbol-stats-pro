const { Pool } = require('pg');
require('dotenv').config();

// ✅ FIX ERROR 1: El fallback ahora usa el nombre del servicio Docker ('db_futbol')
// para que funcione correctamente dentro de la red interna de contenedores.
// En CI y Render, siempre se inyecta DATABASE_URL desde el entorno.
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password123@db_futbol:5432/futbol_db';

const pool = new Pool({
  connectionString,
});

pool.on('connect', () => {
  console.log('⚡ Conexión exitosa a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de Postgres', err);
});

module.exports = pool;
