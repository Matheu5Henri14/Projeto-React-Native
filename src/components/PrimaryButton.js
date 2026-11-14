import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}) {
  const blocked = loading || disabled;

  return (
    <TouchableOpacity
      style={[styles.button, blocked && styles.buttonDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={blocked}
    >
      {loading ? (
        <ActivityIndicator color="#1C1C1E" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F5B800',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#1C1C1E',
    fontSize: 15,
    fontWeight: '700',
  },
});
