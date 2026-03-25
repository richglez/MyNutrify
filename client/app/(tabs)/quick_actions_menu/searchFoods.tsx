// Search Foods Screen -> client\app\(tabs)\quick-actions-menu\searchFoods.tsx

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function SearchFoodScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 1) searchFoods(query);
      else setFoods([]);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("dark-content");
    }, []),
  );

  const searchFoods = async (text: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/foods/search?q=${encodeURIComponent(text)}`,
      );
      const data = await res.json();
      setFoods(data);
    } catch (error) {
      console.error("Error buscando alimentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFood = (food: any) => {
    console.log("Seleccionado:", food.name);
  };

  return (
    <View style={styles.gradient}>
      {/* Capa 1: azul cielo cubre toda la pantalla */}
      <LinearGradient
        colors={["#C8DFF5", "#f2faff", "#fdfeff"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Capa 2: glow durazno horizontal centrado */}
      <LinearGradient
        colors={["#CBEAFC", "#d1eaff", "#fff"]}
        locations={[0, 0.3, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Capa durazno — solo la parte superior */}
      <LinearGradient
        colors={["transparent", "#F5C5A3", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        // Como puedo redcuir el tamaño vertical?
        // locations={[0, 0.18, 0.55, 1]} para reducir el tamaño vertical
        style={StyleSheet.absoluteFill}
      />

      {/* Fade que disuelve el durazno hacia abajo ← NUEVO */}
      <LinearGradient
        colors={["transparent", "rgb(250, 254, 255)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Contenido encima de todo */}
      <View style={[styles.content, { paddingTop: insets.top + 16 }]}>
        <TextInput
          placeholder="Buscar alimentos..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          placeholderTextColor="#999"
        />

        {loading && <ActivityIndicator size="large" color="#1A6BFF" />}

        <FlatList
          data={foods}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleSelectFood(item)}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>
                {item.calories} kcal • {item.protein}g protein
              </Text>
              {item.brand && <Text style={styles.brand}>{item.brand}</Text>}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            query.length > 1 && !loading ? (
              <Text style={styles.empty}>No se encontraron resultados</Text>
            ) : null
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.55)",
    fontSize: 15,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  name: { fontSize: 16, fontWeight: "600" },
  details: { fontSize: 14, color: "#666" },
  brand: { fontSize: 12, color: "#999" },
  empty: { textAlign: "center", marginTop: 20, color: "#888" },
});
