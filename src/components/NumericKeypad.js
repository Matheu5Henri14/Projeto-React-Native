import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function NumericKeypad({ onPressNumber, onBackspace }) {
  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '<'],
  ];

  return (
    <View style={styles.keypadContainer}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, keyIndex) => {
            if (key === '') {
              return <View key={keyIndex} style={styles.emptyKey} />;
            }

            const isBackspace = key === '<';

            return (
              <TouchableOpacity
                key={keyIndex}
                style={[styles.key, isBackspace && styles.backspaceKey]}
                onPress={() => (isBackspace ? onBackspace() : onPressNumber(key))}
                activeOpacity={0.7}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keypadContainer: {
    backgroundColor: '#D1D5DB',
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  key: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    height: 46,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  backspaceKey: {
    backgroundColor: '#AEB4BE',
  },
  emptyKey: {
    flex: 1,
    marginHorizontal: 4,
  },
  keyText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#111111',
  },
});