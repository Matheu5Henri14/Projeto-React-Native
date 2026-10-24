import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../config/theme';

export default function ContactCard({ name, relation, phone, onEdit }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() ?? '?';
  const displayName = relation ? `${name} (${relation})` : name;

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={styles.phone}>{phone}</Text>
      </View>

      <Pressable
        onPress={onEdit}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`Editar contato ${name}`}
      >
        <Text style={styles.edit}>Editar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6D9F2',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  phone: {
    fontSize: 13,
    color: colors.textMuted,
  },
  edit: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    paddingLeft: spacing.sm,
  },
});