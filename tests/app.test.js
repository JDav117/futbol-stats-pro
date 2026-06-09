const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');

beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS equipos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(50) NOT NULL,
      puntos INT DEFAULT 0,
      diferencia_goles INT DEFAULT 0
    );
  `);
  await pool.query("INSERT INTO equipos (nombre, puntos, diferencia_goles) VALUES ('ITP F.C.', 9, 5);");
});

afterAll(async () => {
  await pool.query('DROP TABLE IF EXISTS equipos;');
  await pool.end();
});

describe('GET /api/posiciones', () => {
  it('Debería retornar la lista de equipos ordenada por puntos', async () => {
    // ✅ FIX ERROR 2: Se eliminó el guard de NODE_ENV que rompía el pipeline de CI.
    // La variable NODE_ENV=test se inyecta directamente en el workflow de GitHub Actions.

    const res = await request(app).get('/api/posiciones');

    // ✅ FIX ERROR 3: Se eliminó la línea con el typo .colose(200) que no existe
    // en Jest y lanzaba un TypeError, impidiendo que la prueba corriera.
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].nombre).toBe('ITP F.C.');
  });
});
