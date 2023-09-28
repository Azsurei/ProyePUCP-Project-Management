import Link from "next/link";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/projectMenu.css";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import ListProject from "@/components/dashboardComps/projectComps/ListProject";

export default function Dashboard() {

    const componenteProject=[
        {
            id: 1,
            name: 'Gestion de proyecto',

        },
        {
            id: 2,
            name: 'xd',

        }
    ];


    return (
        
        <div className="mainDiv">


            <div className="headerDiv">
            <HeaderWithButtons haveReturn={false} 
                               haveAddNew={true}
                               hrefToReturn={''}
                               hrefForButton={'/dashboard/project/newProject'}
                               breadcrump={'Inicio / Proyectos '}
                               btnText={'Crear Proyecto'}>Proyectos</HeaderWithButtons>
            </div>

            <div class="divSearch">
                <form role="searchContainer">
                    <input
                        type="search" id="query" name="q"
                        class="searchProject"
                        placeholder="Buscar proyecto"
                        />
                    <button class="searchButton">
                    <svg viewBox="0 0 1024 1024"><path class="path1" d="M848.471 928l-263.059-263.059c-48.941 36.706-110.118 55.059-177.412 55.059-171.294 0-312-140.706-312-312s140.706-312 312-312c171.294 0 312 140.706 312 312 0 67.294-24.471 128.471-55.059 177.412l263.059 263.059-79.529 79.529zM189.623 408.078c0 121.364 97.091 218.455 218.455 218.455s218.455-97.091 218.455-218.455c0-121.364-103.159-218.455-218.455-218.455-121.364 0-218.455 97.091-218.455 218.455z"></path></svg>
                    </button>
                </form>
            </div>


        
            <ListProject listData={componenteProject}></ListProject>
        </div>

        


    );
}