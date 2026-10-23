import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../config/theme';

export default function SecretHub({ title, onExit }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>

      {onExit && (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 6,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
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
});