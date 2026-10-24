import { View, Text, ScrollView, Linking, Vibration, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import AlertButton from '../components/AlertButton';
import EmergencyCallCard from '../components/EmergencyCallCard';
import { emergencyNumbers } from '../config/emergencyNumbers';
import { colors, spacing } from '../config/theme';
import { useState } from 'react';

export default function SecretHub({ navigation }) {
  const [alertSent, setAlertSent] = useState(false);

  const handleExit = () => {
    // Volta ao bloco de notas (disfarce) e limpa o histórico de navegação.
    // A rota 'Notes' precisa existir no navigator raiz.
    const root = navigation.getParent() ?? navigation;
    root.reset({ index: 0, routes: [{ name: 'NotesList' }] });
  };

  const handleSilentAlert = async () => {
    Vibration.vibrate(50); // confirmação discreta, sem som

    // TODO: buscar os contatos de CONTATO_APOIO, obter a localização
    // (ex.: expo-location) e enviar a mensagem de alerta.
    setAlertSent(true);
  };

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="Início" onExit={handleExit} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Você está em um espaço seguro. Só você tem acesso a esta área.
        </Text>

        <View style={styles.alertArea}>
          <AlertButton onActivate={handleSilentAlert} />
          <Text style={styles.caption}>
            {alertSent
              ? 'Alerta enviado para sua rede de apoio.'
              : 'Toque e segure por 3 segundos para avisar sua rede de apoio com sua localização.'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Ligações rápidas</Text>

        <View style={styles.list}>
          {emergencyNumbers.map((item) => (
            <EmergencyCallCard
              key={item.id}
              name={item.name}
              description={item.description}
              number={item.number}
              onPress={() => handleCall(item.number)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: 6,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  intro: {
    fontSize: 14,
    color: colors.textMuted,
  },
  alertArea: {
    alignItems: 'center',
    paddingVertical: 6,
    gap: 12,
  },
  caption: {
    fontSize: 13,
    textAlign: 'center',
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  list: {
    gap: 10,
  },
});