import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListUsers.css";
import { UserCardsContextNormal } from "./ModalUsers";
import { Avatar } from "@nextui-org/react";

axios.defaults.withCredentials = true;

function CardUser({ usuarioObject }) {
    const [isSelected, setIsSelected] = useState(false);

    const { addUserList, removeUserInList } = useContext(
        UserCardsContextNormal
    );

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

            <Avatar
                //isBordered
                //as="button"
                className="transition-transform w-[48px] min-w-[48px] h-[48px] min-h-[48px] bg-mainUserIcon"
                src={usuarioObject.imgLink}
                fallback={
                    <p className="usrLeftIconNull bg-mainUserIcon">
                        {usuarioObject.nombres[0] +
                            (usuarioObject.apellidos !== null
                                ? usuarioObject.apellidos[0]
                                : "")}
                    </p>
                }
            />

            <div className="cardUserDataSection">
                <p className="titleUserName">
                    {usuarioObject.nombres +
                        " " +
                        (usuarioObject.apellidos !== null
                            ? usuarioObject.apellidos
                            : "")}
                </p>
                <p className="titleUserEmail">
                    {usuarioObject.correoElectronico}
                </p>
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
