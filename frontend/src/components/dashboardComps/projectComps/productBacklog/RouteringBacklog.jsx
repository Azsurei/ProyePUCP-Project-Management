import React from 'react';
import { useRouter } from 'next/navigation';
function RouteringBacklog({proy_name, proy_id, idHu, isEdit}) {
    const router= useRouter();
    const proy_name1 = 'Mi primer proyecto';
    const proy_id1 = '42';
    const idHu1 = '5';
    // router.push("/dashboard/"+proy_name+"="+proy_id+"/backlog/productBacklog/" + idHu);
    const route = isEdit
    ? `/dashboard/${proy_name}=${proy_id}/backlog/productBacklog/${idHu}=edit`
    : `/dashboard/${proy_name}=${proy_id}/backlog/productBacklog/${idHu}`;

    router.push(route);
};
export default RouteringBacklog;