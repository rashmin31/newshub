import { ChevronDownIcon } from "../../assets/icons";

const SourceFilter = () => {
    return (
        <div className="relative">
            <button
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 dark:border-gray-700 
                          rounded-lg flex items-center gap-2 
                          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                          hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
                <span className="text-sm sm:text-base">Sources (0)</span>
                <ChevronDownIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export default SourceFilter;
