import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#8B5CF6",
                    foreground: "#ffffff"
                },
                secondary: {
                    DEFAULT: "#7C3AED",
                    foreground: "#ffffff"
                }
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                gradient: 'gradient 5s linear infinite',
            },
        },
    },
    plugins: [],
};
export default config;
