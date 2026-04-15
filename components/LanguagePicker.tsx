import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { LANGUAGES, type LangCode } from '../constants/i18n';
import { useLanguage } from '../services/language';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function LanguagePicker({ visible, onClose }: Props) {
  const { lang, setLang, t } = useLanguage();

  function handleSelect(code: LangCode) {
    setLang(code);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title}>{t('lang_title')}</Text>
          {LANGUAGES.map((l) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.row, lang === l.code && styles.rowActive]}
              onPress={() => handleSelect(l.code)}
            >
              <Text style={styles.flag}>{l.flag}</Text>
              <Text style={[styles.label, lang === l.code && styles.labelActive]}>
                {l.label}
              </Text>
              {lang === l.code && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    width: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
  },
  rowActive: {
    backgroundColor: '#f1f8f4',
  },
  flag: { fontSize: 22 },
  label: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
  },
  labelActive: {
    fontWeight: '700',
    color: Colors.primary,
  },
  check: {
    fontSize: Typography.fontSize.md,
    color: Colors.primary,
    fontWeight: '700',
  },
});
