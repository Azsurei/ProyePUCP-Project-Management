import "@/styles/dashboardStyles/projectStyles/reportesStyles/reporteTareasStyles/GroupUserIconsReporte.css";

import {
    Avatar,
    AvatarGroup,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@nextui-org/react";

export default function GroupUserIconsReporte({ idTarea, listUsers, beImg }) {
    return (
        <AvatarGroup
            isGrid={true}
            isBordered
            max={3}
            renderCount={(count) => (
                    <Avatar
                    isBordered={false}
                    color={"primary"}
                    className="w-[40px] h-[40px] text-tiny"
                    fallback={
                        <p id="MoreUsrsIcn">
                            +{count}
                        </p>
                    }
                />
            )}
        >
            {listUsers.map((user) => {
                return (
                    <div className="flex gap-4 items-center border-sm" key={user.idUsuario}>
                        <Avatar
                            isBordered
                            color="default"
                            src={user.imgLink}
                            className="w-[40px] h-[40px] text-tiny"
                            fallback={
                                <p id="UsrNoIcon">
                                    {user.nombres[0] + user.apellidos[0]}
                                </p>
                            }
                        />
                    </div>
                );
            })}
        </AvatarGroup>
    );
}
