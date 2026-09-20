// src/components/customers/CustomerRow.tsx
import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { formatINR } from "../../lib/format";
import type { Customer } from "../../mocks/customers";
import { Droplet, Phone } from "../ui/icons";

// Full class strings only: NativeWind can't see names built at runtime.
const avatarTones = [
  { box: "bg-sky-100", text: "text-sky-700" },
  { box: "bg-emerald-100", text: "text-emerald-700" },
  { box: "bg-violet-100", text: "text-violet-700" },
  { box: "bg-rose-100", text: "text-rose-700" },
  { box: "bg-indigo-100", text: "text-indigo-700" },
] as const;

// Same name always gives the same color, so a customer is recognisable at a glance
function toneFor(name: string) {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return avatarTones[sum % avatarTones.length];
}

// "Sri Lakshmi Stores" -> "SL"
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

// "9876543201" -> "98765 43201"
function formatPhone(phone: string): string {
  return `${phone.slice(0, 5)} ${phone.slice(5)}`;
}

type Props = {
  customer: Customer;
  showJars: boolean; // false for BEVERAGE companies
  onPress: (id: string) => void;
  onCall: (phone: string) => void;
};

function CustomerRowBase({ customer, showJars, onPress, onCall }: Props) {
  const tone = toneFor(customer.name);
  const hasDues = customer.outstanding > 0;

  return (
    <Pressable
      onPress={() => onPress(customer.id)}
      accessibilityRole="button"
      accessibilityLabel={`Start a bill for ${customer.name}`}
      // Thin border instead of a shadow: cheap to draw on a long list
      className="flex-row items-center rounded-2xl border border-slate-200 bg-white p-3.5 active:bg-slate-50"
    >
      {/* Initials avatar */}
      <View
        className={`h-12 w-12 items-center justify-center rounded-full ${tone.box}`}
      >
        <Text className={`text-base font-bold ${tone.text}`}>
          {initials(customer.name)}
        </Text>
      </View>

      {/* Name, area and phone, plus jars held */}
      <View className="mx-3 flex-1">
        <Text
          className="text-base font-semibold text-slate-900"
          numberOfLines={1}
        >
          {customer.name}
        </Text>
        <Text className="mt-0.5 text-sm text-slate-500" numberOfLines={1}>
          {customer.area} · {formatPhone(customer.phone)}
        </Text>
        {showJars && customer.jarsHeld > 0 && (
          <View className="mt-1.5 flex-row items-center gap-1 self-start rounded-full bg-brand-50 px-2 py-0.5">
            <Droplet size={12} color="#0284c7" strokeWidth={2.4} />
            <Text className="text-xs font-semibold text-brand-700">
              {customer.jarsHeld} {customer.jarsHeld === 1 ? "jar" : "jars"}
            </Text>
          </View>
        )}
      </View>

      {/* Amount owed */}
      <View className="items-end">
        {hasDues ? (
          <>
            <Text className="text-base font-bold text-amber-600">
              {formatINR(customer.outstanding)}
            </Text>
            <Text className="text-xs text-slate-400">Due</Text>
          </>
        ) : (
          <Text className="text-sm font-semibold text-green-600">No dues</Text>
        )}
      </View>

      {/* One-tap call. It's a separate button, so it doesn't start a bill. */}
      <Pressable
        onPress={() => onCall(customer.phone)}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={`Call ${customer.name}`}
        className="ml-3 h-11 w-11 items-center justify-center rounded-full bg-brand-50 active:bg-brand-100"
      >
        <Phone size={20} color="#0284c7" />
      </Pressable>
    </Pressable>
  );
}

// memo = skip re-rendering this row unless one of its props actually changed
export const CustomerRow = memo(CustomerRowBase);
