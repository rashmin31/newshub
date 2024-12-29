import { useState, useCallback, useEffect } from "react";
import { XMarkIcon } from "../../assets/icons";
import { FilterState } from "./types";
import CategoryFilter from "./CategoryFilter";
import SourceFilter from "./SourceFilter";
import DateFilter from "./DateFilter";

interface FilterBarProps {
    onChange: (filters: FilterState) => void;
    initialFilters: FilterState;
}

const FilterBar = ({ onChange, initialFilters }: FilterBarProps) => {
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
            console.log("Selected categories:", categories); // Debug log
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
            console.log("Selected sources:", sources);
            setSelectedSources(sources);
            const fromDate = dateRange.fromDate;
            const toDate = dateRange.toDate;
            onChange({
                categories: selectedCategories,
                sources,
                fromDate,
                toDate,
            });
        },
        [onChange, selectedCategories, dateRange]
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

    const handleResetAll = () => {
        setSelectedCategories([]);
        setSelectedSources([]);
        setDateRange({ fromDate: "", toDate: "" });
        onChange({
            categories: [],
            sources: [],
            fromDate: "",
            toDate: "",
        });
    };

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
                        selectedSource={selectedSources[0]} // Pass first selected source
                    />

                    <DateFilter
                        fromDate={dateRange.fromDate}
                        toDate={dateRange.toDate}
                        onDateChange={handleDateChange}
                    />
                </div>
                {(selectedCategories.length > 0 ||
                    selectedSources.length > 0 ||
                    dateRange.fromDate) && (
                    <button
                        onClick={handleResetAll}
                        className="px-3 py-2 text-sm rounded-lg bg-gray-200 dark:bg-gray-700 
                                 text-gray-700 dark:text-gray-300
                                 hover:bg-gray-300 dark:hover:bg-gray-600 
                                 transition-colors"
                    >
                        Reset All Filters
                    </button>
                )}
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 ||
                selectedSources.length > 0 ||
                dateRange.fromDate) && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {selectedSources.map((source) => (
                        <span
                            key={source}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                bg-blue-50 dark:bg-blue-900/30 
                                text-blue-700 dark:text-blue-300
                                text-sm border border-blue-200 dark:border-blue-800"
                        >
                            {source}
                            <button
                                onClick={() =>
                                    handleSourceChange(
                                        selectedSources.filter(
                                            (s) => s !== source
                                        )
                                    )
                                }
                                className="ml-1 hover:text-green-800 dark:hover:text-green-200"
                                aria-label={`Remove ${source} filter`}
                            >
                                <XMarkIcon className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {selectedCategories.map((category) => (
                        <span
                            key={category}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                bg-blue-50 dark:bg-blue-900/30 
                                text-blue-700 dark:text-blue-300
                                text-sm border border-blue-200 dark:border-blue-800"
                        >
                            {category}
                            <button
                                onClick={() =>
                                    handleCategoryChange(
                                        selectedCategories.filter(
                                            (c) => c !== category
                                        )
                                    )
                                }
                                className="ml-1 hover:text-blue-800 dark:hover:text-blue-200"
                                aria-label={`Remove ${category} filter`}
                            >
                                <XMarkIcon className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {dateRange.fromDate && dateRange.toDate && (
                        <span
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                            bg-purple-50 dark:bg-purple-900/30 
                            text-purple-700 dark:text-purple-300
                            text-sm border border-purple-200 dark:border-purple-800"
                        >
                            {`${new Date(
                                dateRange.fromDate
                            ).toLocaleDateString()} - 
                              ${new Date(
                                  dateRange.toDate
                              ).toLocaleDateString()}`}
                            <button
                                onClick={() => handleDateChange("", "")}
                                className="ml-1 hover:text-purple-800 dark:hover:text-purple-200"
                                aria-label="Clear date range"
                            >
                                <XMarkIcon className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default FilterBar;
