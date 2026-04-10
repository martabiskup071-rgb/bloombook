import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
  const router = useRouter();
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Декоративне коло */}
      <View style={styles.bgCircle} />

      <View style={styles.content}>
        {/* Логотип */}
        <View style={styles.logoWrap}>
          <Text style={styles.logoEmoji}>🌿</Text>
          <Text style={styles.logoText}>Bloombook</Text>
        </View>

        <Text style={styles.tagline}>
          Відкривай світ рослин.{'\n'}Зберігай живі спогади.
        </Text>

        <View style={styles.features}>
          {[
            { icon: '📷', text: 'Фотографуй рослини' },
            { icon: '🔬', text: 'Розпізнавання за секунди' },
            { icon: '🎙️', text: 'Голосові спогади' },
            { icon: '🗺️', text: 'Карта знахідок' },
          ].map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Кнопка старту */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => router.replace('/album')}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Text style={styles.startBtnText}>Почати збирати 🌱</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    justifyContent: 'space-between',
  },
  bgCircle: {
    position: 'absolute',
    top: -height * 0.15,
    right: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: Colors.primary,
    opacity: 0.08,
  },
  content: { flex: 1, justifyContent: 'center', paddingTop: Spacing.xxl },
  logoWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  logoEmoji: { fontSize: 40, marginRight: Spacing.sm },
  logoText: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 32,
    marginBottom: Spacing.xl,
  },
  features: { gap: Spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  featureIcon: { fontSize: 24, width: 36 },
  featureText: { fontSize: Typography.fontSize.md, color: Colors.textSecondary },
  startBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#fff',
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
  },
});
