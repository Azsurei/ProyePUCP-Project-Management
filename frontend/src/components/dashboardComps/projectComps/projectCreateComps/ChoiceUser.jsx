"use client"
import React, { useContext } from "react";
import "@/styles/dashboardStyles/projectStyles/ProjectCreateStyles/ChoiceUser.css";
import CardSelectedUser from "@/components/CardSelectedUser";



export default function ChoiceUser({
    toggleModal1,
    toggleModal2,
    selectedSupervisoresList,
    selectedMiembrosList,
    removeSupervisor,
    removeMiembro
}) {
    return (
        <div className="containerBusquedaUsuarios">
            <div className="SelectedUsersContainer">
                <p className="selectedUsersHeader">Supervisores</p>
                <div
                    className="containerToPopUpUsrSearch"
                    onClick={toggleModal1}
                >
                    <p>Buscar nuevo supervisor</p>
                    <img
                        src="/icons/icon-searchBar.svg"
                        alt=""
                        className="icnSearch"
                    />
                </div>

                <ul className="listUsersContainer">
                    {selectedSupervisoresList.map((component) => {
                        return (
                            <CardSelectedUser
                                key={component.id}
                                name={component.name}
                                lastName={component.lastName}
                                usuarioObject={component}
                                email={component.email}
                                removeHandler={removeSupervisor}
                            ></CardSelectedUser>
                        );
                    })}
                </ul>
            </div>
            <div className="SelectedUsersContainer">
                <p className="selectedUsersHeader">Miembros de equipo</p>
                <div
                    className="containerToPopUpUsrSearch"
                    onClick={toggleModal2}
                >
                    <p>Buscar nuevo miembro</p>
                    <img
                        src="/icons/icon-searchBar.svg"
                        alt=""
                        className="icnSearch"
                    />
                </div>

                <ul className="listUsersContainer">
                    {selectedMiembrosList.map((component) => {
                        return (
                            <CardSelectedUser
                                key={component.id}
                                name={component.name}
                                lastName={component.lastName}
                                usuarioObject={component}
                                email={component.email}
                                removeHandler={removeMiembro}
                            ></CardSelectedUser>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
