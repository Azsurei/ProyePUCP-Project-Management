import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListUsers.css";
import { UserCardsContext } from "./modalUsers";

axios.defaults.withCredentials = true;

function CardUser(props) {

  const [isSelected, setIsSelected] = useState(false);

	const {addUserList, removeUserInList } = useContext(UserCardsContext);

	const handleSelectedOn = () => {
		addUserList(props.usuarioObject);
		setIsSelected(true)
	}

	const handleSelectedOff = () => {
		removeUserInList(props.usuarioObject);
		setIsSelected(false)
	}
  
  return (
    <li className={isSelected ? "UserCard active" : "UserCard"} onClick={isSelected ? handleSelectedOff: handleSelectedOn}>

        <img className="imgageUserDefault" src="/images/userDefaultList.png"/>
        <div style={{ marginTop: '12px',marginLeft:'15px' }}>
          <p className="titleUserName">{props.name + ' ' + props.lastName}</p>
          <p className="titleUserEmail">{props.email}</p>
        </div>

        
    </li>
  );
}

export default function ListUsers(props) {
  const router = useRouter();


  return (
    <ul className="ListUsersProject">
      {props.lista.map((component) => {
        return (
          <CardUser
            key={component.id}
            name={component.name}
            lastName={component.lastName}
            usuarioObject={component}
            email={component.email}
          ></CardUser>
        );
      })}
    </ul>
  );
}