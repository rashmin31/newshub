import { useState, useCallback, memo } from "react";
import SearchSection from "../SearchSection";
import ArticlesSection from "../ArticlesSection";
import { NewsFilters } from "../../types/news";
import { FilterState } from "../SearchSection/types";

const MainContent = memo(() => {
    const [filters, setFilters] = useState<NewsFilters>({
        query: "",
        category: "",
        source: "",
        fromDate: "",
        toDate: "",
    });

    const handleSearch = useCallback((searchQuery: string) => {
        setFilters((prev: NewsFilters) => ({
            ...prev,
            query: searchQuery,
        }));
    }, []);

    const handleFilterChange = useCallback((filterState: FilterState) => {
        setFilters((prev: NewsFilters) => ({
            ...prev,
            source: filterState.sources[0] || "",
            category: filterState.categories[0] || "",
            fromDate: filterState.fromDate || "",
            toDate: filterState.toDate || "",
        }));
    }, []);

    return (
        <div className="space-y-4 sm:space-y-6">
            <SearchSection
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
            />
            <ArticlesSection filters={filters} />
        </div>
    );
});

export default MainContent;
