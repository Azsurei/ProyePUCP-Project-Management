import "@/styles/CardSelectedUser.css";
import { Avatar } from "@nextui-org/react";

function IconTeam() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
        </svg>
    );
}

function CardUser({ isEditable, usuarioObject, removeHandler, ...props }) {
    const nombres = usuarioObject.nombres;
    const apellidos =
        usuarioObject.apellidos === null ? "" : usuarioObject.apellidos;
    return (
        <div
            className="CardSelectedUser bg-mainBackground dark:rounded-[10px] cursor-pointer 
            transition-background ease-in duration-100
            dark:hover:bg-slate-800 
             hover:bg-slate-300 hover:border-slate-300"
        >
            <div className="containerLeft">
                <Avatar
                    //isBordered
                    //as="button"
                    className="transition-transform w-[50px] min-w-[50px] h-[50x] min-h-[50px]"
                    src={usuarioObject.imgLink}
                    fallback={
                        <p className="profilePic bg-mainUserIcon">
                            {usuarioObject.nombres[0] +
                                (usuarioObject.apellidos !== null
                                    ? usuarioObject.apellidos[0]
                                    : "")}
                        </p>
                    }
                />

                <div className="containerInfo">
                    <p className="usrNames">{nombres + " " + apellidos}</p>
                    <p className="usrMail">{usuarioObject.correoElectronico}</p>
                </div>
            </div>
            {isEditable && (
                <img
                    src="/icons/icon-trash.svg"
                    alt="delete"
                    className="mb-4 cursor-pointer mr-2 absolute right-0 top-1/2 transform -translate-y-1/2"
                    onClick={() => {
                        removeHandler(usuarioObject);
                    }}
                />
            )}
        </div>
    );
}

function CardContribuyente({ contribuyente, user, equipo, isEquipo }) {
    //componente creado para manejar un contribuyente que puede ser equipo o participante

    const formattedValue = typeof contribuyente.porcentajeTotal === 'number' ? contribuyente.porcentajeTotal.toFixed(1) : contribuyente.porcentajeTotal;

    if (isEquipo) {
        return (
            <div className="flex flex-row w-full items-center gap-2">
                <p className="font-[Montserrat] font-semibold text-lg">
                    {formattedValue + "%"}
                </p>
                <div
                    className="flex flex-row gap-2 w-full items-center bg-mainBackground py-5 px-5 border-[#DFDFDF] border-[1px] rounded-[10px]
                    cursor-pointer
                    transition-background ease-in duration-100
                    dark:hover:bg-slate-800 
                    hover:bg-slate-300 hover:border-slate-300"
                    style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
                >
                    <IconTeam />
                    <p className="font-semibold">{equipo.nombre}</p>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex flex-row w-full items-center gap-2">
                <p className="font-[Montserrat] font-semibold text-lg">
                    {formattedValue + "%"}
                </p>
                <CardUser isEditable={false} usuarioObject={user} />
            </div>
        );
    }
}

export default CardContribuyente;
