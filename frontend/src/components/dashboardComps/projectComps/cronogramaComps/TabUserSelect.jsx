import { Tabs, Tab } from "@nextui-org/react";

export default function TabUserSelect({ selectedKey, onSelectionChange }) {
    return (
        <div className="flex flex-wrap gap-4">
            <Tabs
                key={"primary"}
                color={"primary"}
                aria-label="Tabs colors"
                radius="full"
                classNames={{
                    cursor: "w-full bg-[#F0AE19]",
                }}
                selectedKey={selectedKey}
                onSelectionChange={onSelectionChange}
            >
                <Tab key="users" title="Usuarios" />
                <Tab key="subteams" title="Subequipos" />
            </Tabs>
        </div>
    );
}
