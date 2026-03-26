// Search Foods Screen -> client\app\(tabs)\quick_actions_menu\searchFood.tsx

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function SearchFoodScreen() {
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const insets = useSafeAreaInsets();

  // ── Cargar sugerencias al montar ─────────────────────────────────────────
  useEffect(() => {
    loadSuggestions();
    loadHistory();
  }, []);

  const loadSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const res = await fetch(`${API_URL}/api/foods/suggestions`);
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando sugerencias:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // ── Búsqueda con debounce ─────────────────────────────────────────────────
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 1) searchFoods(query);
      else setFoods([]);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem("search_history");
      if (data) setHistory(JSON.parse(data));
    } catch (e) {
      console.log("Error loading history", e);
    }
  };

  const saveSearch = async (text: string) => {
    if (!text.trim()) return;
    setHistory((prev) => {
      const next = [text, ...prev.filter((item) => item !== text)].slice(0, 5);
      AsyncStorage.setItem("search_history", JSON.stringify(next));
      return next;
    });
  };

  const handleSelectFood = (food: any) => {
    saveSearch(food.name);
    console.log("Seleccionado:", food.name);
    // router.push(...)  <- navegar a detalle si lo necesitas
  };

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
      setFoods(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error buscando alimentos:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Separar exactos vs. parciales ────────────────────────────────────────
  const normalizedQuery = query.trim().toLowerCase();
  const exactMatches = foods.filter(
    (f) => f.name.toLowerCase() === normalizedQuery,
  );
  const partialMatches = foods.filter(
    (f) => f.name.toLowerCase() !== normalizedQuery,
  );

  // ── Card reutilizable ─────────────────────────────────────────────────────
  const renderCard = (item: any) => (
    <TouchableOpacity
      key={item._id}
      onPress={() => handleSelectFood(item)}
      activeOpacity={0.75}
      style={{ marginBottom: 10 }}
    >
      <View style={styles.card}>
        <View style={styles.cardIcon}>
          <Ionicons name="nutrition-outline" size={20} color="#7AAFD4" />
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardName}>{item.name}</Text>
          {item.brand && <Text style={styles.cardBrand}>{item.brand}</Text>}
          <Text style={styles.cardMeta}>
            {item.calories} kcal · {item.protein}g prot · {item.carbs ?? "–"}g
            carbs
          </Text>
        </View>
        <Ionicons name="add-circle-outline" size={22} color="#1A6BFF" />
      </View>
    </TouchableOpacity>
  );

  const showSearch = query.length > 1;

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
        colors={["transparent", "#ffc49b", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.6 }]}
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

        {/* ── Input glass ── */}
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

        {/* ── Chips historial ── */}
        {history.length > 0 && (
          <>
            <Text style={styles.chipsLabel}>Recent</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsScroll}
            >
              <View style={styles.chipsContainer}>
                {history.map((item) => (
                  <TouchableOpacity
                    style={styles.glassChip}
                    key={item}
                    onPress={() => {
                      setQuery(item);
                      searchFoods(item);
                    }}
                  >
                    <Text style={styles.chipText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </>
        )}

        {/* ── Resultados o Sugerencias ── */}
        <FlatList
          data={[]}
          keyExtractor={() => "header"}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={styles.flatlistScroll}
          renderItem={null}
          ListHeaderComponent={
            showSearch ? (
              // ── Modo búsqueda activa ──────────────────────────────────────
              <>
                {/* Best Match: resultados exactos */}
                {exactMatches.length > 0 && (
                  <>
                    <Text style={styles.subtitle}>Best Match</Text>
                    {exactMatches.map(renderCard)}
                  </>
                )}

                {/* More Results: resultados parciales */}
                {partialMatches.length > 0 && (
                  <>
                    <Text
                      style={[
                        styles.subtitle,
                        exactMatches.length > 0 && { marginTop: 18 },
                      ]}
                    >
                      More Results
                    </Text>
                    {partialMatches.map(renderCard)}
                  </>
                )}

                {/* Empty state */}
                {foods.length === 0 && !loading && (
                  <View style={styles.emptyWrap}>
                    <Ionicons name="search-outline" size={36} color="#AECDE3" />
                    <Text style={styles.emptyText}>No results found</Text>
                    <Text style={styles.emptySubtext}>
                      Try a different name or brand
                    </Text>
                  </View>
                )}
              </>
            ) : (
              // ── Modo sugerencias (pantalla vacía) ────────────────────────
              <>
                {loadingSuggestions ? (
                  <ActivityIndicator
                    size="small"
                    color="#7AAFD4"
                    style={{ marginTop: 20 }}
                  />
                ) : suggestions.length > 0 ? (
                  <>
                    <Text style={styles.subtitle}>Suggestions</Text>
                    {suggestions.map(renderCard)}
                  </>
                ) : null}
              </>
            )
          }
        />
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  title: {
    fontFamily: "DMSans_700Bold",
    fontSize: 26,
    letterSpacing: -1.8,
    color: "#5C788E",
    marginBottom: 16,
  },

  subtitle: {
    fontFamily: "DMSans_500Medium",
    fontSize: 15,
    letterSpacing: -0.8,
    color: "#5C788E",
    marginBottom: 12,
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
    paddingVertical: 0,
  },

  // ── Lista ────────────────────────────────────────────────────────────────────
  listContent: {
    paddingTop: 14,
    paddingBottom: 120,
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
    color: "#F5A47A",
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

  // ── Chips ────────────────────────────────────────────────────────────────────
  chipsLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#8aaabf",
    marginBottom: 8,
  },

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
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.7)",
  },

  chipText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#7a9ab5",
  },

  chipsScroll: {
    maxHeight: 60,
  },

  flatlistScroll: {
    maxHeight: 600,
  },
});
