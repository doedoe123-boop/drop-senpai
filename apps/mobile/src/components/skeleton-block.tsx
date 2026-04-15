import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { mobileTheme } from "../constants/theme";

interface SkeletonBlockProps {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
}

export function SkeletonBlock({
  width = "100%",
  height,
  radius = 14,
}: SkeletonBlockProps) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.92,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        {
          width,
          height,
          borderRadius: radius,
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: mobileTheme.colors.surfaceMuted,
  },
});
