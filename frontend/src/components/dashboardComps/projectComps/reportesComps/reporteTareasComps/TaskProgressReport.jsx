import { Slider, Progress, Divider } from "@nextui-org/react";
import CardProgressEntry from "./CardProgressEntry";
import CardUserWithProgress from "./CardUserWithProgress";

function TaskProgressReport({
    generalProgress,
    progressEntries,
    asignedUsers,
}) {
    const progressEntry = {
        user: {
            idUsuario: 3,
            nombres: "renzo",
            apellidos: "pinto",
            imgLink:
                "https://lh3.googleusercontent.com/a/ACg8ocJfDJJnt4CClfOWItoYOykKhkSPpobVB82pkxKw7MAIOQ=s96-c",
            correoElectronico: "a20201491@pucp.edu.pe",
        },
        equipo: {
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
                            value={generalProgress}
                            color={getColorForProgBar(generalProgress)}
                        />
                        <div className="flex flex-row w-full justify-evenly">
                            <p className="text-md font-normal ">20%</p>
                            <p className="text-md font-normal ">50%</p>
                            <p className="text-md font-normal ">80%</p>
                        </div>
                    </div>
                    <p className="h-full translate-y-[-25%] font-semibold text-lg">
                        {generalProgress}%
                    </p>
                </div>

                <div className=" flex-1 flex flex-row overflow-y-hidden">
                    <div className="flex-1 flex flex-col overflow-y-hidden">
                        <p className="font-medium text-lg">
                            Historia de progreso
                        </p>

                        <div className=" flex-1 space-y-1 overflow-y-auto">
                            {progressEntries.length === 0 && (
                                <div className="w-full h-full flex justify-center items-center text-slate-500">
                                    No hay registros de progreso
                                </div>
                            )}
                            {progressEntries.map((entry) => {
                                return (
                                    <CardProgressEntry
                                        key={entry.idRegistroProgreso}
                                        progressEntry={entry}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-5 flex justify-center items-center py-1">
                        <Divider orientation="vertical" />
                    </div>

                    <div className="flex-1 flex flex-col overflow-y-hidden">
                        <p className="font-medium text-lg">Porcentaje total</p>

                        <div className=" flex-1 space-y-1 overflow-y-auto pb-1">
                            {asignedUsers.map((user) => {
                                return (
                                    <CardUserWithProgress
                                        key={user.idUsuario}
                                        isEditable={false}
                                        usuarioObject={user}
                                        //percentage={progressEntry.progressValue}
                                        percentage={sumPorcentajeRegistradoById(
                                            user.idUsuario
                                        )}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    function sumPorcentajeRegistradoById(idUsuario) {
        return progressEntries.reduce((sum, element) => {
            if (element.idUsuario === idUsuario) {
                return sum + element.porcentajeRegistrado;
            }
            return sum;
        }, 0);
    }

    function getColorForProgBar(progressVal) {
        if(progressVal <= 20){
            return "danger";
        }
        if(progressVal > 20 && progressVal <=50){
            return "warning";
        }
        if(progressVal > 50 && progressVal <=80){
            return "primary";
        }
        if(progressVal > 80 && progressVal <=100){
            return "success";
        }
    }
}
export default TaskProgressReport;
