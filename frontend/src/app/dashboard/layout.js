import DashboardNav from "@/components/dashboardComps/DashboardNav";
import DashboardSecondNav from "@/components/dashboardComps/DashboardSecondNav";

export default function RootLayout({ children }) {
    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <DashboardNav />
            <DashboardSecondNav />
            <div style={{paddingTop:'123px', height: '100%'}}>
                {children}
            </div>
        </div>
    );
}
