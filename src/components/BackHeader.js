import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../config/theme';

export default function BackHeader({ title, subtitle, onBack, onExit }) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          onPress={onBack}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.back}>‹ Voltar</Text>
        </Pressable>

        {!!onExit && (
          <Pressable
            onPress={onExit}
            style={({ pressed }) => [styles.exitChip, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Sair e voltar ao bloco de notas"
          >
            <Text style={styles.exitText}>Sair</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: 6,
    paddingBottom: 10,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exitChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  exitText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.6,
  },
  back: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
});