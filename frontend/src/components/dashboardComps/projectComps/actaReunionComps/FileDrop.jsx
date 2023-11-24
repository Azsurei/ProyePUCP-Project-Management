import { Image } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";

function TrashIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
        </svg>
    );
}

function CloudIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="w-10 h-10"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
        </svg>
    );
}

const fileIconsMap = [
    {
        type: "excel",
        image: "/images/icnExcel.png",
    },
    {
        type: "word",
        image: "/images/icnWord.png",
    },
    {
        type: "pdf",
        image: "/images/icnPdf.png",
    },
];

function FileDrop({setFile}) {
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState(null);

    return (
        <div
            className="w-full h-full
                     bg-gray-100 border border-dashed border-slate-400 rounded-lg
                       p-4"
        >
            {isFileUploaded === false && (
                <form
                    className="w-full h-full flex justify-center items-center flex-col cursor-pointer"
                    onClick={() => {
                        document.querySelector(".uploadFileField").click();
                    }}
                >
                    <input
                        type="file"
                        className="uploadFileField"
                        hidden
                        accept=".pdf, .xls, .xlsx, .doc, .docx"
                        onChange={({ target: { files } }) => {
                            files[0] && setFileName(files[0].name);
                            if (files && files[0]) {
                                const allowedTypes = [
                                    "application/pdf",
                                    "application/msword",
                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                    "application/vnd.ms-excel",
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                ];

                                if (allowedTypes.includes(files[0].type)) {
                                    setFileName(files[0].name);
                                    setIsFileUploaded(true);
                                    setFile(files[0]);

                                    if (files[0].type === allowedTypes[0]) {
                                        setFileType(2);
                                        console.log("es pdf");
                                    }
                                    if (
                                        files[0].type === allowedTypes[1] ||
                                        files[0].type === allowedTypes[2]
                                    ) {
                                        setFileType(1);
                                        console.log("es word");
                                    }
                                    if (
                                        files[0].type === allowedTypes[3] ||
                                        files[0].type === allowedTypes[4]
                                    ) {
                                        setFileType(0);
                                        console.log("es excel");
                                    }
                                } else {
                                    toast.error(
                                        "Tipo de archivo invalido"
                                    );
                                    setFileName("");
                                    setIsFileUploaded(false);
                                    setFile(null);
                                    document.querySelector(
                                        ".uploadFileField"
                                    ).value = "";
                                }
                            }
                        }}
                    />

                    <div className="stroke-slate-400">
                        <CloudIcon className="stroke-slate-400" />
                    </div>
                    <p className="text-slate-400 font-medium text-lg">
                        Sube tu archivo aquí
                    </p>
                </form>
            )}
            {isFileUploaded === true && (
                <div className="border flex flex-row items-center justify-between bg-white p-3 pr-8 rounded-lg shadow-md border-slate-300">
                    <div className="flex flex-row items-center gap-1">
                        <Image
                            alt="Filetype"
                            height={70}
                            width={70}
                            src={fileIconsMap[fileType]?.image}
                        />
                        <p className="font-medium text-xl">{fileName}</p>
                    </div>
                    <div className="stroke-slate-400 hover:bg-red-500 hover:stroke-white rounded-md p-1 transition-colors duration-100 ease-in cursor-pointer"
                        onClick={()=>{
                            setFileName("");
                            setFileType(null);
                            setIsFileUploaded(false);
                        }}>
                        <TrashIcon />
                    </div>
                </div>
            )}
        </div>
    );
}
export default FileDrop;
