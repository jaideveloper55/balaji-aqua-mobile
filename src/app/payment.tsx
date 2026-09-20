// src/app/payment.tsx
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "../components/ui/icons";
import { useBillSummary } from "../hooks/useBillSummary";
import { formatINR } from "../lib/format";
import { customers } from "../mocks/customers";
import { useBillDraft } from "./stores/billDraft";


export default function PaymentScreen() {
  const router = useRouter();
  const customerId = useBillDraft((s) => s.customerId);
  const summary = useBillSummary(customerId);
  const customer = customers.find((c) => c.id === customerId);

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="flex-row items-center px-4 pb-2 pt-2">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-11 w-11 items-center justify-center rounded-full bg-white active:bg-slate-50"
        >
          <ArrowLeft size={22} color="#0f172a" />
        </Pressable>
        <Text className="ml-3 text-xl font-bold text-slate-900">Payment</Text>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-base text-slate-500">{customer?.name}</Text>
        <Text className="mt-1 text-4xl font-bold text-slate-900">
          {formatINR(summary.subtotal)}
        </Text>
        <Text className="mt-1 text-base text-slate-500">
          {summary.itemCount} items · Payment options coming next
        </Text>
      </View>
    </SafeAreaView>
  );
}
