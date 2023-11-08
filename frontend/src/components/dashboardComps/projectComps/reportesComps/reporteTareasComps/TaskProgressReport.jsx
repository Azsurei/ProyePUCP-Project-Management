import { Slider, Progress, Divider } from "@nextui-org/react";
import CardProgressEntry from "./CardProgressEntry";
import CardUserWithProgress from "./CardUserWithProgress";

function TaskProgressReport() {
    const progressEntry = {
        user: {
            idUsuario: 3,
            nombres: "renzo",
            apellidos: "pinto",
            imgLink:
                "https://lh3.googleusercontent.com/a/ACg8ocJfDJJnt4CClfOWItoYOykKhkSPpobVB82pkxKw7MAIOQ=s96-c",
            correoElectronico: "a20201491@pucp.edu.pe"
        },
        equipo:{
            idEquipo: 0,
        },
        description: "Se cambio backlogsdfsdfsdfsfac as",
        progressValue: 3,
        dateEntry: "23/03/2023",
        timeEntry: "14:32",
    };

    return (
        <div className="flex flex-col flex-1 overflow-y-hidden">
            <p className="font-semibold text-2xl text-mainHeaders">
                Progreso de tarea
            </p>

            <div className="px-4 pt-2 flex-1 flex flex-col overflow-y-hidden">
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
                    <p className="h-full translate-y-[-25%] font-semibold text-lg">
                        85%
                    </p>
                </div>

                <div className=" flex-1 flex flex-row overflow-y-hidden">
                    <div className="flex-1 flex flex-col overflow-y-hidden">
                        <p className="font-medium text-lg">
                            Historia de progreso
                        </p>

                        <div className=" flex-1 space-y-1 overflow-y-auto">
                            <CardProgressEntry progressEntry={progressEntry} />
                            <CardProgressEntry progressEntry={progressEntry} />
                            <CardProgressEntry progressEntry={progressEntry} />
                            <CardProgressEntry progressEntry={progressEntry} />
                            <CardProgressEntry progressEntry={progressEntry} />
                            <CardProgressEntry progressEntry={progressEntry} />
                        </div>
                    </div>

                    <div className="w-5 flex justify-center items-center py-1">
                        <Divider orientation="vertical" />
                    </div>

                    <div className="flex-1 flex flex-col overflow-y-hidden">
                        <p className="font-medium text-lg">
                            Porcentaje total
                        </p>

                        <div className=" flex-1 space-y-1 overflow-y-auto pb-1">
                            <CardUserWithProgress isEditable={false} usuarioObject={progressEntry.user} percentage={progressEntry.progressValue}/>
                            <CardUserWithProgress isEditable={false} usuarioObject={progressEntry.user} percentage={progressEntry.progressValue}/>
                            <CardUserWithProgress isEditable={false} usuarioObject={progressEntry.user} percentage={progressEntry.progressValue}/>
                            <CardUserWithProgress isEditable={false} usuarioObject={progressEntry.user} percentage={progressEntry.progressValue}/>
                            <CardUserWithProgress isEditable={false} usuarioObject={progressEntry.user} percentage={progressEntry.progressValue}/>
                            <CardUserWithProgress isEditable={false} usuarioObject={progressEntry.user} percentage={progressEntry.progressValue}/>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
export default TaskProgressReport;
