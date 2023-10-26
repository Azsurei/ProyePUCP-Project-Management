import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/productBacklog/LisEpic.css";
import { UserCardsContext } from "@/components/equipoComps/PopUpRolEquipo";
//import { set } from "date-fns";
axios.defaults.withCredentials = true;

function CardEpic(props) {
  const [isSelected, setIsSelected] = useState(false);
  const { selectRol, deselectRol } = useContext(UserCardsContext);


  const handleSelectedOn = () => {
    selectRol(props.roleName);
    setIsSelected(true);
  }

  const handleSelectedOff = () => {
    deselectRol(props.roleName);
    setIsSelected(false);
  }

  return (
    <li className={isSelected ? "UserCard active" : "UserCard"} onClick={isSelected ? handleSelectedOff : handleSelectedOn}>
      <div style={{ marginTop: '12px', marginLeft: '15px' }}>
        <p className="titleUserName">{props.roleName}</p>
      </div>
    </li>
  );
}

export default function ListRol(props) {
  const router = useRouter();

  return (
    <ul className="ListEpicsProject">
      {props.lista.map((roleName, index) => {
        return (
          <CardEpic
            key={index}
            roleName={roleName}
          ></CardEpic>
        );
      })}
    </ul>
  );
}
