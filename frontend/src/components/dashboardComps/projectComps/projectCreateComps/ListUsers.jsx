import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/ProjectCreateStyles/ListUsers.css";
import { UserCardsContextNormal } from "./ModalUsers";

axios.defaults.withCredentials = true;

function CardUser({usuarioObject}) {
    const [isSelected, setIsSelected] = useState(false);

    const { addUserList, removeUserInList } = useContext(UserCardsContextNormal);

    const handleSelectedOn = () => {
        addUserList(usuarioObject);
        setIsSelected(true);
    };

    const handleSelectedOff = () => {
        removeUserInList(usuarioObject);
        setIsSelected(false);
    };

    return (
        <li
            className={isSelected ? "UserCard active" : "UserCard"}
            onClick={isSelected ? handleSelectedOff : handleSelectedOn}
        >
            <img
                className="imgageUserDefault"
                src="/images/userDefaultList.png"
            />
            <div style={{ marginTop: "12px", marginLeft: "15px" }}>
                <p className="titleUserName">
                    {usuarioObject.nombres + " " + usuarioObject.apellidos}
                </p>
                <p className="titleUserEmail">{usuarioObject.correoElectronico}</p>
            </div>
        </li>
    );
}

export default function ListUsers(props) {
    const router = useRouter();

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
                        key={component.idUsuario}
                        usuarioObject={component}
                    ></CardUser>
                );
            })}
        </ul>
    );
}
