import React from "react";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ChoiceUser.css";

function CardSelectedUser(props) {
    return (
        <div className="CardSelectedUser">
            <div className="containerLeft">
                <p className="profilePic">
                    {props.name[0] + props.lastName[0]}
                </p>
                <div className="containerInfo">
                    <p className="usrNames">
                        {props.name + " " + props.lastName}
                    </p>
                    <p className="usrMail">{props.email}</p>
                </div>
            </div>
            <img
                src="/icons/icon-crossBlack.svg"
                alt="delete"
                className="icnRight"
            />
        </div>
    );
}

export default function ChoiceUser({
    toggleModal1,
    toggleModal2,
    selectedSupervisoresList,
    selectedMiembrosList,
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
                            ></CardSelectedUser>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
