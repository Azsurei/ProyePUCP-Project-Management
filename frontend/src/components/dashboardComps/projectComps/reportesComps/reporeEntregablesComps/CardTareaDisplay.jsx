import { Avatar, AvatarGroup, Chip, Tooltip } from "@nextui-org/react";
import GroupUserIcons from "../../cronogramaComps/GroupUserIcons";

function UsersDisplay({ listUsers }) {
    return (
        <AvatarGroup
            isBordered
            isGrid
            max={3}
            renderCount={(count) => (
                <Avatar
                    isBordered={false}
                    color={"primary"}
                    className="w-[40px] h-[40px] text-tiny"
                    fallback={<p id="MoreUsrsIcn">+{count}</p>}
                />
            )}
        >
            {listUsers.map((user) => {
                return (
                    <div
                        className="flex gap-4 items-center border-sm"
                        key={user.idUsuario}
                    >
                        <Tooltip
                            content={
                                <div className="px-1 py-2">
                                    <div className="text-small font-bold">
                                        {user.nombres + " " + user.apellidos}
                                    </div>
                                    <div className="text-small">
                                        {user.correoElectronico}
                                    </div>
                                </div>
                            }
                            classNames={{
                                base: "border border-slate-700 dark:border-slate-400 bg-mainSidebar",
                                arrow: "border border-slate-700 dark:border-slate-400 bg-mainSidebar"
                            }}
                            showArrow
                        >
                            <Avatar
                                isBordered
                                color="default"
                                src={user.imgLink}
                                className="w-[45px] h-[45px] text-tiny"
                                fallback={
                                    <p id="UsrNoIcon">
                                        {user.nombres[0] + user.apellidos[0]}
                                    </p>
                                }
                            />
                        </Tooltip>
                    </div>
                );
            })}
        </AvatarGroup>
    );
}

function CardTareaDisplay({
    tarea,
    leftMargin,
    handleVerDetalle,
    handleEdit,
    handleAddNewSon,
    handleDelete,
}) {
    const tieneHijos = true;

    const formattedStartDate = new Date(tarea.fechaInicio);
    const formattedEndDate = new Date(tarea.fechaFin);
    const duracion =
        formattedStartDate.toLocaleDateString() +
        " - " +
        formattedEndDate.toLocaleDateString();

    const toggleOpen = () => {
        setHijosIsOpen(!hijosIsOpen);
    };

    return (
        <div
            className="border-[1px] border-[#d3d3d3] rounded-[5px] flex flex-row items-center py-[.4rem] px-[1rem] text-base"
            style={{
                boxShadow:
                    "0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
            }}
        >
            <div className="containerNombreTarea flex-1">
                {tarea.tareasHijas.length !== 0 && (
                    <div className="containerChevron" onClick={toggleOpen}>
                        <img src="/icons/chevron-down.svg" />
                    </div>
                )}
                <div className="flex flex-col">
                    <p>{tarea.sumillaTarea}</p>
                    {/* {tarea.tareasPosteriores.length !== 0 && (
                        <p className="text-bold text-sm capitalize text-default-400">
                            {tarea.tareasPosteriores.length +
                                (tarea.tareasPosteriores.length > 1
                                    ? " tareas posteriores"
                                    : " tarea posterior")}
                        </p>
                    )} */}
                </div>
            </div>

            <div className="containerSelectedUsers w-[30%] flex items-center py-1 pl-1">
                {tarea.idEquipo !== null ? (
                    <div className="tareaContainerSubteam">
                        <img src="/icons/sideBarDropDown_icons/sbdd14.svg"></img>
                        <p>{tarea.equipo.nombre}</p>
                    </div>
                ) : (
                    <UsersDisplay listUsers={tarea.usuarios}></UsersDisplay>
                )}
            </div>

            <div className="containerTareaState w-[20%]">
                {/* <p className="bg-primary-200" id="labelTareaState">
                            {tarea.nombreTareaEstado}
                        </p> */}

                <Chip
                    className="capitalize"
                    color={tarea.colorTareaEstado}
                    size="sm"
                    variant="flat"
                >
                    {tarea.nombreTareaEstado}
                </Chip>
            </div>
            <div className="containerTareaDuracion w-[20%]">
                <p>{duracion}</p>
            </div>
        </div>
    );
}

export default CardTareaDisplay;
