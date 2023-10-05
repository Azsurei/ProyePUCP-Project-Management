"use client"

import React, { useState } from "react";
//import Modal from "react-modal";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";

const PopUpDetEquipo = ({ closeModal, teamName }) => {
  return (
    <div className='modalBackground'>
        <div className='modalContainer'>
            <div className='titleCloseBtn'>
              <button onClick={() => closeModal(false)}>X</button>
            </div>
            <div className='title'>
                <h3 className='modalTitle'>{teamName}</h3>
            </div>
            <div>
              <p>Insertar participantes</p>
            </div>
        </div>
    </div>    
  );
};

export default PopUpDetEquipo;

/*
<Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Detalle del Equipo"
      className="PopUpDetEquipo"
      overlayClassName="Overlay"
    >
      <div>
        <h2>Hola soy un modal</h2>
        <button onClick={closeModal}>Cerrar</button>
      </div>
    </Modal>
    */