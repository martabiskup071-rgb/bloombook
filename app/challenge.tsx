import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getCards } from '../services/storage';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';

interface Challenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  goal: number;
  current: number;
}

export default function ChallengeScreen() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    getCards().then((cards) => {
      const total = cards.length;
      const families = new Set(cards.map((c) => c.family)).size;
      const withLocation = cards.filter((c) => c.location).length;
      const withMemo = cards.filter((c) => c.voiceMemoUrl).length;

      setChallenges([
        {
          id: '1',
          title: 'Перший крок',
          description: 'Додай 1 рослину до колекції',
          emoji: '🌱',
          goal: 1,
          current: Math.min(total, 1),
        },
        {
          id: '2',
          title: 'Початківець',
          description: 'Зберери 10 рослин',
          emoji: '🌿',
          goal: 10,
          current: Math.min(total, 10),
        },
        {
          id: '3',
          title: 'Ботанік',
          description: 'Зберери 50 рослин',
          emoji: '🌳',
          goal: 50,
          current: Math.min(total, 50),
        },
        {
          id: '4',
          title: 'Мандрівник',
          description: 'Знайди рослини в 5 різних місцях',
          emoji: '🗺️',
          goal: 5,
          current: Math.min(withLocation, 5),
        },
        {
          id: '5',
          title: 'Різноманіття',
          description: 'Відкрий рослини з 5 різних родин',
          emoji: '🔬',
          goal: 5,
          current: Math.min(families, 5),
        },
        {
          id: '6',
          title: 'Оповідач',
          description: 'Запиши 3 голосові спогади',
          emoji: '🎙️',
          goal: 3,
          current: Math.min(withMemo, 3),
        },
      ]);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Виклики 🎯</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {challenges.map((c) => {
          const done = c.current >= c.goal;
          const progress = Math.min(c.current / c.goal, 1);

          return (
            <View key={c.id} style={[styles.card, done && styles.cardDone]}>
              <View style={styles.cardRow}>
                <Text style={styles.cardEmoji}>{c.emoji}</Text>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{c.title}</Text>
                  <Text style={styles.cardDesc}>{c.description}</Text>
                </View>
                {done && <Text style={styles.check}>✓</Text>}
              </View>

              {/* Прогрес-бар */}
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {c.current} / {c.goal}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl + 16,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backText: { fontSize: 24, color: Colors.text },
  title: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.text },
  list: { padding: Spacing.md, gap: Spacing.md },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cardDone: {
    borderColor: Colors.primary,
    backgroundColor: '#F0FBF5',
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  cardEmoji: { fontSize: 32 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.text },
  cardDesc: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  check: { fontSize: 20, color: Colors.primary, fontWeight: '700' },
  progressBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  progressText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
});
