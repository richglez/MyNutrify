// BottomNavBar -> client\components\BottomNavBar.tsx
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
import { NavBarProps } from "../types/navigation";

// ─── Colores ──────────────────────────────────────────────────────────────────
const BLUE = "#1A6BFF";
const BLUE_DARK = "#1452CC";
const WHITE = "#FFFFFF";
const ACTIVE_COLOR = "#1A6BFF"; // ícono + label activo
const INACTIVE_COLOR = "#525965"; // ícono + label inactivo (gris)
const BAR_BG = "#FFFFFF"; // fondo blanco, como la imagen
const BAR_SHADOW = "#000000";

// ─── Íconos ───────────────────────────────────────────────────────────────────

const IconHome = ({ color }: { color: string }) => (
  <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
      fill={color}
    />
  </Svg>
);

const IconDiary = ({ color }: { color: string }) => (
  <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
    <Rect
      x="4"
      y="2"
      width="14"
      height="19"
      rx="2"
      stroke={color}
      strokeWidth="1.8"
    />
    <Path
      d="M4 2C4 2 3 2 3 4V20C3 22 4 22 4 22"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Path d="M8 8H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M8 12H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M8 16H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const IconPlus = ({ color }: { color: string }) => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Path d="M14 6V22" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    <Path d="M6 14H22" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
  </Svg>
);

const IconGlobe = ({ color }: { color: string }) => (
  <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
    <Path
      d="M12 3C12 3 8 7 8 12C8 17 12 21 12 21"
      stroke={color}
      strokeWidth="1.8"
    />
    <Path
      d="M12 3C12 3 16 7 16 12C16 17 12 21 12 21"
      stroke={color}
      strokeWidth="1.8"
    />
    <Path d="M3 12H21" stroke={color} strokeWidth="1.8" />
  </Svg>
);

const IconSettings = ({ color }: { color: string }) => (
  <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke={color}
      strokeWidth="1.8"
    />
    <Path
      d="M19.4 15C19.1 15.6 19.3 16.4 19.8 16.9L19.9 17C20.3 17.4 20.3 18 19.9 18.4L18.4 19.9C18 20.3 17.4 20.3 17 19.9L16.9 19.8C16.4 19.3 15.6 19.1 15 19.4C14.4 19.7 14 20.3 14 21V21.2C14 21.7 13.6 22 13.2 22H10.8C10.4 22 10 21.7 10 21.2V21C10 20.3 9.6 19.7 9 19.4C8.4 19.1 7.6 19.3 7.1 19.8L7 19.9C6.6 20.3 6 20.3 5.6 19.9L4.1 18.4C3.7 18 3.7 17.4 4.1 17L4.2 16.9C4.7 16.4 4.9 15.6 4.6 15C4.3 14.4 3.7 14 3 14H2.8C2.3 14 2 13.6 2 13.2V10.8C2 10.4 2.3 10 2.8 10H3C3.7 10 4.3 9.6 4.6 9C4.9 8.4 4.7 7.6 4.2 7.1L4.1 7C3.7 6.6 3.7 6 4.1 5.6L5.6 4.1C6 3.7 6.6 3.7 7 4.1L7.1 4.2C7.6 4.7 8.4 4.9 9 4.6C9.6 4.3 10 3.7 10 3V2.8C10 2.3 10.4 2 10.8 2H13.2C13.6 2 14 2.3 14 2.8V3C14 3.7 14.4 4.3 15 4.6C15.6 4.9 16.4 4.7 16.9 4.2L17 4.1C17.4 3.7 18 3.7 18.4 4.1L19.9 5.6C20.3 6 20.3 6.6 19.9 7L19.8 7.1C19.3 7.6 19.1 8.4 19.4 9C19.7 9.6 20.3 10 21 10H21.2C21.7 10 22 10.4 22 10.8V13.2C22 13.6 21.7 14 21.2 14H21C20.3 14 19.7 14.4 19.4 15Z"
      stroke={color}
      strokeWidth="1.8"
    />
  </Svg>
);

// ─── Mapas ────────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.FC<{ color: string }>> = {
  index: IconHome,
  diary: IconDiary,
  quick_actions_menu: IconPlus,
  explore: IconGlobe,
  settings: IconSettings,
};

const LABEL_MAP: Record<string, string> = {
  index: "Home",
  diary: "Diary",
  quick_actions_menu: "",
  explore: "Explore",
  settings: "Settings",
};

// ─── Componente ───────────────────────────────────────────────────────────────
export default function BottomNavBar({
  state,
  descriptors,
  navigation,
  onOpenPost,
}: NavBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isActive = state.index === index;
          const isFab = route.name === "quick_actions_menu";

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
                onPress={onOpenPost}
                activeOpacity={0.85}
              >
                <View style={styles.fab}>
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
              <View style={styles.iconWrap}>
                <Icon color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR} />
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

const BOTTOM_PADDING = Platform.select({
  ios: 24,
  android: 12,
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
    overflow: "visible",
  },

  bar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BAR_BG, // ← blanco en lugar de azul
    borderRadius: 36,
    width: width - 32,
    paddingVertical: 10,
    paddingHorizontal: 8,
    // Sombra iOS
    shadowColor: BAR_SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    // Sombra Android
    elevation: 12,
    overflow: "visible",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },

  iconWrap: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 11,
    marginTop: 2,
    color: INACTIVE_COLOR,
    letterSpacing: 0.2,
    includeFontPadding: false,
    textAlignVertical: "center",
    fontFamily: "DMSans_500Medium",
  },

  labelActive: {
    color: ACTIVE_COLOR,
    fontFamily: "DMSans_700Bold",
  },

  fabWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // Eleva el FAB por encima de la barra
    marginTop: Platform.select({
      ios: -28,
      android: -28,
      default: -28,
    }),
  },

  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: BLUE, // ← azul vivo como en la imagen
    alignItems: "center",
    justifyContent: "center",
    // Sombra azul como en la referencia
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 14,
    // Sin borde blanco (la imagen no lo tiene)
  },
});
