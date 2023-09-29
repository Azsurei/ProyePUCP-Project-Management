import React from "react";
import "../styles/PopUpEliminateHU.css";


function PopUpEliminate ({ modal,toggle, taskName}) {
    

  return (
    <>
      

      {modal && (
        <div className="popUp">
          <div onClick={toggle} className="overlay"></div>
          <div className="popUp-content">
            <h2 className="popUp-title">Eliminar elemento del Backlog</h2>
            <h3 className="advertisement">¿Estás seguro que desea eliminar la siguiente tarea?</h3>
            <label for="TextBoxEliminate" className="label-Eliminate">
              <strong>Nombre del elemento: </strong>
            </label>
            <input type="text" className="input-field" readonly value={taskName}></input>
            
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

export default PopUpEliminate;