import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../config/theme';

const SIZE = 170;

export default function AlertButton({ onActivate, holdDuration = 3000 }) {
  return (
    <Pressable
      onLongPress={onActivate}
      delayLongPress={holdDuration}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Alerta silencioso"
      accessibilityHint="Toque e segure por 3 segundos para avisar sua rede de apoio"
    >
      <Text style={styles.label}>{'ALERTA\nSILENCIOSO'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  label: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
  },
});