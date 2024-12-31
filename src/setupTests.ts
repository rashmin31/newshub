import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { config } from "dotenv";

// Load environment variables from `.env.test`
config({ path: ".env.test" });

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock scrollTo
Object.defineProperty(window, "scrollTo", {
    writable: true,
    value: jest.fn(),
});

// Mock react-router-dom navigation
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate, // Return the mocked navigate function
}));

// Mock localStorage and sessionStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        },
        removeItem: (key: string) => {
            delete store[key];
        },
    };
})();

// Mock Vite env variables
global.process.env = {
    ...global.process.env,
    VITE_GUARDIAN_API_KEY: "mock-guardian-key",
    VITE_NYTIMES_API_KEY: "mock-nytimes-key",
    VITE_NEWSAPI_API_KEY: "mock-newsapi-key",
};

Object.defineProperty(window, "localStorage", { value: localStorageMock });
Object.defineProperty(window, "sessionStorage", { value: localStorageMock });

// Mock IntersectionObserver
Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
    })),
});
