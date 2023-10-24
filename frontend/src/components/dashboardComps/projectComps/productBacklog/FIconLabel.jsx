import "@/styles/dashboardStyles/projectStyles/productBacklog/IconLabel.css";

export default function IconLabel({icon,label,className}) {
    return (
        <div className={className}>
            <img src={icon} className="icono"/>
            <div className="label">
                {label}
            </div>
        </div>
    )
}