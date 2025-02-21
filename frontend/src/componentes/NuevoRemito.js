import React, { useState, useEffect } from 'react';
import './NuevoRemito.css';

const NuevoRemito = () => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [fecha, setFecha] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  useEffect(() => {
    // Obtener clientes
    fetch('http://localhost:5000/clientes')
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => console.error('Error al cargar clientes:', err));

    // Obtener productos
    fetch('http://localhost:5000/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  const agregarProducto = (idProducto) => {
    const producto = productos.find(p => p.id === parseInt(idProducto));
    if (!producto) return;

    setProductosSeleccionados([...productosSeleccionados, { 
      id_producto: producto.id, 
      descripcion: producto.descripcion, 
      cantidad: 1 
    }]);
  };

  const actualizarCantidad = (idProducto, nuevaCantidad) => {
    setProductosSeleccionados(
      productosSeleccionados.map(p => 
        p.id_producto === idProducto ? { ...p, cantidad: nuevaCantidad } : p
      )
    );
  };

  const eliminarProducto = (idProducto) => {
    setProductosSeleccionados(productosSeleccionados.filter(p => p.id_producto !== idProducto));
  };

  const enviarRemito = () => {
    if (!fecha || !idCliente || productosSeleccionados.length === 0) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const nuevoRemito = {
      fecha,
      id_cliente: idCliente,
      productos: productosSeleccionados
    };

    fetch('http://localhost:5000/crear-remito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoRemito),
    })
    .then(res => res.json())
    .then(() => {
      alert('Remito creado exitosamente');
      setFecha('');
      setIdCliente('');
      setProductosSeleccionados([]);
    })
    .catch(err => console.error('Error al crear el remito:', err));
  };

  return (
    <div className="nuevo-remito-container">
      <h2>Nuevo Remito</h2>

      <label>Fecha:</label>
      <input 
        type="date" 
        value={fecha} 
        onChange={(e) => setFecha(e.target.value)} 
      />

      <label>Cliente:</label>
      <select 
        value={idCliente} 
        onChange={(e) => setIdCliente(e.target.value)}
      >
        <option value="">Seleccionar Cliente</option>
        {clientes.map(cliente => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.id} - {cliente.nombre}
          </option>
        ))}
      </select>

      <label>Agregar Producto:</label>
      <select onChange={(e) => agregarProducto(e.target.value)}>
        <option value="">Seleccionar Producto</option>
        {productos.map(producto => (
          <option key={producto.id} value={producto.id}>
            {producto.descripcion} (Stock: {producto.stock}, Precio: {producto.precio_unitario})
          </option>
        ))}
      </select>

      <div className="productos-seleccionados">
        <h3>Productos Seleccionados</h3>
        {productosSeleccionados.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productosSeleccionados.map(p => (
                <tr key={p.id_producto}>
                  <td>{p.descripcion}</td>
                  <td>
                    <input 
                      type="number" 
                      min="1" 
                      value={p.cantidad} 
                      onChange={(e) => actualizarCantidad(p.id_producto, parseInt(e.target.value))}
                    />
                  </td>
                  <td>
                    <button 
                      className="btn-eliminar" 
                      onClick={() => eliminarProducto(p.id_producto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No hay productos seleccionados</p>}
      </div>

      <button onClick={enviarRemito}>Guardar Remito</button>
    </div>
  );
};

export default NuevoRemito;