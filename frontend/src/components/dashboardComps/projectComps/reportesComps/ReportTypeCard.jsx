import { Image } from "@nextui-org/react";

function ReportTypeCard({ title, description, img, isActive, setActive }) {
    return (
        <div
            className={
                "group h-full min-w-0 border shadow-md border-[#d3d3d3] rounded-[5px] transition-all ease-in duration-300 bg-mainBackground hover:bg-[#f3f3f3] dark:hover:bg-opacity-10" +
                " flex flex-col p-4  overflow-x-auto cursor-pointer " + (isActive ? "w-full" : "w-[25%]")
            }
            onClick={setActive}
        >
            <div className={"flex overflow-x-hidden justify-center rounded-xl bg-mainSidebar group-hover:bg-slate-300 dark:group-hover:bg-slate-700 transition-height ease-in duration-300 delay-200 " + (isActive ? "h-[400px]" : "h-[200px]")} >
                <Image
                    //width={"100%"}
                    height={"100%"}
                    alt="NextUI hero Image with delay"
                    src={img}
                    className=" h-full min-w-[200px]"
                />
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <p className={"transition-all ease duration-200 font-semibold font-[Montserrat] text-mainHeaders " + (isActive ? "text-3xl" : "text-2xl")} >
                    {title}
                </p>

                <p>{description}</p>
            </div>
        </div>
    );
}

export default ReportTypeCard;
