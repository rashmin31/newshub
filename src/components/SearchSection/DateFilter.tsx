// src/components/SearchSection/DateFilter.tsx
import { useState, useRef, useEffect } from "react";
import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "../../assets/icons";

interface DateFilterProps {
    fromDate: string;
    toDate: string;
    onDateChange: (fromDate: string, toDate: string) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DateFilter = ({ fromDate, toDate, onDateChange }: DateFilterProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [tempFromDate, setTempFromDate] = useState(fromDate);
    const [tempToDate, setTempToDate] = useState(toDate);

    // Initialize dates when opening the date picker
    const initializeDates = () => {
        if (!tempFromDate && !tempToDate) {
            const today = new Date();
            today.setHours(12, 0, 0, 0); // Set to noon
            const lastWeek = new Date(today);
            lastWeek.setDate(today.getDate() - 7);

            setTempFromDate(formatDate(lastWeek));
            setTempToDate(formatDate(today));
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                // Reset temp dates to actual selected dates
                setTempFromDate(fromDate);
                setTempToDate(toDate);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [fromDate, toDate]);

    const formatDate = (date: Date): string => {
        // Fix timezone issue by using the local date values
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getDaysInMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const generateDays = () => {
        const days = [];
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);

        // Add empty days for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push({ date: null, isCurrentMonth: false });
        }

        // Add days for current month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                i
            );
            days.push({
                date,
                isCurrentMonth: true,
                isInRange: isDateInRange(date),
                isSelected: isDateSelected(date),
            });
        }

        return days;
    };

    const isDateInRange = (date: Date): boolean => {
        if (!tempFromDate || !tempToDate) return false;
        const currentDate = formatDate(date);
        return currentDate >= tempFromDate && currentDate <= tempToDate;
    };

    const isDateSelected = (date: Date): boolean => {
        const currentDate = formatDate(date);
        return currentDate === tempFromDate || currentDate === tempToDate;
    };

    const handleDateSelect = (date: Date | null) => {
        if (!date) return;

        // Set time to noon to avoid timezone issues
        const selectedDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            12,
            0,
            0
        );
        const formattedDate = formatDate(selectedDate);

        if (!tempFromDate || (tempFromDate && tempToDate)) {
            // Start new range
            setTempFromDate(formattedDate);
            setTempToDate("");
        } else {
            // Complete range
            if (formattedDate < tempFromDate) {
                setTempToDate(tempFromDate);
                setTempFromDate(formattedDate);
            } else {
                setTempToDate(formattedDate);
            }
        }
    };

    const handleQuickSelect = (days: number) => {
        const today = new Date();
        today.setHours(12, 0, 0, 0); // Set to noon
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - days);

        setTempFromDate(formatDate(startDate));
        setTempToDate(formatDate(today));
    };

    const handleApply = () => {
        if (tempFromDate && tempToDate) {
            onDateChange(tempFromDate, tempToDate);
            setIsOpen(false);
        }
    };

    const handleClear = () => {
        setTempFromDate("");
        setTempToDate("");
        onDateChange("", "");
        setIsOpen(false);
    };

    const handleToggle = () => {
        const shouldOpen = !isOpen;
        setIsOpen(shouldOpen);
        if (shouldOpen) {
            initializeDates();
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 
                         rounded-lg flex items-center gap-2 bg-white dark:bg-gray-800 
                         text-gray-900 dark:text-white hover:bg-gray-50 
                         dark:hover:bg-gray-700 transition-colors"
            >
                <CalendarIcon className="w-4 h-4" />
                <span>
                    {fromDate && toDate
                        ? `${new Date(
                              fromDate
                          ).toLocaleDateString()} - ${new Date(
                              toDate
                          ).toLocaleDateString()}`
                        : "Select dates"}
                </span>
            </button>

            {isOpen && (
                <div
                    className="absolute z-50 mt-2 p-4 bg-white dark:bg-gray-800 
                             rounded-lg shadow-lg border border-gray-200 
                             dark:border-gray-700 w-[300px]"
                >
                    {/* Quick selects */}
                    <div className="mb-4 space-y-1">
                        <button
                            onClick={() => handleQuickSelect(7)}
                            className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 
                                     dark:hover:bg-gray-700 rounded"
                        >
                            Last 7 days
                        </button>
                        <button
                            onClick={() => handleQuickSelect(30)}
                            className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 
                                     dark:hover:bg-gray-700 rounded"
                        >
                            Last 30 days
                        </button>
                    </div>

                    {/* Calendar header */}
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() =>
                                setCurrentMonth(
                                    new Date(
                                        currentMonth.setMonth(
                                            currentMonth.getMonth() - 1
                                        )
                                    )
                                )
                            }
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <span className="font-medium">
                            {currentMonth.toLocaleString("default", {
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentMonth(
                                    new Date(
                                        currentMonth.setMonth(
                                            currentMonth.getMonth() + 1
                                        )
                                    )
                                )
                            }
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {DAYS.map((day) => (
                            <div
                                key={day}
                                className="text-center text-sm text-gray-500 dark:text-gray-400"
                            >
                                {day}
                            </div>
                        ))}
                        {generateDays().map((day, index) => (
                            <button
                                key={index}
                                disabled={!day.date}
                                onClick={() => handleDateSelect(day.date)}
                                className={`
                                    p-2 text-sm rounded
                                    ${
                                        !day.date
                                            ? "text-gray-400 dark:text-gray-600"
                                            : day.isInRange
                                            ? "bg-blue-100 dark:bg-blue-900/50"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }
                                    ${
                                        day.isSelected
                                            ? "bg-blue-500 text-white"
                                            : ""
                                    }
                                `}
                            >
                                {day.date?.getDate()}
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <div
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 
                                  flex justify-between items-center"
                    >
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {tempFromDate && tempToDate && (
                                <span>
                                    {new Date(
                                        tempFromDate
                                    ).toLocaleDateString()}{" "}
                                    -{new Date(tempToDate).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {(tempFromDate || tempToDate) && (
                                <button
                                    onClick={handleClear}
                                    className="px-3 py-1.5 text-sm text-red-600 
                                             dark:text-red-400 hover:bg-red-50 
                                             dark:hover:bg-red-900/20 rounded"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setTempFromDate(fromDate);
                                    setTempToDate(toDate);
                                }}
                                className="px-3 py-1.5 text-sm text-gray-600 
                                         dark:text-gray-400 hover:bg-gray-100 
                                         dark:hover:bg-gray-700 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApply}
                                disabled={!tempFromDate || !tempToDate}
                                className="px-3 py-1.5 text-sm bg-blue-600 text-white 
                                         rounded hover:bg-blue-700 disabled:opacity-50 
                                         disabled:cursor-not-allowed"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateFilter;
