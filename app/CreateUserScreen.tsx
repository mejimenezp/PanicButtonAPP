/*import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Asegúrate de instalar esta librería
import axios from "axios";
import { API_URL } from "@/constants/api";
import { useRouter } from "expo-router";

// Definir interfaces para cada tipo de dato
interface Departamento {
  Dpto_ID: number;
  Dpto_Name: string;
}

interface Area {
  Area_ID: number;
  Area_Name: string;
}

interface Ciudad {
  Ciud_ID: number;
  Ciud_Name: string;
}

interface Vereda {
  Vere_ID: number;
  Vere_Name: string;
}

interface Localidad {
  Loca_ID: number;
  Loca_Name: string;
}

const CreateUserScreen: React.FC = () => {
  const [name, setName] = useState<string>(""); // Nombre del usuario
  const [email, setEmail] = useState<string>(""); // Correo del usuario
  const [phone, setPhone] = useState<string>("");

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [veredas, setVeredas] = useState<Vereda[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);

  const [dptoId, setDptoId] = useState<number | null>(null);
  const [areaId, setAreaId] = useState<number | null>(null);
  const [ciudId, setCiudId] = useState<number | null>(null);
  const [vereId, setVereId] = useState<number | null>(null);
  const [locaId, setLocaId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const fetchDepartamentos = async () => {
    try {
      const { data } = await axios.get<Departamento[]>(`${API_URL}/departamentos`);
      setDepartamentos(data);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  };

  const fetchAreas = async (dpto_id: number) => {
    setDptoId(dpto_id);
    setAreaId(null);
    setCiudId(null);
    setVereId(null);
    setLocaId(null);
    setAreas([]);
    setCiudades([]);
    setVeredas([]);
    setLocalidades([]);

    try {
      const { data } = await axios.get<Area[]>(`${API_URL}/areas/${dpto_id}`);
      setAreas(data);
    } catch (error) {
      console.error("Error al obtener áreas:", error);
    }
  };

  const fetchCiudades = async (area_id: number) => {
    setAreaId(area_id);
    setCiudId(null);
    setVereId(null);
    setLocaId(null);
    setCiudades([]);
    setVeredas([]);
    setLocalidades([]);

    try {
      const { data } = await axios.get<Ciudad[]>(`${API_URL}/ciudades/${area_id}`);
      setCiudades(data);
    } catch (error) {
      console.error("Error al obtener ciudades:", error);
    }
  };

  const fetchVeredas = async (ciud_id: number) => {
    setCiudId(ciud_id);
    setVereId(null);
    setLocaId(null);
    setVeredas([]);
    setLocalidades([]);

    try {
      const { data } = await axios.get<Vereda[]>(`${API_URL}/veredas/${ciud_id}`);
      setVeredas(data);
    } catch (error) {
      console.error("Error al obtener veredas:", error);
    }
  };

  const fetchLocalidades = async (vere_id: number) => {
    setVereId(vere_id);
    setLocaId(null);
    setLocalidades([]);

    try {
      const { data } = await axios.get<Localidad[]>(`${API_URL}/localidades/${vere_id}`);
      setLocalidades(data);
    } catch (error) {
      console.error("Error al obtener localidades:", error);
    }
  };

  const handleCreateUser = async () => {
    if (!name || !email || !phone || !dptoId || !areaId || !ciudId || !vereId || !locaId) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/create-user`, {
        Usua_Name: name,
        Usua_Email: email,
        phone,
        serv_id: 1, // ID de servicio fijo, ajustar según necesidad
        dpto_id: dptoId,
        area_id: areaId,
        ciud_id: ciudId,
        vere_id: vereId,
        loca_id: locaId,
        cont_id: null,
      });

      Alert.alert("Éxito", "Usuario creado correctamente");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Usuario</Text>

      <TextInput style={styles.input} placeholder="Nombre Completo" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Correo Electrónico" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Número de teléfono" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

      <Picker selectedValue={dptoId} onValueChange={fetchAreas}>
        <Picker.Item label="Seleccione Departamento" value={null} />
        {departamentos.map((item) => <Picker.Item key={item.Dpto_ID} label={item.Dpto_Name} value={item.Dpto_ID} />)}
      </Picker>

      <Picker selectedValue={areaId} enabled={!!dptoId} onValueChange={fetchCiudades}>
        <Picker.Item label="Seleccione Área" value={null} />
        {areas.map((item) => <Picker.Item key={item.Area_ID} label={item.Area_Name} value={item.Area_ID} />)}
      </Picker>

      <Picker selectedValue={ciudId} enabled={!!areaId} onValueChange={fetchVeredas}>
        <Picker.Item label="Seleccione Ciudad" value={null} />
        {ciudades.map((item) => <Picker.Item key={item.Ciud_ID} label={item.Ciud_Name} value={item.Ciud_ID} />)}
      </Picker>

      <Picker selectedValue={vereId} enabled={!!ciudId} onValueChange={fetchLocalidades}>
        <Picker.Item label="Seleccione Vereda" value={null} />
        {veredas.map((item) => <Picker.Item key={item.Vere_ID} label={item.Vere_Name} value={item.Vere_ID} />)}
      </Picker>

      <Picker selectedValue={locaId} enabled={!!vereId} onValueChange={(value) => setLocaId(value)}>
        <Picker.Item label="Seleccione Localidad" value={null} />
        {localidades.map((item) => <Picker.Item key={item.Loca_ID} label={item.Loca_Name} value={item.Loca_ID} />)}
      </Picker>

      <Button title="Crear Usuario" onPress={handleCreateUser} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="blue" />}
    </ScrollView>
  );
};

export default CreateUserScreen;
*/