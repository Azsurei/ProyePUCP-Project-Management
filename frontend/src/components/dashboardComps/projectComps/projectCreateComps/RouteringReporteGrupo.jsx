import React from 'react';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { SmallLoadingScreen } from "@/app/dashboard/layout";
function RouteringReporteGrupo({idGrupoProyecto}) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    setIsLoadingSmall(true);
    const router= useRouter();
    const proy_name1 = 'Mi primer proyecto';
    const proy_id1 = '42';
    const idHu1 = '5';
    // router.push("/dashboard/"+proy_name+"="+proy_id+"/backlog/productBacklog/" + idHu);
    const route = 
     `/dashboard/grupoProyectos/${idGrupoProyecto}`

    router.push(route);
};
export default RouteringReporteGrupo;