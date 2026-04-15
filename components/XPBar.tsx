// Компонент XP бару — показує рівень і прогрес
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { XPState } from '../services/xp';
import { useLanguage } from '../services/language';
import { type TranslationKey } from '../constants/i18n';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';

interface XPBarProps {
  xpState: XPState;
  compact?: boolean;
}

const LEVEL_KEYS: TranslationKey[] = [
  'xp_lvl1', 'xp_lvl2', 'xp_lvl3', 'xp_lvl4', 'xp_lvl5', 'xp_lvl6', 'xp_lvl7',
];

export default function XPBar({ xpState, compact = false }: XPBarProps) {
  const { t } = useLanguage();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: xpState.progressPercent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [xpState.progressPercent]);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const levelName = t(LEVEL_KEYS[xpState.level - 1] ?? 'xp_lvl1');

  if (compact) {
    return (
      <View style={styles.compact}>
        <Text style={styles.compactEmoji}>{xpState.levelEmoji}</Text>
        <View style={styles.compactInfo}>
          <Text style={styles.compactName}>{levelName}</Text>
          <View style={styles.compactBar}>
            <Animated.View style={[styles.compactFill, { width: barWidth }]} />
          </View>
        </View>
        <Text style={styles.compactXP}>{xpState.totalXP} XP</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelEmoji}>{xpState.levelEmoji}</Text>
          <View>
            <Text style={styles.levelName}>{levelName}</Text>
            <Text style={styles.levelNum}>{t('xp_level')} {xpState.level}</Text>
          </View>
        </View>
        <Text style={styles.xpTotal}>{xpState.totalXP} XP</Text>
      </View>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: barWidth }]} />
      </View>

      {!xpState.isMaxLevel ? (
        <Text style={styles.hint}>
          {xpState.xpInLevel} / {xpState.xpNeededForLevel} {t('xp_to_next')}
        </Text>
      ) : (
        <Text style={styles.hint}>{t('xp_max_level')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  levelEmoji: { fontSize: 28 },
  levelName: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.text },
  levelNum: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 1 },
  xpTotal: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.primary },
  track: {
    height: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  hint: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#f1f8e9',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  compactEmoji: { fontSize: 16 },
  compactInfo: { flex: 1, gap: 2 },
  compactName: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.text },
  compactBar: {
    height: 4,
    backgroundColor: '#dcedc8',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  compactFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  compactXP: { fontSize: Typography.fontSize.xs, color: Colors.primary, fontWeight: '700' },
});
