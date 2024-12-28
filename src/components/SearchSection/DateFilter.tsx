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
    const [selecting, setSelecting] = useState<"from" | "to">("from");

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

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
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
            });
        }

        return days;
    };

    const isDateInRange = (date: Date) => {
        if (!fromDate || !toDate) return false;
        const currentDate = date.getTime();
        const start = new Date(fromDate).getTime();
        const end = new Date(toDate).getTime();
        return currentDate >= start && currentDate <= end;
    };

    const handleDateSelect = (date: Date | null) => {
        if (!date) return;

        const selectedDate = formatDate(date);

        if (selecting === "from") {
            onDateChange(selectedDate, toDate);
            setSelecting("to");
        } else {
            if (fromDate && selectedDate < fromDate) {
                // If selected end date is before start date, swap them
                onDateChange(selectedDate, fromDate);
            } else {
                onDateChange(fromDate, selectedDate);
            }
            setSelecting("from");
        }
    };

    const handleQuickSelect = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);
        onDateChange(formatDate(start), formatDate(end));
        setIsOpen(false);
    };

    const handleMonthChange = (increment: number) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + increment);
        setCurrentMonth(newMonth);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
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
                            onClick={() => handleMonthChange(-1)}
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
                            onClick={() => handleMonthChange(1)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Calendar */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* Day headers */}
                        {DAYS.map((day) => (
                            <div
                                key={day}
                                className="text-center text-sm text-gray-500 dark:text-gray-400"
                            >
                                {day}
                            </div>
                        ))}

                        {/* Calendar days */}
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
                                        day.date &&
                                        formatDate(day.date) === fromDate
                                            ? "bg-blue-500 text-white"
                                            : ""
                                    }
                                    ${
                                        day.date &&
                                        formatDate(day.date) === toDate
                                            ? "bg-blue-500 text-white"
                                            : ""
                                    }
                                `}
                            >
                                {day.date?.getDate()}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateFilter;
