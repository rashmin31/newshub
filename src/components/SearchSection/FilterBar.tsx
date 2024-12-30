import { useState, useCallback, useEffect } from "react";
import { FilterState } from "./types";
import CategoryFilter from "./CategoryFilter";
import SourceFilter from "./SourceFilter";
import DateFilter from "./DateFilter";
import { sourceToApiKey } from "../../utils/sourceMapping";
import { useNewsMetadata } from "../../hooks/useNewsMetaData";

interface FilterBarProps {
    onChange: (filters: FilterState) => void;
    initialFilters: FilterState;
}

const FilterBar = ({ onChange, initialFilters }: FilterBarProps) => {
    const { metadata } = useNewsMetadata();
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialFilters.categories
    );
    const [selectedSources, setSelectedSources] = useState<string[]>(
        initialFilters.sources
    );
    const [dateRange, setDateRange] = useState({
        fromDate: initialFilters.fromDate,
        toDate: initialFilters.toDate,
    });

    // Update local state when initialFilters change
    useEffect(() => {
        setSelectedCategories(initialFilters.categories);
        setSelectedSources(initialFilters.sources);
        setDateRange({
            fromDate: initialFilters.fromDate,
            toDate: initialFilters.toDate,
        });
    }, [initialFilters]);

    const handleCategoryChange = useCallback(
        (categories: string[]) => {
            setSelectedCategories(categories);
            const fromDate = dateRange.fromDate;
            const toDate = dateRange.toDate;
            onChange({
                categories,
                sources: selectedSources,
                fromDate,
                toDate,
            });
        },
        [onChange, selectedSources, dateRange]
    );

    const handleSourceChange = useCallback(
        (sources: string[]) => {
            setSelectedSources(sources);
            const fromDate = dateRange.fromDate;
            const toDate = dateRange.toDate;
            const availableCategories = metadata
                ? sources.length > 0
                    ? Array.from(
                          new Set(
                              sources
                                  .map(
                                      (source) =>
                                          metadata.categories[
                                              sourceToApiKey(source)
                                          ]
                                  )
                                  .flat()
                          )
                      ).sort()
                    : Array.from(
                          new Set(Object.values(metadata.categories).flat())
                      ).sort()
                : [];
            onChange({
                categories: availableCategories,
                sources,
                fromDate,
                toDate,
            });
        },
        [onChange, dateRange, metadata]
    );

    const handleDateChange = useCallback(
        (fromDate: string, toDate: string) => {
            setDateRange({ fromDate, toDate });
            onChange({
                categories: selectedCategories,
                sources: selectedSources,
                fromDate,
                toDate,
            });
        },
        [onChange, selectedCategories, selectedSources]
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    <SourceFilter
                        selectedSources={selectedSources}
                        onSourceChange={handleSourceChange}
                    />

                    <CategoryFilter
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                        selectedSources={selectedSources}
                    />

                    <DateFilter
                        fromDate={dateRange.fromDate}
                        toDate={dateRange.toDate}
                        onDateChange={handleDateChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
