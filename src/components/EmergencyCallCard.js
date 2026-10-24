import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../config/theme';

export default function EmergencyCallCard({ name, description, number, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Ligar para ${name}, número ${number}`}
    >
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.numberChip}>
        <Text style={styles.numberText}>{number}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  pressed: {
    opacity: 0.7,
  },
  info: {
    flex: 1,
    paddingRight: spacing.md,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  numberChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
  },
  numberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});