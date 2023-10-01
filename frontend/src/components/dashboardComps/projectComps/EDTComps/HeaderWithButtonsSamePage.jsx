import "@/styles/dashboardStyles/projectStyles/EDTStyles/HeaderWithButtons.css";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/ButtonAddNew.css";
import ButtonAddNew from "./ButtonAddNew";
import Link from "next/link";


export default function HeaderWithButtonsSamePage(props){
    return(
        <div id="HeaderWithButtons">
            <p id="HeaderBreadcrumb">{props.breadcrump}</p>
            <div id="HeaderXbuttonXBackContainer">
                <div id="HeaderXBackContainer">
                    <p id="MainHeader">{props.children}</p>
                    {props.haveReturn &&
                        <img src="/icons/icon-goBack.svg" alt="" id="HeaderIconGoBack" onClick={props.handlerReturn}/>
                    }
                </div>
                {props.haveAddNew &&
                    <button onClick={props.handlerAddNew} className="ButtonAddNew">{props.btnText}</button>
                }
            </div>
        </div>
    );
}
