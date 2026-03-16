// Sing In

import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    router.replace("/(tabs)"); // Navegar a la pantalla principal después del login
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

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
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
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
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

  input: {
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

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6fa",
    borderRadius: 12,
    paddingHorizontal: 12,
  },

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
