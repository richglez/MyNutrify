// ExploreScreen → app/(tabs)/explore.tsx

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

const { width } = Dimensions.get("window");
const GAP = 12;
const H_PADDING = 20;
const CARD_WIDTH = (width - H_PADDING * 2 - GAP) / 2;

const VEGETABLES = [
  {
    id: "1",
    name: "Broccoli",
    calories: "34 kcal",
    tag: "Antioxidant",
    color: "#2D6A4F",
    emoji: "🥦",
    bg: "#D8F3DC",
  },
  {
    id: "2",
    name: "Carrot",
    calories: "41 kcal",
    tag: "Rich in vitamin A",
    color: "#E76F00",
    emoji: "🥕",
    bg: "#FFF3E0",
  },
  {
    id: "3",
    name: "Spinach",
    calories: "23 kcal",
    tag: "High in iron",
    color: "#1B4332",
    emoji: "🌿",
    bg: "#B7E4C7",
  },
  {
    id: "4",
    name: "Pepper",
    calories: "31 kcal",
    tag: "Vitamin C",
    color: "#C1121F",
    emoji: "🫑",
    bg: "#FFE5E5",
  },
  {
    id: "5",
    name: "Eggplant",
    calories: "25 kcal",
    tag: "Anti-inflammatory",
    color: "#4A0E8F",
    emoji: "🍆",
    bg: "#EDE7F6",
  },
  {
    id: "6",
    name: "Tomato",
    calories: "18 kcal",
    tag: "Lycopene",
    color: "#B5161B",
    emoji: "🍅",
    bg: "#FFECEC",
  },
  {
    id: "7",
    name: "Avocado",
    calories: "160 kcal",
    tag: "Healthy fats",
    color: "#386641",
    emoji: "🥑",
    bg: "#DCEFD8",
  },
  {
    id: "8",
    name: "Cucumber",
    calories: "16 kcal",
    tag: "Moisturizing",
    color: "#52796F",
    emoji: "🥒",
    bg: "#CAD2C5",
  },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets(); // ← agregar esto
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);

  const filtered = VEGETABLES.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Split into rows of 2
  const rows: (typeof VEGETABLES)[] = [];
  for (let i = 0; i < filtered.length; i += 2) {
    rows.push(filtered.slice(i, i + 2));
  }

  // StatusBar en tabs con Expo Router .- Fuerza el estilo cada vez que esta tab recibe el foco
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("dark-content");
    }, []),
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, Ricardo 👋</Text>
            <Text style={styles.title}>Discover</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn}>
            <Text style={styles.avatarText}>R</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchWrap, focused && styles.searchFocused]}>
          <Ionicons
            name="search-outline"
            size={18}
            color={focused ? "#2d406a" : "#848d9e"}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vegetables…"
            placeholderTextColor="#848d9e"
            value={search}
            onChangeText={setSearch}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#A0A89B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories pill row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {["All", "Green leaf", "Roots", "Fruits", "Legumes"].map((cat, i) => (
            <TouchableOpacity
              key={cat}
              style={[styles.pill, i === 0 && styles.pillActive]}
            >
              <Text style={[styles.pillText, i === 0 && styles.pillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section header */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Vegetales</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        {/* Cards Grid — rows of 2 */}
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((veg) => (
              <TouchableOpacity
                key={veg.id}
                style={[styles.card, { backgroundColor: veg.bg }]}
                activeOpacity={0.85}
              >
                {/* Big emoji */}
                <Text style={styles.emoji}>{veg.emoji}</Text>

                {/* Tag chip */}
                <View
                  style={[styles.chip, { backgroundColor: veg.color + "22" }]}
                >
                  <Text style={[styles.chipText, { color: veg.color }]}>
                    {veg.tag}
                  </Text>
                </View>

                {/* Name & calories */}
                <Text style={[styles.vegName, { color: veg.color }]}>
                  {veg.name}
                </Text>
                <Text style={styles.vegCal}>{veg.calories}</Text>

                {/* Arrow */}
                <View style={[styles.arrowBtn, { backgroundColor: veg.color }]}>
                  <Ionicons name="arrow-forward" size={14} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
            {/* If odd number of cards, fill the empty slot */}
            {row.length === 1 && <View style={styles.cardPlaceholder} />}
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No se encontraron resultados</Text>
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F3",
  },
  scroll: {
    paddingHorizontal: H_PADDING,
    // sin paddingTop aquí
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  greeting: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: "#7A8573",
    marginBottom: 2,
  },
  title: {
    fontFamily: "DMSans_900Black",
    fontSize: 36,
    letterSpacing: -1.5,
    color: "#1C6BFF",
  },
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2E90FE",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  avatarText: {
    fontFamily: "DMSans_900Black",
    fontSize: 18,
    color: "#fff",
  },

  /* Search */
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEEE9",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  searchFocused: {
    borderColor: "#2E90FE",
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: "#1A2117",
  },

  /* Pills */
  pillRow: {
    paddingBottom: 20,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: "#EDEEE9",
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: "#3c97ff",
  },
  pillText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#7A8573",
  },
  pillTextActive: {
    color: "#fff",
    fontFamily: "DMSans_700Bold",
  },

  /* Section row */
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    color: "#0c60c0",
    letterSpacing: -0.5,
  },
  viewAll: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#2E90FE",
  },

  /* Grid rows */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: GAP,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    padding: 16,
    minHeight: 180,
    position: "relative",
    overflow: "hidden",
  },
  cardPlaceholder: {
    width: CARD_WIDTH,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    marginBottom: 6,
  },
  chipText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    letterSpacing: 0.2,
  },
  vegName: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  vegCal: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#7A8573",
  },
  arrowBtn: {
    position: "absolute",
    bottom: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Empty */
  empty: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: "#A0A89B",
  },
});
