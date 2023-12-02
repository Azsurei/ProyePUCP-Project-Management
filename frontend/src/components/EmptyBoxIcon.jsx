"use client";
import { Image } from "@nextui-org/react";

function EmptyBoxIcon({ width, height }) {
    return (
        <div className="flex justify-center items-center ">
            <Image
                src="/icons/empty-box-light.png"
                className="dark:hidden"
                height={height}
                width={width}
            />
            <Image
                src="/icons/empty-box-dark.png"
                className="hidden dark:block"
                height={height}
                width={width}
            />
        </div>
    );
}
export default EmptyBoxIcon;
