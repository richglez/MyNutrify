// app/login.tsx — Sign In

import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";

// ── Google "G" con colores oficiales ──────────────────────────────────────────
function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {/* Rojo */}
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      {/* Verde */}
      <Path
        fill="#34A853"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      {/* Amarillo */}
      <Path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      {/* Azul */}
      <Path
        fill="#4285F4"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      {/* Blanco central (hueco de la G) */}
      <Path fill="#fff" d="M0 0h48v48H0z" opacity="0" />
    </Svg>
  );
}


// ── Botón social solo icono ───────────────────────────────────────────────────
function SocialButton({
  icon,
  onPress,
}: {
  icon: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.socialButton,
        pressed && styles.socialButtonPressed,
      ]}
      onPress={onPress}
    >
      {icon}
    </Pressable>
  );
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    router.replace("/(tabs)");
  };

  return (
    <LinearGradient
      colors={["#1e6ee8", "#4aa3ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Pressable style={styles.backButton} onPress={() => router.replace("/")}>
        <Ionicons name="arrow-back" size={26} color="white" />
      </Pressable>

      <Text style={styles.title}>MyNutrify!</Text>
      <Text style={styles.subtitle}>Track your calories easily with AI</Text>

      <View style={styles.card}>
        {/* ── Email ── */}
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <TextInput
            placeholder="example@gmail.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        {/* ── Password ── */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <TextInput
            placeholder="************"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
        </View>

        {/* ── Login button ── */}
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        {/* ── Divider ── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Social buttons ── */}
        <View style={styles.socialRow}>
          {/* Google */}
          <SocialButton icon={<GoogleG size={24} />} />

          {/* X */}
          <SocialButton
            icon={<Ionicons name="logo-x" size={24} color="#111" />}
          />

          {/* Apple */}
          <SocialButton
            icon={<Ionicons name="logo-apple" size={24} color="#111" />}
          />
        </View>
      </View>

      <Pressable onPress={() => router.push("/register")}>
        <Text style={styles.footer}>
          Don't have an account?{" "}
          <Text style={{ fontWeight: "700" }}>Sign up</Text>
        </Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 40,
    fontWeight: "800",
    textAlign: "center",
    color: "white",
    marginBottom: 6,
  },

  subtitle: {
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 40,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6fa",
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  input: {
    flex: 1,
    backgroundColor: "#f4f6fa",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#2E93FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#2E93FF",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  // ── Divider ──────────────────────────────
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e4ee",
  },

  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },

  // ── Social row ───────────────────────────
  socialRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },

  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e0e4ee",
    backgroundColor: "#fafbff",
  },

  socialButtonPressed: {
    backgroundColor: "#f0f3ff",
    borderColor: "#c0c8e0",
  },

  socialButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },

  // Google "G"
  googleIcon: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  googleLetterBlue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#4285F4",
  },

  // X logo
  xIconWrapper: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  xLetter: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  // ── Footer ───────────────────────────────
  footer: {
    textAlign: "center",
    marginTop: 30,
    color: "rgba(255,255,255,0.9)",
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
  },

  backText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
