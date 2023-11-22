"use client";
import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListUsers.css";
import { UserCardsContextOne } from "./ModalUsersOne";
import { Avatar, CircularProgress } from "@nextui-org/react";

axios.defaults.withCredentials = true;

function CardUser({ usuarioObject, isSelected, onSelection }) {
    //const [isSelected, setIsSelected] = useState(false);

    return (
        <li
            className={
                isSelected
                    ? "UserCard bg-green-300 dark:bg-success-300 active hover:bg-green-300"
                    : "UserCard dark:hover:bg-slate-700 hover:bg-slate-100 bg-mainBackground "
            }
            onClick={onSelection}
        >
            {/* <img
                className="imgageUserDefault"
                src="/images/userDefaultList.png"
            /> */}

            <Avatar
                //isBordered
                //as="button"
                className="transition-transform w-[48px] min-w-[48px] h-[48px] min-h-[48px] bg-mainUserIcon"
                src={usuarioObject.imgLink}
                fallback={
                    <p className="usrLeftIconNull  bg-mainUserIcon">
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
                <p className="titleUserEmail  text-mainHeaders dark:text-slate-300 dark:font-normal">
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

    if (props.isLoaded === false) {
        return <CircularProgress size="lg" aria-label="Loading..." />;
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
