import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { useRouter } from "expo-router";

const CreateUserScreen: React.FC = () => {
  const [name, setName] = useState(""); // Nombre del usuario
  const [email, setEmail] = useState(""); // Correo del usuario
  const [phone, setPhone] = useState("");

  const [departamentos, setDepartamentos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [veredas, setVeredas] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  const [dptoId, setDptoId] = useState(null);
  const [areaId, setAreaId] = useState(null);
  const [ciudId, setCiudId] = useState(null);
  const [vereId, setVereId] = useState(null);
  const [locaId, setLocaId] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const fetchDepartamentos = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/departamentos`);
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
      const { data } = await axios.get(`${API_URL}/areas/${dpto_id}`);
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
      const { data } = await axios.get(`${API_URL}/ciudades/${area_id}`);
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
      const { data } = await axios.get(`${API_URL}/veredas/${ciud_id}`);
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
      const { data } = await axios.get(`${API_URL}/localidades/${vere_id}`);
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
      
      <TextInput 
        style={styles.input} 
        placeholder="Nombre Completo" 
        value={name} 
        onChangeText={setName} 
      />

      <TextInput 
        style={styles.input} 
        placeholder="Correo Electrónico" 
        keyboardType="email-address" 
        value={email} 
        onChangeText={setEmail} 
      />

      <TextInput 
        style={styles.input} 
        placeholder="Número de teléfono" 
        keyboardType="phone-pad" 
        value={phone} 
        onChangeText={setPhone} 
      />

      {/* Departamento */}
      <Text style={styles.label}>Departamento:</Text>
      <Picker selectedValue={dptoId} onValueChange={fetchAreas}>
        <Picker.Item label="Seleccione Departamento" value={null} />
        {departamentos.map((item) => <Picker.Item key={item.Dpto_ID} label={item.Dpto_Name} value={item.Dpto_ID} />)}
      </Picker>

      {/* Área */}
      <Text style={styles.label}>Área:</Text>
      <Picker selectedValue={areaId} enabled={!!dptoId} onValueChange={fetchCiudades}>
        <Picker.Item label="Seleccione Área" value={null} />
        {areas.map((item) => <Picker.Item key={item.Area_ID} label={item.Area_Name} value={item.Area_ID} />)}
      </Picker>

      {/* Ciudad */}
      <Text style={styles.label}>Ciudad:</Text>
      <Picker selectedValue={ciudId} enabled={!!areaId} onValueChange={fetchVeredas}>
        <Picker.Item label="Seleccione Ciudad" value={null} />
        {ciudades.map((item) => <Picker.Item key={item.Ciud_ID} label={item.Ciud_Name} value={item.Ciud_ID} />)}
      </Picker>

      {/* Vereda */}
      <Text style={styles.label}>Vereda:</Text>
      <Picker selectedValue={vereId} enabled={!!ciudId} onValueChange={fetchLocalidades}>
        <Picker.Item label="Seleccione Vereda" value={null} />
        {veredas.map((item) => <Picker.Item key={item.Vere_ID} label={item.Vere_Name} value={item.Vere_ID} />)}
      </Picker>

      {/* Localidad */}
      <Text style={styles.label}>Localidad:</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});
