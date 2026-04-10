import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { getCards, PlantCard } from '../services/storage';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';

export default function MapScreen() {
  const router = useRouter();
  const [cards, setCards] = useState<PlantCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCards()
      .then((data) => setCards(data.filter((c) => c.location)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const initialRegion =
    cards.length > 0
      ? {
          latitude: cards[0].location!.latitude,
          longitude: cards[0].location!.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }
      : {
          latitude: 48.3794,   // Центр України
          longitude: 31.1656,
          latitudeDelta: 8,
          longitudeDelta: 8,
        };

  return (
    <View style={styles.container}>
      {/* Кнопка назад */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <MapView style={StyleSheet.absoluteFill} initialRegion={initialRegion}>
        {cards.map((card) =>
          card.location ? (
            <Marker
              key={card.id}
              coordinate={{
                latitude: card.location.latitude,
                longitude: card.location.longitude,
              }}
              pinColor={Colors.primary}
            >
              <Callout onPress={() => router.push(`/card/${card.id}`)}>
                <View style={styles.callout}>
                  <Image
                    source={{ uri: card.imageUrl }}
                    style={styles.calloutImage}
                  />
                  <Text style={styles.calloutName}>{card.commonName}</Text>
                  <Text style={styles.calloutSci}>{card.scientificName}</Text>
                  <Text style={styles.calloutAction}>Натисни для деталей →</Text>
                </View>
              </Callout>
            </Marker>
          ) : null
        )}
      </MapView>

      {/* Лічильник */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>📍 {cards.length} знахідок</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: {
    position: 'absolute',
    top: Spacing.xl + 16,
    left: Spacing.lg,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  backText: { fontSize: 22, color: Colors.text },
  counter: {
    position: 'absolute',
    bottom: Spacing.xl,
    alignSelf: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  counterText: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.text },
  callout: { width: 180, padding: Spacing.sm },
  calloutImage: {
    width: '100%',
    height: 100,
    borderRadius: Radius.sm,
    marginBottom: Spacing.xs,
  },
  calloutName: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.text },
  calloutSci: { fontSize: Typography.fontSize.xs, fontStyle: 'italic', color: Colors.textSecondary },
  calloutAction: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
});
