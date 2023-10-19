import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListUsers.css";
import { UserCardsContext } from "./ModalUsersOne";

axios.defaults.withCredentials = true;

function CardUser(props) {
    //const [isSelected, setIsSelected] = useState(false);
    const isSelected = props.isSelected;

    const { addUserList, removeUserInList } = useContext(UserCardsContext);

    const handleSelectedOn = () => {
        props.setSelectedUser;
        addUserList(props.usuarioObject);
        //setIsSelected(true);
    };

    const handleSelectedOff = () => {
        props.setSelectedUser;
        removeUserInList(props.usuarioObject);
        //setIsSelected(false);
    };

    return (
        <li
            className={isSelected ? "UserCard active" : "UserCard"}
            //onClick={isSelected ? handleSelectedOff : handleSelectedOn}
            onClick={props.setSelectedUser}
        >
            <img
                className="imgageUserDefault"
                src="/images/userDefaultList.png"
            />
            <div style={{ marginTop: "12px", marginLeft: "15px" }}>
                <p className="titleUserName">
                    {props.name + " " + props.lastName}
                </p>
                <p className="titleUserEmail">{props.email}</p>
            </div>
        </li>
    );
}

export default function ListUsersOne(props) {
    const router = useRouter();

    const [selectedUser, setSelectedUser] = useState(null); //contiene el id del seleccionado

    if (props.lista.length === 0) {
        return (
            <p className="noResultsMessage">No se encontraron resultados.</p>
        );
    }
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
                        isSelected={selectedUser === component.id}
                        onSelection={()=>{setSelectedUser(component.id)}}
                    ></CardUser>
                );
            })}
        </ul>
    );
}
