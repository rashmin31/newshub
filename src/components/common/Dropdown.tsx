// src/components/common/Dropdown.tsx
import { useState, useRef, useEffect, ReactNode, MouseEvent } from "react";
import { ChevronDownIcon } from "../../assets/icons";

interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    className?: string;
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
}

interface DropdownItemProps {
    children: ReactNode;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
    className?: string;
}

// Named function component for the main Dropdown
const Dropdown = ({
    trigger,
    children,
    className = "",
    isOpen: controlledIsOpen,
    onOpenChange,
}: DropdownProps) => {
    const [isOpenState, setIsOpenState] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Support both controlled and uncontrolled modes
    const isOpen =
        controlledIsOpen !== undefined ? controlledIsOpen : isOpenState;
    const setIsOpen = (value: boolean) => {
        if (onOpenChange) {
            onOpenChange(value);
        }
        setIsOpenState(value);
    };

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

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

            {isOpen && (
                <div
                    className="absolute z-10 mt-2 rounded-md shadow-lg 
                               bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 
                               min-w-[200px]"
                >
                    {children}
                </div>
            )}
        </div>
    );
};

// Named function component for DropdownTrigger
const DropdownTrigger = ({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) => (
    <button
        className={`
            flex items-center justify-between w-full px-4 py-2 text-sm 
            bg-white dark:bg-gray-800 border border-gray-200 
            dark:border-gray-700 rounded-lg text-gray-900 dark:text-white
            hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
            ${className}
        `}
        type="button"
    >
        {children}
        <ChevronDownIcon className="w-4 h-4 ml-2" />
    </button>
);

// Named function component for DropdownContent
const DropdownContent = ({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) => <div className={`py-1 ${className}`}>{children}</div>;

// Named function component for DropdownItem
const DropdownItem = ({
    children,
    onClick,
    className = "",
}: DropdownItemProps) => (
    <div
        onClick={onClick}
        className={`
            px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
            hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer
            ${className}
        `}
        role="button"
        tabIndex={0}
    >
        {children}
    </div>
);

// Export the components with proper names
const NamedDropdown = Object.assign(Dropdown, {
    Trigger: DropdownTrigger,
    Content: DropdownContent,
    Item: DropdownItem,
});

export default NamedDropdown;
