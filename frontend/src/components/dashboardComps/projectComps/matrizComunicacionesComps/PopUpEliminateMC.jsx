import React from "react";
import "@/styles/PopUpEliminateHU.css";
import axios from "axios";
axios.defaults.withCredentials = true;

function PopUpEliminateMC({ modal, toggle, taskName, idComunicacion}) {

    const Eliminate = (idComunicacion) => {
        // console.log(idHistoriaDeUsuario);
        // axios.post("http://localhost:8080/api/proyecto/backlog/hu/eliminarHistoria", { idHistoriaDeUsuario: idHistoriaDeUsuario })
        //     .then((response) => {
        //         // Manejar la respuesta de la solicitud POST
        //         console.log("Respuesta del servidor:", response.data);
        //         console.log("Eliminado correcto");
        //         // Llamar a refresh() aquí después de la solicitud HTTP exitosa
        //         refresh();
        //     })
        //     .catch((error) => {
        //         // Manejar errores si la solicitud POST falla
        //         console.error("Error al realizar la solicitud POST:", error);
        //     });
    };

    

    return (
        <>
            {modal && (
                <div className="popUp">
                    <div onClick={toggle} className="overlay"></div>
                    <div className="popUp-content">
                        <h2 className="popUp-title">
                            Eliminar informacion de la matriz {idComunicacion}
                        </h2>
                        <h3 className="advertisement">
                            ¿Estás seguro que desea eliminar la siguiente informacion?
                        </h3>
                        <label
                            for="TextBoxEliminate"
                            className="label-Eliminate"
                        >
                            <strong>Nombre de la informacion: </strong>
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            readonly
                            value={taskName}
                        ></input>

                        <div className="buttonSection">
                            <button className="close-modal" onClick={toggle}>
                                Cancelar
                            </button>
                            <button className="close-modal" onClick={() => Eliminate(idComunicacion)}>
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <p></p>
        </>
    );
}

export default PopUpEliminateMC;
