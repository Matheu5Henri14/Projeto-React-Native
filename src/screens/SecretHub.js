import {
  View,
  Text,
  ScrollView,
  Linking,
  Vibration,
  StyleSheet,
  Alert,
} from 'react-native';

import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import AlertButton from '../components/AlertButton';
import EmergencyCallCard from '../components/EmergencyCallCard';
import RiskIndicatorCard from '../components/RiskIndicatorCard';

import { emergencyNumbers } from '../config/emergencyNumbers';
import { colors, spacing } from '../config/theme';
import { useAuth } from '../config/AuthContext';
import { apiRequest } from '../services/api';

export default function SecretHub({ navigation }) {
  const [alertSent, setAlertSent] = useState(false);
  const [sendingAlert, setSendingAlert] = useState(false);

  const { token, unlocked, lock } = useAuth();

  const [indicator, setIndicator] = useState(null);
  const [indicatorLoading, setIndicatorLoading] = useState(false);
  const [indicatorError, setIndicatorError] = useState(null);

  const loadIndicator = useCallback(async () => {
    if (!token || !unlocked) {
      return;
    }

    setIndicatorLoading(true);
    setIndicatorError(null);

    try {
      const result = await apiRequest('/indicador-risco', { token });
      setIndicator(result);
    } catch (error) {
      setIndicatorError(error.message);
    } finally {
      setIndicatorLoading(false);
    }
  }, [token, unlocked]);

  useFocusEffect(
    useCallback(() => {
      loadIndicator();
    }, [loadIndicator])
  );

  // Sai da área restrita e volta ao bloco de notas.
  const handleExit = async () => {
    const root = navigation.getParent() ?? navigation;

    try {
      await lock();
    } catch (error) {
      Alert.alert(
        'Sessão encerrada',
        error.message
      );
    }

    root.reset({
      index: 0,
      routes: [{ name: 'NotesList' }],
    });
  };

  // Registra uma solicitação de alerta no backend.
  const handleSilentAlert = async () => {
    if (sendingAlert) {
      return;
    }

    setSendingAlert(true);

    try {
      await apiRequest('/alertas', {
        method: 'POST',
        body: {},
        token,
      });

      Vibration.vibrate(50);

      setAlertSent(true);
    } catch (error) {
      Alert.alert(
        'Não foi possível registrar o alerta',
        error.message
      );
    } finally {
      setSendingAlert(false);
    }
  };

  // Abre o discador do telefone.
  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <ScreenHeader
        title="Início"
        onExit={handleExit}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Você está em um espaço seguro. Só você tem acesso a esta área.
        </Text>

        <View style={styles.alertArea}>
          <AlertButton
            onActivate={handleSilentAlert}
          />

          <Text style={styles.caption}>
            {sendingAlert
              ? 'Registrando solicitação...'
              : alertSent
                ? 'Solicitação registrada. O envio de mensagens aos contatos ainda depende de uma integração externa.'
                : 'Toque e segure por 3 segundos para registrar uma solicitação de alerta.'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Ligações rápidas
        </Text>

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

        <Text style={styles.sectionTitle}>
          Indicador do modelo de dados
        </Text>

        <RiskIndicatorCard
          data={indicator}
          loading={indicatorLoading}
          error={indicatorError}
          onRetry={loadIndicator}
        />
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