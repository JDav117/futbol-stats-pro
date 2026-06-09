const express = require('express');
const pool = require('./config/db');

const app = express();
app.use(express.json());

// Crear tabla y poblar con datos de ejemplo si la BD está vacía
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS equipos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        puntos INT DEFAULT 0,
        diferencia_goles INT DEFAULT 0
      );
    `);
    const { rowCount } = await pool.query('SELECT 1 FROM equipos LIMIT 1');
    if (rowCount === 0) {
      await pool.query(`
        INSERT INTO equipos (nombre, puntos, diferencia_goles) VALUES
          ('ITP F.C.',      9,  5),
          ('Devs United',   6,  2),
          ('Code FC',       3, -1),
          ('Null Pointers', 0, -6);
      `);
      console.log('Datos de ejemplo insertados.');
    }
    console.log('Base de datos inicializada.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
  }
}

// Endpoint de salud para Render
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'UP', database: 'CONNECTED' });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', error: error.message });
  }
});

// Obtener tabla de posiciones
app.get('/api/posiciones', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM equipos ORDER BY puntos DESC, diferencia_goles DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tabla de posiciones' });
  }
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    await initDB();
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

module.exports = app;
