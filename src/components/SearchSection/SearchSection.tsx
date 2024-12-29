import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import { FilterState } from "./types";
import { useCallback } from "react";

interface SearchSectionProps {
    onSearch: (query: string) => void;
    onFilterChange: (filters: FilterState) => void;
    currentFilters: FilterState;
}

const SearchSection = ({
    onSearch,
    onFilterChange,
    currentFilters,
}: SearchSectionProps) => {
    const handleFilterChange = useCallback(
        (filters: FilterState) => {
            console.log("Filters changed:", filters); // Debug log
            onFilterChange(filters);
        },
        [onFilterChange]
    );
    return (
        <div className="space-y-4">
            <SearchBar onSearch={onSearch} />
            <FilterBar
                onChange={handleFilterChange}
                initialFilters={currentFilters}
            />
        </div>
    );
};

export default SearchSection;
