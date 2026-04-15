import { useEffect, useRef, type PropsWithChildren } from "react";
import {
  Animated,
  Easing,
  type StyleProp,
  type ViewStyle,
} from "react-native";

interface AnimatedEntranceProps {
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedEntrance({
  children,
  delay = 0,
  distance = 18,
  style,
}: PropsWithChildren<AnimatedEntranceProps>) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 360,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
