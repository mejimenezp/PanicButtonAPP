import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, ActivityIndicator } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const storedPhone = await AsyncStorage.getItem("userPhone");
      if (storedPhone) {
        router.replace("/home"); 
      } else {
        router.replace("/register"); 
      }
    };

    checkUser();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text>Verificando usuario...</Text>
    </View>
  );
}
