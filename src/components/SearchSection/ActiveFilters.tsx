import { XMarkIcon } from "../../assets/icons";

interface ActiveFiltersProps {
    filters: {
        sources: string[];
        categories: string[];
        dateRange: string | null;
    };
}

const ActiveFilters = ({ filters }: ActiveFiltersProps) => {
    const handleRemoveFilter = (type: string, value: string) => {
        // TODO: Implement remove filter logic
        console.log("Remove filter:", type, value);
    };

    return (
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
                        onClick={() => handleRemoveFilter("source", source)}
                        className="p-0.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800"
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
                        onClick={() => handleRemoveFilter("category", category)}
                        className="p-0.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800"
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
                        onClick={() =>
                            handleRemoveFilter("date", filters.dateRange!)
                        }
                        className="p-0.5 rounded-full hover:bg-green-100 dark:hover:bg-green-800"
                    >
                        <XMarkIcon className="w-3 h-3" />
                    </button>
                </span>
            )}
        </div>
    );
};

export default ActiveFilters;
