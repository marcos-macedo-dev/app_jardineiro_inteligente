// components/ThemedView.tsx
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export function ThemedView(props: ViewProps) {
  const { theme } = useTheme();
  const backgroundColor = theme === 'dark' ? '#121212' : '#f8f8f8';

  return (
    <View
      {...props}
      style={[{ backgroundColor }, props.style]}
    />
  );
}
