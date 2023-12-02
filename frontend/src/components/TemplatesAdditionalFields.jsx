import { v4 } from "uuid";
import "@/styles/TemplatesExtras.css";

import {
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import SaveAsIcon from '@mui/icons-material/SaveAs';

function TemplatesAdditionalFields({ setBaseFields }) {

    const { 
        isOpen: isModalSavePlantilla, 
        onOpen: onSaveModalPlantilla, 
        onOpenChange: onModaSavePlantillaChange 
    
    
    } = useDisclosure();

    const { 
        isOpen: isModalPlantillas, 
        onOpen: onModalPlantillas, 
        onOpenChange: onModalPlantillasChange 
    
    
    } = useDisclosure();



    return <div>
        <Dropdown>
            <DropdownTrigger>
                <Button className="btnPlantilla" color="secondary">Plantillas</Button>
            </DropdownTrigger>
            <DropdownMenu
                variant="faded"
                aria-label="Dropdown menu with icons"
            >
                <DropdownItem
                    key="verPlantillasAC"
                    startContent={<ContentPasteGoIcon />}
                    onPress={onModalPlantillas}
                    color="secondary"
                >
                    Ver Plantillas
                </DropdownItem>
                <DropdownItem
                    key="guardarPlantillasAC"
                    startContent={<SaveAsIcon />}
                    onPress={onSaveModalPlantilla}
                    color="secondary"
                >
                    Guardar Plantilla
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>

    </div>;

    function handleSetPlantilla() {
        const array = ["tit1", "tit2"];

        const mappedArray = array.map((titulo) => {
            return {
                idCampoAdicional: v4(), //esto genera random ids que son basicamente imposibles de replicar
                titulo: titulo,
                descripcion: "Descripción detallada del campo ",
            };
        });

        setBaseFields(mappedArray);
        console.log(mappedArray);
    }
}
export default TemplatesAdditionalFields;
