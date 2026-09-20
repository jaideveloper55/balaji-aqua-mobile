import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BillsScreen() {
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 items-center justify-center bg-slate-100"
    >
      <View className="items-center">
        <Text className="text-xl font-bold text-slate-900">Bills</Text>
        <Text className="text-slate-500">Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
