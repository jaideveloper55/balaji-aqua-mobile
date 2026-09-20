// src/components/pos/BillSummaryBar.tsx
// Sticky bar at the bottom: the running total and the Continue button.
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatINR } from "../../lib/format";
import { shadows } from "../../lib/shadows";
import { Button } from "../ui/Button";

type Props = {
  itemCount: number;
  total: number;
  onContinue: () => void;
};

export function BillSummaryBar({ itemCount, total, onContinue }: Props) {
  const insets = useSafeAreaInsets();
  const empty = itemCount === 0;

  return (
    <View
      // Padding keeps the button above the phone's gesture bar
      style={[shadows.sheet, { paddingBottom: Math.max(insets.bottom, 12) }]}
      className="flex-row items-center bg-white px-5 pt-3"
    >
      <View className="flex-1">
        <Text className="text-sm text-slate-500">
          {empty
            ? "No items yet"
            : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
        </Text>
        <Text className="text-2xl font-bold text-slate-900">
          {formatINR(total)}
        </Text>
      </View>
      <View className="w-44">
        <Button label="Continue" onPress={onContinue} disabled={empty} />
      </View>
    </View>
  );
}
