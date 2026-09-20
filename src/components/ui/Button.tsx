import { ActivityIndicator, Pressable, Text } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export function Button({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`h-14 flex-row items-center justify-center rounded-2xl ${
        isPrimary
          ? "bg-brand-600 active:bg-brand-700"
          : "border-2 border-slate-300 bg-white active:bg-slate-100"
      } ${isDisabled ? "opacity-50" : ""}`}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#fff" : "#0284c7"} />
      ) : (
        <Text
          className={`text-lg font-semibold ${isPrimary ? "text-white" : "text-slate-800"}`}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
