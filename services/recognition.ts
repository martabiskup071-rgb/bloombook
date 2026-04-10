// Pl@ntNet API — розпізнавання рослин за фото
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
  formData.append('images', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'plant.jpg',
  } as any);
  formData.append('organs', 'auto');

  const url = `${PLANTNET_BASE_URL}?api-key=${PLANTNET_API_KEY}&lang=uk&nb-results=5`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (!response.ok) {
    throw new Error(`Pl@ntNet error: ${response.status}`);
  }

  const data = await response.json();

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
