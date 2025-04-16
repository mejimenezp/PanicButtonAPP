import React, { useState } from 'react';
import { 
  View, 
  Image, 
  TouchableOpacity, 
  Alert, 
  Text, 
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
    if (loading) return;
    setLoading(true);

    try {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== 'granted') {
        // Mostrar mensaje explicativo solo si no se ha otorgado permiso aún
        Alert.alert(
          'Acceso a tu ubicación',
          'Tu ubicación solo será utilizada para enviar una alerta de emergencia a tus contactos registrados.',
          [
            {
              text: 'Aceptar',
              onPress: async () => {
                const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
                if (newStatus !== 'granted') {
                  Alert.alert('❌ Permiso Denegado', 'Debes permitir el acceso a la ubicación para enviar la alerta.');
                  setLoading(false);
                  return;
                } else {
                  await handleSend();
                }
              },
            },
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: () => setLoading(false),
            },
          ]
        );
      } else {
        await handleSend();
      }
    } catch (error: any) {
      console.error("Error al enviar la alerta:", error);
      Alert.alert('❌ Error', `No se pudo enviar la alerta.\n\n${error.message}`);
      setLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const phone = await AsyncStorage.getItem('userPhone');
      if (!phone) {
        Alert.alert('⚠️ Error', 'No se encontró el número de teléfono registrado.');
        return;
      }

      const alertData = {
        phone,
        latitude: location.coords.latitude.toString(),
        longitude: location.coords.longitude.toString(),
      };

      await axios.post(`${API_URL}/panic`, alertData);
      Alert.alert('✅ Alerta Enviada', 'Se ha enviado un SMS y un Email a tus contactos de emergencia.');
    } catch (error: any) {
      console.error("Error interno:", error);
      Alert.alert('❌ Error', `No se pudo enviar la alerta.\n\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.locationInfo}>
        ⚠️ Al pulsar el botón de emergencia, tu ubicación será enviada por SMS y/o correo electrónico a tus contactos.
      </Text>

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
  locationInfo: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    fontSize: 14,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
  
});