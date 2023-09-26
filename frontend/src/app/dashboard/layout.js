import DashboardNav from "@/components/dashboardComps/DashboardNav";
import DashboardSidebar from "@/components/dashboardComps/DashboardSidebar";

export default function RootLayout({ children }) {
    return (
        <body className="global-styles">
            <DashboardNav />
            <DashboardSidebar />
            {children}
        </body>
    );
}
