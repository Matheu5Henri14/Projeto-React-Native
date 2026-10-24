import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import NotesListScreen from '../screens/NotesListScreen';
import NoteEditorScreen from '../screens/NoteEditorScreen';

const Stack = createNativeStackNavigator();

// Ecrã provisório para a Tela 5 (Área de Apoio) caso outro colega do grupo ainda a esteja a fazer
function SupportAreaPlaceholder({ navigation }) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitle}>Área de Apoio (Tela 5)</Text>
      <Text style={styles.placeholderSub}>
        Gatilho do disfarce acionado com sucesso!
      </Text>
      <TouchableOpacity 
        style={styles.backBtn} 
        onPress={() => navigation.navigate('NotesList')}
      >
        <Text style={styles.backBtnText}>Voltar ao Disfarce</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Register"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="NotesList" component={NotesListScreen} />
        <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
        <Stack.Screen name="SupportArea" component={SupportAreaPlaceholder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9F5',
    padding: 24,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 8,
  },
  placeholderSub: {
    fontSize: 14,
    color: '#6C6C70',
    marginBottom: 24,
    textAlign: 'center',
  },
  backBtn: {
    backgroundColor: '#F5B800',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backBtnText: {
    fontWeight: '700',
    color: '#111111',
  },
});