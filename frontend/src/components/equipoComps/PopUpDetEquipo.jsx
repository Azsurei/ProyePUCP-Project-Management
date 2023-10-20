"use client"

import React, { useState, useEffect } from "react";
//import Modal from "react-modal";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
import ChoiceUser from "../dashboardComps/projectComps/projectCreateComps/ChoiceUser";
import CardParticipantes from "./CardParticipantes";
import Card from "@/components/Card";

const PopUpDetEquipo = ({ closeModal, teamName, coordinador, miembros }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal]);

  console.log("Estos son los miembros: " + miembros);

  return (
    
    <div className='modalBackground'>
        <div className='modalContainer'>
            <div className='titleCloseBtn'>
              <button onClick={() => closeModal(false)}>X</button>
            </div>
            <div className='title'>
                <h3 className='modalTitle'>{teamName}</h3>
                <p className="coordinator">Coordinador: {coordinador}</p>
            </div>
            <div className="modalBody_detEq">
              {miembros.map((miembro) => (
                <div className="flex items-center w-full ml-4" key={miembro.idUsuario}>
                  <div className="membersIconContainer">
                    <p className="membersIcon">
                      {miembro.nombres[0]}
                      {miembro.apellidos[0]}
                    </p>
                  </div>
                  <div className="memberDetails">
                    <p className="member">
                      {miembro.nombres} {miembro.apellidos}
                    </p>
                    <p className="memberMail">
                      {miembro.correoElectronico}
                    </p>
                  </div>
                </div>
              ))}
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