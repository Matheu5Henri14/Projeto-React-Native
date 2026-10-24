import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../config/theme';
import { formatCardDate } from '../config/dateTime';

export default function RecordCard({ date, description, type, onPress }) {
  const dateLabel = formatCardDate(date);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Registro de ${dateLabel}. Toque para editar.`}
    >
      <Text style={styles.date}>{dateLabel}</Text>

      <Text style={styles.description} numberOfLines={3}>
        {description}
      </Text>

      {!!type && (
        <View style={styles.tag}>
          <Text style={styles.tagText}>{type}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  pressed: {
    opacity: 0.7,
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  description: {
    fontSize: 14,
    color: colors.text,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#EFE6F7',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
});