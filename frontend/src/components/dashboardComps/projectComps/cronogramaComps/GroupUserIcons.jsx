import "@/styles/dashboardStyles/projectStyles/cronogramaStyles/GroupUserIcons.css";

import {
    Avatar,
    AvatarGroup,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@nextui-org/react";

export default function GroupUserIcons({ idTarea, listUsers, beImg }) {
    return (
        <AvatarGroup
            isBordered
            max={3}
            renderCount={(count) => (
                    <Avatar
                    isBordered={false}
                    color={"primary"}
                    //src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                    className="w-[50px] h-[50px] text-tiny"
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
                            //src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                            className="w-14 h-14 text-tiny"
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
