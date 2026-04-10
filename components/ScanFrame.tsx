import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/theme';

interface ScanFrameProps {
  size?: number;
  scanning?: boolean;
}

export default function ScanFrame({ size = 260, scanning = false }: ScanFrameProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const lineY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!scanning) return;

    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );

    const lineAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(lineY, { toValue: size - 4, duration: 1500, useNativeDriver: true }),
        Animated.timing(lineY, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    );

    pulseAnim.start();
    lineAnim.start();
    return () => {
      pulseAnim.stop();
      lineAnim.stop();
    };
  }, [scanning, size]);

  const corner = 24;

  return (
    <Animated.View style={[styles.frame, { width: size, height: size, transform: [{ scale: pulse }] }]}>
      {/* Кути рамки */}
      <View style={[styles.corner, styles.tl, { width: corner, height: corner }]} />
      <View style={[styles.corner, styles.tr, { width: corner, height: corner }]} />
      <View style={[styles.corner, styles.bl, { width: corner, height: corner }]} />
      <View style={[styles.corner, styles.br, { width: corner, height: corner }]} />

      {/* Лінія сканування */}
      {scanning && (
        <Animated.View
          style={[styles.scanLine, { width: size - 4, transform: [{ translateY: lineY }] }]}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 8 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 8 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 8 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 8 },
  scanLine: {
    position: 'absolute',
    top: 2,
    left: 2,
    height: 2,
    backgroundColor: Colors.primary,
    opacity: 0.8,
    borderRadius: 1,
  },
});
