// src/app/bill/[customerId].tsx
// This screen lives OUTSIDE (tabs), so the floating tab bar is not shown while billing.
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BillSummaryBar } from "../../components/pos/BillSummaryBar";
import { JarExchangeCard } from "../../components/pos/JarExchangeCard";
import { ProductRow } from "../../components/pos/ProductRow";
import { ArrowLeft } from "../../components/ui/icons";
import { useBillSummary } from "../../hooks/useBillSummary";
import { IS_WATER_PLANT } from "../../lib/company";
import { formatINR } from "../../lib/format";
import { shadows } from "../../lib/shadows";
import { customers } from "../../mocks/customers";
import { priceFor, products } from "../../mocks/products";
import { isDraftEmpty, useBillDraft } from "../stores/billDraft";

export default function NewBillScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { customerId } = useLocalSearchParams<{ customerId: string }>();
  const customer = customers.find((c) => c.id === customerId);

  // Store values and actions (actions never change, so they never cause re-renders)
  const quantities = useBillDraft((s) => s.quantities);
  const start = useBillDraft((s) => s.start);
  const clear = useBillDraft((s) => s.clear);
  const setQuantity = useBillDraft((s) => s.setQuantity);
  const setJarsGiven = useBillDraft((s) => s.setJarsGiven);
  const setJarsReturned = useBillDraft((s) => s.setJarsReturned);
  const summary = useBillSummary(customerId);

  // Begin a draft for this customer (blank if it's a different customer)
  useEffect(() => {
    if (customerId) start(customerId);
  }, [customerId, start]);

  // Guard against losing a half-made bill. "beforeRemove" fires for the header
  // back button, the Android hardware back button and the iOS swipe-back alike.
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (isDraftEmpty()) return; // nothing to lose: leave normally

      e.preventDefault(); // stop leaving, and ask first
      Alert.alert(
        "Discard this bill?",
        "The items you added will be removed.",
        [
          { text: "Keep editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              clear();
              navigation.dispatch(e.data.action); // now really leave
            },
          },
        ]
      );
    });
    return unsubscribe; // stop listening when the screen closes
  }, [navigation, clear]);

  const goToPayment = () => {
    if (summary.itemCount === 0) return;
    router.push("/payment"); // pushing a screen on TOP does not trigger "beforeRemove"
  };

  // Header (shared by the normal view and the "not found" view)
  const header = (title: string) => (
    <View className="flex-row items-center px-4 pb-2 pt-2">
      <Pressable
        onPress={() => router.back()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={shadows.card}
        className="h-11 w-11 items-center justify-center rounded-full bg-white active:bg-slate-50"
      >
        <ArrowLeft size={22} color="#0f172a" />
      </Pressable>
      <Text className="ml-3 text-xl font-bold text-slate-900">{title}</Text>
    </View>
  );

  // A bad link or deleted customer shows a clear message, not a blank screen
  if (!customer) {
    return (
      <SafeAreaView className="flex-1 bg-slate-100">
        {header("New bill")}
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-lg font-bold text-slate-900">
            Customer not found
          </Text>
          <Text className="mt-1 text-center text-base text-slate-500">
            Go back and pick the customer again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasDues = customer.outstanding > 0;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-100">
      {/* iOS needs this to lift content above the keyboard. Android resizes the window itself. */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {header("New bill")}

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-6 pt-2"
          keyboardShouldPersistTaps="handled" // first tap on +/- works while the keyboard is open
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* Who is this bill for? */}
          <View
            style={shadows.card}
            className="mb-5 flex-row items-center rounded-2xl bg-white p-4"
          >
            <View className="flex-1">
              <Text
                className="text-lg font-bold text-slate-900"
                numberOfLines={1}
              >
                {customer.name}
              </Text>
              <Text className="mt-0.5 text-sm text-slate-500" numberOfLines={1}>
                {customer.area}
              </Text>
            </View>
            {hasDues ? (
              <View className="items-end">
                <Text className="text-lg font-bold text-amber-600">
                  {formatINR(customer.outstanding)}
                </Text>
                <Text className="text-xs text-slate-400">Previous due</Text>
              </View>
            ) : (
              <Text className="text-sm font-semibold text-green-600">
                No dues
              </Text>
            )}
          </View>

          <Text className="text-lg font-bold text-slate-900">Products</Text>
          <Text className="mb-3 mt-0.5 text-sm text-slate-500">
            Tap + or -, or tap the number to type a quantity
          </Text>

          {/* 5 products: a plain map is fine. (A 2,000-row list would use FlatList.) */}
          <View className="mb-5 gap-3">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                qty={quantities[product.id] ?? 0}
                unitPrice={priceFor(customer.id, product)}
                onChange={setQuantity}
              />
            ))}
          </View>

          {/* Jars only exist for WATER_PLANT companies */}
          {IS_WATER_PLANT && (
            <JarExchangeCard
              jarsHeld={summary.jarsHeld}
              given={summary.jarsGiven}
              returned={summary.jarsReturned}
              givenIsAuto={summary.jarsGivenIsAuto}
              onGivenChange={setJarsGiven}
              onReturnedChange={setJarsReturned}
            />
          )}
        </ScrollView>

        <BillSummaryBar
          itemCount={summary.itemCount}
          total={summary.subtotal}
          onContinue={goToPayment}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
