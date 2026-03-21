import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export type NavBarProps = BottomTabBarProps & {
  onOpenPost: () => void;
};
