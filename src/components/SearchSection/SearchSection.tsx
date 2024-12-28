import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import { FilterState } from "./types";
import { useCallback } from "react";

interface SearchSectionProps {
    onSearch: (query: string) => void;
    onFilterChange: (filters: FilterState) => void;
}

const SearchSection = ({ onSearch, onFilterChange }: SearchSectionProps) => {
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
            <FilterBar onChange={handleFilterChange} />
        </div>
    );
};

export default SearchSection;
