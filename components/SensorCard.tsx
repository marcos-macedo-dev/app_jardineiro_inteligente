import React from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface SensorCardProps {
  iconName: keyof typeof FontAwesome.glyphMap;
  value: number;
  unit: string;
  label: string;
  iconColor: string;
}

export default function SensorCard({ iconName, value, unit, label, iconColor }: SensorCardProps) {
  return (
    <ThemedView style={styles.card}>
      <FontAwesome name={iconName} size={40} color={iconColor} style={styles.icon} />
      <ThemedText style={styles.value}>{value}{unit}</ThemedText>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    margin: 10,
    width: '45%', // Ajuste para caber dois cards por linha
    aspectRatio: 1, // Para que o card seja quadrado
  },
  icon: {
    marginBottom: 10,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: '#777',
  },
});
