import "@/styles/dashboardStyles/projectStyles/cronogramaStyles/ModalSubequipos.css";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Switch,
    useDisclosure,
} from "@nextui-org/react";
import { SearchIcon } from "public/icons/SearchIcon";
import { useState } from "react";

import axios from "axios";
axios.defaults.withCredentials = true;

function CardSubequipo({ subequipo, isSelected, onSelection }) {
    //const [isSelected, setIsSelected] = useState(false);

    return (
        <li
            className={isSelected ? "SubteamCard active" : "SubteamCard"}
            onClick={onSelection}
        >
            <div className="SubTeamHeader">
                <img src="/icons/sideBarDropDown_icons/sbdd14.svg"></img>
                <p>{subequipo.nombre}</p>
            </div>

            <div className="SubTeamUsersContainer">
                {subequipo.participantes.map((user) => {
                    return (
                        <div className="SingleUserIcon">
                            {user.nombres[0] + user.apellidos[0]}
                        </div>
                    );
                })}
            </div>
        </li>
    );
}

function ListSubequipos({ lista }) {
    const [selectedUser, setSelectedUser] = useState(null); //contiene el id del seleccionado

    if (lista.length === 0) {
        return (
            <p className="noResultsMessage">No se encontraron resultados.</p>
        );
    }
    return (
        <ul className="ListSubequiposContainer">
            {lista.map((subequipo) => {
                return (
                    <CardSubequipo
                        key={subequipo.idEquipo}
                        subequipo={subequipo}
                        isSelected={selectedUser === subequipo.idEquipo}
                        onSelection={() => {
                            setSelectedUser(subequipo.idEquipo);
                            //addUserList(subequipo);
                        }}
                    ></CardSubequipo>
                );
            })}
        </ul>
    );
}

export default function ModalSubequipos({ isOpen, onOpenChange, projectId }) {
    const [filterValue, onSearchChange] = useState("");
    const [listSubequipos, setListSubequipos] = useState([]);
    const [showNames, setShowNames] = useState(false);

    const refreshList = () => {
        const searchURL =
            "http://localhost:8080/api/proyecto/equipo/listarEquiposYParticipantes/" +
            projectId;
        axios
            .get(searchURL, {
                nombreCorreo: filterValue,
            })
            .then(function (response) {
                console.log(response);
                setListSubequipos(response.data.equipos);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="xl"
            classNames={{
                closeButton: "hidden",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="ModalHeaderSubteams">
                                Busca
                                    <Switch
                                        isSelected={showNames}
                                        onValueChange={setShowNames}
                                    >
                                    </Switch>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    gap: ".6rem",
                                }}
                            >
                                <div className="divBuscador">
                                    <Input
                                        isClearable
                                        className="w-full sm:max-w-[100%]"
                                        placeholder="Ingresa un miembro..."
                                        startContent={<SearchIcon />}
                                        value={filterValue}
                                        onValueChange={onSearchChange}
                                        variant="faded"
                                    />
                                </div>
                                <Button
                                    className="bg-indigo-950 text-slate-50"
                                    onClick={refreshList}
                                >
                                    Buscar
                                </Button>
                            </div>

                            <ListSubequipos
                                lista={listSubequipos}
                            ></ListSubequipos>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Action
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
