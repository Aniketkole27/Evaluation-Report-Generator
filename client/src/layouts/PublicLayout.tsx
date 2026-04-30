import { Outlet } from "react-router-dom";
import Navbar from "../features/landing/components/Navbar";
import Footer from "../features/landing/components/Footer";

export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}