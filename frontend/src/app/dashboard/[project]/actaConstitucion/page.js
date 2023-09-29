"use client"
import { useState, useRef } from "react";
import Link from "next/link";
import '../../../../components/dashboardComps/projectComps/appConstComps/AtributoCard';
import '../../../../styles/dashboardStyles/projectStyles/actaConstStyles/ActaConstitucion.css';
import '../../../../styles/dashboardStyles/projectStyles/actaConstStyles/AtributoCard.css';
import AtributoCard from "@/components/dashboardComps/projectComps/appConstComps/AtributoCard";
import '../../../../components/dashboardComps/projectComps/appConstComps/CardComplex'

export default function actaConstitucion() {

    return(
        <div className="container">
            <div className="header">
                Inicio / Proyectos / Nombre del proyecto / Acta de Constitucion
            </div>
            <div className="ActaConst">
                <div className="subtitle">Acta de Constitucion</div>

                <div className="subtitle">Informacion del Proyecto</div>
                <div className="ArregloAtributos">
                    <AtributoCard atributo={"Projecto"} valor={"Proyecto de Bajarse a PUCP Movil"}>
                    </AtributoCard><br/>
                    <AtributoCard atributo={"Nombre del equipo"} valor={"Los Dibujitos"}>
                    </AtributoCard><br/>
                    <AtributoCard atributo={"Fecha"} valor={"25/12/2023"}>
                    </AtributoCard><br/>
                    <AtributoCard atributo={"Cliente"} valor={"Sindicato de Catolica"}>
                    </AtributoCard><br/>
                    <AtributoCard atributo={"Patrocinador principal"} valor={"Luis Flores"}>
                    </AtributoCard><br/>
                    <AtributoCard atributo={"Gerente de proyecto"} valor={"Diego Iwasaki"}>
                    </AtributoCard><br/>
                    <br/><br/>
                </div>
                <br/>
                <div className="subtitle">Propósito y Justificación del Proyecto</div>
                <div className="ArregloAtributos">
                    <AtributoCard atributo={""} valor={"Dado que la aplicación PUCP Movil tiene muchos problemas (no sé cuales) hemos decidido tumbar PUCP Movil."}>
                    </AtributoCard>
                </div>
                <br/>

                <div className="subtitle">Descripción del Proyecto y Entregables</div>
                <div className="ArregloAtributos">
                    <AtributoCard atributo={""} valor={"Descripción del Proyecto totalmente generícas y cualquier otro entregable que sea necesario para el desarrollo de este proyecto. \n" +
                        "Se espera que para este proyecto se entreguen el Producto1 completamente terminado, así como los Documento 1, Documento 2 y Documento 3. Además, se requiere que al final del mismo todos los integrantes puedan realizar un nuevo requisito invisible."}>
                    </AtributoCard>
                </div>
                <br/>

                <div className="subtitle">Propósito y Justificación del Proyecto</div>
                <div className="ArregloAtributos">
                    <AtributoCard atributo={""} valor={"Dado que la aplicación PUCP Movil tiene muchos problemas (no sé cuales) hemos decidido tumbar PUCP Movil."}>
                    </AtributoCard>
                </div>
                <br/>

                <div className="subtitle">Presupuesto Estimado</div>
                <div className="ArregloAtributos">
                    <AtributoCard atributo={""} valor={"Las estimaciones de este proyecto se encuentran alrededor de los $10,000.00 bajo las siguientes razones. Pago a desarrolladores: $10. Pago a sindicato: $99,990.00."}>
                    </AtributoCard>
                </div>
                <br/>

                <div className="subtitle">Premisas y Restricciones</div>
                <div className="ArregloAtributos">
                    <AtributoCard atributo={""} valor={"Este proyecto se da a cabo por la Premisa1, Premisa2, Premisa3 y Premisa4. Se ha detectado que se cuenta con la Restricción1, Restricción2, Restricción3 y Restricción4. Las medidas en contra de la Restricción4 son dejar de alimentar a las ardillas y bajar el costo del menú."}>
                    </AtributoCard>
                </div>
                <br/>

                <div className="subtitle">Riesgos Iniciales de Alto Nivel</div>
                <div className="ArregloAtributos">
                    <AtributoCard atributo={""} valor={"Se calculan como Riesgos Iniciales de Alto Nivel el dejar que los desarrolladores se tiren una maratón de 10h viendo series. Se recomienda bloquear las páginas de streaming."}>
                    </AtributoCard>
                </div>
                <br/>

                <div className="subtitle">Requisitos de Aprobación del Proyecto</div>
                <div className="ArregloAtributos">
                    <AtributoCard atributo={""} valor={"Se tienen el Requisito1, Requisito2 y Requisito3, siendo el Requisito3 el más importante."}>
                    </AtributoCard>
                </div>
                <br/>

                <div className="subtitle">Requerimientos de Alto Nivel</div>
                <div className="ArregloAtributos">
                    <AtributoCard atributo={""} valor={"Se calculan como Riesgos Iniciales de Alto Nivel el dejar que los desarrolladores se tiren una maratón de 10h viendo series. Se recomienda bloquear las páginas de streaming."}>
                    </AtributoCard>
                </div>
                <br/>

                <div className="subtitle">Requerimientos del Producto</div>
                <div className="ArregloAtributos">
                    <AtributoCard atributo={""} valor={"Se calculan como Riesgos Iniciales de Alto Nivel el dejar que los desarrolladores se tiren una maratón de 10h viendo series. Se recomienda bloquear las páginas de streaming."}>
                    </AtributoCard>
                </div>
                <br/>

                <div className="subtitle">Requerimientos del Proyecto</div>
                <div className="ArregloAtributos">
                    <AtributoCard atributo={""} valor={"Se calculan como Riesgos Iniciales de Alto Nivel el dejar que los desarrolladores se tiren una maratón de 10h viendo series. Se recomienda bloquear las páginas de streaming."}>
                    </AtributoCard>
                </div>
                <br/>

                <div className="subtitle">Elaborado por</div>
                <div className="ArregloAtributos">
                    <AtributoCard atributo={""} valor={"Sebastian Chira Mallqui (20171857)"}>
                    </AtributoCard>
                </div>
                <br/>


                <div className="cancelarAceptar">
                    <div className="buttonContainer">
                        {/* Probablemente necesite usar router luego en vez de link */}
                        <Link href="#cancelar">
                            <button className="btnCancel" type="button">Cancelar</button>
                        </Link>
                        <Link href="#aceptar">
                            <button className="btnSave" type="button">Guardar</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}