import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, Alert, ActivityIndicator, 
  StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,
  TouchableOpacity, Modal, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@/constants/api';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';


const RegisterScreen: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);



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
    if (!acceptedTerms) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones');
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
    <>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Términos y Condiciones</Text>
            <ScrollView style={{ maxHeight: '70%' }}>
              <Text style={styles.modalText}>
                Al aceptar esta política, estoy aceptando como Titular de mis Datos Personales el Tratamiento de estos por parte de FTE, sus aliados estratégicos, filiales, sociedades subordinadas, matrices, y empleados, con la finalidad de prestar un mejor servicio y, en especial, cumplir con las funciones y obligaciones, procedentes de diversas operaciones realizadas a través de medios físicos y/o electrónicos.
              </Text>
              <Text style={styles.modalText}>
                Acepto que mis Datos Personales se usarán para fines estadísticos, de contacto, envío de documentación, información, envío de notificaciones, informes sobre estado del proceso o proyecto, noticias de interés, informes sobre las gestiones que se realizan, y diferente información relacionada con las actividades que desarrolla FTE.
              </Text>
              <Text style={styles.modalText}>
                Lo anterior, sin perjuicio de que yo manifieste expresamente, a través de los medios establecidos por FTE, que se eliminen, rectifiquen o supriman mis Datos Personales de sus Bases de Datos.
              </Text>
            </ScrollView>
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <View style={styles.innerContainer}>
    <Text style={styles.title}>Registro</Text>

    {/* Paso 1: Validar número */}
    {!isRegistered && (
  <Text style={styles.stepInfo}>
    Ingresa tu número de teléfono para verificar si ya estás registrado.
  </Text>
)}

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
        {/* Paso 2: Ingresar nombre */}
        <Text style={styles.stepInfo}>
          Ingresa tu nombre completo.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />

        {/* Paso 3: Ingresar código */}
        <Text style={styles.stepInfo}>
          Ingresa el código de verificación que recibiste por correo electrónico.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Código de verificación"
          keyboardType="numeric"
          value={verificationCode}
          onChangeText={setVerificationCode}
        />

        {/* Paso 4: Aceptar términos */}
        <TouchableOpacity 
          onPress={() => setAcceptedTerms(!acceptedTerms)} 
          style={styles.checkboxContainer}
        >
          <View style={styles.checkbox}>
            {acceptedTerms && <View style={styles.checkboxChecked} />}
          </View>
          <Text style={styles.checkboxText}>
            Acepto y autorizo el <Text style={{ textDecorationLine: 'underline', color: 'blue' }} onPress={() => setModalVisible(true)}>tratamiento de mis datos personales.</Text>
          </Text>
        </TouchableOpacity>

        <Button title="Verificar código" onPress={verifyCode} disabled={loading} />
      </>
    )}
    
    {loading && <ActivityIndicator size="large" color="blue" />}
  </View>
</TouchableWithoutFeedback>

      </KeyboardAvoidingView>
    </>
  );
};

export default RegisterScreen;

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#000' : '#fff',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: isDarkMode ? '#000' : '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: isDarkMode ? '#fff' : '#000',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    color: isDarkMode ? '#fff' : '#000',
    borderColor: isDarkMode ? '#ccc' : '#000',
    backgroundColor: isDarkMode ? '#222' : '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '80%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: isDarkMode ? '#fff' : '#000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: 'blue',
  },
  checkboxText: {
    fontSize: 14,
    flexShrink: 1,
    color: isDarkMode ? '#ccc' : '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: isDarkMode ? '#222' : '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: isDarkMode ? '#fff' : '#000',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'justify',
    color: isDarkMode ? '#ccc' : '#000',
  },
  stepInfo: {
    fontSize: 14,
    color: isDarkMode ? '#ccc' : '#333',
    marginBottom: 10,
    textAlign: 'left',
    paddingHorizontal: 10,
  },
});