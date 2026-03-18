// components/BottomNavBar.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Svg, { Path, Circle, Rect } from "react-native-svg";

const BLUE = "#1A6BFF";
const BLUE_DARK = "#1452CC";
const WHITE = "#FFFFFF";
const INACTIVE = "rgba(255,255,255,0.55)";

// ─── Íconos ───────────────────────────────────────────────────────────────────

const IconHome = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
      fill={color}
    />
  </Svg>
);

const IconAnalytics = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="12" width="4" height="9" rx="1" fill={color} />
    <Rect x="10" y="7" width="4" height="14" rx="1" fill={color} />
    <Rect x="17" y="3" width="4" height="18" rx="1" fill={color} />
  </Svg>
);

const IconPlus = ({ color }: { color: string }) => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Path d="M14 6V22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M6 14H22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const IconGlobe = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path
      d="M12 3C12 3 8 7 8 12C8 17 12 21 12 21"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M12 3C12 3 16 7 16 12C16 17 12 21 12 21"
      stroke={color}
      strokeWidth="2"
    />
    <Path d="M3 12H21" stroke={color} strokeWidth="2" />
  </Svg>
);

const IconSettings = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M19.4 15C19.1 15.6 19.3 16.4 19.8 16.9L19.9 17C20.3 17.4 20.3 18 19.9 18.4L18.4 19.9C18 20.3 17.4 20.3 17 19.9L16.9 19.8C16.4 19.3 15.6 19.1 15 19.4C14.4 19.7 14 20.3 14 21V21.2C14 21.7 13.6 22 13.2 22H10.8C10.4 22 10 21.7 10 21.2V21C10 20.3 9.6 19.7 9 19.4C8.4 19.1 7.6 19.3 7.1 19.8L7 19.9C6.6 20.3 6 20.3 5.6 19.9L4.1 18.4C3.7 18 3.7 17.4 4.1 17L4.2 16.9C4.7 16.4 4.9 15.6 4.6 15C4.3 14.4 3.7 14 3 14H2.8C2.3 14 2 13.6 2 13.2V10.8C2 10.4 2.3 10 2.8 10H3C3.7 10 4.3 9.6 4.6 9C4.9 8.4 4.7 7.6 4.2 7.1L4.1 7C3.7 6.6 3.7 6 4.1 5.6L5.6 4.1C6 3.7 6.6 3.7 7 4.1L7.1 4.2C7.6 4.7 8.4 4.9 9 4.6C9.6 4.3 10 3.7 10 3V2.8C10 2.3 10.4 2 10.8 2H13.2C13.6 2 14 2.3 14 2.8V3C14 3.7 14.4 4.3 15 4.6C15.6 4.9 16.4 4.7 16.9 4.2L17 4.1C17.4 3.7 18 3.7 18.4 4.1L19.9 5.6C20.3 6 20.3 6.6 19.9 7L19.8 7.1C19.3 7.6 19.1 8.4 19.4 9C19.7 9.6 20.3 10 21 10H21.2C21.7 10 22 10.4 22 10.8V13.2C22 13.6 21.7 14 21.2 14H21C20.3 14 19.7 14.4 19.4 15Z"
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

// ─── Mapas ────────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.FC<{ color: string }>> = {
  index: IconHome,
  analytics: IconAnalytics,
  post: IconPlus,
  explore: IconGlobe,
  settings: IconSettings,
};

const LABEL_MAP: Record<string, string> = {
  index: "Dashboard",
  analytics: "Analytics",
  post: "",
  explore: "Explore",
  settings: "Settings",
};

// ─── Componente ───────────────────────────────────────────────────────────────
export default function BottomNavBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isActive = state.index === index;
          const isFab = route.name === "post";

          const Icon = ICON_MAP[route.name] ?? IconHome;
          const label = LABEL_MAP[route.name] ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isActive && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // ── FAB central ───────────────────────────────────────────────────
          if (isFab) {
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.fabWrapper}
                onPress={onPress}
                activeOpacity={0.85}
              >
                <View style={[styles.fab, isActive && styles.fabActive]}>
                  <Icon color={WHITE} />
                </View>
              </TouchableOpacity>
            );
          }

          // ── Tab normal ────────────────────────────────────────────────────
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={onPress}
              activeOpacity={0.7}
            >
              {/* Contenedor unificado: pill + ícono centrados juntos */}
              <View style={styles.iconContainer}>
                {isActive && <View style={styles.activePill} />}
                <View style={styles.iconWrap}>
                  <Icon color={isActive ? WHITE : INACTIVE} />
                </View>
              </View>

              {label ? (
                <Text style={[styles.label, isActive && styles.labelActive]}>
                  {label}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const { width } = Dimensions.get("window");

// Safe area bottom padding por plataforma
const BOTTOM_PADDING = Platform.select({
  ios: 24, // respeta el home indicator de iPhone
  android: 12, // padding estándar para Android
  default: 12,
});

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: BOTTOM_PADDING,
    backgroundColor: "transparent",
    // overflow visible para que el FAB sobresalga en Android sin cortarse
    overflow: "visible",
  },

  bar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BLUE,
    borderRadius: 36,
    width: width - 32,
    paddingVertical: 10,
    paddingHorizontal: 8,
    // Sombra iOS
    shadowColor: BLUE_DARK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    // Sombra Android
    elevation: 16,
    overflow: "visible",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },

  // ── CLAVE: contenedor que engloba pill + ícono ──────────────────────────
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  // El pill queda absolute dentro de iconContainer → siempre centrado
  activePill: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    // Sin top/left/right: se centra solo dentro de iconContainer
  },

  iconWrap: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 10,
    marginTop: 2,
    color: INACTIVE,
    fontWeight: "500",
    letterSpacing: 0.3,
    // Evitar que el texto se corte en pantallas pequeñas
    includeFontPadding: false, // Android: elimina padding extra del texto
    textAlignVertical: "center", // Android: alineación vertical correcta
  },

  labelActive: {
    color: WHITE,
    fontWeight: "700",
  },

  fabWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // El FAB sube por encima de la barra
    marginTop: Platform.select({
      ios: -16, // antes: -28
      android: -16, // antes: -28
      default: -16,
    }),
  },

  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE_DARK,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12, // ← baja el círculo para compensar el wrapper elevado
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 3,
    borderColor: WHITE,
  },

  fabActive: {
    backgroundColor: "#0A3EAB",
  },
});
