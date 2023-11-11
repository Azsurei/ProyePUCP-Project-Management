import { Tab, Tabs } from "@nextui-org/react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Legend, plugins } from "chart.js/auto";
import { useState } from "react";

function TasksGraphicView({ chartGeneralData, chartSprintData }) {
    const [selectedTab, setSelectedTab] = useState("vGeneral");


    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex flex-row gap-3 items-center">
                <p className="font-semibold text-2xl text-mainHeaders flex-none">
                    Grafico de culminacion por sprints
                </p>
                <Tabs
                    radius="md"
                    aria-label="Tabs radius"
                    color="primary"
                    selectedKey={selectedTab}
                    onSelectionChange={setSelectedTab}
                >
                    <Tab key="vGeneral" title="Vista general" />
                    <Tab key="vSprints" title="Por sprints" />
                </Tabs>
            </div>

            <div className="absolute top-unit-10 bottom-0 left-0 right-0 ">
                <Bar
                    data={
                        selectedTab === "vGeneral"
                            ? chartGeneralData
                            : chartSprintData
                    }
                    width={"100%"}
                    height={"100%"}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'x'
                    }}
                />
            </div>
        </div>
    );
}
export default TasksGraphicView;
