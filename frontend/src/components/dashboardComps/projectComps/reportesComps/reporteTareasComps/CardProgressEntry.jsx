import { Avatar } from "@nextui-org/react";

function CardProgressEntry({ progressEntry }) {
    return (
        <div className="flex flex-row border-b-1 pb-2 pt-1 px-1 gap-2 items-center  max-w-full relative">
            <Avatar
                //isBordered
                //as="button"
                className="transition-transform w-[45px] min-w-[45px] h-[45px] min-h-[45px] max-w-[45px] max-h-[45px]"
                src={progressEntry.user.imgLink}
                fallback={
                    <p className="h-[45px] w-[45px] max-w-[45px] max-h-[45px] text-[1.1rem] bg-mainUserIcon flex justify-center items-center">
                        {progressEntry.user.nombres[0] +
                            (progressEntry.user.apellidos !== null
                                ? progressEntry.user.apellidos[0]
                                : "")}
                    </p>
                }
            />
            <div className="flex flex-col flex-1  gap-0 absolute right-1 left-[54px]">
                <div className="flex flex-row w-full justify-between">
                    <p>
                        <span className="font-semibold">Renzo</span> agregó {progressEntry.progressValue}%
                    </p>
                    <p>{progressEntry.dateEntry}</p>
                </div>


                <p className="italic font-bold text-slate-500 truncate">&quot;{progressEntry.description}&quot;</p>
            </div>
        </div>
    );
}
export default CardProgressEntry;