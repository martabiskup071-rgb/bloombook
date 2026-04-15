import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../services/language';
import { Colors, Spacing, Typography } from '../constants/theme';

export default function MapScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/album')}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={styles.emoji}>🗺️</Text>
        <Text style={styles.text}>{t('map_mobile_only')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  backBtn: {
    position: 'absolute',
    top: Spacing.xl + 16,
    left: Spacing.lg,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { fontSize: 22, color: Colors.text },
  emoji: { fontSize: 64, marginBottom: Spacing.md },
  text: { fontSize: Typography.fontSize.md, color: Colors.textSecondary, textAlign: 'center' },
});
