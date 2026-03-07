// app/index.tsx
// Welcome - Pantalla inicial de bienvenida con opciones para iniciar sesión o registrarse

import { Text, StyleSheet, Pressable, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={["#0f3fb8", "#4aa3ff"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>MyNutrify</Text>
        <Text style={styles.subtitle}>Track your calories easily with AI</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable
          style={styles.signInButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </Pressable>

        <Pressable
          style={styles.registerButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.registerText}>Register</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 40,
  },

  content: {
    marginTop: 120,
  },

  title: {
    fontSize: 48,
    fontWeight: "800",
    color: "white",
  },

  subtitle: {
    fontSize: 18,
    marginTop: 10,
    color: "rgba(255,255,255,0.85)",
  },

  buttons: {
    gap: 16,
  },

  signInButton: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  signInText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e6ee8",
  },

  registerButton: {
    borderWidth: 2,
    borderColor: "white",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  registerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
});
