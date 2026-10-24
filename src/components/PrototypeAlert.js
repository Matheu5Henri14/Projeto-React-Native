import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PrototypeAlert({ title, description }) {
  return (
    <View style={styles.alertBox}>
      <Text style={styles.alertTitle}>{title}</Text>
      <Text style={styles.alertDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alertBox: {
    backgroundColor: '#FDF4D7',
    borderWidth: 1,
    borderColor: '#F2D283',
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    marginBottom: 24,
  },
  alertTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#946200',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  alertDescription: {
    fontSize: 12,
    color: '#855800',
    lineHeight: 17,
  },
});