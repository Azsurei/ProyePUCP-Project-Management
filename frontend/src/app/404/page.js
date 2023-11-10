"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function DefaultErrorPage() {
    const router = useRouter();
    return (
        <div className="w-full h-full flex justify-center items-center flex-col gap-5">
            <p className="font-[Montserrat] text-3xl">
                Pagina no encontrada, intenta de nuevo!
            </p>
            <Button
                onPress={handleRedirection}
                color="primary"
                size="lg"
                className="font-[Montserrat]"
            >
                Volver a dashboard
            </Button>
        </div>
    );

    function handleRedirection() {
        router.push("/dashboard");
    }
}
export default DefaultErrorPage;
