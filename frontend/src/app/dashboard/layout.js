import DashboardNav from "@/components/dashboardComps/DashboardNav";
import DashboardSecondNav from "@/components/dashboardComps/DashboardSecondNav";

export default function RootLayout({ children }) {
    return (
        <div className="dashboardLayout" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <DashboardNav />
            <DashboardSecondNav />
            <div style={{marginTop:'123px', flex: '1', overflow:'auto', display: 'flex'}}>
                {children}
            </div>
        </div>
    );
}
