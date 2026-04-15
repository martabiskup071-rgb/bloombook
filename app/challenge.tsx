// Природне Бінго — 5×5 картка з завданнями на основі колекції
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getCards, PlantCard } from '../services/storage';
import { useLanguage } from '../services/language';
import LanguagePicker from '../components/LanguagePicker';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';

const { width: W } = Dimensions.get('window');
const CELL = (W - Spacing.md * 2 - 4 * 4) / 5;

interface Cell {
  emoji: string;
  title: string;
  done: boolean;
  free?: boolean;
}

function buildGrid(cards: PlantCard[], lang: 'uk' | 'en' = 'uk'): Cell[] {
  const total = cards.length;
  const families = new Set(cards.map((c) => c.family?.trim()).filter(Boolean));
  const withLocation = cards.filter((c) => c.location).length;
  const withMemo = cards.filter((c) => c.voiceMemoUrl).length;
  const withNote = cards.filter((c) => c.note?.trim()).length;
  const withMood = cards.filter((c) => c.mood).length;

  const hasFamily = (name: string) =>
    cards.some((c) => c.family?.toLowerCase().includes(name.toLowerCase()));

  const uk = lang === 'uk';
  const cells: Omit<Cell, 'done'>[] & { check: () => boolean }[] = [
    // Row 0
    { emoji: '🌱', title: uk ? 'Перша\nрослина'     : 'First\nplant',        check: () => total >= 1 },
    { emoji: '🎙️', title: uk ? 'Голосовий\nспогад'  : 'Voice\nmemory',       check: () => withMemo >= 1 },
    { emoji: '📍', title: uk ? 'Знайди з\nлокацією' : 'With\nlocation',      check: () => withLocation >= 1 },
    { emoji: '📝', title: uk ? 'Напиши\nнотатку'    : 'Write a\nnote',       check: () => withNote >= 1 },
    { emoji: '😊', title: uk ? 'Обери\nнастрій'     : 'Pick a\nmood',        check: () => withMood >= 1 },
    // Row 1
    { emoji: '🌿', title: uk ? '5\nрослин'          : '5\nplants',           check: () => total >= 5 },
    { emoji: '🔬', title: uk ? '3 різні\nродини'    : '3 different\nfamilies', check: () => families.size >= 3 },
    { emoji: '🗺️', title: uk ? '3\nлокації'         : '3\nlocations',        check: () => withLocation >= 3 },
    { emoji: '🎙️', title: uk ? '3 голосові\nспогади': '3 voice\nmemories',   check: () => withMemo >= 3 },
    { emoji: '📝', title: uk ? '3\nнотатки'         : '3\nnotes',            check: () => withNote >= 3 },
    // Row 2 — FREE у центрі (індекс 12)
    { emoji: '🌸', title: uk ? 'Родина\nRosaceae'   : 'Family\nRosaceae',    check: () => hasFamily('Rosaceae') },
    { emoji: '💚', title: uk ? '5\nнастроїв'        : '5\nmoods',            check: () => withMood >= 5 },
    { emoji: '⭐', title: 'FREE',                                              check: () => true, free: true } as any,
    { emoji: '🌴', title: uk ? 'Родина\nArecaceae'  : 'Family\nArecaceae',   check: () => hasFamily('Arecaceae') },
    { emoji: '🌾', title: uk ? 'Родина\nPoaceae'    : 'Family\nPoaceae',     check: () => hasFamily('Poaceae') },
    // Row 3
    { emoji: '🌿', title: uk ? '10\nрослин'         : '10\nplants',          check: () => total >= 10 },
    { emoji: '🔬', title: uk ? '5 різних\nродин'    : '5 different\nfamilies', check: () => families.size >= 5 },
    { emoji: '🗺️', title: uk ? '5\nлокацій'         : '5\nlocations',        check: () => withLocation >= 5 },
    { emoji: '🌺', title: uk ? 'Родина\nOrchidaceae': 'Family\nOrchidaceae', check: () => hasFamily('Orchidaceae') },
    { emoji: '🌵', title: uk ? 'Родина\nCactaceae'  : 'Family\nCactaceae',   check: () => hasFamily('Cactaceae') },
    // Row 4
    { emoji: '🌿', title: uk ? '20\nрослин'         : '20\nplants',          check: () => total >= 20 },
    { emoji: '🔬', title: uk ? '10 різних\nродин'   : '10 different\nfamilies', check: () => families.size >= 10 },
    { emoji: '🎙️', title: uk ? '5 голосових\nспогадів': '5 voice\nmemories', check: () => withMemo >= 5 },
    { emoji: '📝', title: uk ? '5\nнотаток'         : '5\nnotes',            check: () => withNote >= 5 },
    { emoji: '🏆', title: uk ? '50\nрослин'         : '50\nplants',          check: () => total >= 50 },
  ];

  return cells.map((c) => ({ emoji: c.emoji, title: c.title, done: c.check(), free: !!(c as any).free }));
}

function getBingos(grid: Cell[]): Set<number> {
  if (grid.length < 25) return new Set();
  const done = (i: number) => grid[i]?.done ?? false;
  const bingoCells = new Set<number>();

  // Рядки
  for (let r = 0; r < 5; r++) {
    const row = [r*5, r*5+1, r*5+2, r*5+3, r*5+4];
    if (row.every(done)) row.forEach((i) => bingoCells.add(i));
  }
  // Стовпці
  for (let c = 0; c < 5; c++) {
    const col = [c, c+5, c+10, c+15, c+20];
    if (col.every(done)) col.forEach((i) => bingoCells.add(i));
  }
  // Діагоналі
  const d1 = [0, 6, 12, 18, 24];
  const d2 = [4, 8, 12, 16, 20];
  if (d1.every(done)) d1.forEach((i) => bingoCells.add(i));
  if (d2.every(done)) d2.forEach((i) => bingoCells.add(i));

  return bingoCells;
}

export default function ChallengeScreen() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [grid, setGrid] = useState<Cell[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLangPicker, setShowLangPicker] = useState(false);

  useEffect(() => {
    getCards().then((cards) => {
      setGrid(buildGrid(cards, lang));
      setLoading(false);
    });
  }, [lang]);

  const bingoCells = getBingos(grid);
  const completedCount = grid.filter((c) => c.done).length;
  const bingoCount = grid.length < 25 ? 0 : (() => {
    let n = 0;
    for (let r = 0; r < 5; r++) {
      if ([r*5, r*5+1, r*5+2, r*5+3, r*5+4].every((i) => grid[i]?.done)) n++;
    }
    for (let c = 0; c < 5; c++) {
      if ([c, c+5, c+10, c+15, c+20].every((i) => grid[i]?.done)) n++;
    }
    if ([0,6,12,18,24].every((i) => grid[i]?.done)) n++;
    if ([4,8,12,16,20].every((i) => grid[i]?.done)) n++;
    return n;
  })();

  return (
    <View style={styles.container}>
      {/* Хедер */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/album')} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{t('bingo_title')}</Text>
          {bingoCount > 0 && (
            <Text style={styles.bingoAlert}>🎉 BINGO ×{bingoCount}!</Text>
          )}
        </View>
        <TouchableOpacity onPress={() => setShowLangPicker(true)} style={styles.langBtn}>
          <Text style={{ fontSize: 20 }}>🌐</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Лічильник */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{completedCount}</Text>
            <Text style={styles.statLabel}>{t('bingo_completed')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{bingoCount}</Text>
            <Text style={styles.statLabel}>bingo</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>25</Text>
            <Text style={styles.statLabel}>{t('bingo_total')}</Text>
          </View>
        </View>

        {/* Сітка */}
        {!loading && (
          <View style={styles.grid}>
            {/* BINGO header letters */}
            {['B', 'I', 'N', 'G', 'O'].map((letter) => (
              <View key={letter} style={[styles.cell, styles.headerCell]}>
                <Text style={styles.headerLetter}>{letter}</Text>
              </View>
            ))}

            {grid.map((cell, i) => {
              const isBingo = bingoCells.has(i);
              return (
                <View
                  key={i}
                  style={[
                    styles.cell,
                    cell.done && styles.cellDone,
                    isBingo && styles.cellBingo,
                    cell.free && styles.cellFree,
                  ]}
                >
                  <Text style={styles.cellEmoji}>{cell.emoji}</Text>
                  <Text
                    style={[
                      styles.cellText,
                      cell.done && styles.cellTextDone,
                    ]}
                    numberOfLines={2}
                  >
                    {cell.title}
                  </Text>
                  {cell.done && !cell.free && (
                    <View style={styles.checkMark}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Легенда */}
        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendText}>{t('bingo_legend_done')}</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#FFD600' }]} />
            <Text style={styles.legendText}>{t('bingo_legend_bingo')}</Text>
          </View>
        </View>
      </ScrollView>
      <LanguagePicker visible={showLangPicker} onClose={() => setShowLangPicker(false)} />
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
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backText: { fontSize: 24, color: Colors.text },
  headerCenter: { flex: 1 },
  langBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: Typography.fontSize.lg, fontWeight: '800', color: Colors.text },
  bingoAlert: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: '#e65100',
    marginTop: 2,
  },

  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statNum: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  headerCell: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLetter: {
    fontSize: Typography.fontSize.md,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
  cell: {
    width: CELL,
    height: CELL,
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  cellDone: {
    backgroundColor: '#e8f5e9',
    borderColor: Colors.primary,
  },
  cellBingo: {
    backgroundColor: '#fff9c4',
    borderColor: '#FFD600',
    borderWidth: 2,
  },
  cellFree: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  cellEmoji: { fontSize: CELL * 0.28 },
  cellText: {
    fontSize: 8,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 10,
  },
  cellTextDone: {
    color: Colors.primary,
    fontWeight: '700',
  },
  checkMark: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: { fontSize: 8, color: '#fff', fontWeight: '900' },

  legend: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.md,
    justifyContent: 'center',
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
});
