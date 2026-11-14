import React, { useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';

import CustomInput from '../components/CustomInput';
import PrimaryButton from '../components/PrimaryButton';

import { useAuth } from '../config/AuthContext';
import { formatPhone, isValidPhone } from '../config/phone';

export default function RegisterScreen({ navigation }) {
  const { register, loading } = useAuth();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [codigoAcesso, setCodigoAcesso] = useState('');
  const [confirmarCodigo, setConfirmarCodigo] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const next = {};

    if (nome.trim().length < 2) {
      next.nome = 'Informe seu nome.';
    }

    if (!isValidPhone(telefone)) {
      next.telefone = 'Informe o telefone com DDD.';
    }

    if (senha.length < 8) {
      next.senha = 'A senha deve ter ao menos 8 caracteres.';
    }

    if (confirmarSenha !== senha) {
      next.confirmarSenha = 'As senhas não conferem.';
    }

    if (!/^\d{4,8}$/.test(codigoAcesso)) {
      next.codigoAcesso = 'Use de 4 a 8 números.';
    } else if (codigoAcesso === senha) {
      next.codigoAcesso = 'O código deve ser diferente da senha.';
    }

    if (confirmarCodigo !== codigoAcesso) {
      next.confirmarCodigo = 'Os códigos não conferem.';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleRegister = async () => {
    setApiError('');

    if (loading || !validate()) {
      return;
    }

    try {
      await register({
        nome: nome.trim(),
        telefone: telefone.replace(/\D/g, ''),
        senha,
        codigoAcesso,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'NotesList' }],
      });
    } catch (error) {
      setApiError(error.message);
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
            <Text style={styles.backButtonText}>‹ Entrar</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Criar conta</Text>

          <CustomInput
            label="Nome"
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            error={errors.nome}
            editable={!loading}
          />

          <CustomInput
            label="Telefone"
            placeholder="(11) 9XXXX-XXXX"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={(text) => setTelefone(formatPhone(text))}
            error={errors.telefone}
            editable={!loading}
          />

          <CustomInput
            label="Senha"
            placeholder="••••••••"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            error={errors.senha}
            editable={!loading}
          />

          <CustomInput
            label="Confirmar senha"
            placeholder="••••••••"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            error={errors.confirmarSenha}
            editable={!loading}
          />

          <CustomInput
            label="Código de acesso"
            placeholder="• • • •"
            secureTextEntry
            keyboardType="numeric"
            maxLength={8}
            value={codigoAcesso}
            onChangeText={setCodigoAcesso}
            error={errors.codigoAcesso}
            editable={!loading}
          />

          <CustomInput
            label="Confirmar código de acesso"
            placeholder="• • • •"
            secureTextEntry
            keyboardType="numeric"
            maxLength={8}
            value={confirmarCodigo}
            onChangeText={setConfirmarCodigo}
            error={errors.confirmarCodigo}
            editable={!loading}
          />

          {!!apiError && <Text style={styles.apiError}>{apiError}</Text>}

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Criar conta"
              onPress={handleRegister}
              loading={loading}
            />
          </View>

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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  buttonContainer: {
    marginTop: 10,
  },
  apiError: {
    fontSize: 13,
    color: '#D32F2F',
    marginBottom: 8,
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