// Settings -> client\app\(tabs)\settings.tsx

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/useAuthStore";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.glassCard}>
      <View style={styles.glassHighlight} />
      {children}
    </View>
  );
}

// Setting Row Component
function SettingRow({
  icon,
  label,
  value,
  isLast = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  isLast?: boolean;
  onPress?: () => void;
}) {
  return (
    <>
      <Pressable style={styles.row} onPress={onPress}>
        <View style={styles.iconWrapper}>
          {/* iconos para settings */}
          <Ionicons name={icon} size={18} color="rgb(255, 255, 255)" />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <Ionicons
          name="chevron-forward"
          size={15}
          color="rgba(255,255,255,0.4)"
        />
      </Pressable>
      {!isLast && <View style={styles.divider} />}
    </>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const name = useAuthStore((s) => s.name);
  const clearAuth = useAuthStore((s) => s.clearAuth); // limpiar los datos del store

      // StatusBar en tabs con Expo Router .- Fuerza el estilo cada vez que esta tab recibe el foco
      useFocusEffect(
        useCallback(() => {
          StatusBar.setBarStyle("dark-content"); // ← método correcto
        }, []),
      );

  return (
    <LinearGradient
      colors={[
        "#0A2472",
        "#0D47A1",
        "#1976D2",
        "#42A5F5",
        "#90CAF9",
        "#E3F2FD",
        "#F8FBFF",
      ]}
      locations={[0, 0.12, 0.28, 0.45, 0.62, 0.8, 1]}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Menu Section</Text>
        </View>

        <GlassCard>
          <SettingRow
            icon="person-outline"
            label="Account"
            value={name ?? "Default User"} // Si el nombre es null o undefined, muestra "Default User, de lo contrario muestra el nombre real"
            onPress={() => router.push("/(settings)/account")} // Navega a la pantalla de cuenta
          />
          <SettingRow icon="notifications-outline" label="Notifications" />
          <SettingRow icon="lock-closed-outline" label="Privacy" isLast />
        </GlassCard>

        <GlassCard>
          <SettingRow
            icon="color-palette-outline"
            label="Appearance"
            value="Light"
          />
          <SettingRow
            icon="language-outline"
            label="Language"
            value="English"
          />
          <SettingRow icon="location-outline" label="Location" isLast />
        </GlassCard>

        <GlassCard>
          <SettingRow icon="help-circle-outline" label="Help & Support" />
          <SettingRow
            icon="information-circle-outline"
            label="About"
            value="v1.0.0"
            isLast
          />
        </GlassCard>
        {/* ── Log out ── */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          onPress={() => {
            clearAuth(); // ← limpia el store primero
            router.replace("/(auth)/welcome");
            console.log("Log out");
          }}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingTop: 64,
    gap: 14,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#F7FFF5",
    letterSpacing: -0.8,
    textShadowColor: "rgba(0,20,80,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
    fontWeight: "400",
  },
  glassCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(5, 30, 53, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
    shadowColor: "#767f9d",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  glassHighlight: {
    height: 1,
    backgroundColor: "rgba(0, 115, 255, 0.37)",
    marginHorizontal: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "rgb(143, 179, 223)",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15.5,
    color: "rgba(255,255,255,0.92)",
    fontWeight: "500",
  },
  rowValue: {
    fontSize: 13.5,
    color: "rgba(255,255,255,0.50)",
    marginRight: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginLeft: 58,
    marginRight: 14,
  },

  logoutButton: {
    alignSelf: "center",
    backgroundColor: "#2E90FE",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 50,
    marginTop: 10,
    shadowColor: "#2E90FE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  logoutButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  logoutText: {
    color: "white",
    fontSize: 13.5,
    fontFamily: "DMSans_700Bold",
    letterSpacing: 0.2,
  },
});
