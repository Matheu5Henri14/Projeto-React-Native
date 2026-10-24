import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import NotesListScreen from '../screens/NotesListScreen';
import NoteEditorScreen from '../screens/NoteEditorScreen';
import AppTabs from './AppTabs';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* Disfarce: bloco de notas */}
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="NotesList" component={NotesListScreen} />
        <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />

        {/* Área segura: abas Início, Contatos e Registros */}
        <Stack.Screen name="SupportArea" component={AppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}