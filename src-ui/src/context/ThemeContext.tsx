import { createContext, useContext, useState, ReactNode } from 'react';

// Simplified theme interface
interface Theme {
    name: string;
    colors: Record<string, string>;
}

interface ThemeContextType {
    theme: Theme;
    setTheme: (t: Theme) => void;
}

const defaultTheme: Theme = {
    name: "Prism Dark",
    colors: {
        background: '#1e1e2e',
        foreground: '#cdd6f4',
        cursor: '#f5e0dc',
    }
};

const ThemeContext = createContext<ThemeContextType>({
    theme: defaultTheme,
    setTheme: () => {}
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
