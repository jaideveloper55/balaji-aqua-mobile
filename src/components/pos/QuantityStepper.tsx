// src/components/pos/QuantityStepper.tsx
// [ - ]  12  [ + ]   The number in the middle can be typed directly.
import * as Haptics from "expo-haptics";
import { Pressable, TextInput, View } from "react-native";
import { Minus, Plus } from "../ui/icons";

type Props = {
  value: number;
  onChange: (next: number) => void;
  label: string; // for screen readers: "20L Water Can"
  min?: number;
  max?: number;
};

export function QuantityStepper({
  value,
  onChange,
  label,
  min = 0,
  max = 999,
}: Props) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  // Tapping + or -: change the value and give a light tick
  const step = (delta: number) => {
    const next = clamp(value + delta);
    if (next !== value) {
      Haptics.selectionAsync();
      onChange(next);
    }
  };

  // Typing: keep digits only. An empty box counts as the minimum.
  const onType = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "");
    const next = clamp(digits === "" ? min : parseInt(digits, 10));
    if (next !== value) onChange(next);
  };

  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <View className="flex-row items-center">
      <Pressable
        onPress={() => step(-1)}
        disabled={atMin}
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${label}`}
        // h-11 w-11 = 44px, the minimum comfortable touch size
        className={`h-11 w-11 items-center justify-center rounded-xl ${
          atMin ? "bg-slate-100" : "bg-slate-200 active:bg-slate-300"
        }`}
      >
        <Minus
          size={20}
          color={atMin ? "#cbd5e1" : "#0f172a"}
          strokeWidth={2.6}
        />
      </Pressable>

      <TextInput
        value={String(value)}
        onChangeText={onType}
        keyboardType="number-pad"
        selectTextOnFocus // tapping the number selects it, so typing replaces it
        maxLength={3}
        selectionColor="#0284c7"
        accessibilityLabel={`${label} quantity`}
        className="h-11 w-14 py-0 text-center text-lg font-bold text-slate-900"
      />

      <Pressable
        onPress={() => step(1)}
        disabled={atMax}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${label}`}
        className={`h-11 w-11 items-center justify-center rounded-xl ${
          atMax ? "bg-slate-100" : "bg-brand-600 active:bg-brand-700"
        }`}
      >
        <Plus
          size={20}
          color={atMax ? "#cbd5e1" : "#ffffff"}
          strokeWidth={2.6}
        />
      </Pressable>
    </View>
  );
}
