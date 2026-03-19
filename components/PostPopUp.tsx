// components/PostPopUp.tsx
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onClose: () => void;
};

export default function PostPopUp({ onClose }: Props) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Registrar</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color="#9098A3" />
        </TouchableOpacity>
      </View>

      {/* Contenido — aquí irá lo que quieras */}
      <View style={styles.body}>
        <Text style={styles.placeholder}>Aquí va tu contenido 🚀</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: "#9098A3",
  },
});
