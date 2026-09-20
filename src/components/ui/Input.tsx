// src/components/ui/Input.tsx
import { Ref, useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { Eye, EyeOff } from "./icons";

type InputProps = TextInputProps & {
  label: string;
  error?: string; // message shown under the field
  inputRef?: Ref<TextInput>; // lets a screen focus this field from code (Next key)
};

export function Input({
  label,
  error,
  secureTextEntry,
  inputRef,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry); // password hidden by default

  // Border color shows the state: error (red), typing (blue), idle (grey)
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
          // Screen readers announce "Email" instead of only the placeholder.
          // It sits before {...rest}, so a screen can still override it.
          accessibilityLabel={label}
          {...rest}
          ref={inputRef}
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
          selectionColor="#0284c7" // cursor and text-selection color = brand blue
          // h-full: the input fills the whole 56px box, so tapping anywhere
          // inside the field focuses it. py-0 removes Android's extra inner padding.
          className="h-full flex-1 py-0 text-base text-slate-900"
        />

        {/* Show/hide eye icon, only for password fields */}
        {secureTextEntry && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={12} // bigger tap area than the small icon
            accessibilityRole="button"
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

      {/* Inline error, right under the field where the user is looking.
          The live region makes screen readers announce it when it appears. */}
      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
