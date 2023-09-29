import DashboardNav from "@/components/dashboardComps/DashboardNav";
import DashboardSecondNav from "@/components/dashboardComps/DashboardSecondNav";

export default function RootLayout({ children }) {
    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <DashboardNav />
            <DashboardSecondNav />
            {children}
        </div>
    );
}
