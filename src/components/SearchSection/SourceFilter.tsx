// src/components/SearchSection/SourceFilter.tsx
import { MouseEvent } from "react";
import { useNewsMetadata } from "../../hooks/useNewsMetaData";
import { useFilter } from "../../hooks/useFilter";
import Dropdown from "../common/Dropdown";
import Checkbox from "../common/Checkbox";

interface SourceFilterProps {
    selectedSources: string[];
    onSourceChange: (sources: string[]) => void;
}

const SourceFilter = ({
    selectedSources,
    onSourceChange,
}: SourceFilterProps) => {
    const { metadata, isLoading } = useNewsMetadata();
    const availableSources = metadata?.sources.sort() || [];

    const { isOpen, setIsOpen, toggleItem, handleSelectAll, isAllSelected } =
        useFilter({
            selectedItems: selectedSources,
            onItemChange: onSourceChange,
            availableItems: availableSources,
            filterName: "Sources",
        });

    const handleItemClick =
        (source: string) => (e: MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            toggleItem(source, e);
        };

    const handleSelectAllClick = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleSelectAll(e);
    };

    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            trigger={
                <Dropdown.Trigger>
                    {isLoading
                        ? "Loading sources..."
                        : `Sources (${selectedSources.length})`}
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
                    {availableSources.map((source) => (
                        <Dropdown.Item
                            key={source}
                            onClick={handleItemClick(source)}
                        >
                            <Checkbox
                                checked={selectedSources.includes(source)}
                                label={source}
                                readOnly
                            />
                        </Dropdown.Item>
                    ))}
                </div>
            </Dropdown.Content>
        </Dropdown>
    );
};

export default SourceFilter;
