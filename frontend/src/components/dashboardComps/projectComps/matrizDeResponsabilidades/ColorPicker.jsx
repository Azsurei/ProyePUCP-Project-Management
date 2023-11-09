import { Input, Snippet } from "@nextui-org/react";
export default function ColorPicker({ value, onChangeColor }) {

    function hexToRgb(hex) {
        // Eliminar el hash si está presente
        hex = hex.replace(/^#/, "");

        // Parsear los componentes de color
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        // Retornar el resultado en formato RGB
        return `rgb(${r}, ${g}, ${b})`;
    }

    const handleColorChange = (e) => {
        const hexColor = e.target.value;
        const rgbColor = hexToRgb(hexColor);
        onChangeColor(rgbColor);
    };

    return (
        <section className="flex rounded-xl border-slate-500">
            <div className="w-2/12 mr-4">
                <div
                    style={{ backgroundColor: value }}
                    className="w-full h-full rounded-xl relative"
                >
                    <input
                        onChange={handleColorChange}
                        type="color"
                        id="colorPickerMR"
                        className="w-full h-full absolute opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            <Input
                label="Color"
                placeholder="#000000"
                variant="bordered"
                value={value}
                isReadOnly
                className="w-10/12"
            />
        </section>
    );
}
