import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import VoiceMemo from '../../components/VoiceMemo';
import { getCard, deleteCard, PlantCard, uploadVoiceMemo } from '../../services/storage';
import { Colors, Spacing, Radius, Typography } from '../../constants/theme';

export default function CardDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [card, setCard] = useState<PlantCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCard(id).then((c) => { setCard(c); setLoading(false); });
  }, [id]);

  async function handleVoiceRecorded(uri: string) {
    if (!card?.id) return;
    await uploadVoiceMemo(uri, card.id);
  }

  async function handleDelete() {
    Alert.alert('Видалити?', 'Цю картку буде видалено назавжди', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: async () => {
          await deleteCard(card!.id!, card!.imageUrl);
          router.back();
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!card) {
    return (
      <View style={styles.center}>
        <Text>Картку не знайдено</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Фото */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: card.imageUrl }} style={styles.image} resizeMode="cover" />
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>Точність: {card.score}%</Text>
        </View>
      </View>

      {/* Основна інфо */}
      <View style={styles.card}>
        <Text style={styles.commonName}>{card.commonName}</Text>
        <Text style={styles.sciName}>{card.scientificName}</Text>
        <Text style={styles.family}>Родина: {card.family}</Text>

        <View style={styles.divider} />

        {/* Локація */}
        {card.location && (
          <View style={styles.row}>
            <Text style={styles.rowIcon}>📍</Text>
            <Text style={styles.rowText}>{card.location.label ?? 'Невідоме місце'}</Text>
          </View>
        )}

        {/* Дата */}
        <View style={styles.row}>
          <Text style={styles.rowIcon}>📅</Text>
          <Text style={styles.rowText}>
            {card.createdAt.toLocaleDateString('uk-UA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Голосовий спогад */}
        <Text style={styles.sectionTitle}>Голосовий спогад</Text>
        <VoiceMemo
          onRecorded={handleVoiceRecorded}
          existingUri={card.voiceMemoUrl}
        />
      </View>

      {/* Кнопка видалення */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>Видалити картку</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 320 },
  scoreBadge: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  scoreText: { color: '#fff', fontWeight: '700', fontSize: Typography.fontSize.sm },
  card: {
    margin: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  commonName: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
  },
  sciName: {
    fontSize: Typography.fontSize.md,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  family: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  rowIcon: { fontSize: 16 },
  rowText: { fontSize: Typography.fontSize.sm, color: Colors.text },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  deleteBtn: {
    marginHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.error,
    alignItems: 'center',
  },
  deleteBtnText: { color: Colors.error, fontWeight: '600', fontSize: Typography.fontSize.md },
});
