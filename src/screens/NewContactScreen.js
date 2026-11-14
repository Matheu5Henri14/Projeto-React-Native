import { useEffect, useState } from 'react';

import {
  View,
  Text,
  Switch,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import BackHeader from '../components/BackHeader';
import FormField from '../components/FormField';
import SupportButton from '../components/SupportButton';

import { useContacts } from '../config/ContactsContext';
import useQuickExit from '../config/useQuickExit';
import { confirmAction } from '../config/confirm';
import { formatPhone, isValidPhone } from '../config/phone';
import { colors, spacing, radius } from '../config/theme';

export default function NewContactScreen({ navigation, route }) {
  const contactId = route.params?.contactId;
  const handleExit = useQuickExit(navigation);

  const {
    contacts,
    addContact,
    updateContact,
    removeContact,
  } = useContacts();

  const existing = contacts.find(
    (contact) => String(contact.id) === String(contactId)
  );

  const isEditing = !!existing;

  const [name, setName] = useState(existing?.name ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [relation, setRelation] = useState(existing?.relation ?? '');
  const [receiveAlerts, setReceiveAlerts] = useState(
    existing?.receiveAlerts ?? true
  );

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Preenche o formulário ao editar um contato.
  useEffect(() => {
    if (existing) {
      setName(existing.name || '');

      setPhone(
        formatPhone(existing.phone || '')
      );

      setRelation(existing.relation || '');

      setReceiveAlerts(
        existing.receiveAlerts === undefined
          ? true
          : Boolean(existing.receiveAlerts)
      );
    }
  }, [existing]);

  // Valida os dados antes de enviar à API.
  const validate = () => {
    const next = {};

    if (!name.trim()) {
      next.name = 'Informe o nome do contato.';
    }

    if (!isValidPhone(phone)) {
      next.phone = 'Informe um telefone válido com DDD.';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  // Cadastra ou atualiza o contato.
  const handleSave = async () => {
    if (!validate() || saving) {
      return;
    }

    const data = {
      name: name.trim(),
      phone: phone.replace(/\D/g, ''),
      relation: relation.trim(),
      receiveAlerts,
      priority: existing?.priority ?? 1,
    };

    setSaving(true);

    try {
      if (isEditing) {
        await updateContact(contactId, data);
      } else {
        await addContact(data);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Não foi possível salvar',
        error.message
      );
    } finally {
      setSaving(false);
    }
  };

  // Exclui o contato.
  const handleDelete = () => {
    if (!existing) {
      return;
    }

    confirmAction({
      title: 'Excluir contato',

      message: `Remover ${existing.name} da sua rede de apoio?`,

      confirmText: 'Excluir',

      destructive: true,

      onConfirm: async () => {
        try {
          await removeContact(contactId);
          navigation.goBack();
        } catch (error) {
          Alert.alert(
            'Não foi possível excluir',
            error.message
          );
        }
      },
    });
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <BackHeader
          title={
            isEditing
              ? 'Editar pessoa de apoio'
              : 'Nova pessoa de apoio'
          }
          subtitle="Alguém de confiança que será avisada quando você pedir ajuda."
          onBack={() => navigation.goBack()}
          onExit={handleExit}
        />

        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FormField
            label="Nome do contato"
            placeholder="Ex.: Mariana"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoCapitalize="words"
          />

          <FormField
            label="Telefone"
            placeholder="(11) 9XXXX-XXXX"
            value={phone}
            onChangeText={(text) => setPhone(formatPhone(text))}
            error={errors.phone}
            keyboardType="phone-pad"
          />

          <FormField
            label="Relação (opcional)"
            placeholder="Irmã, amiga, vizinha..."
            value={relation}
            onChangeText={setRelation}
            autoCapitalize="words"
          />

          <View style={styles.optionRow}>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>
                Incluir nas solicitações de alerta
              </Text>

              <Text style={styles.optionSub}>
                Define se este contato está habilitado para receber alertas.
              </Text>
            </View>

            <Switch
              value={receiveAlerts}
              onValueChange={setReceiveAlerts}
              trackColor={{
                false: '#D9D2E3',
                true: colors.primary,
              }}
              thumbColor={colors.white}
              accessibilityLabel="Incluir nas solicitações de alerta"
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              O cadastro não envia mensagens automaticamente.
              O envio depende da integração com um serviço externo.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <SupportButton
            label={saving ? 'Salvando...' : 'Salvar contato'}
            onPress={handleSave}
          />

          <SupportButton
            label="Cancelar"
            variant="outline"
            onPress={() => navigation.goBack()}
          />

          {isEditing && (
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Excluir contato"
            >
              <Text style={styles.deleteText}>
                Excluir contato
              </Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  form: {
    paddingHorizontal: spacing.lg,
    paddingTop: 6,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#D9D2E3',
  },

  optionText: {
    flex: 1,
    gap: 2,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  optionSub: {
    fontSize: 12,
    color: colors.textMuted,
  },

  infoBox: {
    padding: 12,
    backgroundColor: '#EFE6F7',
    borderRadius: radius.sm,
  },

  infoText: {
    fontSize: 12,
    color: colors.primary,
  },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    paddingBottom: 14,
    gap: 10,
  },

  deleteButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },

  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.danger,
  },

  pressed: {
    opacity: 0.6,
  },
});