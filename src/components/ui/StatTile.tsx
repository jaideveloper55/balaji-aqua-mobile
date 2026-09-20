import { ReactNode } from "react";
import { Text, View } from "react-native";
import { shadows } from "../../lib/shadows";

// Full class strings only (NativeWind can't see names built at runtime)
const tones = {
  green: { box: "bg-green-100", text: "text-green-700", bar: "bg-green-500" },
  blue: { box: "bg-blue-100", text: "text-blue-700", bar: "bg-blue-500" },
  amber: { box: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-500" },
} as const;

type Props = {
  label: string;
  value: string;
  share: number; // 0-100, percent of today's total
  icon: ReactNode;
  tone: keyof typeof tones;
};

export function StatTile({ label, value, share, icon, tone }: Props) {
  return (
    <View
      style={[shadows.card, { flex: 1 }]}
      className="rounded-2xl bg-white p-3.5"
    >
      <View className="mb-3 flex-row items-center justify-between">
        <View
          className={`h-9 w-9 items-center justify-center rounded-xl ${tones[tone].box}`}
        >
          {icon}
        </View>
        <Text className="text-xs font-semibold text-slate-400">
          {Math.round(share)}%
        </Text>
      </View>

      <Text className="text-sm text-slate-500">{label}</Text>
      <Text
        className={`text-lg font-bold ${tones[tone].text}`}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>

      {/* Track + fill. The fill width is a plain percentage. */}
      <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <View
          className={`h-full rounded-full ${tones[tone].bar}`}
          style={{ width: `${share}%` }}
        />
      </View>
    </View>
  );
}
