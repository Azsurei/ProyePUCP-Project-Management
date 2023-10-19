import React from 'react';
import { useRouter } from 'next/navigation';
function RouteringBacklog({proy_name, proy_id, idMC}) {
    const router= useRouter();
    const proy_name1 = 'Mi primer proyecto';
    const proy_id1 = '42';
    const idMC1 = '5';
    router.push("/dashboard/"+proy_name+"="+proy_id+"/matrizDeComunicaciones/" + idMC);
};
export default RouteringBacklog;