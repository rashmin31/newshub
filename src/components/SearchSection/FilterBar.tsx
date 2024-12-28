import { useState, useCallback } from "react";
import { ChevronDownIcon, XMarkIcon } from "../../assets/icons";
import { FilterState } from "./types";

interface FilterBarProps {
    onChange: (filters: FilterState) => void;
}

const FilterBar = ({ onChange }: FilterBarProps) => {
    const [filters, setFilters] = useState<FilterState>({
        sources: [],
        categories: [],
        dateRange: null,
    });

    const [isSourcesOpen, setIsSourcesOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);

    const removeFilter = useCallback(
        (type: keyof FilterState, value?: string) => {
            const newFilters = {
                ...filters,
                [type]:
                    type === "dateRange"
                        ? null
                        : filters[type].filter((item) => item !== value),
            };
            setFilters(newFilters);
            onChange(newFilters); // Call onChange directly with new filters
        },
        [filters, onChange]
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setIsSourcesOpen(!isSourcesOpen)}
                    className="px-3 py-2 sm:px-4 sm:py-2 border 
                        border-gray-200 dark:border-gray-700 rounded-lg 
                        flex items-center gap-2 
                        bg-white dark:bg-gray-800 
                        text-gray-900 dark:text-white
                        hover:bg-gray-50 dark:hover:bg-gray-700 
                        transition-colors"
                >
                    <span className="text-sm sm:text-base">
                        Sources ({filters.sources.length})
                    </span>
                    <ChevronDownIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="px-3 py-2 sm:px-4 sm:py-2 border 
                        border-gray-200 dark:border-gray-700 rounded-lg 
                        flex items-center gap-2 
                        bg-white dark:bg-gray-800 
                        text-gray-900 dark:text-white
                        hover:bg-gray-50 dark:hover:bg-gray-700 
                        transition-colors"
                >
                    <span className="text-sm sm:text-base">
                        Categories ({filters.categories.length})
                    </span>
                    <ChevronDownIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => setIsDateOpen(!isDateOpen)}
                    className="px-3 py-2 sm:px-4 sm:py-2 border 
                        border-gray-200 dark:border-gray-700 rounded-lg 
                        flex items-center gap-2 
                        bg-white dark:bg-gray-800 
                        text-gray-900 dark:text-white
                        hover:bg-gray-50 dark:hover:bg-gray-700 
                        transition-colors"
                >
                    <span className="text-sm sm:text-base">Date Range</span>
                    <ChevronDownIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Active Filters */}
            {(filters.sources.length > 0 ||
                filters.categories.length > 0 ||
                filters.dateRange) && (
                <div className="flex flex-wrap gap-2">
                    {filters.sources.map((source) => (
                        <span
                            key={source}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                bg-blue-50 dark:bg-blue-900/30 
                                text-blue-700 dark:text-blue-300
                                text-sm border border-blue-200 dark:border-blue-800"
                        >
                            {source}
                            <button
                                onClick={() => removeFilter("sources", source)}
                                className="p-0.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800
                                    transition-colors"
                                aria-label={`Remove ${source} filter`}
                            >
                                <XMarkIcon className="w-3 h-3" />
                            </button>
                        </span>
                    ))}

                    {filters.categories.map((category) => (
                        <span
                            key={category}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                bg-purple-50 dark:bg-purple-900/30 
                                text-purple-700 dark:text-purple-300
                                text-sm border border-purple-200 dark:border-purple-800"
                        >
                            {category}
                            <button
                                onClick={() =>
                                    removeFilter("categories", category)
                                }
                                className="p-0.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800
                                    transition-colors"
                                aria-label={`Remove ${category} filter`}
                            >
                                <XMarkIcon className="w-3 h-3" />
                            </button>
                        </span>
                    ))}

                    {filters.dateRange && (
                        <span
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                bg-green-50 dark:bg-green-900/30 
                                text-green-700 dark:text-green-300
                                text-sm border border-green-200 dark:border-green-800"
                        >
                            {filters.dateRange}
                            <button
                                onClick={() => removeFilter("dateRange")}
                                className="p-0.5 rounded-full hover:bg-green-100 dark:hover:bg-green-800
                                    transition-colors"
                                aria-label="Remove date range filter"
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
