import React from "react";
import { useRouter } from "next/navigation";
import { SmallLoadingScreen } from "@/app/dashboard/[project]/layout";
import { useContext } from "react";
function RouteringRC({ proy_name, proy_id, idRC, isEdit }) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    setIsLoadingSmall(true);
    const router = useRouter();
    const proy_name1 = "Mi primer proyecto";
    const proy_id1 = "42";
    const idMC1 = "5";
    const route = isEdit
        ? `/dashboard/${proy_name}=${proy_id}/catalogoDeRiesgos/${idRC}=edit`
        : `/dashboard/${proy_name}=${proy_id}/catalogoDeRiesgos/${idRC}`;

    router.push(route);
}
export default RouteringRC;
