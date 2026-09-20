import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

type InputProps = TextInputProps & {
  label: string;
  error?: string;
};

export function Input({ label, error, secureTextEntry, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  const borderColor = error
    ? "border-red-500"
    : focused
      ? "border-brand-600"
      : "border-slate-300";

  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-base font-medium text-slate-700">
        {label}
      </Text>

      <View
        className={`h-14 flex-row items-center rounded-2xl border-2 bg-white px-4 ${borderColor}`}
      >
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor="#94a3b8"
          className="flex-1 text-base text-slate-900"
        />

        {/* Show/hide eye icon, only for password fields */}
        {secureTextEntry && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={12}
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            {hidden ? (
              <Eye size={22} color="#64748b" strokeWidth={2} />
            ) : (
              <EyeOff size={22} color="#64748b" strokeWidth={2} />
            )}
          </Pressable>
        )}
      </View>

      {/* Inline error, right under the field where the user is looking */}
      {error ? (
        <Text className="mt-1 text-sm text-red-600">{error}</Text>
      ) : null}
    </View>
  );
}
