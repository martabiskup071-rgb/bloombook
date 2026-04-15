import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';
import type { PlantCard } from '../services/storage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

interface LiveCardProps {
  card: PlantCard;
  onPress?: () => void;
}

export default function LiveCard({ card, onPress }: LiveCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 20 }).start();
    Animated.timing(shimmer, { toValue: 1, duration: 400, useNativeDriver: false }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
    Animated.timing(shimmer, { toValue: 0, duration: 400, useNativeDriver: false }).start();
  };

  const borderColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.primary],
  });

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }], borderColor }]}>
        {/* Фото */}
        <Image source={{ uri: card.imageUrl }} style={styles.image} resizeMode="cover" />

        {/* Бейдж точності */}
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{card.score}%</Text>
        </View>

        {/* Інфо */}
        <View style={styles.info}>
          <Text style={styles.commonName} numberOfLines={1}>
            {card.commonName}
          </Text>
          <Text style={styles.sciName} numberOfLines={1}>
            {card.scientificName}
          </Text>
          {!!card.location?.label && (
            <Text style={styles.location} numberOfLines={1}>
              📍 {card.location.label}
            </Text>
          )}
          {!!card.addedBy && (
            <Text style={styles.addedBy} numberOfLines={1}>
              👤 {card.addedBy}
            </Text>
          )}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    borderWidth: 1.5,
    // тінь (elevation для Android, boxShadow для web/iOS)
    elevation: 5,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.10)',
  } as any,
  image: {
    width: '100%',
    height: '62%',
  },
  scoreBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  scoreText: {
    color: '#fff',
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  info: {
    padding: Spacing.sm,
    flex: 1,
    justifyContent: 'center',
  },
  commonName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  sciName: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  location: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  addedBy: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    marginTop: 2,
    fontWeight: '600',
  },
});
