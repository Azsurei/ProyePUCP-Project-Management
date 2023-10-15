import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListUsers.css";

axios.defaults.withCredentials = true;

function CardEpic(props) {
  const [isSelected, setIsSelected] = useState(false);

	const {selectEpic, deselectEpic } = useContext(UserCardsContext);

	const handleSelectedOn = () => {
		selectEpic(props.epicObject);
		setIsSelected(true)
	}

	const handleSelectedOff = () => {
		deselectEpic(props.epicObject);
		setIsSelected(false)
	}
  return (
    <li className={isSelected ? "UserCard active" : "UserCard"} onClick={isSelected ? handleSelectedOff: handleSelectedOn}>
        <div style={{ marginTop: '12px',marginLeft:'15px' }}>
          <p className="titleUserName">{props.name}</p>
        </div>
    </li>
  );
}

export default function ListEpic(props) {
  const router = useRouter();


  return (
    <ul className="ListUsersProject">
      {props.lista.map((component) => {
        return (
          <CardEpic
            key={component.idEpica}
            name={component.nombre}
            epicObject={component}
          ></CardEpic>
        );
      })}
    </ul>
  );
}