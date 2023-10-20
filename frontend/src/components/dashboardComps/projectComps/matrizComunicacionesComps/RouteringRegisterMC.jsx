import React from 'react';
import { useRouter } from 'next/navigation';
import { SmallLoadingScreen } from  "@/app/dashboard/[project]/layout"
import { useContext } from "react";
function RouteringRegisterMC({proy_name, proy_id}) {
    const router= useRouter();
    router.push("/dashboard/"+proy_name+"="+proy_id+"/matrizDeComunicaciones/registerMC");
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    setIsLoadingSmall(true);
};
export default RouteringRegisterMC;