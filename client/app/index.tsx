// Splash Screen -> client\app\index.tsx
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";


const APP_NAME = "MyNutrify!".split("");
const LETTER_DELAY = 100; // ms entre cada letra
const LETTER_DURATION = 400; // duración de cada letra

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const letterAnims = useRef(
    APP_NAME.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(12),
    })),
  ).current;

  useEffect(() => {
    // 1. Logo aparece primero
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // 2. Letras aparecen una por una con delay escalonado
    const letterAnimations = letterAnims.map((anim, i) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: LETTER_DURATION,
          delay: 300 + i * LETTER_DELAY, // empieza después del logo
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: LETTER_DURATION,
          delay: 300 + i * LETTER_DELAY,
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.parallel(letterAnimations).start();

    // 3. Navegar después de que termine la animación
    const totalDuration =
      300 + APP_NAME.length * LETTER_DELAY + LETTER_DURATION + 600;
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, totalDuration);

    return () => clearTimeout(timer);
  }, []);



  return (
    <LinearGradient
      colors={["#3a5af9", "#2545e8", "#1a35d4"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <LinearGradient
        colors={["rgba(120,150,255,0.55)", "transparent"]}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 0.85 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.center}>
        {/* Logo */}
        <Animated.Image
          source={require("../assets/MyNutrify!logo-v2.png")}
          style={[styles.logo, { opacity: logoOpacity }]}
          resizeMode="contain"
        />

        {/* Letras animadas */}
        <View style={styles.letterRow}>
          {APP_NAME.map((letter, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.letter,
                {
                  opacity: letterAnims[i].opacity,
                  transform: [{ translateY: letterAnims[i].translateY }],
                },
              ]}
            >
              {letter}
            </Animated.Text>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  logo: {
    width: 72,
    height: 72,
  },
  letterRow: {
    flexDirection: "row",
  },
  letter: {
    fontSize: 36,
    fontWeight: "800",
    color: "white",
    letterSpacing: 1,
  },
});
