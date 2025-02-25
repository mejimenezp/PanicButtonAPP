import React, { useState } from 'react';
import { 
  View, 
  Image, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/api';

const PanicButton: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const sendAlert = async () => {
    setLoading(true);

    try {
      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('❌ Permiso Denegado', 'Debes permitir el acceso a la ubicación para enviar la alerta.');
        setLoading(false);
        return;
      }

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        mayShowUserSettingsDialog: true,
      });




      const phone = await AsyncStorage.getItem('userPhone');

      if (!phone) {
        Alert.alert('⚠️ Error', 'No se encontró el número de teléfono registrado.');
        setLoading(false);
        return;
      }

      // Crear objeto de datos
      const alertData = {
        phone,
        latitude: location.coords.latitude.toString(),
        longitude: location.coords.longitude.toString(),
      };

      // Enviar alerta al backend
      await axios.post(`${API_URL}/panic`, alertData);
      Alert.alert('✅ Alerta Enviada', 'Tus contactos de emergencia han sido notificados.');

    } catch (error: any) {
      console.error("Error al enviar la alerta:", error);
      Alert.alert('❌ Error', `No se pudo enviar la alerta. Inténtalo nuevamente.\n\nDetalles: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={sendAlert} style={styles.panicButton} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : (
          <Image source={require('@/assets/images/panic-button.png')} style={styles.panicImage} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PanicButton;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panicButton: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 110, 
    backgroundColor: 'rgba(255, 0, 0, 0.2)', 
    shadowColor: 'red',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10, 
  },
  panicImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
