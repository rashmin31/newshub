// src/hooks/useFilter.ts
import { useState, useRef, useEffect } from "react";

interface UseFilterProps {
    selectedItems: string[];
    onItemChange: (items: string[]) => void;
    availableItems: string[];
    filterName: string;
}

export function useFilter({
    selectedItems,
    onItemChange,
    availableItems,
    filterName,
}: UseFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleItem = (item: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedItems.includes(item)) {
            onItemChange(selectedItems.filter((i) => i !== item));
        } else {
            onItemChange([...selectedItems, item]);
        }
    };

    const handleSelectAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedItems.length === availableItems.length) {
            onItemChange([]);
        } else {
            onItemChange([...availableItems]);
        }
    };

    const isAllSelected =
        availableItems.length > 0 &&
        selectedItems.length === availableItems.length;

    return {
        isOpen,
        setIsOpen,
        dropdownRef,
        toggleItem,
        handleSelectAll,
        isAllSelected,
    };
}
