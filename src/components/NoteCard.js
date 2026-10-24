import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function NoteCard({ title, preview, date, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.preview} numberOfLines={1}>{preview}</Text>
      <Text style={styles.date}>{date}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EFEFF4',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  preview: {
    fontSize: 13,
    color: '#6C6C70',
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
    color: '#AEAEB2',
  },
});