// Settings -> app/(tabs)/settings.tsx

import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.glassCard}>
      <View style={styles.glassHighlight} />
      {children}
    </View>
  );
}

function SettingRow({
  icon,
  label,
  value,
  isLast = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  isLast?: boolean;
}) {
  return (
    <>
      <View style={styles.row}>
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={18} color="rgba(255,255,255,0.9)" />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <Ionicons
          name="chevron-forward"
          size={15}
          color="rgba(255,255,255,0.4)"
        />
      </View>
      {!isLast && <View style={styles.divider} />}
    </>
  );
}

export default function SettingsScreen() {
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
      <StatusBar backgroundColor="transparent" translucent />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Menu Section</Text>
        </View>

        <GlassCard>
          <SettingRow
            icon="person-outline"
            label="Account"
            value="Ricardo Gonzalez"
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
    color: "#FFFFFF",
    letterSpacing: -0.8,
    textShadowColor: "rgba(0,20,80,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
    fontWeight: "400",
  },
  glassCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(5, 30, 53, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    shadowColor: "#1a4fff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  glassHighlight: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.45)",
    marginHorizontal: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.15)",
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
});
