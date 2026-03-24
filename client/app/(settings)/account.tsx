// AccountScreen -> client\app\(settings)\account.tsx
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { LinearGradient } from "expo-linear-gradient";

// Genera iniciales a partir del nombre completo
function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function AccountScreen() {
  const name = useAuthStore((s) => s.name);
  const email = useAuthStore((s) => s.email);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleLogout() {
    clearAuth();
    router.replace("/login"); // ← ajusta la ruta según tu estructura
  }

  function handleDeleteAccount() {
    // TODO: llamar al endpoint de eliminar cuenta en tu API
    // await deleteAccount(userId, token);
    clearAuth();
    router.replace("/login");
  }

  return (
    <LinearGradient
      colors={["#0A1628", "#0D2F6E", "#1255B8", "#2E90FE", "#7EC8FF"]}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      style={styles.container}
    >
      {/* ── Header ─────────────────────────────────── */}
      <View style={styles.headerRow}>
        <Pressable style={styles.back} onPress={router.back}>
          <Ionicons name="arrow-back" size={24} color="#dfedff" />
        </Pressable>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      {/* ── Avatar ─────────────────────────────────── */}
      <View style={styles.avatarWrapper}>
        <LinearGradient
          colors={["#2E90FE", "#0D2F6E"]}
          style={styles.avatarGradient}
        >
          <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
        </LinearGradient>
        <View style={styles.avatarRing} />
      </View>

      <Text style={styles.avatarName}>{name ?? "Account"}</Text>
      <Text style={styles.avatarEmail}>{email ?? ""}</Text>

      {/* ── Account details card ───────────────────── */}
      <Text style={styles.title}>Account details</Text>

      <View style={styles.card}>
        <View style={styles.fieldRow}>
          <Ionicons
            name="person-outline"
            size={18}
            color="#5ea9ff"
            style={styles.fieldIcon}
          />
          <View>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.userDataStyles}>{name ?? "—"}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldRow}>
          <Ionicons
            name="mail-outline"
            size={18}
            color="#5ea9ff"
            style={styles.fieldIcon}
          />
          <View>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.userDataStyles}>{email ?? "—"}</Text>
          </View>
        </View>
      </View>

      {/* ── Danger zone ────────────────────────────── */}
      <Text style={styles.dangerZoneLabel}>Danger zone</Text>

      <View style={styles.dangerCard}>
        {/* Logout */}
        <Pressable
          style={({ pressed }) => [
            styles.dangerRow,
            pressed && styles.dangerRowPressed,
          ]}
          onPress={handleLogout}
        >
          <View style={styles.dangerRowLeft}>
            <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
            <Text style={styles.dangerRowText}>Log out</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="rgba(255,107,107,0.5)"
          />
        </Pressable>

        <View style={styles.dangerDivider} />

        {/* Delete account */}
        <Pressable
          style={({ pressed }) => [
            styles.dangerRow,
            pressed && styles.dangerRowPressed,
          ]}
          onPress={() => setShowDeleteModal(true)}
        >
          <View style={styles.dangerRowLeft}>
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            <Text style={styles.dangerRowText}>Delete account</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="rgba(255,107,107,0.5)"
          />
        </Pressable>
      </View>

      {/* ── Modal confirmación eliminar cuenta ─────── */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Icono advertencia */}
            <View style={styles.modalIconWrapper}>
              <Ionicons name="warning-outline" size={32} color="#FF6B6B" />
            </View>

            <Text style={styles.modalTitle}>Delete account?</Text>
            <Text style={styles.modalBody}>
              Are you sure you want to delete this account?{"\n"}
              Changes cannot be undone.
            </Text>

            {/* Botones */}
            <View style={styles.modalActions}>
              {/* Cancelar */}
              <Pressable
                style={({ pressed }) => [
                  styles.modalBtnCancel,
                  pressed && styles.modalBtnCancelPressed,
                ]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </Pressable>

              {/* Confirmar eliminar */}
              <Pressable
                style={({ pressed }) => [
                  styles.modalBtnDelete,
                  pressed && styles.modalBtnDeletePressed,
                ]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.modalBtnDeleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },

  // ── Header ───────────────────────────────────────
  back: {
    padding: 8,
    marginLeft: -8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },

  headerTitle: {
    position: "absolute",
    left: 80,
    right: 80,
    fontFamily: "DMSans_600SemiBold",
    fontSize: 20,
    textAlign: "center",
    color: "#e7f2ff",
  },

  // ── Avatar ───────────────────────────────────────
  avatarWrapper: {
    alignSelf: "center",
    marginBottom: 12,
    position: "relative",
  },

  avatarGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarRing: {
    position: "absolute",
    top: -4,
    left: -4,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
  },

  avatarInitials: {
    fontSize: 32,
    fontFamily: "DMSans_700Bold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },

  avatarName: {
    textAlign: "center",
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 4,
  },

  avatarEmail: {
    textAlign: "center",
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#b7d9ff",
    marginBottom: 28,
  },

  // ── Info card ─────────────────────────────────────
  title: {
    fontFamily: "DMSans_900Black",
    fontSize: 22,
    letterSpacing: -1,
    color: "#FFFFFF",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginBottom: 28,
  },

  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 14,
  },

  fieldIcon: {
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  label: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    color: "#b7d9ff",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  userDataStyles: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
    color: "#FFFFFF",
  },

  // ── Danger zone ───────────────────────────────────
  dangerZoneLabel: {
    fontSize: 12,
    fontFamily: "DMSans_700Bold",
    color: "rgb(255, 107, 107)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },

  dangerCard: {
    backgroundColor: "rgba(255, 107, 107, 0.34)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.25)",
    overflow: "hidden",
  },

  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  dangerRowPressed: {
    backgroundColor: "rgba(255, 107, 107, 0.3)",
  },

  dangerRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  dangerRowText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    color: "#FF6B6B",
  },

  dangerDivider: {
    height: 1,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    marginHorizontal: 20,
  },

  // ── Modal ─────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  modalCard: {
    backgroundColor: "#0D1F4E",
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 28,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.59)",
  },

  modalIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.3)",
  },

  modalTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },

  modalBody: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#b7d9ff",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  modalBtnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
  },

  modalBtnCancelPressed: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  modalBtnCancelText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#e7f2ff",
  },

  modalBtnDelete: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#FF6B6B",
    alignItems: "center",
  },

  modalBtnDeletePressed: {
    backgroundColor: "#e05555",
  },

  modalBtnDeleteText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
});
