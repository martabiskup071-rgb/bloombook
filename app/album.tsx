import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import LiveCard from '../components/LiveCard';
import XPBar from '../components/XPBar';
import LanguagePicker from '../components/LanguagePicker';
import { subscribeToCards, PlantCard } from '../services/storage';
import { getXPState, XPState, computeXPState } from '../services/xp';
import { getFamilyCode, getMemberName } from '../services/family';
import { useLanguage } from '../services/language';
import { Colors, Spacing, Typography, Radius } from '../constants/theme';

type SortOrder = 'newest' | 'oldest';

export default function Album() {
  const router = useRouter();
  const { t } = useLanguage();
  const [cards, setCards] = useState<PlantCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [xpState, setXpState] = useState<XPState>(computeXPState(0));
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [memberName, setMemberName] = useState('');

  // Search / filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Перевіряємо сімейний код при відкритті
  useEffect(() => {
    getFamilyCode().then((code) => {
      if (!code) router.replace('/family-setup');
    });
    getMemberName().then((n) => setMemberName(n ?? ''));
  }, []);

  // Real-time підписка на картки сім'ї
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    subscribeToCards((data) => {
      setCards(data);
      setLoading(false);
      setRefreshing(false);
      getXPState().then(setXpState);
    }).then((unsub) => {
      unsubscribe = unsub;
    }).catch(() => setLoading(false));
    return () => { unsubscribe?.(); };
  }, []);

  const onRefresh = () => setRefreshing(true);

  // Унікальні імена учасників для фільтра
  const members = useMemo(() => {
    const names = cards
      .map((c) => c.addedBy)
      .filter((n): n is string => !!n);
    return [...new Set(names)];
  }, [cards]);

  // Фільтрація + сортування
  const filteredCards = useMemo(() => {
    let result = [...cards];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((c) =>
        c.commonName?.toLowerCase().includes(q) ||
        c.scientificName?.toLowerCase().includes(q)
      );
    }

    if (selectedMember) {
      result = result.filter((c) => c.addedBy === selectedMember);
    }

    result.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === 'newest' ? tb - ta : ta - tb;
    });

    return result;
  }, [cards, searchQuery, selectedMember, sortOrder]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('album_title')}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setShowLangPicker(true)} style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>🌐</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/map')} style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>🗺️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/challenge')} style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>🎯</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/family-settings')} style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>👨‍👩‍👧</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* XP бар */}
      <XPBar xpState={xpState} />

      {/* Пошук */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('search_placeholder')}
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {/* Сортування */}
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setSortOrder((o) => o === 'newest' ? 'oldest' : 'newest')}
        >
          <Text style={styles.sortBtnText}>
            {sortOrder === 'newest' ? '↓' : '↑'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Фільтр по учасниках (показуємо лише якщо є > 1 учасника) */}
      {members.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          <TouchableOpacity
            style={[styles.chip, !selectedMember && styles.chipActive]}
            onPress={() => setSelectedMember(null)}
          >
            <Text style={[styles.chipText, !selectedMember && styles.chipTextActive]}>
              {t('filter_all')}
            </Text>
          </TouchableOpacity>
          {members.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.chip, selectedMember === m && styles.chipActive]}
              onPress={() => setSelectedMember(selectedMember === m ? null : m)}
            >
              <Text style={[styles.chipText, selectedMember === m && styles.chipTextActive]}>
                👤 {m}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {filteredCards.length === 0 && !loading ? (
        <View style={styles.empty}>
          {cards.length === 0 ? (
            <>
              <Text style={styles.emptyEmoji}>🌱</Text>
              <Text style={styles.emptyTitle}>{t('album_empty_title')}</Text>
              <Text style={styles.emptyText}>{t('album_empty_text')}</Text>
            </>
          ) : (
            <>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>
                {searchQuery ? `"${searchQuery}"` : selectedMember ?? ''}
              </Text>
              <Text style={styles.emptyText}>
                {t('album_empty_text')}
              </Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredCards}
          keyExtractor={(item) => item.id!}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <LiveCard card={item} onPress={() => router.push(`/card/${item.id}`)} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
        />
      )}

      {/* FAB — камера */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/camera')}>
        <Text style={styles.fabText}>📷</Text>
      </TouchableOpacity>

      <LanguagePicker visible={showLangPicker} onClose={() => setShowLangPicker(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl + 16,
    paddingBottom: Spacing.md,
  },
  title: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.text },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBtnText: { fontSize: 18 },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 42,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortBtnText: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '700',
  },

  // Filter chips
  chipsRow: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },

  list: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 100 },
  row: { gap: Spacing.md, justifyContent: 'space-between' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyEmoji: { fontSize: 64, marginBottom: Spacing.md },
  emptyTitle: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.text },
  emptyText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: { fontSize: 26 },
});
