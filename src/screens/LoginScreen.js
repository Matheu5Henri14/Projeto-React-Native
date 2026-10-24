import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';

import CustomInput from '../components/CustomInput';
import PrimaryButton from '../components/PrimaryButton';
import PrototypeAlert from '../components/PrototypeAlert';

export default function LoginScreen({ navigation }) {
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    navigation.navigate('NotesList');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          {/* Ícone Amarelo de Notas */}
          <View style={styles.logoBox}>
            <View style={styles.logoLineFull} />
            <View style={styles.logoLineFull} />
            <View style={styles.logoLineShort} />
          </View>

          <Text style={styles.title}>Notas</Text>
          <Text style={styles.subtitle}>
            Entre para acessar suas notas em qualquer{'\n'}aparelho.
          </Text>
        </View>

        {/* Inputs Reutilizados */}
        <CustomInput
          label="Telefone"
          placeholder="(11) 9XXXX-XXXX"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />

        <CustomInput
          label="Senha"
          placeholder="••••••••"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <View style={styles.buttonSpacing}>
          <PrimaryButton title="Entrar" onPress={handleLogin} />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <PrototypeAlert
          title="PROTÓTIPO · CÓDIGO DE ACESSO NÃO É PEDIDO AQUI"
          description="O login usa só telefone e senha. O código de acesso é digitado no final da nota mestre, depois do login."
        />

        <View style={styles.spacer} />

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Ainda não tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 40,
    paddingBottom: 28,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBox: {
    width: 64,
    height: 64,
    backgroundColor: '#F5B800',
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  logoLineFull: {
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginBottom: 6,
    width: '100%',
  },
  logoLineShort: {
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    width: '65%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonSpacing: {
    marginTop: 6,
  },
  forgotPassword: {
    alignItems: 'center',
    marginVertical: 16,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D98A00',
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D98A00',
  },
});