const ArticleSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div
                className="aspect-video rounded-t-lg bg-gray-200 dark:bg-gray-700 
                      animate-pulse"
            />
            <div className="p-4 space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                </div>
                <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default ArticleSkeleton;
