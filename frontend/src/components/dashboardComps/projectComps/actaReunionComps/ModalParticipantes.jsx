import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import "@/styles/dashboardStyles/projectStyles/actaReunionStyles/ModalParticipantes.css";

function UserCard({ participant, onSelect, onDeselect }) {
    const [isSelected, setIsSelected] = useState(false);
  
    const handleClick = () => {
      if (isSelected) {
        onDeselect(participant.idUsuario);
      } else {
        onSelect(participant);
      }
      setIsSelected(!isSelected);
    };
  
    return (
      <li
        className={`userCard ${isSelected ? "selected" : ""}`}
        onClick={handleClick}
      >
        {participant.nombres} {participant.apellidos}
      </li>
    );
  }


function ListUsers({ participantes, onSelect, onDeselect }) {
    return (
      <ul>
        {participantes.map(participant => (
          <UserCard
            key={participant.idUsuario}
            participant={participant}
            onSelect={onSelect}
            onDeselect={onDeselect}
          />
        ))}
      </ul>
    );
  }


export default function ModalParticipantes({ participantes, handlerModalClose, handlerModalFinished }) {
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const handleSelectParticipant = (participant) => {
    setSelectedParticipants(prev => [...prev, participant]);
  };

  const handleDeselectParticipant = (participantId) => {
    setSelectedParticipants(prev => prev.filter(p => p.idUsuario !== participantId));
  };

  const handleFinish = () => {
    handlerModalFinished(selectedParticipants);
    handlerModalClose();
  };

  return (
    <div className="modal">
      <div className="modalContent">
        <h2>Seleccionar Participantes</h2>
        <ListUsers
          participantes={participantes}
          onSelect={handleSelectParticipant}
          onDeselect={handleDeselectParticipant}
        />
        <div className="modalButtons">
          <Button onClick={handlerModalClose}>Cerrar</Button>
          <Button onClick={handleFinish}>Finalizar</Button>
        </div>
      </div>
    </div>
  );
}