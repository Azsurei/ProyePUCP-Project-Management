"use client";
import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListUsers.css";
import { UserCardsContext } from "./ModalUsersOne";

axios.defaults.withCredentials = true;

function CardUser({
    name,
    lastName,
    usuarioObject,
    email,
    isSelected,
    onSelection,
}) {
    //const [isSelected, setIsSelected] = useState(false);

    const { addUserList, removeUserInList } = useContext(UserCardsContext);

    return (
        <li
            className={isSelected ? "UserCard active" : "UserCard"}
            onClick={onSelection}
        >
            <img
                className="imgageUserDefault"
                src="/images/userDefaultList.png"
            />
            <div style={{ marginTop: "12px", marginLeft: "15px" }}>
                <p className="titleUserName">{name + " " + lastName}</p>
                <p className="titleUserEmail">{email}</p>
            </div>
        </li>
    );
}

export default function ListUsersOne(props) {
    const router = useRouter();

    const { addUserList, removeUserInList } = useContext(UserCardsContext);

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
                        onSelection={() => {
                            setSelectedUser(component.id);
                            addUserList(component);
                        }}
                    ></CardUser>
                );
            })}
        </ul>
    );
}
