import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import ContactCard from '../components/ContactCard';
import SupportButton from '../components/SupportButton';
import { useContacts } from '../config/ContactsContext';
import { colors, spacing } from '../config/theme';

export default function ContactsScreen({ navigation }) {
  const { contacts } = useContacts();

  const handleExit = () => {
    // Volta ao bloco de notas (disfarce). A rota 'Notes' precisa existir no navigator raiz.
    const root = navigation.getParent()?.getParent() ?? navigation;
    root.reset({ index: 0, routes: [{ name: 'Notes' }] });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="Rede de Apoio" onExit={handleExit} />

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.intro}>
            Pessoas de confiança que receberão seu alerta.
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nenhuma pessoa cadastrada</Text>
            <Text style={styles.emptyText}>
              Adicione ao menos uma pessoa de confiança para receber seus alertas.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ContactCard
            name={item.name}
            relation={item.relation}
            phone={item.phone}
            onEdit={() => navigation.navigate('NewContact', { contactId: item.id })}
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