import React, { useEffect, useState } from 'react';
import './Remitos.css'; // Importamos el CSS

const Remitos = ({ remitoId }) => {
  const [remito, setRemito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/remito-detalle/${remitoId}`)
      .then((response) => response.json())
      .then((data) => {
        setRemito(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al cargar los datos del remito');
        setLoading(false);
      });
  }, [remitoId]);

  if (loading) return <p className="loading-message">Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="remito-container">
      <h2>Detalles del Remito</h2>

      <table className="remito-table">
        <thead>
          <tr>
            <th colSpan="2">Remito</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ID Remito:</td>
            <td>{remito.id}</td>
          </tr>
          <tr>
            <td>Fecha:</td>
            <td>{new Date(remito.fecha).toLocaleDateString('es-ES')}</td>
          </tr>
        </tbody>
      </table>

      <h3>Cliente Asociado</h3>
      <table className="remito-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Domicilio</th>
            <th>Localidad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{remito.cliente.nombre}</td>
            <td>{remito.cliente.domicilio}</td>
            <td>{remito.cliente.localidad}</td>
          </tr>
        </tbody>
      </table>

      <h3>Productos Asociados</h3>
      <table className="remito-table">
        <thead>
          <tr>
            <th>Descripcion</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Precio Total</th>
          </tr>
        </thead>
        <tbody>
          {remito.productos.length > 0 ? (
            remito.productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.descripcion}</td>
                <td>${producto.precio_unitario}</td>
                <td>{producto.cantidad}</td>
                <td>${producto.precio_total.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-products">
                No hay productos asociados a este remito.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Remitos;
