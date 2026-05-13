import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check system preference or localStorage
        const savedTheme = localStorage.getItem('astra-theme');
        if (savedTheme === 'dark') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            // Optional: Check system preference
            // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            //     setIsDark(true);
            //     document.documentElement.classList.add('dark');
            // }
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(prev => {
            const newTheme = !prev;
            if (newTheme) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('astra-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('astra-theme', 'light');
            }
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

