import { Outlet } from "react-router-dom";
// import Sidebar from "@/components/Sidebar";
// import Topbar from "@/components/Topbar";

export default function AppLayout() {
    return (
        <div className="flex min-h-screen">

            {/* <Sidebar /> */}

            <div className="flex-1 flex flex-col">
                {/* <Topbar /> */}

                <main className="p-4 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}