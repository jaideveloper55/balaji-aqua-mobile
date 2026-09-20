// src/components/ui/SearchBar.tsx
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { shadows } from "../../lib/shadows";
import { Search, X } from "./icons";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search",
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    // Border turns blue while typing, so the user knows the field is active
    <View
      style={shadows.card}
      className={`h-12 flex-row items-center rounded-2xl border-2 bg-white px-3.5 ${
        focused ? "border-brand-600" : "border-transparent"
      }`}
    >
      <Search size={20} color="#94a3b8" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        selectionColor="#0284c7"
        returnKeyType="search" // keyboard shows a Search key
        autoCorrect={false} // names like "Sathya" must not be "corrected"
        autoCapitalize="none"
        accessibilityLabel="Search customers"
        // h-full + py-0: the whole bar is tappable, and the text is centered on Android
        className="h-full flex-1 px-2.5 py-0 text-base text-slate-900"
      />
      {/* Clear button appears only when there is text */}
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          className="h-6 w-6 items-center justify-center rounded-full bg-slate-200"
        >
          <X size={14} color="#475569" strokeWidth={2.6} />
        </Pressable>
      )}
    </View>
  );
}
