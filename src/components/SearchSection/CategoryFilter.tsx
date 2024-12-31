// src/components/SearchSection/CategoryFilter.tsx
import { ChevronDownIcon } from "../../assets/icons";
import { useNewsMetadata } from "../../hooks/useNewsMetaData";
import { useFilter } from "../../hooks/useFilter";
import { sourceToApiKey } from "../../utils/sourceMapping";

interface CategoryFilterProps {
    selectedCategories: string[];
    onCategoryChange: (categories: string[]) => void;
    selectedSources: string[];
}

const CategoryFilter = ({
    selectedCategories,
    onCategoryChange,
    selectedSources,
}: CategoryFilterProps) => {
    const { metadata, isLoading } = useNewsMetadata();

    // Get categories based on selected sources or all unique categories
    const availableCategories = metadata
        ? selectedSources.length > 0
            ? Array.from(
                  new Set(
                      selectedSources
                          .map(
                              (source) =>
                                  metadata.categories[sourceToApiKey(source)]
                          )
                          .flat()
                  )
              ).sort()
            : Array.from(
                  new Set(Object.values(metadata.categories).flat())
              ).sort()
        : [];

    const {
        isOpen,
        setIsOpen,
        dropdownRef,
        toggleItem,
        handleSelectAll,
        isAllSelected,
    } = useFilter({
        selectedItems: selectedCategories,
        onItemChange: onCategoryChange,
        availableItems: availableCategories,
        filterName: "Categories",
    });

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                disabled={isLoading}
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 
                          dark:border-gray-700 rounded-lg flex items-center gap-2 
                          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                          hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                          disabled:opacity-50 disabled:cursor-not-allowed"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {isLoading ? (
                    <span>Loading categories...</span>
                ) : (
                    <>
                        <span className="text-sm sm:text-base">
                            Categories ({selectedCategories.length})
                        </span>
                        <ChevronDownIcon
                            className={`w-4 h-4 transition-transform duration-200 
                                ${isOpen ? "transform rotate-180" : ""}`}
                        />
                    </>
                )}
            </button>

            {isOpen && !isLoading && (
                <div
                    className="absolute z-10 mt-2 w-56 rounded-md shadow-lg 
                               bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
                >
                    <div className="py-1">
                        {/* Select All Option */}
                        <div
                            className="px-4 py-2 flex items-center hover:bg-gray-100 
                                     dark:hover:bg-gray-700 cursor-pointer border-b 
                                     border-gray-200 dark:border-gray-700"
                            onClick={handleSelectAll}
                        >
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={() => {}} // Handle change through div click
                                className="h-4 w-4 text-blue-600 rounded 
                                         border-gray-300 focus:ring-blue-500
                                         dark:border-gray-600 dark:bg-gray-700"
                            />
                            <span className="ml-3 text-gray-900 dark:text-gray-200 font-medium">
                                Select All
                            </span>
                        </div>

                        <div className="max-h-60 overflow-auto">
                            {availableCategories.map((category) => (
                                <div
                                    key={category}
                                    className="px-4 py-2 flex items-center hover:bg-gray-100 
                                             dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={(e) => toggleItem(category, e)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(
                                            category
                                        )}
                                        onChange={() => {}} // Handle change through div click
                                        className="h-4 w-4 text-blue-600 rounded 
                                                 border-gray-300 focus:ring-blue-500
                                                 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                    <span className="ml-3 text-gray-900 dark:text-gray-200">
                                        {category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {availableCategories.length === 0 && (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No categories available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryFilter;
