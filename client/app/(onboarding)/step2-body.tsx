// client\app\(onboarding)\step2-body.tsx

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import GoalIllustration from "@/assets/images/onboarding_body_illustration.svg";

type Sex = "male" | "female";

export default function Step2Body() {
  const { goal } = useLocalSearchParams();

  const [sex, setSex] = useState<Sex | null>(null);
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  const handleContinue = () => {
    router.push({
      pathname: "/(onboarding)/step3-done",
      params: { goal, sex, age, weight, height }, // ✅ manda todos estos parametros al siguiente paso
    });
  };

  return (
    <View style={styles.container}>
      {/* Header row: flecha + progress */}
      <View style={styles.headerRow}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#2E90FE" />
        </Pressable>
        <View style={styles.progressRow}>
          <View style={[styles.progressBar, styles.progressActive]} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
        </View>
      </View>

      {/* Header */}
      <Text style={styles.step}>Paso 2 de 3</Text>
      <Text style={styles.title}>Cuéntanos sobre ti</Text>
      <Text style={styles.subtitle}>
        Usamos estos datos para calcular tus necesidades nutricionales.
      </Text>

      <GoalIllustration height={190} style={styles.illustrationContainer} />

      {/* Sexo */}
      <Text style={styles.label}>Sexo</Text>
      <View style={styles.sexRow}>
        <TouchableOpacity
          style={[styles.sexBtn, sex === "male" && styles.sexBtnSelected]}
          onPress={() => setSex("male")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.sexBtnText,
              sex === "male" && styles.sexBtnTextSelected,
            ]}
          >
            ♂ Masculino
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sexBtn, sex === "female" && styles.sexBtnSelected]}
          onPress={() => setSex("female")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.sexBtnText,
              sex === "female" && styles.sexBtnTextSelected,
            ]}
          >
            ♀ Femenino
          </Text>
        </TouchableOpacity>
      </View>

      {/* Edad */}
      <View style={styles.sliderBlock}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderName}>Edad</Text>
          <Text style={styles.sliderValue}>
            <Text style={styles.sliderNumber}>{age}</Text>
            <Text style={styles.sliderUnit}> años</Text>
          </Text>
        </View>
        <Slider
          minimumValue={10}
          maximumValue={80}
          step={1}
          value={age}
          onValueChange={setAge}
          minimumTrackTintColor={PRIMARY}
          maximumTrackTintColor={PRIMARY_LIGHT}
          thumbTintColor={PRIMARY}
        />
      </View>

      {/* Peso */}
      <View style={styles.sliderBlock}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderName}>Peso</Text>
          <Text style={styles.sliderValue}>
            <Text style={styles.sliderNumber}>{weight}</Text>
            <Text style={styles.sliderUnit}> kg</Text>
          </Text>
        </View>
        <Slider
          minimumValue={30}
          maximumValue={200}
          step={1}
          value={weight}
          onValueChange={setWeight}
          minimumTrackTintColor={PRIMARY}
          maximumTrackTintColor={PRIMARY_LIGHT}
          thumbTintColor={PRIMARY}
        />
      </View>

      {/* Altura */}
      <View style={styles.sliderBlock}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderName}>Altura</Text>
          <Text style={styles.sliderValue}>
            <Text style={styles.sliderNumber}>{height}</Text>
            <Text style={styles.sliderUnit}> cm</Text>
          </Text>
        </View>
        <Slider
          minimumValue={100}
          maximumValue={220}
          step={1}
          value={height}
          onValueChange={setHeight}
          minimumTrackTintColor={PRIMARY}
          maximumTrackTintColor={PRIMARY_LIGHT}
          thumbTintColor={PRIMARY}
        />
      </View>

      {/* Botón */}
      <TouchableOpacity
        style={[styles.btn, !sex && styles.btnDisabled]}
        onPress={handleContinue}
        disabled={!sex}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>Continuar</Text>
      </TouchableOpacity>

      {/* Skip */}
      <TouchableOpacity onPress={() => router.push("/(onboarding)/step3-done")}>
        <Text style={styles.skip}>Omitir por ahora</Text>
      </TouchableOpacity>
    </View>
  );
}

const PRIMARY = "#2E90FE";
const PRIMARY_LIGHT = "#E6F1FB";
const PRIMARY_DARK = "#0C447C";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },

  // Progress
  progressRow: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    marginLeft: 12, // gap entre botón y barras
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 99,
    backgroundColor: PRIMARY_LIGHT,
  },
  progressActive: {
    backgroundColor: PRIMARY,
  },

  // Header
  step: {
    fontSize: 13,
    color: "#888",
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#111",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    lineHeight: 22,
    marginBottom: 8
  },

  // Sexo
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  sexRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  sexBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  sexBtnSelected: {
    borderWidth: 2,
    borderColor: PRIMARY,
    backgroundColor: PRIMARY_LIGHT,
  },
  sexBtnText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
  },
  sexBtnTextSelected: {
    color: PRIMARY_DARK,
  },

  // Sliders
  sliderBlock: {
    marginBottom: 28,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  sliderName: {
    fontSize: 14,
    color: "#888",
  },
  sliderValue: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  sliderNumber: {
    fontSize: 22,
    fontWeight: "500",
    color: PRIMARY,
  },
  sliderUnit: {
    fontSize: 13,
    color: "#888",
  },

  // Botón
  btn: {
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  // Skip
  skip: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 13,
    color: "#888",
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    // ← sin position: absolute
  },

  illustrationContainer: {
    alignSelf: "center",
    marginBottom: -4,
  },
});
