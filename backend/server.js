const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Para manejar JSON en las solicitudes

app.get('/remito-detalle/:id', (req, res) => {
  const remitoId = req.params.id;

  const query = `
    SELECT remitos.id AS remito_id, remitos.fecha, 
      clientes.id AS cliente_id, clientes.nombre AS cliente_nombre, 
      clientes.domicilio AS cliente_domicilio, clientes.localidad AS cliente_localidad,
      productos.id AS producto_id, productos.descripcion AS producto_descripcion, 
      productos.stock, productos.precio_unitario,
      remitos_productos.cantidad
    FROM remitos
    JOIN clientes ON remitos.id_cliente = clientes.id
    LEFT JOIN remitos_productos ON remitos.id = remitos_productos.id_remito
    LEFT JOIN productos ON remitos_productos.id_producto = productos.id
    WHERE remitos.id = ?
  `;

  db.query(query, [remitoId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener el remito y los productos' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Remito no encontrado' });
    }

    const remito = {
      id: results[0]?.remito_id,
      fecha: results[0]?.fecha,
      cliente: {
        id: results[0]?.cliente_id,
        nombre: results[0]?.cliente_nombre,
        domicilio: results[0]?.cliente_domicilio,
        localidad: results[0]?.cliente_localidad,
      },
      productos: results.map((row) => ({
        id: row.producto_id,
        descripcion: row.producto_descripcion,
        stock: row.stock,
        precio_unitario: row.precio_unitario,
        cantidad: row.cantidad,
        precio_total: row.precio_unitario * row.cantidad
      })),
    };

    res.status(200).json(remito);
  });
});





// Obtener todos los clientes
app.get('/clientes', (req, res) => {
  const query = 'SELECT id, nombre FROM clientes';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener los clientes' });
    }
    res.json(results);
  });
});

// Obtener todos los productos
app.get('/productos', (req, res) => {
  const query = 'SELECT id, descripcion, stock, precio_unitario FROM productos';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener los productos' });
    }
    res.json(results);
  });
});

// Crear un remito
app.post('/crear-remito', (req, res) => {
  const { fecha, id_cliente, productos } = req.body;

  if (!fecha || !id_cliente || productos.length === 0) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  // Insertar el remito en la tabla 'remitos'
  const queryRemito = `INSERT INTO remitos (fecha, id_cliente) VALUES (?, ?)`;

  db.query(queryRemito, [fecha, id_cliente], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al insertar el remito' });
    }

    const remitoId = result.insertId;

    // Insertar los productos en la tabla 'remitos_productos'
    const valoresProductos = productos.map((p) => [remitoId, p.id_producto, p.cantidad]);
    const queryProductos = `INSERT INTO remitos_productos (id_remito, id_producto, cantidad) VALUES ?`;

    db.query(queryProductos, [valoresProductos], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al insertar productos en el remito' });
      }

      res.json({ mensaje: 'Remito creado exitosamente', id_remito: remitoId });
    });
  });
});

// Endpoint para obtener todos los remitos
app.get('/remitos', (req, res) => {
  const query = 'SELECT * FROM remitos';

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener los remitos' });
    }

    res.status(200).json(results);
  });
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});