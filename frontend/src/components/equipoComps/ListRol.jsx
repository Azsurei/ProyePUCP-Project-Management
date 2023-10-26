import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/productBacklog/LisEpic.css";
import { UserCardsContext } from "@/components/equipoComps/PopUpRolEquipo";
//import { set } from "date-fns";
axios.defaults.withCredentials = true;

function CardRol(props) {
  const [isSelected, setIsSelected] = useState(false);
  const { selectEpic, deselectEpic } = useContext(UserCardsContext);

  const handleSelectedOn = () => {
    selectEpic(props.epicObject);
    setIsSelected(true);
  }

  const handleSelectedOff = () => {
    deselectEpic(props.epicObject);
    setIsSelected(false);
  }

  return (
    <li className={isSelected ? "UserCard active" : "UserCard"} onClick={isSelected ? handleSelectedOff : handleSelectedOn}>
      <div style={{ marginTop: '12px', marginLeft: '15px' }}>
        <p className="titleUserName">{props.name}</p>
      </div>
    </li>
  );
}

export default function ListRol(props) {
  const router = useRouter();

  return (
    <ul className="ListEpicsProject">
      {props.lista.map((component) => {
        return (
          <CardRol
            key={component.idRolEquipo}
            name={component.nombreRol}
            epicObject={component}
          ></CardRol>
        );
      })}
    </ul>
  );
}
