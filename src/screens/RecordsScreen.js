import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import RecordCard from '../components/RecordCard';
import SupportButton from '../components/SupportButton';
import { useRecords } from '../config/RecordsContext';
import { colors, spacing } from '../config/theme';

export default function RecordsScreen({ navigation }) {
  const { records } = useRecords();

  // Mais recentes primeiro
  const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleExit = () => {
    // Volta ao bloco de notas (disfarce). A rota 'Notes' precisa existir no navigator raiz.
    const root = navigation.getParent()?.getParent() ?? navigation;
    root.reset({ index: 0, routes: [{ name: 'Notes' }] });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="Registros" onExit={handleExit} />

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.intro}>
            Diário sigiloso: registre datas e episódios. Serve como histórico de provas.
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nenhum registro ainda</Text>
            <Text style={styles.emptyText}>
              Anote o que aconteceu enquanto você lembra dos detalhes.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RecordCard
            date={item.date}
            description={item.description}
            type={item.type}
            onPress={() => navigation.navigate('NewRecord', { recordId: item.id })}
          />
        )}
      />

      <View style={styles.footer}>
        <SupportButton
          label="+ Novo registro"
          onPress={() => navigation.navigate('NewRecord')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: 6,
    paddingBottom: spacing.md,
    gap: 12,
  },
  intro: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 2,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.textMuted,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 14,
    paddingTop: 8,
  },
});