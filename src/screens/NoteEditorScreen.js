import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';

import NumericKeypad from '../components/NumericKeypad';

export default function NoteEditorScreen({ navigation }) {
  const [pin, setPin] = useState('1234');

  const handlePressNumber = (num) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);

      if (nextPin.length === 4) {
        setTimeout(() => {
          navigation.navigate('SupportArea');
        }, 250);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleConcluido = () => {
    if (pin.length === 4) {
      navigation.navigate('SupportArea');
    } else {
      navigation.goBack();
    }
  };

  const maskedPin = pin
    .split('')
    .map(() => '•')
    .join(' ');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹ Notas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleConcluido}>
            <Text style={styles.doneText}>Concluído</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.noteTitle}>Lembretes</Text>
        <Text style={styles.noteDate}>5 de outubro de 2026</Text>

        <View style={styles.noteBody}>
          <Text style={styles.bodyText}>Comprar:</Text>
          <Text style={styles.bodyText}>• leite</Text>
          <Text style={styles.bodyText}>• pão</Text>
          <Text style={styles.bodyText}>• ovos</Text>

          <Text style={[styles.bodyText, styles.paragraphSpacing]}>
            Consulta dentista: quinta, 15h
          </Text>

          <Text style={[styles.bodyText, styles.paragraphSpacing]}>
            Código: <Text style={styles.dotsText}>{maskedPin}</Text>
          </Text>
        </View>
      </View>

      <NumericKeypad
        onPressNumber={handlePressNumber}
        onBackspace={handleBackspace}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  noteTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 4,
  },
  noteDate: {
    fontSize: 12,
    color: '#AEAEB2',
    marginBottom: 16,
  },
  noteBody: {
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 15,
    color: '#1C1C1E',
    lineHeight: 22,
  },
  paragraphSpacing: {
    marginTop: 14,
  },
  dotsText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
});