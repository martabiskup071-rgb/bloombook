import React, { useRef, useState, useEffect } from 'react';
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
import { useLanguage } from '../services/language';
import { LANGUAGES } from '../constants/i18n';
import { getFamilyCode } from '../services/family';
import LanguagePicker from '../components/LanguagePicker';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Якщо вже є сімейний код — відразу на альбом
  useEffect(() => {
    getFamilyCode().then((code) => {
      if (code) router.replace('/album');
    });
  }, []);

  const handlePressIn = () =>
    Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

  const currentLangFlag = LANGUAGES.find((l) => l.code === lang)?.flag ?? '🌐';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Декоративне коло */}
      <View style={styles.bgCircle} />

      {/* Кнопка мови — вгорі праворуч */}
      <TouchableOpacity style={styles.langBtn} onPress={() => setShowLangPicker(true)}>
        <Text style={styles.langFlag}>{currentLangFlag}</Text>
        <Text style={styles.langCode}>{lang.toUpperCase()}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Логотип */}
        <View style={styles.logoWrap}>
          <Text style={styles.logoEmoji}>🌿</Text>
          <Text style={styles.logoText}>Bloombook</Text>
        </View>

        <Text style={styles.tagline}>{t('onboarding_tagline')}</Text>

        <View style={styles.features}>
          {[
            { icon: '📷', text: t('onboarding_feature_photo') },
            { icon: '🔬', text: t('onboarding_feature_scan') },
            { icon: '🎙️', text: t('onboarding_feature_voice') },
            { icon: '🗺️', text: t('onboarding_feature_map') },
          ].map((f) => (
            <View key={f.icon} style={styles.featureRow}>
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
          onPress={() => router.replace('/family-setup')}
        >
          <Text style={styles.startBtnText}>{t('onboarding_start')}</Text>
        </TouchableOpacity>
      </Animated.View>
      {/* Кнопка "вже є код" */}
      <TouchableOpacity
        style={styles.joinLink}
        onPress={() => router.replace('/family-setup')}
      >
        <Text style={styles.joinLinkText}>🔗 {t('family_join')}</Text>
      </TouchableOpacity>

      <LanguagePicker visible={showLangPicker} onClose={() => setShowLangPicker(false)} />
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
  langBtn: {
    position: 'absolute',
    top: Spacing.xl + 8,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 10,
  },
  langFlag: { fontSize: 18 },
  langCode: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.text,
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
  joinLink: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  joinLinkText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
  },
});
