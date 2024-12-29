import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserPreferences {
    sources: string[];
    categories: string[];
    authors: string[];
    dateRange: {
        fromDate: string;
        toDate: string;
    } | null;
}

interface PreferencesState {
    preferences: UserPreferences;
    isLoading: boolean;
    error: string | null;
}

const initialState: PreferencesState = {
    preferences: {
        sources: [],
        categories: [],
        authors: [],
        dateRange: null,
    },
    isLoading: false,
    error: null,
};

export const preferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        setSources: (state, action: PayloadAction<string[]>) => {
            state.preferences.sources = action.payload;
        },
        setCategories: (state, action: PayloadAction<string[]>) => {
            state.preferences.categories = action.payload;
        },
        setAuthors: (state, action: PayloadAction<string[]>) => {
            state.preferences.authors = action.payload;
        },
        setDateRange: (
            state,
            action: PayloadAction<{ fromDate: string; toDate: string } | null>
        ) => {
            state.preferences.dateRange = action.payload;
        },
        resetPreferences: (state) => {
            state.preferences = initialState.preferences;
        },
        setPreferences: (state, action: PayloadAction<UserPreferences>) => {
            state.preferences = action.payload;
        },
    },
});

export const {
    setSources,
    setCategories,
    setAuthors,
    setDateRange,
    resetPreferences,
    setPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
