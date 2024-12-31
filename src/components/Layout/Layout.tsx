// src/components/Layout/Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "../Header";

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
