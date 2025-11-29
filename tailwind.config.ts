import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    1: "#0A0A0E",
                    2: "#8A0014",
                },
                accent: "#D6C7A1",
                secondary: {
                    1: "#1B1B22",
                    2: "#3A3A48",
                    3: "#EFE7D8",
                },
            },
            fontFamily: {
                cairo: ["var(--font-cairo)"],
                changa: ["var(--font-changa)"],
                bebas: ["var(--font-bebas)"],
                inter: ["var(--font-inter)"],
                montserrat: ["var(--font-montserrat)"],
            },
        },
    },
    plugins: [],
};
export default config;
