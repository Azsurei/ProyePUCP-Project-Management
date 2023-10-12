import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import AgendaTable from "@/components/dashboardComps/projectComps/cronogramaComps/AgendaTable";

export default function Cronograma(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    return (
        <div className="cronogramaDiv" style={{padding: "2.5rem 2.5rem"}}>
            <HeaderWithButtonsSamePage
                haveReturn={false}
                haveAddNew={false}
                // handlerAddNew={handlerGoToNew}
                //newPrimarySon={ListComps.length + 1}
                breadcrump={"Inicio / Proyectos / " + projectName}
                //btnText={"Nuevo componente"}
            >
                Cronograma
            </HeaderWithButtonsSamePage>

            <AgendaTable></AgendaTable>
        </div>
    );
}
