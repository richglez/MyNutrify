// Search Foods Screen -> client\app\(tabs)\quick_actions_menu\searchFood.tsx

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function SearchFoodScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

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
    <View style={styles.root}>
      {/* Fondo azul cielo base */}
      <LinearGradient
        colors={["#CBEAFC", "#bbe0ff", "#fdfeff"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Glow durazno horizontal */}
      <LinearGradient
        colors={["transparent", "#F5C5A3", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.55 }]}
      />

      {/* Fade hacia abajo */}
      <LinearGradient
        colors={["transparent", "rgb(250, 254, 255)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Contenido */}
      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Search</Text>

        {/* ── Input glass (sin BlurView) ── */}
        <View
          style={[
            styles.inputContainer,
            focused && styles.inputContainerFocused,
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#5C788E" />
          ) : (
            <Ionicons
              name="search"
              size={18}
              color={focused ? "#1A6BFF" : "#7a92a8"}
            />
          )}

          <TextInput
            placeholder="Search foods, brands, flavors..."
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={styles.input}
            placeholderTextColor="#7a92a8"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />

          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                setFoods([]);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={18} color="#9EB8CC" />
            </TouchableOpacity>
          )}
        </View>

        {/* Chips-History */}
        <Text style={styles.subtitle}>Recent</Text>
        <View style={styles.chipsContainer}>
          <TouchableOpacity style={styles.glassChip}>
            <Text style={styles.chipText}>Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.glassChip}>
            <Text style={styles.chipText}>Broccoli</Text>
          </TouchableOpacity>
        </View>

        {/* ── Lista de resultados ── */}
        <FlatList
          data={foods}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectFood(item)}
              activeOpacity={0.75}
            >
              <View style={styles.card}>
                <View style={styles.cardIcon}>
                  <Ionicons
                    name="nutrition-outline"
                    size={20}
                    color="#7AAFD4"
                  />
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  {item.brand && (
                    <Text style={styles.cardBrand}>{item.brand}</Text>
                  )}
                  <Text style={styles.cardMeta}>
                    {item.calories} kcal · {item.protein}g prot ·{" "}
                    {item.carbs ?? "–"}g carbs
                  </Text>
                </View>

                <Ionicons name="add-circle-outline" size={22} color="#1A6BFF" />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            query.length > 1 && !loading ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="search-outline" size={36} color="#AECDE3" />
                <Text style={styles.emptyText}>No results found</Text>
                <Text style={styles.emptySubtext}>
                  Try a different name or brand
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 18,
  },

  title: {
    fontFamily: "DMSans_700Bold",
    fontSize: 26,
    letterSpacing: -1.8,
    color: "#5C788E",
    marginBottom: 16,
  },

  // ── Input ───────────────────────────────────────────────────────────────────
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.85)",
    backgroundColor: "#e8f6ff",
    paddingHorizontal: 14,
    paddingVertical: 13,
    shadowColor: "#78AECE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    // elevation: 3,
    marginBottom: 18,
  },

  inputContainerFocused: {
    borderColor: "rgba(26, 107, 255, 0.4)",
    backgroundColor: "#DBF1FF",
    shadowColor: "#1A6BFF",
    shadowOpacity: 0.18,
  },

  input: {
    fontFamily: "DMSans_400Regular",
    flex: 1,
    fontSize: 15,
    color: "#3A5F7A",
    // letterSpacing: -2,
    paddingVertical: 0, // evita altura extra en Android
  },

  // ── Lista ────────────────────────────────────────────────────────────────────
  listContent: {
    paddingTop: 14,
    paddingBottom: 120,
    gap: 10,
  },

  // ── Card resultado ──────────────────────────────────────────────────────────
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.72)",
    backgroundColor: "rgba(255, 255, 255, 0.38)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#78AECE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    // elevation: 2,
  },

  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(200, 223, 245, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  cardBody: {
    flex: 1,
    gap: 2,
  },

  cardName: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#2E4F66",
  },

  cardBrand: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#8AAFC8",
  },

  cardMeta: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#F5A47A", //color label especs -> #7AAAC4 400regular
  },

  // ── Empty state ─────────────────────────────────────────────────────────────
  emptyWrap: {
    alignItems: "center",
    marginTop: 60,
    gap: 8,
  },

  emptyText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    color: "#7AAAC4",
  },

  emptySubtext: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#a0c1d8",
  },

  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#8aaabf",
    marginBottom: 8,
  },

  // Chips
  chipsContainer: {
    marginTop: 6,
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },

  glassChip: {
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: "flex-start", // evita que se estire
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.7)",
  },

  chipText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#7a9ab5",
  },
});
