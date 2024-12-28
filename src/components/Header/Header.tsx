// src/components/Header/Header.tsx
import { Link } from "react-router-dom";
import { SunIcon, MoonIcon } from "../../assets/icons";
import { useTheme } from "../../hooks/useTheme";

const Header = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        try {
            setTheme(theme === "dark" ? "light" : "dark");
        } catch (e) {
            console.error("Error toggling theme:", e);
        }
    };

    return (
        <header className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link
                    to="/"
                    className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white"
                >
                    News Hub
                </Link>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-white dark:bg-gray-700 
                             hover:bg-gray-50 dark:hover:bg-gray-600 
                             transition-colors"
                    aria-label={
                        theme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                >
                    {theme === "dark" ? (
                        <SunIcon className="w-5 h-5 text-gray-800 dark:text-white" />
                    ) : (
                        <MoonIcon className="w-5 h-5 text-gray-800 dark:text-white" />
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
