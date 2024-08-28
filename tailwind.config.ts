import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
      extend: {
        colors: {
        'navy-blue': '#003366',
        'gold': '#FFD700',
        'light-gray': '#f5f5f5',

        "silver": "#C0C0C0",
        'coral': '#FF7F50',
        "strong-red": "#FF0000",
        "rose": "#FF007F",
        "fuchsia": "#FF00FF",
        "turquoise": "#40E0D0",
        "chartreuse": "#7FFF00",
        "mint-green": "#98FF98",
        "pastel-blue": "#A2C2E4",
        "pastel-mint": "#A8E6CF",

          // header: "#A2C2E4",
          // primary: "#A2C2E4",
          // secondary: '#F5F5DC',
          
          // textPrimary: "#334155",
          // textSecondary: "#be185d",

          // // primary: "#334155",
          // accent: '#A8E6CF',

          // pastelGreen: '#B2D8B2',
          // pastelLavender: '#D3B4E2',
          // pastelYellow: '#F9E6A1',
          // pastelMint: '#A8E6CF',
          // pastelCoral: '#F6B6B6',
          // pastelGrey: '#D3D3D3',
          // pastelBeige: '#F5F5DC',
        },
        backgroundImage: {
          'custom-gradient': 'linear-gradient(to bottom, #A2C2E4, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff)',
        }
      },
  },
  plugins: [],
};
export default config;
