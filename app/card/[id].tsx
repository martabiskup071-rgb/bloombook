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
  Platform,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import VoiceMemo from '../../components/VoiceMemo';
import Confetti from '../../components/Confetti';
import LanguagePicker from '../../components/LanguagePicker';
import { getCard, deleteCard, updateCard, PlantCard, uploadVoiceMemo } from '../../services/storage';
import { generatePlantLetter, getPlantCharacter, getPlantEmoji } from '../../services/plantLetter';
import { useLanguage } from '../../services/language';
import { Colors, Spacing, Radius, Typography } from '../../constants/theme';

export default function CardDetail() {
  const { id, isNew } = useLocalSearchParams<{ id: string; isNew?: string }>();
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [card, setCard] = useState<PlantCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(isNew === '1');
  const [showLangPicker, setShowLangPicker] = useState(false);

  useEffect(() => {
    getCard(id).then((c) => { setCard(c); setLoading(false); });
  }, [id]);

  async function handleVoiceRecorded(uri: string) {
    if (!card?.id) return;
    await uploadVoiceMemo(uri, card.id);
  }

  async function handleDelete() {
    if (Platform.OS === 'web') {
      if (!window.confirm(t('card_delete_confirm_msg'))) return;
      await deleteCard(card!.id!, card!.imageUrl);
      router.replace('/album');
    } else {
      Alert.alert(t('card_delete_confirm_title'), t('card_delete_confirm_msg'), [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteCard(card!.id!, card!.imageUrl);
            router.replace('/album');
          },
        },
      ]);
    }
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
        <Text>{t('card_not_found')}</Text>
      </View>
    );
  }

  return (
    <>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Фото */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: card.imageUrl }} style={styles.image} resizeMode="cover" />

        {/* Кнопка назад */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/album')}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>

        {/* Кнопка мови */}
        <TouchableOpacity style={styles.langBtn} onPress={() => setShowLangPicker(true)}>
          <Text style={{ fontSize: 20 }}>🌐</Text>
        </TouchableOpacity>

        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{t('card_accuracy')}: {card.score}%</Text>
        </View>
      </View>

      {/* Основна інфо */}
      <View style={styles.card}>
        <Text style={styles.commonName}>{card.commonName}</Text>
        <Text style={styles.sciName}>{card.scientificName}</Text>
        <Text style={styles.family}>{t('family')}: {card.family}</Text>

        <View style={styles.divider} />

        {/* Локація */}
        {card.location && (
          <View style={styles.row}>
            <Text style={styles.rowIcon}>📍</Text>
            <Text style={styles.rowText}>{card.location.label ?? t('card_unknown_location')}</Text>
          </View>
        )}

        {/* Дата */}
        <View style={styles.row}>
          <Text style={styles.rowIcon}>📅</Text>
          <Text style={styles.rowText}>
            {card.createdAt.toLocaleDateString(lang === 'en' ? 'en-GB' : 'uk-UA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Голосовий спогад */}
        <Text style={styles.sectionTitle}>{t('card_voice_title')}</Text>
        <VoiceMemo
          onRecorded={handleVoiceRecorded}
          existingUri={card.voiceMemoUrl}
        />

        <View style={styles.divider} />

        {/* Настрій */}
        <Text style={styles.sectionTitle}>{t('card_mood_title')}</Text>
        <MoodPicker
          value={card.mood}
          onChange={async (mood) => {
            setCard({ ...card, mood });
            if (card.id) await updateCard(card.id, { mood });
          }}
        />

        <View style={styles.divider} />

        {/* Нотатки */}
        <Text style={styles.sectionTitle}>{t('card_note_title')}</Text>
        <NoteEditor
          value={card.note}
          placeholder={t('card_note_placeholder')}
          saveLabel={t('save')}
          savedLabel={t('saved')}
          onSave={async (note) => {
            setCard({ ...card, note });
            if (card.id) await updateCard(card.id, { note });
          }}
        />
      </View>

      {/* Лист від рослини */}
      <PlantLetter card={card} />

      {/* Кнопка видалення */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>{t('card_delete_btn')}</Text>
      </TouchableOpacity>
    </ScrollView>

    {/* Конфеті 🎉 */}
    <Confetti visible={showConfetti} onDone={() => setShowConfetti(false)} />
    <LanguagePicker visible={showLangPicker} onClose={() => setShowLangPicker(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageWrap: { position: 'relative', height: 320, backgroundColor: '#e8f5e9' },
  backBtn: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  langBtn: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backBtnText: { color: '#fff', fontSize: 22, lineHeight: 26 },
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
  moodRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  moodBtn: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minWidth: 52,
    backgroundColor: Colors.background,
  },
  moodBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: '#f1f8f4',
  },
  moodEmoji: { fontSize: 26 },
  moodLabel: { fontSize: 9, color: Colors.primary, fontWeight: '700', marginTop: 2 },

  noteWrap: { gap: Spacing.sm },
  noteInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    backgroundColor: Colors.surface,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  noteSaveBtn: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  noteSaveBtnDone: { backgroundColor: Colors.success },
  noteSaveBtnText: { color: '#fff', fontWeight: '700', fontSize: Typography.fontSize.sm },

  letterWrap: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  letterGradient: {
    backgroundColor: '#f0faf0',
    borderWidth: 1.5,
    borderColor: '#c8e6c9',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  letterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  letterEmoji: { fontSize: 32 },
  letterHeaderText: { flex: 1 },
  letterTitle: { fontSize: Typography.fontSize.sm, fontWeight: '800', color: '#2e7d32' },
  letterCharacter: { fontSize: Typography.fontSize.xs, color: '#66bb6a', marginTop: 2 },
  letterBody: {
    fontSize: Typography.fontSize.sm,
    color: '#37474f',
    lineHeight: 22,
  },
  letterToggle: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
  letterToggleText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
});

// Компонент вибору настрою
function MoodPicker({ value, onChange }: { value?: string; onChange: (mood: string) => void }) {
  const { t } = useLanguage();
  const MOODS = [
    { emoji: '🤩', label: t('mood_delight') },
    { emoji: '😊', label: t('mood_joy') },
    { emoji: '💚', label: t('mood_love') },
    { emoji: '😌', label: t('mood_calm') },
    { emoji: '🌟', label: t('mood_inspired') },
    { emoji: '🤔', label: t('mood_curious') },
  ];
  return (
    <View style={styles.moodRow}>
      {MOODS.map((m) => (
        <TouchableOpacity
          key={m.emoji}
          style={[styles.moodBtn, value === m.emoji && styles.moodBtnActive]}
          onPress={() => onChange(m.emoji)}
        >
          <Text style={styles.moodEmoji}>{m.emoji}</Text>
          {value === m.emoji && <Text style={styles.moodLabel}>{m.label}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Компонент нотаток
function NoteEditor({ value, placeholder, saveLabel, savedLabel, onSave }: {
  value?: string;
  placeholder?: string;
  saveLabel?: string;
  savedLabel?: string;
  onSave: (note: string) => void;
}) {
  const [text, setText] = React.useState(value ?? '');
  const [saved, setSaved] = React.useState(false);

  async function handleSave() {
    await onSave(text);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <View style={styles.noteWrap}>
      <TextInput
        style={styles.noteInput}
        value={text}
        onChangeText={(v) => { setText(v); setSaved(false); }}
        placeholder={placeholder ?? '...'}
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity
        style={[styles.noteSaveBtn, saved && styles.noteSaveBtnDone]}
        onPress={handleSave}
      >
        <Text style={styles.noteSaveBtnText}>
          {saved ? (savedLabel ?? '✓') : (saveLabel ?? 'Save')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Компонент "Лист від рослини"
function PlantLetter({ card }: { card: PlantCard }) {
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = React.useState(false);

  const letter = generatePlantLetter(
    card.scientificName,
    card.commonName,
    card.family ?? '',
    card.createdAt,
    lang,
  );
  const emoji = getPlantEmoji(card.family ?? '');
  const character = getPlantCharacter(card.family ?? '', lang);

  // Показуємо тільки перший абзац якщо згорнуто
  const preview = letter.split('\n\n')[0];
  const displayText = expanded ? letter : preview;

  return (
    <View style={styles.letterWrap}>
      <View style={styles.letterGradient}>
        <View style={styles.letterHeader}>
          <Text style={styles.letterEmoji}>{emoji}</Text>
          <View style={styles.letterHeaderText}>
            <Text style={styles.letterTitle}>{t('card_letter_title')}</Text>
            <Text style={styles.letterCharacter}>{character}</Text>
          </View>
        </View>
        <Text style={styles.letterBody}>{displayText}</Text>
        <TouchableOpacity style={styles.letterToggle} onPress={() => setExpanded(!expanded)}>
          <Text style={styles.letterToggleText}>
            {expanded ? t('card_letter_collapse') : t('card_letter_expand')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
