import { nextui } from "@nextui-org/react";
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["Montserrat", "Roboto", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            backgroundColor: {
                '172B4D': '#172B4D',
                'F0AE19': '#F0AE19',
            },
            textColor: {
                '172B4D': '#172B4D',
            },
            colors: {
                'mainBackground': 'rgb(var(--color-mainBackground) / <alpha-value>)',
                'mainHeaders': 'rgb(var(--color-mainHeaders) / <alpha-value>)',
                'mainSidebar': 'rgb(var(--color-mainSidebar) / <alpha-value>)',
                'mainUserIcon': 'rgb(var(--color-mainUserIcon) / <alpha-value>)',
                'mainContent': 'rgb(var(--color-mainContent) / <alpha-value>)',
                'mainNavBar': 'rgb(var(--color-mainNavBar) / <alpha-value>)',
                'mainModalColor' : 'rgb(var(--color-mainModalColor) / <alpha-value>)',

                //about kanban
                'columnBackgroundColor': 'rgb(var(--color-columnBackgroundColor) / <alpha-value>)',
                'taskBackgroundColor' : 'rgb(var(--color-taskBackgroundColor) / <alpha-value>)',
            }
        },
    },
    plugins: [nextui()],
};
