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

type Slide = {
  key: string;
  emoji: string;
  bg: string;
  decorEmoji: string[];
  titleKey: string;
  subtitleKey: string;
};

export default function Onboarding() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasFamily, setHasFamily] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(1)).current;

  const slides: Slide[] = [
    {
      key: 'discover',
      emoji: '🌿',
      bg: '#e8f5e9',
      decorEmoji: ['🌱', '🍀', '🌾', '🌵'],
      titleKey: 'onboarding_slide1_title',
      subtitleKey: 'onboarding_slide1_sub',
    },
    {
      key: 'identify',
      emoji: '🔬',
      bg: '#e3f2fd',
      decorEmoji: ['🌸', '🌺', '🌻', '🌼'],
      titleKey: 'onboarding_slide2_title',
      subtitleKey: 'onboarding_slide2_sub',
    },
    {
      key: 'family',
      emoji: '👨‍👩‍👧',
      bg: '#fce4ec',
      decorEmoji: ['💚', '📷', '🗺️', '🎙️'],
      titleKey: 'onboarding_slide3_title',
      subtitleKey: 'onboarding_slide3_sub',
    },
  ];

  useEffect(() => {
    getFamilyCode().then((code) => {
      if (code) setHasFamily(true);
    });
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      // Fade out → зміна → fade in
      Animated.timing(contentFade, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        setCurrentIndex(nextIndex);
        Animated.spring(translateX, {
          toValue: -nextIndex * width,
          useNativeDriver: true,
          tension: 60,
          friction: 10,
        }).start();
        Animated.timing(contentFade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      });
    } else {
      router.replace('/family-setup');
    }
  };

  const handlePressIn = () =>
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

  const currentLangFlag = LANGUAGES.find((l) => l.code === lang)?.flag ?? '🌐';
  const isLast = currentIndex === slides.length - 1;

  const slide = slides[currentIndex];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="dark-content" />

      {/* Мова — вгорі праворуч */}
      <TouchableOpacity style={styles.langBtn} onPress={() => setShowLangPicker(true)}>
        <Text style={styles.langFlag}>{currentLangFlag}</Text>
        <Text style={styles.langCode}>{lang.toUpperCase()}</Text>
      </TouchableOpacity>

      {/* Логотип */}
      <View style={styles.logoRow}>
        <Text style={styles.logoEmoji}>🌿</Text>
        <Text style={styles.logoText}>Bloombook</Text>
      </View>

      {/* Слайд */}
      <Animated.View style={[styles.slideArea, { opacity: contentFade }]}>
        {/* Кольоровий круглий фон */}
        <View style={[styles.heroBg, { backgroundColor: slide.bg }]} />

        {/* Декоративні емодзі по колу */}
        {slide.decorEmoji.map((emoji, i) => {
          const angle = (i / slide.decorEmoji.length) * Math.PI * 2 - Math.PI / 4;
          const r = width * 0.3;
          const cx = width / 2 + r * Math.cos(angle) - 20;
          const cy = height * 0.22 + r * Math.sin(angle) - 20;
          return (
            <Text key={i} style={[styles.decorEmoji, { left: cx, top: cy }]}>
              {emoji}
            </Text>
          );
        })}

        {/* Головне емодзі */}
        <View style={[styles.heroEmojiWrap, { backgroundColor: slide.bg }]}>
          <Text style={styles.heroEmoji}>{slide.emoji}</Text>
        </View>

        {/* Текст */}
        <View style={styles.textBlock}>
          <Text style={styles.slideTitle}>{getSlideText(slide.titleKey, lang)}</Text>
          <Text style={styles.slideSub}>{getSlideText(slide.subtitleKey, lang)}</Text>
        </View>
      </Animated.View>

      {/* Банер "повернутись до альбому" */}
      {hasFamily && (
        <TouchableOpacity style={styles.returnBanner} onPress={() => router.replace('/album')}>
          <Text style={styles.returnBannerText}>
            🌿 {lang === 'en' ? 'Continue to my album →' : 'Продовжити до мого альбому →'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Точки-індикатори */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { width: i === currentIndex ? 24 : 8, opacity: i === currentIndex ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>

      {/* Кнопка */}
      <View style={styles.bottomArea}>
        <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={goNext}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <Text style={styles.startBtnText}>
              {isLast ? t('onboarding_start') : (lang === 'en' ? 'Next →' : 'Далі →')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {!isLast ? (
          <TouchableOpacity onPress={() => router.replace('/family-setup')} style={styles.skipBtn}>
            <Text style={styles.skipText}>{lang === 'en' ? 'Skip' : 'Пропустити'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.replace('/family-setup')} style={styles.skipBtn}>
            <Text style={styles.skipText}>🔗 {t('family_join')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <LanguagePicker visible={showLangPicker} onClose={() => setShowLangPicker(false)} />
    </Animated.View>
  );
}

// Тексти слайдів (не через t() бо ці ключі нові, додаємо inline)
function getSlideText(key: string, lang: string): string {
  const texts: Record<string, Record<string, string>> = {
    onboarding_slide1_title: {
      uk: 'Відкривай світ рослин 🌿',
      en: 'Discover the world of plants 🌿',
    },
    onboarding_slide1_sub: {
      uk: 'Фотографуй, зберігай та переглядай свою зелену колекцію',
      en: 'Photograph, save and browse your green collection',
    },
    onboarding_slide2_title: {
      uk: 'Розпізнавання за секунди 🔬',
      en: 'Identification in seconds 🔬',
    },
    onboarding_slide2_sub: {
      uk: 'Зроби фото — Bloombook назве рослину, розкаже факти і запише голосовий спогад',
      en: 'Take a photo — Bloombook names the plant, shares facts and records a voice memory',
    },
    onboarding_slide3_title: {
      uk: 'Колекція для всієї родини 👨‍👩‍👧',
      en: 'A collection for the whole family 👨‍👩‍👧',
    },
    onboarding_slide3_sub: {
      uk: 'Діти, батьки і бабусі бачать одну колекцію в реальному часі — через простий код',
      en: 'Children, parents and grandparents share one collection in real time — via a simple code',
    },
  };
  return texts[key]?.[lang] ?? texts[key]?.['uk'] ?? key;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  langCode: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.text },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xl + 8,
    paddingLeft: Spacing.lg,
    gap: Spacing.xs,
    zIndex: 5,
  },
  logoEmoji: { fontSize: 26 },
  logoText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3,
  },

  slideArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  heroBg: {
    position: 'absolute',
    top: height * 0.04,
    width: width * 0.72,
    height: width * 0.72,
    borderRadius: width * 0.36,
  },
  decorEmoji: {
    position: 'absolute',
    fontSize: 28,
  },
  heroEmojiWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  heroEmoji: { fontSize: 64 },
  textBlock: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  slideTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 32,
  },
  slideSub: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Dots
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingBottom: Spacing.md,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  // Bottom
  bottomArea: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  startBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.full,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  startBtnText: {
    color: '#fff',
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  skipBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  skipText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
  },
  returnBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.primary + '18',
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  returnBannerText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
  },
});
