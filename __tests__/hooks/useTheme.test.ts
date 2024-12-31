import { renderHook, act } from "@testing-library/react";
import { useTheme } from "../../src/hooks/useTheme";

describe("useTheme Hook", () => {
    const mockMatchMedia = (matches: boolean) => {
        window.matchMedia = jest.fn().mockImplementation((query) => ({
            matches,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }));
    };

    beforeEach(() => {
        localStorage.clear();
        mockMatchMedia(false);
    });

    it("initializes with system preference when no stored theme", () => {
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe("light");
    });

    it("uses stored theme when available", () => {
        localStorage.setItem("theme", "dark");
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe("dark");
    });

    it("updates theme correctly", () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
            result.current.setTheme("dark");
        });

        expect(result.current.theme).toBe("dark");
        expect(localStorage.getItem("theme")).toBe("dark");
    });
});
