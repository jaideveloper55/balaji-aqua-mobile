// src/components/ui/PressableScale.tsx
// A Pressable that shrinks slightly while pressed, then springs back.
// This is the "it feels alive" effect: the UI reacts under your finger.
import { ReactNode } from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = Omit<PressableProps, "style"> & {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
};

export function PressableScale({
  children,
  className,
  style,
  scaleTo = 0.96,
  ...rest
}: Props) {
  // A shared value lives on the UI thread, so the animation stays smooth
  // even when the JS thread is busy (important on cheap Android phones).
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...rest}
        onPressIn={(e) => {
          scale.value = withSpring(scaleTo, { damping: 15, stiffness: 320 });
          rest.onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.value = withSpring(1, { damping: 12, stiffness: 260 });
          rest.onPressOut?.(e);
        }}
        className={className}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
