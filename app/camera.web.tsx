// Веб-версія камери — надійний вибір фото для мобільних браузерів
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { recognizePlant } from '../services/recognition';
import { useLanguage } from '../services/language';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';

export default function CameraWeb() {
  const router = useRouter();
  const { t } = useLanguage();
  const inputRef = useRef<any>(null);
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function openPicker(capture?: boolean) {
    // Створюємо input програмно для надійного спрацювання
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (capture) input.setAttribute('capture', 'environment');

    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const uri = URL.createObjectURL(file);
      setPreview(uri);
    };

    // Додаємо в DOM і клікаємо
    document.body.appendChild(input);
    input.click();
    setTimeout(() => document.body.removeChild(input), 1000);
  }

  async function handleRecognize() {
    if (!preview || scanning) return;
    setScanning(true);
    try {
      const recognition = await recognizePlant(preview);
      if (!recognition.results || recognition.results.length === 0) {
        Alert.alert(t('error'), t('camera_error_notfound'));
        return;
      }
      router.push({
        pathname: '/results',
        params: {
          data: JSON.stringify(recognition.results.slice(0, 5)),
          imageUri: preview,
        },
      });
    } catch (e: any) {
      Alert.alert(t('error'), e.message ?? t('error'));
    } finally {
      setScanning(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Хедер */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('camera_title')}</Text>
      </View>

      {/* Область фото */}
      <View style={styles.photoArea}>
        {preview ? (
          <Image source={{ uri: preview }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderEmoji}>🌿</Text>
            <Text style={styles.placeholderText}>{t('camera_hint')}</Text>
          </View>
        )}
      </View>

      {/* Кнопки */}
      <View style={styles.actions}>
        {/* Камера */}
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          onPress={() => openPicker(true)}
          disabled={scanning}
        >
          <Text style={styles.btnIcon}>📷</Text>
          <Text style={styles.btnOutlineText}>{t('camera_btn_camera')}</Text>
        </TouchableOpacity>

        {/* Галерея */}
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          onPress={() => openPicker(false)}
          disabled={scanning}
        >
          <Text style={styles.btnIcon}>🖼️</Text>
          <Text style={styles.btnOutlineText}>{t('camera_btn_gallery')}</Text>
        </TouchableOpacity>
      </View>

      {/* Кнопка розпізнати */}
      {preview && (
        <TouchableOpacity
          style={[styles.recognizeBtn, scanning && styles.recognizeBtnDisabled]}
          onPress={handleRecognize}
          disabled={scanning}
        >
          {scanning ? (
            <View style={styles.recognizingRow}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.recognizeBtnText}>{t('camera_recognizing')}</Text>
            </View>
          ) : (
            <Text style={styles.recognizeBtnText}>{t('camera_btn_recognize')}</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Підказка */}
      {!preview && (
        <Text style={styles.hint}>{t('camera_hint')}</Text>
      )}
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
  title: { fontSize: Typography.fontSize.lg, fontWeight: '800', color: Colors.text },

  photoArea: {
    margin: Spacing.lg,
    height: 300,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  preview: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  placeholderEmoji: { fontSize: 64 },
  placeholderText: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },

  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  btnIcon: { fontSize: 22 },
  btnOutlineText: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.primary },

  recognizeBtn: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  recognizeBtnDisabled: { opacity: 0.7 },
  recognizingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  recognizeBtnText: { color: '#fff', fontWeight: '800', fontSize: Typography.fontSize.md },

  hint: {
    textAlign: 'center',
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
});
