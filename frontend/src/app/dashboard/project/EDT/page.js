
import ButtonAddNew from "@/components/dashboardComps/projectComps/EDTComps/ButtonAddNew";
import ListElementsEDT from "@/components/dashboardComps/projectComps/EDTComps/ListElementsEDT";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";

const childOfFirst=[
    {
        id: 1,
        componentName: 'hola soy hijo de gestion de proyecto',
        levelCounter: '1',
        levelName: 'SUBPROYECTO',
        levelColor: 'gray',
        childsList: null
    },
    {
        id: 2,
        componentName: 'hola soy el otro hijo de gestion de proyecto',
        levelCounter: '2',
        levelName: 'SUBPROYECTO',
        levelColor: 'gray',
        childsList: [{
            id: 5,
            componentName: 'soy tu ultimo hijo hazme un hermano',
            levelCounter: '1',
            levelName: 'ENTREGABLE',
            levelColor: 'red',
        }]
    }
];

const componentsDataFirstNode=[
    {
        id: 3,
        componentName: 'Gestion de proyecto',
        levelCounter: '1',
        levelName: 'FASE',
        levelColor: 'purple',
        childsList: childOfFirst
    },
    {
        id: 4,
        componentName: 'API de acceso a la base de datos de RENIEC',
        levelCounter: '2',
        levelName: 'FASE',
        levelColor: 'purple',
        childsList: null
    }
];


function recursive(list){
    list.map((item)=>{
        console.log('mostrando ' + item.componentName + ' de tipo ' + item.levelName);
        if(item.childsList != null){
            recursive(item.childsList);
            return;
        }

        return <ListElementsEDT listData={item}></ListElementsEDT>;
    });
};


export default function EDT() {
    return (
        //aqui va el contenido dentro de la pagina de ruta /project
        <div className="EDT">
            <p>Inicio / Proyectos / Proyecto X / EDT y Diccionario EDT</p>
            <div className="headerContainer">
                <p className="headerTitle">EDT y diccionario EDT</p>
                <ButtonAddNew></ButtonAddNew>
            </div>
            <div className="componentSearchContainer">
                <input type="text" /> 
                <button>
                    Buscar
                </button>
            </div>

            <ListElementsEDT listData={componentsDataFirstNode} initialPadding={0}></ListElementsEDT>
        </div>
    );
}