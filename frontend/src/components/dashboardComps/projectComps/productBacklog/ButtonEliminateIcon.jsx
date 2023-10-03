import React from "react";
import "@/styles/PopUpEliminateHU.css";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";

export default function ButtonEliminateIcon (task) {

    const [modal, setModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const toggleModal = (task) => {
        setSelectedTask(task);
        setModal(!modal);
    };
  
    if(modal) {
      document.body.classList.add('active-modal')
    } else {
      document.body.classList.remove('active-modal')
    }

    return (
        <>

            <button onClick={() => toggleModal(task)}>
                <IconLabel icon="/icons/eliminar.svg" className="iconElimination"/>
            </button>
          
    
          {modal && (
            <div className="popUp">
              <div onClick={toggle} className="overlay"></div>
              <div className="popUp-content">
                <h2 className="popUp-title">Eliminar elemento del Backlog</h2>
                <h3 className="advertisement">¿Estás seguro que desea eliminar la siguiente tarea?</h3>
                <label for="TextBoxEliminate" className="label-Eliminate">
                  <strong>Nombre del elemento: </strong>
                </label>
                <input type="text" className="input-field" readonly value={selectedTask.descripcion}></input>
                
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