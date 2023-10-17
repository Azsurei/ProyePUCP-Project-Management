import "@/styles/CardSelectedUser.css";
export default function CardSelectedUser({
    name,
    lastName,
    usuarioObject,
    email,
    removeHandler,
    ...props
}) {

    return (
        <div className="CardSelectedUser">
            <div className="containerLeft">
                <p className="profilePic">
                    {name[0] + lastName[0]}
                </p>
                <div className="containerInfo">
                    <p className="usrNames">
                        {name + " " + lastName}
                    </p>
                    <p className="usrMail">{email}</p>
                </div>
            </div>
            <img
                src="/icons/icon-crossBlack.svg"
                alt="delete"
                className="icnRight"
                onClick={()=>{removeHandler(usuarioObject)}}
            />
        </div>
    );
}