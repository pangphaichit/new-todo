/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#2baed9ff";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Color utility functions
export const ColorUtils = {
  /**
   * Adjusts the opacity of a color
   * @param color - Hex color string (e.g., "#2baed9ff" or "#2baed9")
   * @param opacity - Opacity value between 0 and 1
   * @returns RGBA color string
   */
  adjustOpacity: (color: string, opacity: number): string => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  /**
   * Lightens a color by adding to RGB values
   * @param color - Hex color string
   * @param amount - Amount to lighten (0-255)
   * @returns RGB color string
   */
  lighten: (color: string, amount: number): string => {
    const hex = color.replace("#", "");
    const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + amount);
    const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + amount);
    return `rgb(${r}, ${g}, ${b})`;
  },

  /**
   * Darkens a color by subtracting from RGB values
   * @param color - Hex color string
   * @param amount - Amount to darken (0-255)
   * @returns RGB color string
   */
  darken: (color: string, amount: number): string => {
    const hex = color.replace("#", "");
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - amount);
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - amount);
    return `rgb(${r}, ${g}, ${b})`;
  },
};
