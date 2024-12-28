// src/hooks/useTheme.ts
import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

export const useTheme = () => {
    // Function to safely check system preference
    const getSystemTheme = useCallback((): Theme => {
        if (typeof window === "undefined") return "light";

        try {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        } catch (e) {
            console.warn("Error checking system theme:", e);
            return "light";
        }
    }, []);

    // Function to safely get stored theme
    const getStoredTheme = useCallback((): Theme | null => {
        if (typeof window === "undefined") return null;

        try {
            return localStorage.getItem("theme") as Theme | null;
        } catch (e) {
            console.warn("Error accessing localStorage:", e);
            return null;
        }
    }, []);

    // Initialize theme state with a default value
    const [theme, setThemeState] = useState<Theme>("light");

    // Initialize on mount
    useEffect(() => {
        const stored = getStoredTheme();
        setThemeState(stored ?? getSystemTheme());
    }, [getStoredTheme, getSystemTheme]);

    // Effect to update document class and localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const root = window.document.documentElement;
            root.classList.remove("light", "dark");
            root.classList.add(theme);

            try {
                localStorage.setItem("theme", theme);
            } catch (e) {
                console.warn("Error saving theme to localStorage:", e);
            }
        } catch (e) {
            console.error("Error updating theme:", e);
        }
    }, [theme]);

    // Effect to listen for system theme changes
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)"
            );
            const handleChange = (e: MediaQueryListEvent) => {
                if (!getStoredTheme()) {
                    setThemeState(e.matches ? "dark" : "light");
                }
            };

            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        } catch (e) {
            console.warn("Error setting up system theme listener:", e);
        }
    }, [getStoredTheme]);

    // Safe theme setter
    const setTheme = useCallback((newTheme: Theme) => {
        try {
            setThemeState(newTheme);
        } catch (e) {
            console.error("Error setting theme:", e);
        }
    }, []);

    return { theme, setTheme };
};
