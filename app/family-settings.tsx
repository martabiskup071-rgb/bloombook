import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, Share, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../services/language';
import { getFamilyCode, getMemberName, leaveFamily } from '../services/family';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';

export default function FamilySettingsScreen() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [familyCode, setFamilyCode] = useState('');
  const [memberName, setMemberName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFamilyCode().then((c) => setFamilyCode(c ?? ''));
    getMemberName().then((n) => setMemberName(n ?? ''));
  }, []);

  async function handleShare() {
    const msg = lang === 'en'
      ? `Join our family plant collection in Bloombook!\nFamily code: ${familyCode}\n🌿`
      : `Приєднуйся до нашої сімейної колекції рослин у Bloombook!\nКод сім'ї: ${familyCode}\n🌿`;
    try {
      await Share.share({ message: msg });
    } catch {}
  }

  async function handleLeave() {
    Alert.alert(
      t('family_leave'),
      t('family_leave_confirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('family_leave'),
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await leaveFamily();
            router.replace('/');
          },
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      {/* Хедер */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/album')} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>👨‍👩‍👧 {t('family_members')}</Text>
      </View>

      <View style={styles.content}>
        {/* Ім'я учасника */}
        <View style={styles.card}>
          <Text style={styles.label}>👤 {t('family_your_name')}</Text>
          <Text style={styles.value}>{memberName}</Text>
        </View>

        {/* Код сім'ї */}
        <View style={styles.card}>
          <Text style={styles.label}>🔑 {t('family_code_label')}</Text>
          <View style={styles.codeRow}>
            <Text style={styles.code}>{familyCode}</Text>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.shareBtnText}>{t('family_share_btn')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>{t('family_code_share')}</Text>
        </View>

        {/* Як приєднатись */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t('family_invite_title')}</Text>
          <Text style={styles.infoText}>{t('family_invite_steps')}</Text>
        </View>

        {/* Покинути сім'ю */}
        <TouchableOpacity
          style={styles.leaveBtn}
          onPress={handleLeave}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={Colors.error ?? '#e53935'} />
            : <Text style={styles.leaveBtnText}>🚪 {t('family_leave')}</Text>
          }
        </TouchableOpacity>
      </View>
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
  title: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.text },
  content: { padding: Spacing.lg, gap: Spacing.md },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  code: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 4,
  },
  shareBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  shareBtnText: { color: '#fff', fontWeight: '700', fontSize: Typography.fontSize.sm },
  hint: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
  infoCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  infoTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: 24,
  },
  codeInline: {
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 2,
  },
  leaveBtn: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: '#e53935',
  },
  leaveBtnText: {
    color: '#e53935',
    fontWeight: '700',
    fontSize: Typography.fontSize.md,
  },
});
