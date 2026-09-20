import { useEffect, useRef, useState } from "react";
import { Text } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { formatINR } from "../../lib/format";

type Props = { value: number; duration?: number; className?: string };

export function CountUp({ value, duration = 700, className }: Props) {
  // Respect the phone's "remove animations" accessibility setting
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);
  const shown = useRef(reduceMotion ? value : 0); // last number painted

  useEffect(() => {
    if (reduceMotion) {
      shown.current = value;
      setDisplay(value);
      return;
    }
    const startValue = shown.current; // start from what is on screen, not from 0
    const startTime = Date.now();
    let lastPaint = 0;
    let frame: number;

    const tick = () => {
      const now = Date.now();
      const t = Math.min((now - startTime) / duration, 1);
      // Repaint at most every 40ms, and always paint the final value
      if (t === 1 || now - lastPaint > 40) {
        const eased = 1 - Math.pow(1 - t, 3); // ease-out
        shown.current = Math.round(startValue + (value - startValue) * eased);
        setDisplay(shown.current);
        lastPaint = now;
      }
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame); // stop if the screen closes mid-count
  }, [value, duration, reduceMotion]);

  return <Text className={className}>{formatINR(display)}</Text>;
}
