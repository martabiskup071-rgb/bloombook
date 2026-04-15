// Екран вибору результату розпізнавання — топ-5 варіантів від Pl@ntNet
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { saveCard, uploadImage } from '../services/storage';
import { awardPlantXP } from '../services/xp';
import { useLanguage } from '../services/language';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';
import * as Location from 'expo-location';

export default function Results() {
  const router = useRouter();
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ data: string; imageUri: string }>();
  const [saving, setSaving] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Розбираємо результати з параметрів навігації
  const results = React.useMemo(() => {
    try {
      return JSON.parse(params.data ?? '[]');
    } catch {
      return [];
    }
  }, [params.data]);

  const imageUri = params.imageUri ?? '';

  async function handleSelect(index: number) {
    if (saving) return;
    setSelectedIndex(index);
    setSaving(true);

    try {
      const chosen = results[index];

      // Геолокація
      let location: { latitude: number; longitude: number; label?: string } | undefined;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        const [geo] = await Location.reverseGeocodeAsync(loc.coords);
        location = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          label: [geo?.city, geo?.country].filter(Boolean).join(', '),
        };
      }

      const tempId = Date.now().toString();
      const imageUrl = await uploadImage(imageUri, tempId);

      const id = await saveCard({
        scientificName: chosen.scientificName,
        commonName: chosen.commonNames[0] ?? chosen.scientificName,
        family: chosen.family,
        score: chosen.score,
        imageUrl,
        location,
        createdAt: new Date(),
      });

      // XP 🎮
      await awardPlantXP(chosen.family);

      router.replace(`/card/${id}?isNew=1`);
    } catch (e) {
      Alert.alert(t('error'), t('results_error'));
      setSaving(false);
      setSelectedIndex(null);
    }
  }

  function getScoreColor(score: number) {
    if (score >= 70) return '#2e7d32';
    if (score >= 40) return '#f57c00';
    return '#c62828';
  }

  function getScoreLabel(score: number) {
    if (score >= 70) return t('results_score_high');
    if (score >= 40) return t('results_score_mid');
    return t('results_score_low');
  }

  return (
    <View style={styles.container}>
      {/* Хедер */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{t('results_title')}</Text>
          <Text style={styles.subtitle}>{t('results_subtitle')} {results.length}</Text>
        </View>
      </View>

      {/* Фото яке аналізували */}
      {!!imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
      )}

      {/* Список результатів */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {results.map((item: any, index: number) => {
          const isSelected = selectedIndex === index;
          const scoreColor = getScoreColor(item.score);

          return (
            <TouchableOpacity
              key={index}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => handleSelect(index)}
              disabled={saving}
              activeOpacity={0.85}
            >
              {/* Номер + точність */}
              <View style={styles.cardLeft}>
                <View style={[styles.rankBadge, { backgroundColor: index === 0 ? Colors.primary : '#e0e0e0' }]}>
                  <Text style={[styles.rankText, { color: index === 0 ? '#fff' : '#555' }]}>
                    #{index + 1}
                  </Text>
                </View>
              </View>

              {/* Інфо про рослину */}
              <View style={styles.cardBody}>
                <Text style={styles.sciName}>{item.scientificName}</Text>
                {!!item.commonNames?.[0] && (
                  <Text style={styles.commonName}>{item.commonNames[0]}</Text>
                )}
                <Text style={styles.family}>{t('family')}: {item.family || '—'}</Text>
              </View>

              {/* Точність */}
              <View style={styles.cardRight}>
                <Text style={[styles.scoreNum, { color: scoreColor }]}>{item.score}%</Text>
                <Text style={[styles.scoreLabel, { color: scoreColor }]}>{getScoreLabel(item.score)}</Text>
                {isSelected && saving ? (
                  <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 4 }} />
                ) : (
                  <Text style={styles.selectArrow}>→</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Підказка */}
        <View style={styles.hint}>
          <Text style={styles.hintText}>{t('results_hint')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xl + 16,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center', alignItems: 'center',
  },
  backText: { fontSize: 22, color: Colors.text },
  headerCenter: { flex: 1 },
  title: { fontSize: Typography.fontSize.lg, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },

  previewImage: {
    width: '100%',
    height: 160,
  },

  list: { flex: 1 },
  listContent: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: Spacing.xxl },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#f1f8f4',
  },
  cardLeft: { alignItems: 'center' },
  rankBadge: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  rankText: { fontSize: Typography.fontSize.xs, fontWeight: '800' },

  cardBody: { flex: 1, gap: 2 },
  sciName: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.text, fontStyle: 'italic' },
  commonName: { fontSize: Typography.fontSize.sm, color: Colors.text, fontWeight: '600' },
  family: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },

  cardRight: { alignItems: 'center', minWidth: 56 },
  scoreNum: { fontSize: Typography.fontSize.md, fontWeight: '800' },
  scoreLabel: { fontSize: Typography.fontSize.xs, fontWeight: '600' },
  selectArrow: { fontSize: 18, color: Colors.border, marginTop: 4 },

  hint: {
    backgroundColor: '#fff8e1',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: '#ffe082',
  },
  hintText: { fontSize: Typography.fontSize.xs, color: '#795548', lineHeight: 18 },
});
