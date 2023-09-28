import "@/styles/dashboardStyles/projectStyles/productBacklog/IconLabel.css";

export default function IconLabel({icon,label}) {
    return (
        <div className="iconLabel">
            <img src={icon}/>
            <div className="label">
                {label}
            </div>
        </div>
    )
}