import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import LiveCard from '../components/LiveCard';
import { getCards, PlantCard } from '../services/storage';
import { Colors, Spacing, Typography, Radius } from '../constants/theme';

export default function Album() {
  const router = useRouter();
  const [cards, setCards] = useState<PlantCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await getCards();
      setCards(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

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
        <Text style={styles.title}>Мій альбом 🌿</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/map')} style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>🗺️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/challenge')} style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>🎯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {cards.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyTitle}>Поки що порожньо</Text>
          <Text style={styles.emptyText}>Сфотографуй першу рослину, щоб почати колекцію</Text>
        </View>
      ) : (
        <FlatList
          data={cards}
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
              onRefresh={() => { setRefreshing(true); load(); }}
              tintColor={Colors.primary}
            />
          }
        />
      )}

      {/* FAB — камера */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/camera')}>
        <Text style={styles.fabText}>📷</Text>
      </TouchableOpacity>
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
  list: { padding: Spacing.md, gap: Spacing.md },
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
