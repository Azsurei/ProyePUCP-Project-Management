import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import "@/styles/dashboardStyles/projectStyles/actaReunionStyles/ModalParticipantes.css";

function UserCard({ participant, onSelect, onDeselect, isDisabled }) {
    const [isSelected, setIsSelected] = useState(false);
  
    const handleClick = () => {
      if (isDisabled) {
        // No hacemos nada si el participante está deshabilitado
        return;
      }
      if (isSelected) {
        onDeselect(participant.idUsuario);
      } else {
        onSelect(participant);
      }
      setIsSelected(!isSelected);
    };
  
    // Se añade la clase "disabled" si isDisabled es true
    return (
      <li
        className={`userCard ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
        onClick={handleClick}
      >
        {participant.nombres} {participant.apellidos}
      </li>
    );
}

function ListUsers({ participantes, onSelect, onDeselect, disabledParticipants }) {
    return (
      <ul>
        {participantes.map(participant => (
          <UserCard
            key={participant.idUsuario}
            participant={participant}
            onSelect={onSelect}
            onDeselect={onDeselect}
            isDisabled={disabledParticipants.includes(participant.idUsuario)}
          />
        ))}
      </ul>
    );
}

export default function ModalParticipantes({ participantes, handlerModalClose, handlerModalFinished, responsables }) {
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const disabledParticipants = responsables.map(res => res.idUsuario);

  const handleSelectParticipant = (participant) => {
    if (disabledParticipants.includes(participant.idUsuario)) {
      setErrorMessage("Este participante ya está seleccionado como responsable.");
      setTimeout(() => setErrorMessage(""), 5000); // Limpia el mensaje después de 5 segundos
      return;
    }
    setSelectedParticipants(prev => [...prev, participant]);
    setErrorMessage("");
  };

  const handleDeselectParticipant = (participantId) => {
    setSelectedParticipants(prev => prev.filter(p => p.idUsuario !== participantId));
    setErrorMessage("");
  };

  const handleFinish = () => {
    handlerModalFinished(selectedParticipants);
    handlerModalClose();
  };

  return (
    <div className="modal">
      <div className="modalContent">
        <h2 className="selectParticipantesTitle"> Añadir Responsables</h2>
        <ListUsers
          participantes={participantes}
          onSelect={handleSelectParticipant}
          onDeselect={handleDeselectParticipant}
          disabledParticipants={disabledParticipants}
        />
        {errorMessage && <div className="errorMessage">{errorMessage}</div>}
        <div className="modalButtons pt-2">
          <Button onClick={handlerModalClose}>Cerrar</Button>
          <Button onClick={handleFinish} className="bg-indigo-950 text-slate-50">Finalizar</Button>
        </div>
      </div>
    </div>
  );
}
