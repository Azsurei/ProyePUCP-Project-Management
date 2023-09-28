import "@/styles/dashboardStyles/projectStyles/EDTStyles/ButtonAddNew.css";

export default function ButtonAddNew(props){
    return(
        <button className="ButtonAddNew">
            {props.children}
        </button>
    );
}