import React from 'react';
import { useRouter } from 'next/navigation';
import { SmallLoadingScreen } from  "@/app/dashboard/[project]/layout"
import { useContext } from "react";
function RouteringInteresados({proy_name, proy_id, idInteresado, isEdit}) {
    const router= useRouter();
    const proy_name1 = 'Mi primer proyecto';
    const proy_id1 = '42';
    const idMC1 = '5';
    const route = isEdit
        ? "/dashboard/" + proy_name + "=" + proy_id + "/catalogoDeInteresados/" + idInteresado + "=edit"
        : "/dashboard/" + proy_name + "=" + proy_id + "/catalogoDeInteresados/" + idInteresado;

    router.push(route);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    setIsLoadingSmall(true);
};
export default RouteringInteresados;