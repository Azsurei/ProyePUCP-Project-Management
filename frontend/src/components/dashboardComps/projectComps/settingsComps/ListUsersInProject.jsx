"use client";
import CardSelectedUser from "@/components/CardSelectedUser";
import { Chip } from "@nextui-org/react";
import { useEffect } from "react";

function ListUsersInProject({ userList }) {
    const jefeProyecto = userList.filter((user) => user.idRol === 1);
    const supervisores = userList.filter((user) => user.idRol === 2);
    const miembros = userList.filter((user) => user.idRol === 3);

    useEffect(() => {
        console.log(JSON.stringify(jefeProyecto, null, 2));
    }, []);

    const twStyle1="flex flex-col gap-2";
    const twStyle2="flex flex-col gap-2";

    return (
        <div className="flex flex-col gap-3 mt-1">
            <div className={twStyle2}>
                <p className="text-xl font-medium">Jefe de proyecto:</p> 
                {jefeProyecto.length !== 0 && (
                    <CardSelectedUser
                        isEditable={false}
                        usuarioObject={jefeProyecto[0]}
                    />
                )}
            </div>

            <div className={twStyle2}>
                <p className="text-xl font-medium">Supervisores</p> 
                <div className={twStyle1}>
                    {supervisores.length !== 0 &&
                        supervisores.map((supervisor) => {
                            return (
                                <CardSelectedUser
                                    key={supervisor.idUsuario}
                                    isEditable={true}
                                    usuarioObject={supervisor}
                                    removeHandler={() => {
                                        console.log("hola");
                                    }}
                                />
                            );
                        })}
                </div>
            </div>

            <div className={twStyle2}>
                <p className="text-xl font-medium">Miembros de equipo</p>
                <div className={twStyle1}>
                    {miembros.length !== 0 &&
                        miembros.map((miembro) => {
                            return (
                                <CardSelectedUser
                                    key={miembro.idUsuario}
                                    isEditable={true}
                                    usuarioObject={miembro}
                                    removeHandler={() => {
                                        console.log("hola");
                                    }}
                                />
                            );
                        })}
                </div>
            </div>

        </div>
    );
}
export default ListUsersInProject;
