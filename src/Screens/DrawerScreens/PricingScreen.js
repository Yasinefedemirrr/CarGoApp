import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PricingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fiyatlandırma</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E676',
  },
});