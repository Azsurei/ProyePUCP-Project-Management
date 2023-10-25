import "@/styles/dashboardStyles/projectStyles/EquipoStyles/CardTarea.css";
import { Avatar, AvatarGroup, Chip } from "@nextui-org/react";

export default function CardTarea({ tarea }) {
    const startDate = new Date(tarea.fechaInicio);
    const endDate = new Date(tarea.fechaFin);

    // Formatea las fechas
    const formattedStartDate = startDate.toLocaleDateString();
    const formattedEndDate = endDate.toLocaleDateString();

    return (
        <div className="flex flex-row p-3 pl-[6px] items-center">
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
            <div className="w-[30%]">{formattedEndDate}</div>
            <div className="w-[30%] flex pl-[6px]">
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
