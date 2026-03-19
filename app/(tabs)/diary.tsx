// app/(tabs)/diary.tsx
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DiaryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Diary</Text>
      </View>

      {/* ── Contenido ── */}
      <View style={styles.body}>{/* aquí irá tu contenido */}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },

  title: {
    fontFamily: "DMSans_900Black", // títulos
    fontSize: 28,
    letterSpacing: -1.0,
    color: "#3090FE",
  },

  body: {
    fontFamily: "DMSans_400Regular", // texto normal
    flex: 1,
    paddingHorizontal: 24,
  },
});
