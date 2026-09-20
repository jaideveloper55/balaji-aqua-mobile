// src/components/pos/JarExchangeCard.tsx
// WATER_PLANT only: jars are returnable, so the shop must track who holds how many.
import { Text, View } from "react-native";
import { shadows } from "../../lib/shadows";
import { Droplet } from "../ui/icons";
import { QuantityStepper } from "./QuantityStepper";

type Props = {
  jarsHeld: number;
  given: number;
  returned: number;
  givenIsAuto: boolean;
  onGivenChange: (n: number) => void;
  onReturnedChange: (n: number) => void;
};

export function JarExchangeCard({
  jarsHeld,
  given,
  returned,
  givenIsAuto,
  onGivenChange,
  onReturnedChange,
}: Props) {
  const after = jarsHeld + given - returned;
  const delta = given - returned;

  return (
    <View style={shadows.card} className="rounded-2xl bg-white p-4">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5">
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
            <Droplet size={20} color="#0284c7" strokeWidth={2.4} />
          </View>
          <Text className="text-lg font-bold text-slate-900">Jar exchange</Text>
        </View>
        <View className="rounded-full bg-slate-100 px-3 py-1">
          <Text className="text-xs font-semibold text-slate-600">
            Holding {jarsHeld} now
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="mr-3 flex-1">
          <Text className="text-base font-medium text-slate-800">
            Full jars given
          </Text>
          {givenIsAuto && (
            <Text className="text-xs text-slate-400">
              Matches the cans on this bill
            </Text>
          )}
        </View>
        <QuantityStepper
          value={given}
          label="Full jars given"
          onChange={onGivenChange}
        />
      </View>

      <View className="my-3 h-px bg-slate-100" />

      <View className="flex-row items-center justify-between">
        <Text className="mr-3 flex-1 text-base font-medium text-slate-800">
          Empty jars collected
        </Text>
        <QuantityStepper
          value={returned}
          label="Empty jars collected"
          max={jarsHeld + given} // can't collect more than the customer has
          onChange={onReturnedChange}
        />
      </View>

      {/* The result, so nobody has to do the sum in their head */}
      <View className="mt-4 flex-row items-center justify-between rounded-xl bg-brand-50 px-3.5 py-3">
        <Text className="text-sm text-slate-600">Customer will hold</Text>
        <Text className="text-base font-bold text-brand-700">
          {after} {after === 1 ? "jar" : "jars"}
          {delta !== 0 && (
            <Text className="text-sm font-semibold text-slate-500">
              {"  "}({delta > 0 ? "+" : ""}
              {delta})
            </Text>
          )}
        </Text>
      </View>
    </View>
  );
}
