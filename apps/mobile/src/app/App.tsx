import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VidyaFloww</Text>
      <Text style={styles.subtitle}>Enterprise School Management Platform</Text>
      <Text style={styles.note}>📱 Mobile scaffold ready for development.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0aec0',
    marginBottom: 16,
    textAlign: 'center',
  },
  note: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
});
