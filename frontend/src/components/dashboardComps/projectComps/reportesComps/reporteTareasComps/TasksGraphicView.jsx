import { Tab, Tabs } from "@nextui-org/react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Legend, plugins } from "chart.js/auto";

function TasksGraphicView({chartGeneralData}) {

    

    return (
        <div className="flex-1 border overflow-auto">
            <div className="flex flex-row gap-3 items-center">
                <p className="font-semibold text-2xl text-mainHeaders flex-none">
                    Grafico de culminacion por sprints
                </p>
                <Tabs radius="md" aria-label="Tabs radius" color="primary">
                    <Tab key="vGeneral" title="Vista general" />
                    <Tab key="vSprints" title="Por sprints" />
                </Tabs>
            </div>

            <div className="border border-red-500 flex-1 mx-2 w-1/2">
                <Bar data={chartGeneralData} height={"100%"}/>
            </div>
        </div>
    );
}
export default TasksGraphicView;