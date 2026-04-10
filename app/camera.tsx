import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import ScanFrame from '../components/ScanFrame';
import { recognizePlant } from '../services/recognition';
import { saveCard, uploadImage } from '../services/storage';
import * as Location from 'expo-location';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';

export default function Camera() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);

  async function shoot() {
    if (!cameraRef.current) return;
    setScanning(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo) return;
      await processImage(photo.uri);
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося зробити фото');
    } finally {
      setScanning(false);
    }
  }

  async function pickFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled) return;
    setScanning(true);
    try {
      await processImage(result.assets[0].uri);
    } finally {
      setScanning(false);
    }
  }

  async function processImage(uri: string) {
    const recognition = await recognizePlant(uri);
    if (!recognition.bestMatch) {
      Alert.alert('Не розпізнано', 'Спробуй сфотографувати ближче або з іншого кута');
      return;
    }

    // Геолокація
    let location: { latitude: number; longitude: number; label?: string } | undefined;
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      const [geo] = await Location.reverseGeocodeAsync(loc.coords);
      location = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        label: [geo?.city, geo?.country].filter(Boolean).join(', '),
      };
    }

    const tempId = Date.now().toString();
    const imageUrl = await uploadImage(uri, tempId);

    const id = await saveCard({
      scientificName: recognition.bestMatch.scientificName,
      commonName: recognition.bestMatch.commonNames[0] ?? recognition.bestMatch.scientificName,
      family: recognition.bestMatch.family,
      score: recognition.bestMatch.score,
      imageUrl,
      location,
      createdAt: new Date(),
    });

    router.replace(`/card/${id}`);
  }

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>Потрібен доступ до камери</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Дозволити</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

      {/* Накладення */}
      <View style={styles.overlay}>
        <Text style={styles.hint}>Наведи на рослину</Text>
        <ScanFrame scanning={scanning} />
        {scanning && (
          <View style={styles.scanningInfo}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.scanningText}>Розпізнаю...</Text>
          </View>
        )}
      </View>

      {/* Контроли */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.galleryBtn} onPress={pickFromGallery} disabled={scanning}>
          <Text style={styles.galleryText}>🖼️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shootBtn} onPress={shoot} disabled={scanning}>
          <View style={styles.shootInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.galleryBtn} onPress={() => router.back()}>
          <Text style={styles.galleryText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  hint: { color: '#fff', fontSize: Typography.fontSize.md, fontWeight: '600', opacity: 0.9 },
  scanningInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  scanningText: { color: '#fff', fontSize: Typography.fontSize.sm },
  controls: {
    position: 'absolute',
    bottom: Spacing.xxl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  shootBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shootInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  galleryBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryText: { fontSize: 22 },
  permText: { fontSize: Typography.fontSize.md, color: Colors.text, marginBottom: Spacing.md },
  permBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  permBtnText: { color: '#fff', fontWeight: '700' },
});
