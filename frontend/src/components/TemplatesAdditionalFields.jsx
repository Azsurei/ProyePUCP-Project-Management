import { v4 } from "uuid";

function TemplatesAdditionalFields({ setBaseFields }) {
    return <div onClick={handleSetPlantilla}>Presioname</div>;

    function handleSetPlantilla() {
        const array = ["tit1", "tit2"];
        array.map((titulo) => ({
            idCampoAdicional: v4(), //esto genera random ids que son basicamente imposibles de replicar
            titulo: titulo,
            descripcion: "Descripción detallada del campo ",
        }));

        setBaseFields(array);
    }
}
export default TemplatesAdditionalFields;
