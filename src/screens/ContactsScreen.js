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
import ContactCard from '../components/ContactCard';
import SupportButton from '../components/SupportButton';

import { useContacts } from '../config/ContactsContext';
import { useAuth } from '../config/AuthContext';
import { colors, spacing } from '../config/theme';

export default function ContactsScreen({ navigation }) {
  const {
    contacts,
    loading,
    error,
    refreshContacts,
  } = useContacts();

  const { lock } = useAuth();

  // Busca os contatos sempre que a tela é aberta.
  useFocusEffect(
    useCallback(() => {
      refreshContacts().catch((err) => {
        Alert.alert(
          'Erro ao carregar contatos',
          err.message
        );
      });
    }, [refreshContacts])
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
        title="Rede de Apoio"
        onExit={handleExit}
      />

      <FlatList
        data={contacts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <Text style={styles.intro}>
            Pessoas de confiança cadastradas na sua rede de apoio.
          </Text>
        }

        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {loading
                ? 'Carregando contatos...'
                : error
                  ? 'Não foi possível carregar'
                  : 'Nenhuma pessoa cadastrada'}
            </Text>

            <Text style={styles.emptyText}>
              {error ||
                'Adicione ao menos uma pessoa de confiança para compor sua rede de apoio.'}
            </Text>
          </View>
        }

        renderItem={({ item }) => (
          <ContactCard
            name={item.name}
            relation={item.relation}
            phone={item.phone}
            onEdit={() =>
              navigation.navigate('NewContact', {
                contactId: item.id,
              })
            }
          />
        )}
      />

      <View style={styles.footer}>
        <SupportButton
          label="+ Adicionar contato"
          onPress={() => navigation.navigate('NewContact')}
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