// src/server/server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;
// Configuración de middleware
app.use(bodyParser.json()); // Para parsear el cuerpo de las solicitudes JSON
app.use(express.static(path.join(__dirname, '../../build')));
// Conexión a la base de datos
const db = new sqlite3.Database(path.join(__dirname, '../../database/base_de_datos.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  }
});
// Ruta de autenticación
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err) {
      console.error('SQL error:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (row) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  });
});
// Ruta para buscar alumnos
app.post('/api/search', (req, res) => {
  const { query } = req.body; // Obtiene la consulta desde el cuerpo de la solicitud
  const sql = `SELECT * FROM alumnos WHERE nombre LIKE ? OR apellido LIKE ? OR anio LIKE ? OR email LIKE ?`;
  const params = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('SQL error:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(rows); // Devuelve los resultados como respuesta
  });
});
// Asegúrate de que esta línea esté antes de la ruta catch-all
app.use(express.static(path.join(__dirname, '../../build')));
// Ruta catch-all para manejar las rutas de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});