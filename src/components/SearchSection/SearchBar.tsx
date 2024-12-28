import { SearchIcon } from "../../assets/icons";
import { useState, useEffect } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, onSearch]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>

            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search articles..."
                className="w-full p-3 pl-10 sm:p-4 sm:pl-11 rounded-lg 
                    bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-700
                    text-gray-900 dark:text-gray-100 
                    placeholder-gray-500 dark:placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent
                    transition-colors duration-200"
            />
        </div>
    );
};

export default SearchBar;
