import React, { useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import CustomInput from '../components/CustomInput';
import PrototypeAlert from '../components/PrototypeAlert';
import PrimaryButton from '../components/PrimaryButton';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [codigoAcesso, setCodigoAcesso] = useState('');
  const [confirmarCodigo, setConfirmarCodigo] = useState('');

  const handleRegister = () => {
    
    if (navigation) {
      navigation.navigate('NotesList'); 
    } else {
      console.log('Conta criada (simulado):', { nome, telefone, codigoAcesso });
    }
  };

  const handleGoToLogin = () => {
    if (navigation) {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          <TouchableOpacity style={styles.backButton} onPress={handleGoToLogin}>
            <Text style={styles.backButtonText}>‹ Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Criar conta</Text>

          <CustomInput
            label="Nome"
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
          />

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

          <CustomInput
            label="Confirmar senha"
            placeholder="••••••••"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <CustomInput
            label="Código de acesso"
            placeholder="• • • •"
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
            value={codigoAcesso}
            onChangeText={setCodigoAcesso}
          />

          <CustomInput
            label="Confirmar código de acesso"
            placeholder="• • • •"
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
            value={confirmarCodigo}
            onChangeText={setConfirmarCodigo}
          />

          <PrototypeAlert
            title="PROTÓTIPO · SENHA E CÓDIGO SÃO DIFERENTES"
            description="A senha entra na conta do app. O código de acesso abre a Área de Apoio quando digitado no final da nota mestre."
          />

          <PrimaryButton 
            title="Criar conta" 
            onPress={handleRegister} 
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem conta? </Text>
            <TouchableOpacity onPress={handleGoToLogin}>
              <Text style={styles.footerLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F5',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 36,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  backButtonText: {
    fontSize: 16,
    color: '#D98A00',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
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