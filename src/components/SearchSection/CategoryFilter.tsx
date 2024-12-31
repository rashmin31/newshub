// src/components/SearchSection/CategoryFilter.tsx
import { MouseEvent } from "react";
import { useNewsMetadata } from "../../hooks/useNewsMetaData";
import { sourceToApiKey } from "../../utils/sourceMapping";
import Dropdown from "../common/Dropdown";
import Checkbox from "../common/Checkbox";

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

    const handleSelectAllClick = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (selectedCategories.length === availableCategories.length) {
            onCategoryChange([]);
        } else {
            onCategoryChange([...availableCategories]);
        }
    };

    const handleCategoryClick =
        (category: string) => (e: MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (selectedCategories.includes(category)) {
                onCategoryChange(
                    selectedCategories.filter((c) => c !== category)
                );
            } else {
                onCategoryChange([...selectedCategories, category]);
            }
        };

    const isAllSelected =
        availableCategories.length > 0 &&
        selectedCategories.length === availableCategories.length;

    return (
        <Dropdown
            trigger={
                <Dropdown.Trigger>
                    {isLoading ? (
                        <span>Loading categories...</span>
                    ) : (
                        <span className="text-sm sm:text-base">
                            Categories ({selectedCategories.length})
                        </span>
                    )}
                </Dropdown.Trigger>
            }
        >
            <Dropdown.Content>
                <Dropdown.Item onClick={handleSelectAllClick}>
                    <Checkbox
                        checked={isAllSelected}
                        label="Select All"
                        className="font-medium"
                        readOnly
                    />
                </Dropdown.Item>

                <div className="border-t border-gray-200 dark:border-gray-700" />

                <div className="max-h-60 overflow-auto">
                    {availableCategories.map((category) => (
                        <Dropdown.Item
                            key={category}
                            onClick={handleCategoryClick(category)}
                        >
                            <Checkbox
                                checked={selectedCategories.includes(category)}
                                label={category}
                                readOnly
                            />
                        </Dropdown.Item>
                    ))}
                </div>

                {availableCategories.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        No categories available
                    </div>
                )}
            </Dropdown.Content>
        </Dropdown>
    );
};

export default CategoryFilter;
