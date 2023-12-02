import React from 'react';
import { useRouter } from 'next/navigation';
// import { useContext } from 'react';
// import { SmallLoadingScreen } from "@/app/dashboard/layout";
function RouteringEditarGrupo({idGrupoProyecto}) {
    // const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    // setIsLoadingSmall(true);
    const router= useRouter();

    // router.push("/dashboard/"+proy_name+"="+proy_id+"/backlog/productBacklog/" + idHu);
    const route = 
     `/dashboard/grupoProyectos/newGroup/${idGrupoProyecto}`

    router.push(route);
};
export default RouteringReporteGrupo;