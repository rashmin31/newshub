import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchBar from "../../src/components/SearchSection/SearchBar";

describe("SearchBar Component", () => {
    const mockOnSearch = jest.fn();

    beforeEach(() => {
        jest.useFakeTimers();
        mockOnSearch.mockClear();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders search input", () => {
        render(<SearchBar onSearch={mockOnSearch} />);
        expect(
            screen.getByPlaceholderText("Search articles...")
        ).toBeInTheDocument();
    });

    it("debounces search input", () => {
        render(<SearchBar onSearch={mockOnSearch} />);
        const searchInput = screen.getByPlaceholderText("Search articles...");

        fireEvent.change(searchInput, { target: { value: "test" } });
        expect(mockOnSearch).not.toHaveBeenCalled();

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(mockOnSearch).toHaveBeenCalledWith("test");
    });
});
