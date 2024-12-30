import { useState, useCallback, memo, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setPreferences } from "../../store/slices/preferencesSlice";
import SearchSection from "../SearchSection";
import ArticlesSection from "../ArticlesSection";
import { NewsFilters } from "../../types/news";
import { FilterState } from "../SearchSection/types";
import { useNewsMetadata } from "../../hooks/useNewsMetaData";

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

    const { metadata } = useNewsMetadata();

    // Apply saved preferences or default selections on initial load
    useEffect(() => {
        if (
            savedPreferences?.sources.length > 0 ||
            savedPreferences?.categories.length > 0
        ) {
            // Use saved preferences if they exist
            setFilters((prev) => ({
                ...prev,
                category: savedPreferences.categories.join(",") || "",
                source: savedPreferences.sources.join(",") || "",
                fromDate: savedPreferences.dateRange?.fromDate || "",
                toDate: savedPreferences.dateRange?.toDate || "",
            }));
        } else if (metadata) {
            // Set all sources and categories as selected by default
            const allSources = metadata.sources;
            const allCategories = Array.from(
                new Set(Object.values(metadata.categories).flat())
            );

            setFilters((prev) => ({
                ...prev,
                source: allSources.join(","),
                category: allCategories.join(","),
            }));

            // Save to preferences
            dispatch(
                setPreferences({
                    sources: allSources,
                    categories: allCategories,
                    authors: [],
                    dateRange: null,
                })
            );
        }
    }, [savedPreferences, metadata, dispatch]);

    const handleSearch = useCallback((searchQuery: string) => {
        setFilters((prev: NewsFilters) => ({
            ...prev,
            query: searchQuery,
        }));
    }, []);

    const handleFilterChange = useCallback(
        (filterState: FilterState) => {
            // Update local filter state with all selected items
            setFilters((prev: NewsFilters) => ({
                ...prev,
                source: filterState.sources.join(","), // Use a separator that can be split later
                category: filterState.categories.join(","), // Use a separator that can be split later
                fromDate: filterState.fromDate || "",
                toDate: filterState.toDate || "",
            }));

            dispatch(
                setPreferences({
                    sources: filterState.sources,
                    categories: filterState.categories,
                    authors: [],
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
                    sources: filters.source ? filters.source.split(",") : [],
                    categories: filters.category
                        ? filters.category.split(",")
                        : [],
                    fromDate: filters.fromDate,
                    toDate: filters.toDate,
                }}
            />
            <ArticlesSection filters={filters} />
        </div>
    );
});

MainContent.displayName = "MainContent";

export default MainContent;
