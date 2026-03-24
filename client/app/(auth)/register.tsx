// SingUp -> client\app\(auth)\register.tsx
import { View, Text, TextInput, StyleSheet, Pressable, StatusBar } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { registerUser } from "@/services/db";
import { useAuthStore } from "@/store/useAuthStore";
import { useCallback } from "react";

// ── Helpers de validación ──────────────────────────────────────────────────────
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPassword = (v: string) => v.length >= 8;
const isValidName = (v: string) => v.trim().length >= 2;

type FieldState = "idle" | "valid" | "invalid";

function getFieldState(
  value: string,
  validator: (v: string) => boolean,
): FieldState {
  if (value.length === 0) return "idle";
  return validator(value) ? "valid" : "invalid";
}

// ── Sub-componente: icono de estado del campo ──────────────────────────────────
function FieldStatusIcon({ state }: { state: FieldState }) {
  if (state === "idle") return null;
  if (state === "valid")
    return (
      <View style={styles.iconValid}>
        <Ionicons name="checkmark" size={14} color="white" />
      </View>
    );
  return (
    <View style={styles.iconInvalid}>
      <Text style={styles.iconInvalidText}>!</Text>
    </View>
  );
}

// ── Sub-componente: mensaje de error ──────────────────────────────────────────
function ErrorBanner({ message }: { message: string }) {
  return (
    <View style={styles.errorBanner}>
      <Text style={styles.errorBannerText}>{message}</Text>
    </View>
  );
}

// ── Pantalla principal ─────────────────────────────────────────────────────────
export default function RegisterScreen() {
  // ── Estados ───────────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTaken, setEmailTaken] = useState(false); // simula email en uso
  const [showPassword, setShowPassword] = useState(false);
  // ─────────────────────────────────────────────────────────────────────────────

  // StatusBar Light
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
    }, []),
  );

  // ── Store de autenticación ─────────────────────────────────────────────────────────
  const setAuth = useAuthStore((s) => s.setAuth);

  // Estados derivados
  const nameState = getFieldState(name, isValidName);
  const emailState: FieldState =
    email.length === 0
      ? "idle"
      : emailTaken
        ? "invalid"
        : isValidEmail(email)
          ? "valid"
          : "invalid";
  const passwordState = getFieldState(password, isValidPassword);

  // Validacion del formualrio ---
  const formIsValid =
    nameState === "valid" &&
    emailState === "valid" &&
    passwordState === "valid";
  //Mientras no se cumplan los tres, el botón tiene disabled={true} + color gris + sin sombra

  // Mensaje de error por campo
  const nameError =
    nameState === "invalid"
      ? "El nombre debe tener al menos 2 caracteres."
      : null;
  const emailError =
    emailState === "invalid"
      ? emailTaken
        ? "Este correo ya está en uso. Intenta con otro."
        : "Ingresa un correo electrónico válido."
      : null;
  const passwordError =
    passwordState === "invalid"
      ? "La contraseña debe tener al menos 8 caracteres."
      : null;

  const handleRegister = async () => {
    if (!formIsValid) return;
    try {
      const data = await registerUser(name, email, password);
      setAuth(data.userId, data.token, name, email); // guarda estos datos en el store
      router.replace({ pathname: "/(onboarding)/step1-goal" });
    } catch (err: any) {
      // Si el backend responde que el email ya existe
      if (err?.status === 400 || err?.message?.includes("email")) {
        setEmailTaken(true);
      }
    }
  };

  return (
    <LinearGradient
      colors={["#1e6ee8", "#4aa3ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={26} color="white" />
      </Pressable>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Start tracking your nutrition today</Text>

      <View style={styles.card}>
        {/* ── Name ── */}
        <Text style={styles.label}>Your Name</Text>
        <View
          style={[
            styles.inputContainer,
            nameState === "invalid" && styles.inputError,
          ]}
        >
          <Ionicons name="person-outline" size={20} color="#666" />
          <TextInput
            placeholder="Full name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={(t) => setName(t)}
            style={styles.input}
          />
          <FieldStatusIcon state={nameState} />
        </View>
        {nameError && <ErrorBanner message={nameError} />}

        {/* ── Email ── */}
        <Text style={styles.label}>Email</Text>
        <View
          style={[
            styles.inputContainer,
            emailState === "invalid" && styles.inputError,
          ]}
        >
          <Ionicons name="mail-outline" size={20} color="#666" />
          <TextInput
            placeholder="example@gmail.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setEmailTaken(false);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <FieldStatusIcon state={emailState} />
        </View>
        {emailError && <ErrorBanner message={emailError} />}

        {/* ── Password ── */}
        <Text style={styles.label}>Password</Text>
        <View
          style={[
            styles.inputContainer,
            passwordState === "invalid" && styles.inputError,
          ]}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <TextInput
            placeholder="************"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          {/* ── Botón del ojo ── */}
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            style={{ marginRight: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </Pressable>
          <FieldStatusIcon state={passwordState} />
        </View>
        {passwordError && <ErrorBanner message={passwordError} />}

        {/* ── Botón ── */}
        <Pressable
          style={[styles.button, !formIsValid && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={!formIsValid}
        >
          <Text
            style={[
              styles.buttonText,
              !formIsValid && styles.buttonTextDisabled,
            ]}
          >
            Create Account
          </Text>
        </Pressable>
      </View>

      <Pressable onPress={() => router.replace("/login")}>
        <Text style={styles.footer}>
          Already have an account?{" "}
          <Text style={{ fontFamily: "DMSans_800ExtraBold" }}>Login</Text>
        </Text>
      </Pressable>
    </LinearGradient>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },

  backButton: { position: "absolute", top: 60, left: 24 },

  title: {
    fontSize: 36,
    fontFamily: "DMSans_900Black",
    textAlign: "center",
    color: "white",
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 40,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  label: { fontSize: 14, fontFamily: "DMSans_600SemiBold", color: "#333" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: "#e53935",
    backgroundColor: "#fff5f5",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 14,
    fontFamily: "DMSans_300Light",
    fontSize: 16,
  },

  // ── Icono válido (verde) ──
  iconValid: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Icono inválido (rojo con !) ──
  iconInvalid: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: "#e53935",
    alignItems: "center",
    justifyContent: "center",
  },
  iconInvalidText: {
    color: "white",
    fontWeight: "900",
    fontSize: 14,
    lineHeight: 16,
  },

  // ── Banner de error ──
  errorBanner: {
    backgroundColor: "#e53935",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: -2,
  },
  errorBannerText: {
    color: "white",
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
  },

  // ── Botón activo ──
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
    fontFamily: "DMSans_900Black",
    color: "white",
    fontSize: 16,
  },

  // ── Botón deshabilitado ──
  buttonDisabled: {
    backgroundColor: "#b0c4de",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonTextDisabled: {
    color: "rgba(255,255,255,0.6)",
  },

  footer: {
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    marginTop: 30,
    color: "rgba(255,255,255,0.9)",
  },
});
