/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#1313ec",
                "primary-hover": "#2e2ef5",
                "background-light": "#f6f6f8",
                "background-dark": "#101022",
                "card-dark": "#1c1c2e",
                "surface-dark": "#191933",     // Used in User table
                "surface-darker": "#14142b",   // Used in footer/deeper backgrounds
                "surface-light": "#232348",    // Used in sidebar hover/highlights
                "border-dark": "#323267",      // Common border color
                "input-bg": "#191933",
                "text-muted": "#9292c9",       // common secondary text
                "secondary-text": "#9292c9",   // Alias for compatibility
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "full": "9999px"
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-in-out',
                'zoom-in': 'zoomIn 0.2s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                zoomIn: {
                    '0%': { transform: 'scale(0.95)' },
                    '100%': { transform: 'scale(1)' },
                },
            }
        },
    },
    plugins: [],
}
