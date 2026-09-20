// src/lib/shadows.ts
// One place for all shadow styles, so depth is consistent across the app.
// iOS uses shadowColor/Opacity/Radius/Offset. Android uses `elevation`,
// and on Android 9+ it also reads shadowColor, so the shadow can be tinted.
import { ViewStyle } from "react-native";

const make = (
  color: string,
  opacity: number,
  radius: number,
  y: number,
  elevation: number
): ViewStyle => ({
  shadowColor: color,
  shadowOpacity: opacity,
  shadowRadius: radius,
  shadowOffset: { width: 0, height: y },
  elevation,
});

export const shadows = {
  card: make("#0f172a", 0.1, 14, 5, 5), // white cards on the grey background
  hero: make("#0369a1", 0.4, 26, 14, 16), // blue glow under the hero card
  button: make("#0f172a", 0.35, 18, 9, 11), // dark "New Bill" button
  floating: make("#0f172a", 0.22, 26, 12, 18), // floating tab bar
  sheet: make("#0f172a", 0.12, 16, -6, 12), // NEW: shadow pointing UP, for the login sheet
};
