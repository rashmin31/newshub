import { useState } from "react";
import { guardianApi, nyTimesApi, newsApi } from "../../services/api";

const ApiTest = () => {
    const [testResults, setTestResults] = useState({
        guardian: "",
        nytimes: "",
        newsapi: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testAPIs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Test Guardian API
            await guardianApi.fetchArticles({
                pageSize: 1,
            });
            setTestResults((prev) => ({
                ...prev,
                guardian: "Success ✅",
            }));

            // Test NY Times API
            await nyTimesApi.fetchArticles({
                pageSize: 1,
            });
            setTestResults((prev) => ({
                ...prev,
                nytimes: "Success ✅",
            }));

            // Test NewsAPI
            await newsApi.fetchArticles({
                pageSize: 1,
            });
            setTestResults((prev) => ({
                ...prev,
                newsapi: "Success ✅",
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">API Connection Test</h2>

            <button
                onClick={testAPIs}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded 
                         hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
                {isLoading ? "Testing..." : "Test All APIs"}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="mt-4 space-y-2">
                <div>Guardian API: {testResults.guardian}</div>
                <div>NY Times API: {testResults.nytimes}</div>
                <div>NewsAPI: {testResults.newsapi}</div>
            </div>
        </div>
    );
};

export default ApiTest;
