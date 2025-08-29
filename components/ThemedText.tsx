// components/ThemedText.tsx
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type ThemedTextProps = TextProps & {
  type?: 'default' | 'title';
};

export function ThemedText({ type = 'default', style, ...props }: ThemedTextProps) {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#fff' : '#333';

  const fontSize = type === 'title' ? 24 : 16;
  const fontWeight = type === 'title' ? 'bold' : 'normal';

  return (
    <Text
      {...props}
      style={[
        { color: textColor, fontSize, fontWeight },
        style,
      ]}
    />
  );
}
