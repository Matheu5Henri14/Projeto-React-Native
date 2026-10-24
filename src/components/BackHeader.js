import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing } from '../config/theme';

export default function BackHeader({ title, subtitle, onBack }) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
      >
        <Text style={styles.back}>‹ Voltar</Text>
      </Pressable>

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