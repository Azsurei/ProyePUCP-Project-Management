import "@/styles/CardSelectedUser.css";
import { Avatar } from "@nextui-org/react";
export default function CardSelectedUser({
    isEditable,
    usuarioObject,
    removeHandler,
    ...props
}) {
    const nombres = usuarioObject.nombres;
    const apellidos =
        usuarioObject.apellidos === null ? "" : usuarioObject.apellidos;
    return (
        <div className="CardSelectedUser">
            <div className="containerLeft">
                {/* <p className="profilePic">{nombres[0] + apellidos[0]}</p> */}
                 <Avatar
                    //isBordered
                    //as="button"
                    className="transition-transform w-[50px] min-w-[50px] h-[50x] min-h-[50px]"
                    src={usuarioObject.imgLink}
                    fallback={
                        <p className="profilePic">
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
                    src="/icons/icon-crossBlack.svg"
                    alt="delete"
                    className="icnRightDelete"
                    onClick={() => {
                        removeHandler(usuarioObject);
                    }}
                />
            )}
        </div>
    );
}
