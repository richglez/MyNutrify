// Search Foods Screen -> client\app\(tabs)\quick-actions-menu\searchFoods.tsx

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export default function SearchFoodScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 1) {
        searchFoods(query);
      } else {
        setFoods([]);
      }
    }, 400); // 400ms delay

    return () => clearTimeout(timeout);
  }, [query]);

  // 🔍 Fetch a backend
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

  // 👉 Seleccionar alimento
  const handleSelectFood = (food: any) => {
    console.log("Seleccionado:", food.name);

    // después lo conectarás con MealLog
    // router.push(...)
  };

  return (
    <View style={styles.container}>
      {/* 🔍 Input */}
      <TextInput
        placeholder="Buscar alimentos..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      {/* ⏳ Loading */}
      {loading && <ActivityIndicator size="large" />}

      {/* 📋 Lista */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  details: {
    fontSize: 14,
    color: "#666",
  },

  brand: {
    fontSize: 12,
    color: "#999",
  },

  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
