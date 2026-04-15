// Pl@ntNet API — розпізнавання рослин за фото
import { Platform } from 'react-native';

const PLANTNET_API_KEY = process.env.EXPO_PUBLIC_PLANTNET_API_KEY ?? '';
const PLANTNET_BASE_URL = 'https://my-api.plantnet.org/v2/identify/all';

export interface PlantResult {
  scientificName: string;
  commonNames: string[];
  family: string;
  genus: string;
  score: number;
  imageUrl?: string;
  wikiUrl?: string;
}

export interface RecognitionResponse {
  bestMatch: PlantResult;
  results: PlantResult[];
}

export async function recognizePlant(
  imageUri: string
): Promise<RecognitionResponse> {
  const formData = new FormData();
  formData.append('organs', 'auto');

  let data: any;

  if (Platform.OS === 'web') {
    // На веб — завантажуємо зображення як Blob і відправляємо через локальний проксі
    // (щоб обійти CORS обмеження Pl@ntNet для браузерів)
    const imgResponse = await fetch(imageUri);
    const blob = await imgResponse.blob();
    formData.append('images', blob, 'plant.jpg');

    const response = await fetch('/api/recognize', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        errData.error ?? `Помилка розпізнавання: ${response.status}`
      );
    }

    data = await response.json();
  } else {
    // На мобільному — React Native формат файлу, прямий запит до Pl@ntNet
    formData.append('images', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'plant.jpg',
    } as any);

    const url = `${PLANTNET_BASE_URL}?api-key=${PLANTNET_API_KEY}&lang=uk&nb-results=5`;

    // Не встановлюємо Content-Type вручну — браузер/RN сам додає boundary
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Pl@ntNet error: ${response.status} — ${text}`);
    }

    data = await response.json();
  }

  const results: PlantResult[] = (data.results ?? []).map((r: any) => ({
    scientificName: r.species?.scientificNameWithoutAuthor ?? 'Unknown',
    commonNames: r.species?.commonNames ?? [],
    family: r.species?.family?.scientificNameWithoutAuthor ?? '',
    genus: r.species?.genus?.scientificNameWithoutAuthor ?? '',
    score: Math.round((r.score ?? 0) * 100),
    imageUrl: r.images?.[0]?.url?.m,
    wikiUrl: r.species?.gbif?.id
      ? `https://www.gbif.org/species/${r.species.gbif.id}`
      : undefined,
  }));

  return {
    bestMatch: results[0],
    results,
  };
}
