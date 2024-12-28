// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class", // This is crucial for class-based dark mode
    theme: {
        extend: {},
    },
    plugins: [],
};
