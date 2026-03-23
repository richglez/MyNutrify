// Sign In -> client\app\(auth)\login.tsx

import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { loginUser } from "@/services/db";
import { useAuthStore } from "@/store/useAuthStore";

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

// ── Helpers ───────────────────────────────────────────────────────────────────
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type FieldError =
  | "email_format"
  | "email_not_found"
  | "password_wrong"
  | "password_empty"
  | null;

function ErrorBanner({ message }: { message: string }) {
  return (
    <View style={styles.errorBanner}>
      <Text style={styles.errorBannerText}>{message}</Text>
    </View>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────
export default function LoginScreen() {
  // ── Estados ──────────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<FieldError>(null);
  const [passwordError, setPasswordError] = useState<FieldError>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // ──────────────────────────────────────────────────────────────────────

  // Validacion del formualrio ---
  const formIsValid = email.trim() !== ""; // diferente de vacio

  // ── Store de autenticación ──
  const setAuth = useAuthStore((s) => s.setAuth);

  // Mensajes de error legibles
  const emailErrorMsg: Record<string, string> = {
    email_format: "Ingresa un correo electrónico válido.",
    email_not_found: "No existe una cuenta con este correo.",
  };
  const passwordErrorMsg: Record<string, string> = {
    password_empty: "Ingresa tu contraseña.",
    password_wrong: "Contraseña incorrecta.",
  };

  const handleLogin = async () => {
    // ── Validaciones locales antes de hacer fetch ──
    let hasError = false;

    if (!isValidEmail(email)) {
      setEmailError("email_format");
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (password.length === 0) {
      setPasswordError("password_empty");
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) return;

    // ── Llamada al backend ──
    try {
      setLoading(true);
      const data = await loginUser(email, password);
      setAuth(data.userId, data.token);
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log("ERROR:", JSON.stringify(err)); // ← agrega esto
      const msg = err?.message;
      if (msg === "email_not_found") {
        setEmailError("email_not_found");
      } else if (msg === "password_wrong") {
        setPasswordError("password_wrong");
      } else {
        setEmailError("email_not_found");
        setPasswordError("password_wrong");
      }
    } finally {
      setLoading(false);
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
        onPress={() => router.replace("/welcome")}
      >
        <Ionicons name="arrow-back" size={26} color="white" />
      </Pressable>

      <Text style={styles.title}>MyNutrify!</Text>
      <Text style={styles.subtitle}>Track your calories easily with AI</Text>

      <View style={styles.card}>
        {/* ── Email ── */}
        <Text style={styles.label}>Email</Text>
        <View style={[styles.inputContainer, emailError && styles.inputError]}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <TextInput
            placeholder="example@gmail.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setEmailError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          {emailError && (
            <Ionicons name="alert-circle" size={20} color="#e53935" />
          )}
        </View>
        {emailError && <ErrorBanner message={emailErrorMsg[emailError]} />}

        {/* ── Password ── */}
        <Text style={styles.label}>Password</Text>
        <View
          style={[styles.inputContainer, passwordError && styles.inputError]}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <TextInput
            placeholder="************"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword} // ← controla la visibilidad de la contraseña
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setPasswordError(null);
            }}
            style={styles.input}
          />

          {/* ── Botón del ojo ── */}
          <Pressable onPress={() => setShowPassword((prev) => !prev)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </Pressable>

          {passwordError && (
            <Ionicons name="alert-circle" size={20} color="#e53935" />
          )}
        </View>
        {passwordError && (
          <ErrorBanner message={passwordErrorMsg[passwordError]} />
        )}

        {/* ── Login button ── */}
        <Pressable
          style={[
            styles.button,
            (loading || !formIsValid) && styles.buttonDisabled, // aplica estilo deshabilitado si está cargando o el form no es válido
          ]}
          onPress={handleLogin}
          disabled={loading || !formIsValid} // si el form no es válido o si está cargando, deshabilita el botón
        >
          <Text
            style={[
              styles.buttonText,
              !formIsValid && styles.buttonTextDisabled, // aplica estilo de texto deshabilitado si el form no es válido
            ]}
          >
            {loading ? "Iniciando..." : "Login"}
          </Text>
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
          <Text style={{ fontFamily: "DMSans_800ExtraBold" }}>Sign up</Text>
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
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  label: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    color: "#333",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5, //
    borderColor: "transparent",
  },

  input: {
    fontFamily: "DMSans_400Regular",
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
    fontFamily: "DMSans_900Black", // botones
    color: "white",
    fontSize: 16,
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
    fontFamily: "DMSans_500Medium",
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
    fontFamily: "DMSans_400Regular",
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

  // ── Botón deshabilitado ──
  buttonDisabled: {
    backgroundColor: "#b0c4de",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonTextDisabled: {
    color: "rgba(255,255,255,0.6)",
  },

  // ── Banner de error ──
  errorBanner: {
    backgroundColor: "#e53935",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: -4,
  },

  errorBannerText: {
    color: "white",
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
  },

  inputError: {
    borderColor: "#e53935",
    backgroundColor: "#fff5f5",
  },
});
