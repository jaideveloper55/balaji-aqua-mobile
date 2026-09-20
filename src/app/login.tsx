import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Droplet } from "../components/ui/icons";
import { shadows } from "../lib/shadows";

const loginSchema = z.object({
  // trim + lowercase so "Ravi@Gmail.com " and "ravi@gmail.com" are the same login
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email address")),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (_data: LoginForm) => {
    try {
      // TODO (after backend Module 3): POST /api/v1/auth/login, save tokens securely.
      await new Promise((resolve) => setTimeout(resolve, 1000)); // fake network delay
      // replace (not push): Back must not return to the login screen
      router.replace("/home");
    } catch {
      Alert.alert("Login failed", "Please check your details and try again.");
    }
  };

  return (
    <View className="flex-1 bg-brand-600">
      <StatusBar style="light" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          <Animated.View entering={FadeIn.duration(250)} className="flex-1">
            {/* ---------- Brand header ---------- */}
            <LinearGradient
              colors={["#0ea5e9", "#0369a1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingTop: insets.top + 36,
                paddingBottom: 72, // extra room: the white sheet overlaps the bottom 32px
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              {/* White logo tile with a drop icon */}
              <View
                style={shadows.card}
                className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-white"
              >
                <Droplet size={40} color="#0284c7" strokeWidth={2.2} />
              </View>
              <Text className="text-3xl font-bold text-white">Balaji Aqua</Text>
              <Text className="mt-1 text-base text-brand-100">
                Water Plant ERP
              </Text>
            </LinearGradient>

            {/* ---------- White sheet with the form ---------- */}
            {/* -mt-8 pulls the sheet up over the gradient. flex-1 makes it fill the rest of the screen. */}
            <View
              style={[
                shadows.sheet,
                { paddingBottom: Math.max(insets.bottom, 16) + 16 },
              ]}
              className="-mt-8 flex-1 rounded-t-[32px] bg-white px-6 pt-8"
            >
              <Text className="text-2xl font-bold text-slate-900">
                Welcome back
              </Text>
              <Text className="mb-6 mt-1 text-base text-slate-500">
                Sign in to start billing
              </Text>

              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    label="Email"
                    placeholder="name@gmail.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    submitBehavior="submit" // pressing Next keeps the keyboard open (no flicker)
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    inputRef={passwordRef}
                    label="Password"
                    placeholder="Enter your password"
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                    returnKeyType="go"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                  />
                )}
              />

              <View className="mt-2">
                <Button
                  label="Sign in"
                  onPress={handleSubmit(onSubmit)}
                  loading={isSubmitting}
                />
              </View>

              {/* Accounts are created by the owner, so this is the honest answer to "forgot password" */}
              <Text className="mt-5 text-center text-sm text-slate-500">
                Forgot your password? Ask your admin to reset it.
              </Text>

              {/* mt-auto pushes the footer to the bottom on tall phones */}
              <View className="mt-auto items-center pt-8">
                <Text className="text-sm text-slate-400">
                  Balaji Aqua · v1.0.0
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
