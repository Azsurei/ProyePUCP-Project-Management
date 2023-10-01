import HeaderWithButtonsSamePage from "./HeaderWithButtonsSamePage";
import ListElementsEDT from "./ListElementsEDT";

export default function EDTVisualization({projectName,projectId, ListComps, handlerAddNew}) {

    return (
        <>
            <HeaderWithButtonsSamePage
                haveReturn={false}
                haveAddNew={true}
                handlerAddNew={handlerAddNew}
                breadcrump={"Inicio / Proyectos / Proyect X"}
                btnText={"Agregar nueva fase"}
            >
                EDT y diccionario EDT
            </HeaderWithButtonsSamePage>
            <div className="componentSearchContainer">
                <input type="text" />
                <button>Buscar</button>
            </div>

            <ListElementsEDT
                listData={ListComps}
                initialMargin={0}
            ></ListElementsEDT>
        </>
    );
}
