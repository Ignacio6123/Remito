import React, { useState, useEffect } from 'react';
import Remitos from './componentes/Remitos';
import NuevoRemito from './componentes/NuevoRemito';

import "./App.css";

function App() {
  const [remitoId, setRemitoId] = useState(1);

  const [totalRemitos, setTotalRemitos] = useState(0); // Total de remitos disponible


  useEffect(() => {
    // Cargar los remitos y obtener el total
    fetch(`http://localhost:5000/remitos`) // Cambia esta URL con la que uses para obtener todos los remitos
      .then((response) => response.json())
      .then((data) => {
        setTotalRemitos(data.length); // Aquí asumimos que la respuesta contiene todos los remitos

        console.log(data.length)
      })
      .catch((err) => console.error('Error al cargar los remitos:', err));
  }, []);


  return (
    <div className="App">

      <Remitos remitoId={remitoId} />


      {remitoId >= totalRemitos ? "" : (<button className="botonVerRemito" onClick={() =>
        setRemitoId(remitoId + 1)}>Ver siguiente remito</button>)}

      {remitoId !== 1 ? (<button className="botonVerRemito" onClick={() =>
        setRemitoId(remitoId - 1)}>Ver remito anterior</button>)
        :
        ""}


      <NuevoRemito />
    </div>
  );
}

export default App;