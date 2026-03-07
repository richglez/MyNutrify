import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    // Aquí luego puedes conectar tu API
    router.replace("/(tabs)");
  };

  return (
    <LinearGradient
      colors={["#1e6ee8", "#4aa3ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="white" />
      </Pressable>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Start tracking your nutrition today</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Full name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TextInput
          placeholder="Confirm password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => router.replace("/login")}>
        <Text style={styles.footer}>
          Already have an account?{" "}
          <Text style={{ fontWeight: "700" }}>Login</Text>
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
    fontSize: 36,
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
});
