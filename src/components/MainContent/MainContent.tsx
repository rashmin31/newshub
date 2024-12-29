import { useState, useCallback, memo, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setPreferences } from "../../store/slices/preferencesSlice";
import SearchSection from "../SearchSection";
import ArticlesSection from "../ArticlesSection";
import { NewsFilters } from "../../types/news";
import { FilterState } from "../SearchSection/types";

const MainContent = memo(() => {
    const dispatch = useAppDispatch();
    const savedPreferences = useAppSelector(
        (state) => state.preferences.preferences
    );
    const [filters, setFilters] = useState<NewsFilters>({
        query: "",
        category: "",
        source: "",
        fromDate: "",
        toDate: "",
    });

    // Apply saved preferences on initial load
    useEffect(() => {
        if (savedPreferences) {
            setFilters({
                ...filters,
                category: savedPreferences.categories[0] || "",
                source: savedPreferences.sources[0] || "",
                fromDate: savedPreferences.dateRange?.fromDate || "",
                toDate: savedPreferences.dateRange?.toDate || "",
            });
        }
    }, []); // Empty dependency array for initial load only

    const handleSearch = useCallback((searchQuery: string) => {
        setFilters((prev: NewsFilters) => ({
            ...prev,
            query: searchQuery,
        }));
    }, []);

    const handleFilterChange = useCallback(
        (filterState: FilterState) => {
            // Update local filter state
            setFilters((prev: NewsFilters) => ({
                ...prev,
                source: filterState.sources[0] || "",
                category: filterState.categories[0] || "",
                fromDate: filterState.fromDate || "",
                toDate: filterState.toDate || "",
            }));

            // Automatically save preferences when filters change
            dispatch(
                setPreferences({
                    sources: filterState.sources,
                    categories: filterState.categories,
                    authors: [], // Can be expanded later
                    dateRange:
                        filterState.fromDate && filterState.toDate
                            ? {
                                  fromDate: filterState.fromDate,
                                  toDate: filterState.toDate,
                              }
                            : null,
                })
            );
        },
        [dispatch]
    );

    return (
        <div className="space-y-4 sm:space-y-6">
            <SearchSection
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                currentFilters={{
                    sources: filters.source ? [filters.source] : [],
                    categories: filters.category ? [filters.category] : [],
                    fromDate: filters.fromDate,
                    toDate: filters.toDate,
                }}
            />
            <ArticlesSection filters={filters} />
        </div>
    );
});

export default MainContent;
