import * as Haptics from "expo-haptics";
import type { Tabs } from "expo-router";
import { useEffect, useState, type ComponentProps } from "react";
import { Keyboard, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shadows } from "../../lib/shadows";

type TabBarRenderer = NonNullable<ComponentProps<typeof Tabs>["tabBar"]>;
type BottomTabBarProps = Parameters<TabBarRenderer>[0];

function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const show = Keyboard.addListener(showEvent, () => setVisible(true));
    const hide = Keyboard.addListener(hideEvent, () => setVisible(false));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return visible;
}

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();

  if (keyboardVisible) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 10,
        right: 10,
        bottom: Math.max(insets.bottom, 12) + 4,
      }}
    >
      <View
        style={[
          {
            height: 68,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            borderRadius: 28,
            backgroundColor: "#ffffff",
            paddingHorizontal: 0,
          },
          shadows.floating,
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const title = options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              Haptics.selectionAsync();
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? title}
              hitSlop={6}
              style={{
                height: 46,
                minWidth: 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingHorizontal: 14,
                borderRadius: 23,
                backgroundColor: focused ? "#0284c7" : "transparent",
              }}
            >
              {options.tabBarIcon?.({
                focused,
                color: focused ? "#ffffff" : "#94a3b8",
                size: 22,
              })}
              {/* Label only on the active tab, with no animation */}
              {focused && (
                <Text
                  numberOfLines={1}
                  style={{ color: "#ffffff", fontSize: 14, fontWeight: "600" }}
                >
                  {title}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
