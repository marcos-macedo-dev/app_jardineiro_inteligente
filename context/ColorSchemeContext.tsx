import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance } from 'react-native';

type ColorScheme = 'light' | 'dark';

interface ColorSchemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

export const ColorSchemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(Appearance.getColorScheme() || 'light');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        setColorScheme(colorScheme);
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useAppColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error('useAppColorScheme must be used within a ColorSchemeProvider');
  }
  return context;
};
