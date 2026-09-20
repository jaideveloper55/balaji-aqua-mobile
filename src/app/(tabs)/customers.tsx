// src/app/(tabs)/customers.tsx
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Linking, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomerRow } from "../../components/customers/CustomerRow";
import { SearchBar } from "../../components/ui/SearchBar";
import { Search } from "../../components/ui/icons";
import { Customer, customers } from "../../mocks/customers";

type Filter = "all" | "dues" | "jars";

// TODO: read companyType from the JWT once the Auth module is built.
const IS_WATER_PLANT = true;

// Small pill button for the filter row
function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={`h-10 items-center justify-center rounded-full px-4 ${
        active
          ? "bg-slate-900"
          : "border border-slate-200 bg-white active:bg-slate-50"
      }`}
    >
      <Text
        className={`text-sm font-semibold ${active ? "text-white" : "text-slate-600"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// Gap between rows (cheaper than a margin on every row)
const Separator = () => <View className="h-2.5" />;

export default function CustomersScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  // Counts for the chips. Computed once, since the mock list never changes.
  const counts = useMemo(
    () => ({
      all: customers.length,
      dues: customers.filter((c) => c.outstanding > 0).length,
      jars: customers.filter((c) => c.jarsHeld > 0).length,
    }),
    []
  );

  // Filter + search + sort. useMemo = only recompute when query or filter change.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const digits = q.replace(/\s/g, ""); // "98765 43" also matches phone "9876543..."

    const list = customers.filter((c) => {
      if (filter === "dues" && c.outstanding <= 0) return false;
      if (filter === "jars" && c.jarsHeld <= 0) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        c.phone.includes(digits)
      );
    });

    // Dues view: biggest debt first. Everything else: A to Z.
    return list.sort(
      filter === "dues"
        ? (a, b) => b.outstanding - a.outstanding
        : (a, b) => a.name.localeCompare(b.name)
    );
  }, [query, filter]);

  // useCallback = the same function object every render, so memo'd rows can skip re-rendering
  const openBill = useCallback(
    (id: string) => {
      Haptics.selectionAsync();
      router.push({
        pathname: "/bill/[customerId]",
        params: { customerId: id },
      });
    },
    [router]
  );

  const callCustomer = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert(
        "Can't place the call",
        "This phone can't make calls right now."
      )
    );
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Customer }) => (
      <CustomerRow
        customer={item}
        showJars={IS_WATER_PLANT}
        onPress={openBill}
        onCall={callCustomer}
      />
    ),
    [openBill, callCustomer]
  );

  const keyExtractor = useCallback((item: Customer) => item.id, []);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-100">
      {/* Fixed header: stays on screen while the list scrolls */}
      <View className="px-5 pb-3 pt-4">
        <Text className="text-2xl font-bold text-slate-900">Customers</Text>
        <Text className="mb-4 mt-0.5 text-sm text-slate-500">
          Tap a customer to start a bill
        </Text>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search name, area or phone"
        />

        <View className="mt-3 flex-row gap-2">
          <Chip
            label={`All ${counts.all}`}
            active={filter === "all"}
            onPress={() => setFilter("all")}
          />
          <Chip
            label={`Dues ${counts.dues}`}
            active={filter === "dues"}
            onPress={() => setFilter("dues")}
          />
          {/* The jars filter only exists for WATER_PLANT companies */}
          {IS_WATER_PLANT && (
            <Chip
              label={`Jars ${counts.jars}`}
              active={filter === "jars"}
              onPress={() => setFilter("jars")}
            />
          )}
        </View>
      </View>

      <FlatList
        data={visible}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        // pb-32 keeps the last row above the floating tab bar
        contentContainerClassName="px-5 pb-32 pt-1"
        showsVerticalScrollIndicator={false}
        // The first tap on a row works even while the keyboard is open
        keyboardShouldPersistTaps="handled"
        // Scrolling the list closes the keyboard, so the user can see more rows
        keyboardDismissMode="on-drag"
        // Performance: draw few rows first, keep a small window around the screen
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={9}
        removeClippedSubviews // Android: unmounts rows far off screen to save memory
        ListEmptyComponent={
          <View className="items-center px-8 pt-16">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-slate-200">
              <Search size={28} color="#64748b" />
            </View>
            <Text className="text-lg font-bold text-slate-900">
              No customers found
            </Text>
            <Text className="mt-1 text-center text-base text-slate-500">
              {query.trim()
                ? `Nothing matches "${query.trim()}". Check the spelling or try the phone number.`
                : "There are no customers in this list."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
