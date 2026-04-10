// Firestore для метаданих карток + expo-file-system для фото/аудіо локально
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Папка для локальних файлів
const PLANTS_DIR = `${FileSystem.documentDirectory}plants/`;
const MEMOS_DIR  = `${FileSystem.documentDirectory}memos/`;

async function ensureDir(dir: string) {
  if (Platform.OS === 'web') return;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
}

export interface PlantCard {
  id?: string;
  scientificName: string;
  commonName: string;
  family: string;
  score: number;
  imageUrl: string;
  voiceMemoUrl?: string;
  note?: string;
  location?: { latitude: number; longitude: number; label?: string };
  createdAt: Date;
}

// Скопіювати фото у локальне сховище
export async function uploadImage(localUri: string, cardId: string): Promise<string> {
  if (Platform.OS === 'web') return localUri;
  await ensureDir(PLANTS_DIR);
  const dest = `${PLANTS_DIR}${cardId}.jpg`;
  await FileSystem.copyAsync({ from: localUri, to: dest });
  return dest;
}

// Скопіювати голосовий спогад у локальне сховище
export async function uploadVoiceMemo(localUri: string, cardId: string): Promise<string> {
  if (Platform.OS === 'web') return localUri;
  await ensureDir(MEMOS_DIR);
  const dest = `${MEMOS_DIR}${cardId}.m4a`;
  await FileSystem.copyAsync({ from: localUri, to: dest });
  return dest;
}

// Зберегти картку у Firestore
export async function saveCard(card: Omit<PlantCard, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'cards'), {
    ...card,
    createdAt: Timestamp.fromDate(card.createdAt),
  });
  return docRef.id;
}

// Отримати всі картки
export async function getCards(): Promise<PlantCard[]> {
  const q = query(collection(db, 'cards'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<PlantCard, 'id' | 'createdAt'>),
    createdAt: (d.data().createdAt as Timestamp).toDate(),
  }));
}

// Отримати одну картку
export async function getCard(id: string): Promise<PlantCard | null> {
  const docSnap = await getDoc(doc(db, 'cards', id));
  if (!docSnap.exists()) return null;
  return {
    id: docSnap.id,
    ...(docSnap.data() as Omit<PlantCard, 'id' | 'createdAt'>),
    createdAt: (docSnap.data().createdAt as Timestamp).toDate(),
  };
}

// Видалити картку + локальні файли
export async function deleteCard(id: string, imageUrl: string): Promise<void> {
  await deleteDoc(doc(db, 'cards', id));
  if (Platform.OS !== 'web') {
    try { await FileSystem.deleteAsync(imageUrl, { idempotent: true }); } catch {}
    try { await FileSystem.deleteAsync(`${MEMOS_DIR}${id}.m4a`, { idempotent: true }); } catch {}
  }
}
