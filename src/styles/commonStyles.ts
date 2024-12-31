// src/styles/commonStyles.ts
export const commonStyles = {
    filterButton: `px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 
                  dark:border-gray-700 rounded-lg flex items-center gap-2 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed`,

    dropdownPanel: `absolute z-10 mt-2 w-56 rounded-md shadow-lg 
                   bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5`,

    dropdownItem: `px-4 py-2 flex items-center hover:bg-gray-100 
                  dark:hover:bg-gray-700 cursor-pointer`,

    checkbox: `h-4 w-4 text-blue-600 rounded 
              border-gray-300 focus:ring-blue-500
              dark:border-gray-600 dark:bg-gray-700`,

    articleCard: `bg-white dark:bg-gray-800 rounded-lg 
                 shadow-sm hover:shadow-md dark:shadow-gray-700/50 
                 transition-shadow duration-200`,
};

export const articleGridStyles = {
    container: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
    imageContainer: "aspect-video relative overflow-hidden rounded-t-lg",
    image: "w-full h-full object-cover",
    content: "p-4",
    title: "text-lg sm:text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2",
    description:
        "text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2 mb-4",
    metadata:
        "flex justify-between items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400",
};
