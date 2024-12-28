import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import { FilterState } from "./types";

interface SearchSectionProps {
    onSearch: (query: string) => void;
    onFilterChange: (filters: FilterState) => void;
}

const SearchSection = ({ onSearch, onFilterChange }: SearchSectionProps) => {
    return (
        <div className="space-y-4">
            <SearchBar onSearch={onSearch} />
            <FilterBar onChange={onFilterChange} />
        </div>
    );
};

export default SearchSection;
