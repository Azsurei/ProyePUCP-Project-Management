"use client";
import { SmallLoadingScreen } from "@/app/dashboard/[project]/layout";
import { Button, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";

function ReportTypeCard({ title, description, img, hrefGoTo, setActive }) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();

    return (
        <div
            className={
                "group w-full min-w-0 border shadow-md border-[#d3d3d3] rounded-[5px] transition-all ease-in duration-300 bg-mainBackground hover:bg-[#f3f3f3] dark:hover:bg-opacity-10" +
                " flex flex-row p-4  overflow-x-auto cursor-pointer max-h-[200px] gap-5"
            }
        >
            <div className="flex flex-row gap-2 flex-1">
                <div
                    className={
                        "flex overflow-x-hidden min-w-[200px] max-w-[200px] justify-center rounded-xl bg-mainSidebar group-hover:bg-slate-300 dark:group-hover:bg-slate-700 transition-height ease-in duration-300 delay-200 "
                    }
                >
                    <Image
                        //width={"100%"}
                        //height={"100%"}
                        alt="NextUI hero Image with delay"
                        src={img}
                        className=" h-full"
                    />
                </div>
    
                <div className="flex flex-1 flex-col gap-2 mt-2">
                    <p
                        className={
                            "transition-all ease duration-200 font-semibold font-[Montserrat] text-mainHeaders text-2xl"
                        }
                    >
                        {title}
                    </p>
    
                    <p>{description}</p>
                </div>
            </div>

            <div className="flex justify-center items-center">
                <Button
                    color="primary"
                    className="rounded-md"
                    onClick={() => {
                        setIsLoadingSmall(true);
                        router.push(hrefGoTo);
                    }}
                >
                    Generar registro
                </Button>
            </div>
        </div>
    );
}

export default ReportTypeCard;
