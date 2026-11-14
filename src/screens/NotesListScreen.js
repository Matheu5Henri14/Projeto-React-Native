import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import NoteCard from '../components/NoteCard';

import { useAuth } from '../config/AuthContext';
import { useNotes } from '../config/NotesContext';
import { confirmAction } from '../config/confirm';
import { formatRelativeDate } from '../config/dateTime';

export default function NotesListScreen({ navigation }) {
  const [busca, setBusca] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { token, unlock } = useAuth();
  const { notes, loading, error, refreshNotes, removeNote } = useNotes();

  useEffect(() => {
    if (!token) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [token, navigation]);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        refreshNotes().catch(() => {});
      }
    }, [token, refreshNotes])
  );

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await refreshNotes();
    } catch (err) {
    } finally {
      setRefreshing(false);
    }
  };

  const handleSubmitSearch = async () => {
    const text = busca.trim();

    if (!/^\d{4,8}$/.test(text)) {
      return;
    }

    try {
      const unlocked = await unlock(text);

      if (unlocked) {
        setBusca('');
        navigation.navigate('SupportArea');
      }
    } catch (err) {
    }
  };

  const handleDeleteNote = (note) => {
    confirmAction({
      title: 'Excluir nota',
      message: `Excluir "${note.title}"?`,
      confirmText: 'Excluir',
      destructive: true,
      onConfirm: async () => {
        try {
          await removeNote(note.id);
        } catch (err) {
          Alert.alert('Não foi possível excluir', err.message);
        }
      },
    });
  };

  const termo = busca.trim().toLowerCase();

  const notasFiltradas = notes.filter(
    (item) =>
      !termo ||
      (item.title || '').toLowerCase().includes(termo) ||
      (item.content || '').toLowerCase().includes(termo)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Notas</Text>

        {/* Barra de Pesquisa */}
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar"
          placeholderTextColor="#8E8E93"
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={handleSubmitSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Lista de Notas */}
        <FlatList
          data={notasFiltradas}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => (
            <NoteCard
              title={item.title}
              preview={item.preview}
              date={formatRelativeDate(item.updatedAt)}
              onPress={() => navigation.navigate('NoteEditor', { noteId: item.id })}
              onLongPress={() => handleDeleteNote(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {loading
                  ? 'Carregando notas...'
                  : error
                    ? 'Não foi possível carregar'
                    : termo
                      ? 'Nenhuma nota encontrada'
                      : 'Nenhuma nota ainda'}
              </Text>

              <Text style={styles.emptyText}>
                {error ||
                  (termo
                    ? 'Tente buscar por outro termo.'
                    : 'Toque em + para criar sua primeira nota.')}
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />

        {/* Rodapé com contador e botão + */}
        <View style={styles.footer}>
          <Text style={styles.notesCount}>{notasFiltradas.length} Notas</Text>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('NoteEditor')}
            activeOpacity={0.8}
          >
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 12,
  },
  searchBar: {
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 15,
    color: '#1C1C1E',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#8E8E93',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  notesCount: {
    fontSize: 13,
    color: '#8E8E93',
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5B800',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  fabIcon: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: -2,
  },
});
