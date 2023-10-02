import "@/styles/dashboardStyles/projectStyles/EDTStyles/HeaderWithButtons.css";
import ButtonAddNew from "./ButtonAddNew";
import Link from "next/link";


export default function HeaderWithButtons(props){
    return(
        <div id="HeaderWithButtons">
            <p id="HeaderBreadcrumb">{props.breadcrump}</p>
            <div id="HeaderXbuttonXBackContainer">
                <div id="HeaderXBackContainer">
                    <p id="MainHeader">{props.children}</p>
                    {props.haveReturn && props.hrefToReturn != '' &&
                        <Link href={props.hrefToReturn}>
                            <img src="/icons/icon-goBack.svg" alt="" id="HeaderIconGoBack"/>
                        </Link>
                    }
                </div>
                {props.haveAddNew && props.hrefForButton &&
                    <Link href={props.hrefForButton}>
                        <ButtonAddNew hrenToGo={props.hrefForButton}>{props.btnText}</ButtonAddNew>
                    </Link>
                }
            </div>
        </div>
    );
}
