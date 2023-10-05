import ProjectSidebar from "@/components/dashboardComps/projectComps/ProjectSidebar";
import "@/styles/dashboardStyles/projectStyles/ProjectSidebar.css";


export default function RootLayout({ children, params }) {
    const decodedUrl = decodeURIComponent(params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf('=') + 1);
    const projectName= decodedUrl.substring(0, decodedUrl.lastIndexOf('='));

    return ( //AQUI CAMBIE BODY POR DIV, YA QUE AL TENER BODY QUITA EL LAYOUT DEL DASHBOARD
        <div className="DashboardProjectContainer">   
            <ProjectSidebar projectName={projectName} projectId={projectId} currentUrl={params.project}></ProjectSidebar>
            <div style={{flex:'1'}} className="h-[100%] overflow-auto">
                {children}
            </div>
            
        </div>
    );
}