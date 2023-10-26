import "@/styles/CardSelectedUser.css";
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
                <p className="profilePic">{nombres[0] + apellidos[0]}</p>
                <div className="containerInfo">
                    <p className="usrNames">{nombres + " " + apellidos}</p>
                    <p className="usrMail">{usuarioObject.correoElectronico}</p>
                </div>
            </div>
            {isEditable && (
                <img
                    src="/icons/icon-crossBlack.svg"
                    alt="delete"
                    className="icnRight"
                    onClick={() => {
                        removeHandler(usuarioObject);
                    }}
                />
            )}
        </div>
    );
}
