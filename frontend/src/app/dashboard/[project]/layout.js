import ProjectSidebar from "@/components/dashboardComps/projectComps/ProjectSidebar";
import "@/styles/dashboardStyles/projectStyles/ProjectSidebar.css";


export default function RootLayout({ children, params }) {
    const projectName = params.project;
    const decodedName = decodeURIComponent(projectName);

    return ( //AQUI CAMBIE BODY POR DIV, YA QUE AL TENER BODY QUITA EL LAYOUT DEL DASHBOARD
        <div className="DashboardProjectContainer">   
            <ProjectSidebar projectName={decodedName} currentUrl={projectName}></ProjectSidebar>
            {children}
            
        </div>
    );
}