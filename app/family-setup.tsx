import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../services/language';
import { createFamily, joinFamily } from '../services/family';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';

type Step = 'name' | 'choice' | 'create_done' | 'join_code';

export default function FamilySetupScreen() {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const [step, setStep]         = useState<Step>('name');
  const [name, setName]         = useState('');
  const [code, setCode]         = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [loading, setLoading]   = useState(false);

  // Крок 1 — ввести ім'я
  async function handleNameNext() {
    if (!name.trim()) return;
    setStep('choice');
  }

  // Крок 2а — створити нову сім'ю
  async function handleCreate() {
    setLoading(true);
    try {
      const newCode = await createFamily(name.trim());
      setFamilyCode(newCode);
      setStep('create_done');
    } catch (e) {
      Alert.alert('Помилка', String(e));
    } finally {
      setLoading(false);
    }
  }

  // Крок 2б — ввести код і приєднатись
  async function handleJoin() {
    if (code.length < 4) return;
    setLoading(true);
    try {
      await joinFamily(code, name.trim());
      router.replace('/album');
    } catch (e) {
      Alert.alert('Помилка', String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Кнопка назад */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/')}>
          <Text style={styles.backBtnText}>← {t('back')}</Text>
        </TouchableOpacity>

        {/* Логотип */}
        <View style={styles.logoRow}>
          <Text style={styles.logoEmoji}>🌿</Text>
          <Text style={styles.logoText}>Bloombook</Text>
        </View>

        <Text style={styles.title}>{t('family_setup_title')}</Text>
        <Text style={styles.subtitle}>{t('family_setup_subtitle')}</Text>

        {/* ── Крок: Ім'я ── */}
        {step === 'name' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('family_your_name')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('family_name_placeholder')}
              placeholderTextColor={Colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={handleNameNext}
            />
            <TouchableOpacity
              style={[styles.btn, !name.trim() && styles.btnDisabled]}
              onPress={handleNameNext}
              disabled={!name.trim()}
            >
              <Text style={styles.btnText}>{t('family_continue')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Крок: Вибір ── */}
        {step === 'choice' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>👋 {name}!</Text>
            <Text style={styles.cardSubtitle}>
              {t('family_setup_subtitle')}
            </Text>

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleCreate}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>🌱 {t('family_create')}</Text>
              }
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{lang === 'en' ? 'or' : 'або'}</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() => setStep('join_code')}
            >
              <Text style={styles.btnOutlineText}>🔗 {t('family_join')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Крок: Код створено ── */}
        {step === 'create_done' && (
          <View style={styles.card}>
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.cardTitle}>{t('family_code_label')}</Text>

            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{familyCode}</Text>
            </View>

            <Text style={styles.codeHint}>{t('family_code_share')}</Text>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => router.replace('/album')}
            >
              <Text style={styles.btnText}>{t('family_continue')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Крок: Ввести код ── */}
        {step === 'join_code' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('family_enter_code')}</Text>
            <TextInput
              style={[styles.input, styles.codeInput]}
              placeholder="ABC123"
              placeholderTextColor={Colors.textSecondary}
              value={code}
              onChangeText={(v) => setCode(v.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              autoCapitalize="characters"
              maxLength={6}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleJoin}
            />

            <TouchableOpacity
              style={[styles.btn, (code.length < 4 || loading) && styles.btnDisabled]}
              onPress={handleJoin}
              disabled={code.length < 4 || loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>{t('family_continue')}</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backLink}
              onPress={() => setStep('choice')}
            >
              <Text style={styles.backLinkText}>← {t('back')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + 16,
    paddingBottom: Spacing.xxl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  logoEmoji: { fontSize: 36 },
  logoText: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '800',
    color: Colors.primary,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  codeInput: {
    textAlign: 'center',
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    letterSpacing: 6,
  },
  btn: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnText: {
    color: '#fff',
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
  },
  btnOutline: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '100%',
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textSecondary, fontSize: Typography.fontSize.xs },
  successEmoji: { fontSize: 48 },
  codeBox: {
    backgroundColor: '#e8f5e9',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  codeText: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 8,
  },
  codeHint: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  backLink: { paddingVertical: Spacing.sm },
  backLinkText: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  backBtnText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
});
