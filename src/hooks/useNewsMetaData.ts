// src/hooks/useNewsMetadata.ts
import { useState, useEffect } from "react";
import { ApiMetadata } from "../types/news";
import { aggregatorService } from "../services/api/aggregatorService";

export const useNewsMetadata = () => {
    const [metadata, setMetadata] = useState<ApiMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const data = await aggregatorService.getMetadata();
                console.log("Fetched metadata:", data); // Debug log
                setMetadata(data);
            } catch (err) {
                console.error("Error fetching metadata:", err);
                setError("Failed to fetch news categories");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetadata();
    }, []);

    return { metadata, isLoading, error };
};
