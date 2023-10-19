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
              {miembros.map((miembros) => (
                    <div className="flex flex-col items-start justify-between w-full" key={miembros.id}>
                        <Card>
                            <CardParticipantes
                                iconSrc={miembros.iconSrc}
                                nombre={miembros.nombre}
                                correo={miembros.correo}
                            />
                        </Card>
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