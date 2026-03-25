// PostPopUp -> client\components\PostPopUp.tsx
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

type Props = {
  onClose: () => void;
};

type Card = {
  id: string;
  label: string;
  sublabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
};

const CARDS: Card[] = [
  {
    id: "search",
    label: "Buscar",
    sublabel: "Base de datos",
    icon: "search",
    color: "#3090FE",
    bg: "#d2e5ff",
  },
  {
    id: "barcode",
    label: "Código de Barras",
    sublabel: "Escanear producto",
    icon: "barcode-outline",
    color: "#ef4444",
    bg: "#ef444422",
  },
  {
    id: "voice",
    label: "Registro por Voz",
    sublabel: "Habla para registrar",
    icon: "mic",
    color: "#a855f7",
    bg: "#a855f722",
  },
  {
    id: "scan",
    label: "IA Scan",
    sublabel: "Foto del alimento",
    icon: "camera",
    color: "#10b981",
    bg: "#10b98122",
  },
];

export default function PostPopUp({ onClose }: Props) {
  const handleCard = (id: string) => {
    switch (id) {
      case "search":
        onClose(); // ← cierra el modal primero
        router.push("/(tabs)/quick_actions_menu/searchFoods"); // navegación secuencial
        console.log("Abrir búsqueda en DB");
        break;
      case "barcode":
        console.log("Abrir escáner de barras");
        break;
      case "voice":
        console.log("Iniciar grabación de voz");
        break;
      case "scan":
        console.log("Abrir cámara IA");
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Registrar</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color="#9098A3" />
        </TouchableOpacity>
      </View>

      {/* Cards Grid */}
      <View style={styles.body}>
        <View style={styles.grid}>
          {CARDS.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              onPress={() => handleCard(card.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrap, { backgroundColor: card.bg }]}>
                <Ionicons name={card.icon} size={26} color={card.color} />
              </View>
              <Text style={styles.cardLabel}>{card.label}</Text>
              <Text style={styles.cardSub}>{card.sublabel}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    color: "#3090FE",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47%",
    backgroundColor: "#FFFFFF", // ← blanco (antes #252b3b)
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 10,
    // sombra sutil para tema claro:
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    fontFamily: "DMSans_700Bold",
    fontSize: 13,
    color: "#1a1f2e", // ← oscuro (antes #e2e8f0)
    textAlign: "center",
  },
  cardSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#9098A3", // ← gris medio (antes #6b7280)
    textAlign: "center",
  },
});
