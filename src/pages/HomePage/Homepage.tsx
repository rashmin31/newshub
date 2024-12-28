const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header Section - Mobile First */}
            <div className="bg-white shadow">
                <div className="px-4 py-4 md:py-6 max-w-7xl mx-auto">
                    <h1 className="text-xl md:text-3xl font-bold">NewsHub</h1>
                </div>
            </div>

            <main className="px-4 py-4 md:py-6 max-w-7xl mx-auto">
                {/* Search and Filter Section */}
                <div className="space-y-3 mb-4 md:mb-6">
                    {/* Search Bar placeholder */}
                    <div className="h-10 md:h-12 bg-white shadow rounded-lg flex items-center px-4">
                        Search
                    </div>

                    {/* Filter Bar placeholder - Horizontal scrolling on mobile */}
                    <div className="flex overflow-x-auto gap-2 pb-2">
                        <div className="flex-none px-4 h-8 md:h-10 bg-white shadow rounded-lg flex items-center">
                            Sources
                        </div>
                        <div className="flex-none px-4 h-8 md:h-10 bg-white shadow rounded-lg flex items-center">
                            Categories
                        </div>
                        <div className="flex-none px-4 h-8 md:h-10 bg-white shadow rounded-lg flex items-center">
                            Date
                        </div>
                    </div>
                </div>

                {/* Articles Section - Single column on mobile, grid on larger screens */}
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div
                            key={item}
                            className="bg-white shadow rounded-lg p-4 h-48 md:h-64"
                        >
                            {/* Article Card Structure */}
                            <div className="flex flex-col h-full">
                                <div className="h-24 md:h-32 bg-gray-200 rounded-md mb-2">
                                    Image placeholder
                                </div>
                                <h2 className="font-semibold">
                                    Article Title {item}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Short description...
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default HomePage;
