// src/app/(tabs)/home.tsx
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { PressableScale } from "../../components/ui/PressableScale";
import { StatTile } from "../../components/ui/StatTile";
import {
  Banknote,
  ChevronRight,
  NotebookPen,
  Plus,
  Smartphone,
} from "../../components/ui/icons";
import { formatINR } from "../../lib/format";
import { shadows } from "../../lib/shadows";
import { PaymentMethod, recentBills, todaySummary } from "../../mocks/home";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const methodStyles: Record<
  PaymentMethod,
  { pill: string; text: string; label: string }
> = {
  CASH: { pill: "bg-green-100", text: "text-green-700", label: "Cash" },
  UPI: { pill: "bg-blue-100", text: "text-blue-700", label: "UPI" },
  CREDIT: { pill: "bg-amber-100", text: "text-amber-700", label: "Credit" },
};

export default function HomeScreen() {
  const router = useRouter();
  const { totalBilled, billCount, cash, upi, credit } = todaySummary;

  const average = Math.round(totalBilled / billCount);
  const share = (part: number) => (part / totalBilled) * 100;

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const startNewBill = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/customers");
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-100">
      <ScrollView
        contentContainerClassName="px-5 pb-32 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* ONE soft fade for the whole screen content, instead of per-card animations */}
        <Animated.View entering={FadeIn.duration(250)}>
          {/* Greeting + avatar */}
          <View className="mb-5 flex-row items-center justify-between">
            <View>
              <Text className="text-base text-slate-500">
                {getGreeting()} 👋
              </Text>
              {/* TODO: real name from the logged-in user (JWT) */}
              <Text className="text-2xl font-bold text-slate-900">
                Ravi Kumar
              </Text>
              <Text className="mt-0.5 text-sm text-slate-400">
                {todayLabel}
              </Text>
            </View>
            <View
              style={shadows.card}
              className="h-12 w-12 items-center justify-center rounded-full bg-white"
            >
              <Text className="text-base font-bold text-brand-600">RK</Text>
            </View>
          </View>

          {/* Hero card: shadow on the outer view, clipping on the inner gradient */}
          <View
            style={[
              shadows.hero,
              {
                borderRadius: 24,
                backgroundColor: "#0369a1",
                marginBottom: 14,
              },
            ]}
          >
            <LinearGradient
              colors={["#0ea5e9", "#0369a1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 24, padding: 20, overflow: "hidden" }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium text-brand-100">
                  Today's billing
                </Text>
                <View className="rounded-full bg-white/20 px-3 py-1">
                  <Text className="text-xs font-semibold text-white">
                    {billCount} bills
                  </Text>
                </View>
              </View>

              {/* Plain text: the total is readable the instant the screen opens */}
              <Text className="mt-2 text-4xl font-bold text-white">
                {formatINR(totalBilled)}
              </Text>

              <View className="mt-4 flex-row items-center border-t border-white/20 pt-3">
                <Text className="text-sm text-brand-100">Average bill </Text>
                <Text className="text-sm font-bold text-white">
                  {formatINR(average)}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Payment split */}
          <View className="mb-6 flex-row gap-3">
            <StatTile
              label="Cash"
              value={formatINR(cash)}
              share={share(cash)}
              tone="green"
              icon={<Banknote size={20} color="#15803d" />}
            />
            <StatTile
              label="UPI"
              value={formatINR(upi)}
              share={share(upi)}
              tone="blue"
              icon={<Smartphone size={20} color="#1d4ed8" />}
            />
            <StatTile
              label="Credit"
              value={formatINR(credit)}
              share={share(credit)}
              tone="amber"
              icon={<NotebookPen size={20} color="#b45309" />}
            />
          </View>

          {/* Main action: the one place with press feedback + haptic */}
          <View className="mb-8">
            <PressableScale
              onPress={startNewBill}
              accessibilityRole="button"
              accessibilityLabel="Start a new bill"
              scaleTo={0.97}
              style={[shadows.button, { borderRadius: 18 }]}
              className="h-16 flex-row items-center justify-center gap-3 rounded-[18px] bg-slate-900"
            >
              <View className="h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <Plus size={20} color="#fff" strokeWidth={2.6} />
              </View>
              <Text className="text-lg font-bold text-white">New Bill</Text>
            </PressableScale>
          </View>

          {/* Recent bills */}
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-900">
              Recent bills
            </Text>
            <Pressable onPress={() => router.push("/bills")} hitSlop={10}>
              <Text className="text-base font-semibold text-brand-600">
                See all
              </Text>
            </Pressable>
          </View>

          <View
            style={[
              shadows.card,
              { borderRadius: 20, backgroundColor: "#fff" },
            ]}
          >
            <View className="overflow-hidden rounded-[20px]">
              {recentBills.map((bill, index) => {
                const style = methodStyles[bill.method];
                return (
                  <Pressable
                    key={bill.id}
                    // active:bg = instant highlight while pressed, with no animation code
                    className={`flex-row items-center px-4 py-3.5 active:bg-slate-50 ${
                      index > 0 ? "border-t border-slate-100" : ""
                    }`}
                  >
                    <View className="flex-1">
                      <Text
                        className="text-base font-semibold text-slate-900"
                        numberOfLines={1}
                      >
                        {bill.customer}
                      </Text>
                      <Text className="mt-0.5 text-sm text-slate-400">
                        {bill.id} · {bill.time}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-base font-bold text-slate-900">
                        {formatINR(bill.amount)}
                      </Text>
                      <View
                        className={`mt-1 rounded-full px-2 py-0.5 ${style.pill}`}
                      >
                        <Text className={`text-xs font-semibold ${style.text}`}>
                          {style.label}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight
                      size={18}
                      color="#cbd5e1"
                      style={{ marginLeft: 8 }}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
