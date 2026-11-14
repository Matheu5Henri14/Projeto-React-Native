import { useEffect, useState } from 'react';

import {
  View,
  Text,
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
import ChipSelector from '../components/ChipSelector';
import SupportButton from '../components/SupportButton';

import { useRecords } from '../config/RecordsContext';
import useQuickExit from '../config/useQuickExit';
import { confirmAction } from '../config/confirm';
import { recordTypes } from '../config/recordTypes';

import {
  formatDateTimeInput,
  toInputString,
  parseDateTime,
} from '../config/dateTime';

import { colors, spacing } from '../config/theme';

export default function NewRecordScreen({ navigation, route }) {
  const recordId = route.params?.recordId;
  const handleExit = useQuickExit(navigation);

  const {
    records,
    addRecord,
    updateRecord,
    removeRecord,
  } = useRecords();

  const existing = records.find(
    (record) => String(record.id) === String(recordId)
  );

  const isEditing = !!existing;

  const [dateText, setDateText] = useState(
    toInputString(
      existing ? new Date(existing.date) : new Date()
    )
  );

  const [description, setDescription] = useState(
    existing?.description ?? ''
  );

  const [type, setType] = useState(
    existing?.type ?? ''
  );

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Preenche o formulário ao editar um registro.
  useEffect(() => {
    if (existing) {
      setDateText(
        toInputString(new Date(existing.date))
      );

      setDescription(existing.description || '');
      setType(existing.type || '');
    }
  }, [existing]);

  // Valida os dados do formulário.
  const validate = () => {
    const next = {};
    const parsed = parseDateTime(dateText);

    if (!parsed) {
      next.date = 'Use o formato DD/MM/AAAA HH:MM.';
    } else if (parsed > new Date()) {
      next.date = 'A data não pode ser no futuro.';
    }

    if (!description.trim()) {
      next.description = 'Descreva o que aconteceu.';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  // Cadastra ou atualiza o registro.
  const handleSave = async () => {
    if (!validate() || saving) {
      return;
    }

    const data = {
      date: parseDateTime(dateText).toISOString(),
      description: description.trim(),
      type: type || null,
    };

    setSaving(true);

    try {
      if (isEditing) {
        await updateRecord(recordId, data);
      } else {
        await addRecord(data);
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

  // Exclui um registro.
  const handleDelete = () => {
    if (!existing) {
      return;
    }

    confirmAction({
      title: 'Excluir registro',

      message:
        'Este registro será removido do seu diário. Essa ação não pode ser desfeita.',

      confirmText: 'Excluir',

      destructive: true,

      onConfirm: async () => {
        try {
          await removeRecord(recordId);
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
              ? 'Editar registro'
              : 'Novo registro'
          }
          subtitle="Anote o que aconteceu enquanto você lembra dos detalhes."
          onBack={() => navigation.goBack()}
          onExit={handleExit}
        />

        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FormField
            label="Data e hora"
            placeholder="DD/MM/AAAA HH:MM"
            value={dateText}
            onChangeText={(text) =>
              setDateText(formatDateTimeInput(text))
            }
            error={errors.date}
            keyboardType="number-pad"
          />

          <FormField
            label="Descrição do episódio"
            placeholder="O que foi dito ou feito, onde aconteceu, quem presenciou..."
            value={description}
            onChangeText={setDescription}
            error={errors.description}
            multiline
          />

          <ChipSelector
            label="Tipo de ocorrência"
            options={recordTypes}
            value={type}
            onChange={setType}
          />
        </ScrollView>

        <View style={styles.footer}>
          <SupportButton
            label={saving ? 'Salvando...' : 'Salvar registro'}
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
              accessibilityLabel="Excluir registro"
            >
              <Text style={styles.deleteText}>
                Excluir registro
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