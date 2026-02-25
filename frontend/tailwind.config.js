/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f5f7fa',
                    100: '#e4e7eb',
                    200: '#cbd2d9',
                    300: '#9aa5b1',
                    400: '#7b8794',
                    500: '#616e7c',
                    600: '#52606d',
                    700: '#3e4c59',
                    800: '#323f4b',
                    900: '#1f2933',
                    950: '#101820',
                },
                accent: {
                    indigo: '#6366f1',
                    soft: '#818cf8',
                    emerald: '#10b981',
                    slate: '#64748b',
                    zinc: '#71717a',
                },
                surface: {
                    subtle: '#f9fafb', // Zinc 50
                    border: 'rgba(0, 0, 0, 0.05)',
                    card: '#ffffff',
                    hover: 'rgba(0, 0, 0, 0.02)',
                }
            },
            boxShadow: {
                'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'premium-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            },
            borderRadius: {
                'saas': '12px',
            }
        },
    },
    plugins: [],
}
