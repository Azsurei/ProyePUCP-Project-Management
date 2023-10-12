import { Avatar, AvatarGroup } from "@nextui-org/react";

export default function GroupUserIcons() {
    return (
        <AvatarGroup
            isBordered
            max={3}
            renderCount={(count) => (
                <p className="text-small text-foreground font-medium ml-2">
                    +{count} usuario
                </p>
            )}
        >
            <div className="flex gap-4 items-center">
                <Avatar
                    src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                    className="w-12 h-12 text-tiny"
                />
            </div>
            <div className="flex gap-4 items-center">
                <Avatar
                    src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                    className="w-12 h-12 text-tiny"
                />
            </div>
            <div className="flex gap-4 items-center">
                <Avatar
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    className="w-12 h-12 text-tiny"
                />
            </div>
            <div className="flex gap-4 items-center">
                <Avatar
                    src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                    className="w-12 h-12 text-tiny"
                />
            </div>
        </AvatarGroup>
    );
}
