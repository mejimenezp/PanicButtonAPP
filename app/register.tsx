import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, Alert, ActivityIndicator, 
  StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@/constants/api';
import { useRouter } from 'expo-router';

const RegisterScreen: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkStoredUser = async () => {
      const storedPhone = await AsyncStorage.getItem('userPhone');
      if (storedPhone) {
        router.replace('/home'); 
      }
    };
    checkStoredUser();
  }, []);

  const validatePhone = async () => {
    if (!phone) {
      Alert.alert('Error', 'Ingresa tu número de teléfono');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/validate-phone`, { phone });
      if (response.data.exists) {
        setIsRegistered(true);
        await AsyncStorage.setItem('userRole', response.data.isAdmin ? 'admin' : 'user');
        Alert.alert('Código enviado', 'Revisa tu correo e ingresa el código de verificación.');
      } else {
        Alert.alert('Error', 'Número no registrado en la base de datos.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo validar el número');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Ingresa el código de verificación');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/verify-code`, { phone, code: verificationCode });
      if (response.data.valid) {
        await AsyncStorage.setItem('userPhone', phone);
        await AsyncStorage.setItem('userName', name);
        Alert.alert('Éxito', 'Registro completado');
        router.replace('/home');
      } else {
        Alert.alert('Error', 'Código incorrecto');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo verificar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Registro</Text>
          <TextInput
            style={styles.input}
            placeholder="Número de teléfono"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            editable={!isRegistered}
          />
          {!isRegistered ? (
            <Button title="Validar número" onPress={validatePhone} disabled={loading} />
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Código de verificación"
                keyboardType="numeric"
                value={verificationCode}
                onChangeText={setVerificationCode}
              />
              <Button title="Verificar código" onPress={verifyCode} disabled={loading} />
            </>
          )}
          {loading && <ActivityIndicator size="large" color="blue" />}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
});
