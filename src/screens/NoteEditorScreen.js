import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';

import { useNotes } from '../config/NotesContext';
import { confirmAction } from '../config/confirm';
import { formatLongDate } from '../config/dateTime';

export default function NoteEditorScreen({ navigation, route }) {
  const noteId = route.params?.noteId;

  const { notes, addNote, updateNote, removeNote } = useNotes();

  const existing = notes.find((note) => String(note.id) === String(noteId));
  const isEditing = !!existing;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [content, setContent] = useState(existing?.content ?? '');
  const [saving, setSaving] = useState(false);

  const dateLabel = formatLongDate(existing?.updatedAt ?? new Date());

  const changed =
    title !== (existing?.title ?? '') || content !== (existing?.content ?? '');

  const resolveTitle = () => {
    const typed = title.trim();

    if (typed) {
      return typed.slice(0, 150);
    }

    const firstLine = content.trim().split('\n')[0];

    return (firstLine || 'Nova nota').slice(0, 150);
  };

  const handleDone = async () => {
    if (saving) {
      return;
    }

    const empty = !title.trim() && !content.trim();

    if (!changed || (empty && !isEditing)) {
      navigation.goBack();
      return;
    }

    const data = {
      title: resolveTitle(),
      content: content.trim() || null,
    };

    setSaving(true);

    try {
      if (isEditing) {
        await updateNote(noteId, data);
      } else {
        await addNote(data);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Não foi possível salvar', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!existing) {
      return;
    }

    confirmAction({
      title: 'Excluir nota',
      message: `Excluir "${existing.title}"?`,
      confirmText: 'Excluir',
      destructive: true,
      onConfirm: async () => {
        try {
          await removeNote(noteId);
          navigation.goBack();
        } catch (error) {
          Alert.alert('Não foi possível excluir', error.message);
        }
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={handleDone} disabled={saving}>
              <Text style={styles.backText}>‹ Notas</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDone} disabled={saving}>
              <Text style={styles.doneText}>
                {saving ? 'Salvando...' : 'Concluído'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <TextInput
              style={styles.noteTitle}
              placeholder="Título"
              placeholderTextColor="#C7C7CC"
              value={title}
              onChangeText={setTitle}
              maxLength={150}
              autoCapitalize="sentences"
            />

            <Text style={styles.noteDate}>{dateLabel}</Text>

            <TextInput
              style={styles.bodyInput}
              placeholder="Escreva sua nota..."
              placeholderTextColor="#C7C7CC"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              autoCapitalize="sentences"
            />

            {isEditing && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteText}>Excluir nota</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
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
    backgroundColor: '#FAF9F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  backText: {
    fontSize: 16,
    color: '#D98A00',
    fontWeight: '500',
  },
  doneText: {
    fontSize: 16,
    color: '#D98A00',
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  noteTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 4,
    paddingVertical: 0,
  },
  noteDate: {
    fontSize: 12,
    color: '#AEAEB2',
    marginBottom: 16,
  },
  bodyInput: {
    fontSize: 15,
    color: '#1C1C1E',
    lineHeight: 22,
    minHeight: 220,
    paddingVertical: 0,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 20,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D32F2F',
  },
});
