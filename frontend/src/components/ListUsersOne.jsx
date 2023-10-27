"use client";
import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListUsers.css";
import { UserCardsContextOne } from "./ModalUsersOne";

axios.defaults.withCredentials = true;

function CardUser({ usuarioObject, isSelected, onSelection }) {
    //const [isSelected, setIsSelected] = useState(false);

    return (
        <li
            className={isSelected ? "UserCard active" : "UserCard"}
            onClick={onSelection}
        >
            {/* <img
                className="imgageUserDefault"
                src="/images/userDefaultList.png"
            /> */}

            <Avatar
                //isBordered
                //as="button"
                className="transition-transform w-[48px] min-w-[48px] h-[48px] min-h-[48px]"
                src={usuarioObject.imgLink}
                fallback={
                    <p className="usrLeftIconNull">
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

export default function ListUsersOne(props) {
    const router = useRouter();

    const { addUserList, removeUserInList } = useContext(UserCardsContextOne);

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
                        key={component.idUsuario}
                        usuarioObject={component}
                        isSelected={selectedUser === component.idUsuario}
                        onSelection={() => {
                            setSelectedUser(component.idUsuario);
                            addUserList(component);
                        }}
                    ></CardUser>
                );
            })}
        </ul>
    );
}
