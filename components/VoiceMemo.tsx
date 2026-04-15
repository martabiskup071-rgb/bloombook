import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import { useLanguage } from '../services/language';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';

interface VoiceMemoProps {
  onRecorded?: (uri: string) => void;
  existingUri?: string;
}

export default function VoiceMemo({ onRecorded, existingUri }: VoiceMemoProps) {
  const { t } = useLanguage();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(existingUri ?? null);

  const ripple = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRipple = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ripple, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(ripple, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  };

  async function startRecording() {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

    const { recording: rec } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(rec);
    setIsRecording(true);
    setDuration(0);
    startRipple();

    timer.current = setInterval(() => setDuration((d) => d + 1), 1000);
  }

  async function stopRecording() {
    if (!recording) return;
    clearInterval(timer.current!);
    ripple.stopAnimation();

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI() ?? '';
    setRecording(null);
    setIsRecording(false);
    setAudioUri(uri);
    onRecorded?.(uri);
  }

  async function playback() {
    if (!audioUri) return;
    if (isPlaying) {
      await sound?.stopAsync();
      setIsPlaying(false);
      return;
    }
    const { sound: s } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(s);
    setIsPlaying(true);
    await s.playAsync();
    s.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) setIsPlaying(false);
    });
  }

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const rippleScale = ripple.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const rippleOpacity = ripple.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Кнопка запису */}
        <View style={styles.recordWrapper}>
          {isRecording && (
            <Animated.View
              style={[styles.ripple, { transform: [{ scale: rippleScale }], opacity: rippleOpacity }]}
            />
          )}
          <TouchableOpacity
            style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
            onPress={isRecording ? stopRecording : startRecording}
            activeOpacity={0.8}
          >
            <View style={isRecording ? styles.stopIcon : styles.micIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>
            {isRecording ? `${t('voice_recording')} ${formatTime(duration)}` : audioUri ? t('voice_memo') : t('voice_add')}
          </Text>
          {audioUri && !isRecording && (
            <TouchableOpacity onPress={playback}>
              <Text style={styles.playBtn}>{isPlaying ? t('voice_stop') : t('voice_play')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  recordWrapper: { width: 52, height: 52, justifyContent: 'center', alignItems: 'center' },
  ripple: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accent,
  },
  recordBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordBtnActive: { backgroundColor: Colors.accent },
  micIcon: {
    width: 10,
    height: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  stopIcon: {
    width: 14,
    height: 14,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  info: { flex: 1 },
  label: { fontSize: Typography.fontSize.sm, color: Colors.text, fontWeight: '600' },
  playBtn: { fontSize: Typography.fontSize.sm, color: Colors.primary, marginTop: 4 },
});
