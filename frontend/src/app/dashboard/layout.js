import DashboardNav from "@/components/dashboardComps/DashboardNav";
import DashboardSecondNav from "@/components/dashboardComps/DashboardSecondNav";

export default function RootLayout({ children }) {
    return (
        <div>
            <DashboardNav />
            <DashboardSecondNav />
            {children}
        </div>
    );
}
