import { Slider, Progress } from "@nextui-org/react";

function TaskProgressReport() {
    return (
        <div className="w-full h-full border border-green-500 flex flex-col">
            <p className="font-semibold text-xl text-mainHeaders">
                Progreso de tarea
            </p>

            <div className="px-4 pt-2 flex-1 border border-black">
                <div className="flex flex-row w-full items-start gap-2">
                    <div className="flex flex-col items-center w-full">
                        <Progress
                            size="md"
                            aria-label="Loading..."
                            value={70}
                            color={"primary"}
        
                        />
                        <div className="flex flex-row w-full justify-evenly">
                            <p className="text-md font-normal ">20%</p>
                            <p className="text-md font-normal ">50%</p>
                            <p className="text-md font-normal ">80%</p>
                        </div>
                    </div>
                    <p className="h-full translate-y-[-25%] font-semibold text-lg">85%</p>
                </div>
            </div>
        </div>
    );
}
export default TaskProgressReport;
