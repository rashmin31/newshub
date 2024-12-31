import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Header from "../../src/components/Header";

const mockSetTheme = jest.fn();

// Mock the useTheme hook
jest.mock("../../src/hooks/useTheme", () => ({
    __esModule: true,
    useTheme: () => ({
        theme: "light",
        setTheme: mockSetTheme,
    }),
}));

describe("Header Component", () => {
    const renderHeader = () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        mockSetTheme.mockClear();
    });

    it("renders the logo/title", () => {
        renderHeader();
        expect(screen.getByText("News Hub")).toBeInTheDocument();
    });

    it("renders theme toggle button", () => {
        renderHeader();
        const themeButton = screen.getByRole("button", {
            name: /switch to dark mode/i,
        });
        expect(themeButton).toBeInTheDocument();
    });

    it("calls setTheme when theme toggle is clicked", async () => {
        const user = userEvent.setup();
        renderHeader();
        const themeButton = await screen.findByRole("button", {
            name: /switch to dark mode/i,
        });
        await user.click(themeButton);
        expect(mockSetTheme).toHaveBeenCalled();
    });
});
