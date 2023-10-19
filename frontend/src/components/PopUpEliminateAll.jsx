import React from "react";
import "../styles/PopUpEliminateHU.css";


function PopUpEliminateAll ({ modal,toggle}) {
    

  return (
    <>
      

      {modal && (
        <div className="popUp">
          <div onClick={toggle} className="overlay"></div>
          <div className="popUp-content">
            <h2 className="popUp-title">Eliminar elementos del Backlog</h2>
            <h3 className="advertisement">¿Estás seguro que desea eliminar los elementos de la tabla</h3>
            
            <div className="buttonSection">
            <button className="close-modal" onClick={toggle}>
              Cancelar
            </button>
            <button className="close-modal" onClick={toggle}>
              Aceptar
            </button>
            </div>
            
          </div>
        </div>
      )}
      <p></p>
    </>
  );
}

export default PopUpEliminateAll;