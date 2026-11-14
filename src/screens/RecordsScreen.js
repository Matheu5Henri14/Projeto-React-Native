import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import RecordCard from '../components/RecordCard';
import SupportButton from '../components/SupportButton';

import { useRecords } from '../config/RecordsContext';
import { useAuth } from '../config/AuthContext';
import { colors, spacing } from '../config/theme';

export default function RecordsScreen({ navigation }) {
  const {
    records,
    loading,
    error,
    refreshRecords,
  } = useRecords();

  const { lock } = useAuth();

  // Atualiza os registros ao abrir a tela.
  useFocusEffect(
    useCallback(() => {
      refreshRecords().catch((err) => {
        Alert.alert(
          'Erro ao carregar registros',
          err.message
        );
      });
    }, [refreshRecords])
  );

  // Mais recentes primeiro.
  const sorted = [...records].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Sai da área restrita.
  const handleExit = async () => {
    const root =
      navigation.getParent()?.getParent() ?? navigation;

    try {
      await lock();
    } catch (err) {
      Alert.alert(
        'Sessão encerrada',
        err.message
      );
    }

    root.reset({
      index: 0,
      routes: [{ name: 'NotesList' }],
    });
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <ScreenHeader
        title="Registros"
        onExit={handleExit}
      />

      <FlatList
        data={sorted}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <Text style={styles.intro}>
            Diário sigiloso: registre datas e episódios.
            Serve como histórico de provas.
          </Text>
        }

        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {loading
                ? 'Carregando registros...'
                : error
                  ? 'Não foi possível carregar'
                  : 'Nenhum registro ainda'}
            </Text>

            <Text style={styles.emptyText}>
              {error ||
                'Anote o que aconteceu enquanto você lembra dos detalhes.'}
            </Text>
          </View>
        }

        renderItem={({ item }) => (
          <RecordCard
            date={item.date}
            description={item.description}
            type={item.type}
            onPress={() =>
              navigation.navigate('NewRecord', {
                recordId: item.id,
              })
            }
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