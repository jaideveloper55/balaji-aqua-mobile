import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "../../components/ui/icons";
import { customers } from "../../mocks/customers";

export default function NewBillScreen() {
  const router = useRouter();
  const { customerId } = useLocalSearchParams<{ customerId: string }>();
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
        <Text className="ml-3 text-xl font-bold text-slate-900">New bill</Text>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-2xl font-bold text-slate-900">
          {customer?.name ?? "Unknown customer"}
        </Text>
        <Text className="mt-1 text-base text-slate-500">
          POS screen coming next
        </Text>
      </View>
    </SafeAreaView>
  );
}
