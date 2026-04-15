// Анімація конфеті — святкування нової рослини в колекції!
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const COLORS = [
  '#FF4081', '#F9A825', '#4CAF82', '#42A5F5', '#AB47BC',
  '#FF6D00', '#00BCD4', '#8BC34A', '#E91E63', '#FFD600',
  '#00E676', '#2979FF', '#D500F9', '#FF3D00', '#1DE9B6',
  '#FFEA00', '#76FF03', '#FF1744', '#00B0FF', '#F50057',
];
const PIECES = 200;

interface Piece {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
  size: number;
  startX: number;
  shape: 'square' | 'circle' | 'rect';
}

interface ConfettiProps {
  visible: boolean;
  onDone?: () => void;
}

export default function Confetti({ visible, onDone }: ConfettiProps) {
  const shapes: Array<'square' | 'circle' | 'rect'> = ['square', 'circle', 'rect'];

  const pieces = useRef<Piece[]>(
    Array.from({ length: PIECES }, (_, i) => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
      color: COLORS[i % COLORS.length],
      size: Math.random() * 16 + 8,
      startX: Math.random() * W,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }))
  ).current;

  useEffect(() => {
    if (!visible) return;

    const animations = pieces.map((p) => {
      p.x.setValue(0);
      p.y.setValue(0);
      p.rotate.setValue(0);
      p.opacity.setValue(0);
      p.scale.setValue(0);

      const delay = Math.random() * 800;
      const duration = 2200 + Math.random() * 1800;
      const endX = (Math.random() - 0.5) * 400;
      // Деякі летять вверх перед падінням
      const bounceUp = Math.random() > 0.6 ? -(Math.random() * 150 + 50) : 0;

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          // З'являємось з масштабом
          Animated.spring(p.scale, { toValue: 1, speed: 30, bounciness: 12, useNativeDriver: true }),
          Animated.timing(p.opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
          // Падіння вниз
          Animated.timing(p.y, { toValue: H + 50, duration, useNativeDriver: true }),
          // Бокове коливання
          Animated.timing(p.x, { toValue: endX, duration, useNativeDriver: true }),
          // Обертання
          Animated.timing(p.rotate, { toValue: Math.random() * 10 + 3, duration, useNativeDriver: true }),
          // Зникнення в кінці
          Animated.sequence([
            Animated.delay(duration * 0.65),
            Animated.timing(p.opacity, { toValue: 0, duration: duration * 0.35, useNativeDriver: true }),
          ]),
        ]),
      ]);
    });

    Animated.parallel(animations).start(() => onDone?.());
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((p, i) => {
        const spin = p.rotate.interpolate({
          inputRange: [0, 10],
          outputRange: ['0deg', `${720 + Math.random() * 1080}deg`],
        });

        const isCircle = p.shape === 'circle';
        const isRect = p.shape === 'rect';

        return (
          <Animated.View
            key={i}
            style={[
              styles.piece,
              {
                left: p.startX,
                top: -30,
                width: p.size,
                height: isRect ? p.size * 0.45 : p.size,
                backgroundColor: p.color,
                borderRadius: isCircle ? p.size / 2 : isRect ? 2 : 3,
                opacity: p.opacity,
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { rotate: spin },
                  { scale: p.scale },
                ],
                // Яскраве світіння
                shadowColor: p.color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.9,
                shadowRadius: 4,
                elevation: 4,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  piece: {
    position: 'absolute',
  },
});
