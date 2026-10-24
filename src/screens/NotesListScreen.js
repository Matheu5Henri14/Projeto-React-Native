import React, { useState } from 'react';
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
} from 'react-native';

import NoteCard from '../components/NoteCard';

const MOCK_NOTES = [
  {
    id: '1',
    title: 'Lista de compras',
    preview: 'Leite, pão, ovos, café, frutas da semana',
    date: 'Hoje',
  },
  {
    id: '2',
    title: 'Tarefas da semana',
    preview: 'Pagar conta de luz, ligar para o dentista',
    date: 'Ontem',
  },
  {
    id: '3',
    title: 'Receita de bolo',
    preview: '2 xícaras de farinha, 3 ovos, 1 xícara de açúcar',
    date: 'Segunda',
  },
  {
    id: '4',
    title: 'Lembretes',
    preview: 'Consulta quinta às 15h, aniversário da tia',
    date: '28/09',
  },
  {
    id: '5',
    title: 'Ideias de presente',
    preview: 'Livro, planta, caneca personalizada',
    date: '20/09',
  },
];

export default function NotesListScreen({ navigation }) {
  const [busca, setBusca] = useState('');

  const notasFiltradas = MOCK_NOTES.filter(
    (item) =>
      item.title.toLowerCase().includes(busca.toLowerCase()) ||
      item.preview.toLowerCase().includes(busca.toLowerCase())
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
        />

        {/* Lista de Notas */}
        <FlatList
          data={notasFiltradas}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <NoteCard
              title={item.title}
              preview={item.preview}
              date={item.date}
              onPress={() => navigation.navigate('NoteEditor', { note: item })}
            />
          )}
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