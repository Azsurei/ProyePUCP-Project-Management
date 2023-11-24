"use client";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useContext, useState } from "react";
import { SessionContext } from "../../layout";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
axios.defaults.withCredentials = true;

function NotificacionesPage() {
    const { sessionData } = useContext(SessionContext);
    const [presuLimit, setPresuLimit] = useState(
        sessionData.notifPresupuestoAmount
    );
    const [isModified, setIsModified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="w-full">
            <p className="font-medium text-xl mb-2">
                Configura tus preferencias para notificaciones
            </p>
            <div className="px-3">
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-1">
                        <p>Valor limite para notificaciones de presupuesto</p>
                        <Input
                            type="number"
                            variant="bordered"
                            minRows={1}
                            placeholder="Escribe aqui"
                            value={presuLimit}
                            onValueChange={setPresuLimit}
                            onChange={(e) => {
                                if (isModified === false) {
                                    setIsModified(true);
                                }
                            }}
                        />
                    </div>
                    {isModified === true ? (
                        <div className=" flex justify-end">
                            <Button
                                isLoading={isLoading}
                                color="primary"
                                className="font-medium"
                                onPress={async ()=>{
                                    await updateNotifLimit();
                                }}
                            >
                                Guardar
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );

    async function updateNotifLimit() {
        setIsLoading(true);
        try {
            const modifyURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/usuario/modificarPreferenciaNotificacionPresupuesto";
            const response = await axios.post(modifyURL, {
                idUsuario: sessionData.idUsuario,
                newAmount: presuLimit,
            });


            if (response.status === 200) {
                setIsLoading(false);
                setIsModified(false);
                toast.success("Preferencia modificada con exito");
            } 
        } catch (e) {
            setIsLoading(false);
            console.log(e);
            toast.error("Error al modificar preferencia");
        }
    }
}
export default NotificacionesPage;
