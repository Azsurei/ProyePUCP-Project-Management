import "@/styles/dashboardStyles/projectStyles/EquipoStyles/CardTarea.css";
import { Avatar, AvatarGroup, Chip } from "@nextui-org/react";

export default function CardTarea({ tarea }) {
    return (
        <div className="flex flex-row border border-red-500 p-3 items-center">
            <div className="w-[40%] pr-[3%]">
                <Chip
                    className="capitalize"
                    color={tarea.colorTareaEstado}
                    size="sm"
                    variant="flat"
                >
                    {tarea.nombreTareaEstado}
                </Chip>
                <p>{tarea.sumillaTarea}</p>
            </div>
            <div className="w-[30%]">{tarea.fechaFin}</div>
            <div className="w-[30%] flex">
                <AvatarGroup isBordered max={3}>
                    {tarea.usuarios.map((usuario) => {
                        return (
                            <Avatar
                                src=""
                                fallback={
                                    <p id="UsrNoIconTarea">
                                        {usuario.nombres[0] +
                                            usuario.apellidos[0]}
                                    </p>
                                }
                            ></Avatar>
                        );
                    })}
                </AvatarGroup>
            </div>
        </div>
    );
}
