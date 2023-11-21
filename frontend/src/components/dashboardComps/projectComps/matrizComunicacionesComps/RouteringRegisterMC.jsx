import React from 'react';
import { useRouter } from 'next/navigation';
import { SmallLoadingScreen } from  "@/app/dashboard/[project]/layout"
import { useContext } from "react";
function RouteringRegisterMC({proy_name, proy_id}) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router= useRouter();
    setIsLoadingSmall(true);
    router.push("/dashboard/"+proy_name+"="+proy_id+"/matrizDeComunicaciones/registerMC");
};
export default RouteringRegisterMC;
