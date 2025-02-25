import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import PanicButton from '@/components/PanicButton';

const HomeScreen: React.FC = () => {
  const [phone, setPhone] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedPhone = await AsyncStorage.getItem("userPhone");
        const storedName = await AsyncStorage.getItem("userName"); 
        const role = await AsyncStorage.getItem("userRole");

        setPhone(storedPhone);
        setName(storedName);
        setIsAdmin(role === "admin"); 
        console.log("Tipo de usuario:", role);
      } catch (error) {
        console.error("Error obteniendo datos del usuario:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleDeleteUser = async () => {
    Alert.alert(
      "Eliminar Usuario",
      "¿Estás seguro de que deseas eliminar este usuario?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            await AsyncStorage.removeItem('userPhone');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('userRole'); // Borrar también el rol
            Alert.alert("Usuario eliminado", "Debes registrarte nuevamente.");
            router.replace('/register');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Contenedor del menú en la esquina superior derecha */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={handleDeleteUser}>
          <Text style={styles.menuText}>⋮</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>Tu número registrado es:</Text>
        <Text style={styles.phone}>{phone}</Text>

        {/* Botón de Pánico */}
        <PanicButton />

        {/* Mostrar opciones solo si el usuario es admin */}
        {isAdmin && (
          <View style={styles.adminContainer}>
            <Text style={styles.adminTitle}>Opciones de Administrador</Text>
            <TouchableOpacity 
              style={styles.adminButton} 
              //onPress={() => router.push('/create-user')}
            >
              <Text style={styles.adminButtonText}>Crear Usuario</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.adminButton} 
              //onPress={() => router.push('/create-contact')}
            >
              <Text style={styles.adminButtonText}>Crear Contacto</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  menuContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 10,
    zIndex: 10,
  },
  menuButton: {
    padding: 10,
  },
  menuText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  phone: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 20,
  },
  adminContainer: {
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  adminTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  adminButton: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
