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
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { getFamilyCode, getMemberName } from './family';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db  = getFirestore(app);
const fst = getStorage(app);

// Локальна папка для голосових спогадів (не синхронізується)
const MEMOS_DIR = `${FileSystem.documentDirectory}memos/`;

async function ensureDir(dir: string) {
  if (Platform.OS === 'web') return;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
}

/** Колекція карток сім'ї */
async function cardsCol() {
  const code = await getFamilyCode();
  if (!code) throw new Error('family_not_set');
  return collection(db, 'families', code, 'cards');
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
  mood?: string;
  location?: { latitude: number; longitude: number; label?: string };
  createdAt: Date;
  addedBy?: string;   // ← хто додав (ім'я з сімейного профілю)
}

// ─── Фото ────────────────────────────────────────────────────────────────────

/** Завантажити фото в Firebase Storage, повернути публічний URL */
export async function uploadImage(localUri: string, cardId: string): Promise<string> {
  const code = await getFamilyCode();
  if (!code) throw new Error('family_not_set');

  const imgRef = storageRef(fst, `families/${code}/${cardId}.jpg`);

  if (Platform.OS === 'web') {
    // На веб: blob URL → blob → upload
    const resp = await fetch(localUri);
    const blob = await resp.blob();
    await uploadBytes(imgRef, blob, { contentType: 'image/jpeg' });
  } else {
    // На мобільному: читаємо як base64
    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await uploadString(imgRef, base64, 'base64', { contentType: 'image/jpeg' });
  }

  return getDownloadURL(imgRef);
}

/** Голосовий спогад — залишається локально (великий файл, не критично для сім'ї) */
export async function uploadVoiceMemo(localUri: string, cardId: string): Promise<string> {
  if (Platform.OS === 'web') return localUri;
  await ensureDir(MEMOS_DIR);
  const dest = `${MEMOS_DIR}${cardId}.m4a`;
  await FileSystem.copyAsync({ from: localUri, to: dest });
  return dest;
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function saveCard(card: Omit<PlantCard, 'id'>): Promise<string> {
  const memberName = await getMemberName();
  const col = await cardsCol();
  const docRef = await addDoc(col, {
    ...card,
    addedBy: memberName ?? '?',
    createdAt: Timestamp.fromDate(card.createdAt),
  });
  return docRef.id;
}

export async function getCards(): Promise<PlantCard[]> {
  const col = await cardsCol();
  const q = query(col, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<PlantCard, 'id' | 'createdAt'>),
    createdAt: (d.data().createdAt as Timestamp).toDate(),
  }));
}

export async function getCard(id: string): Promise<PlantCard | null> {
  const code = await getFamilyCode();
  if (!code) return null;
  const docSnap = await getDoc(doc(db, 'families', code, 'cards', id));
  if (!docSnap.exists()) return null;
  return {
    id: docSnap.id,
    ...(docSnap.data() as Omit<PlantCard, 'id' | 'createdAt'>),
    createdAt: (docSnap.data().createdAt as Timestamp).toDate(),
  };
}

export async function deleteCard(id: string, imageUrl: string): Promise<void> {
  const code = await getFamilyCode();
  if (!code) return;
  await deleteDoc(doc(db, 'families', code, 'cards', id));
  // Видаляємо фото з Firebase Storage
  try {
    const imgRef = storageRef(fst, `families/${code}/${id}.jpg`);
    await deleteObject(imgRef);
  } catch {}
  // Видаляємо локальний голосовий спогад
  if (Platform.OS !== 'web') {
    try { await FileSystem.deleteAsync(`${MEMOS_DIR}${id}.m4a`, { idempotent: true }); } catch {}
  }
}

export async function updateCard(
  id: string,
  fields: Partial<Pick<PlantCard, 'note' | 'mood'>>,
): Promise<void> {
  const code = await getFamilyCode();
  if (!code) return;
  const { updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'families', code, 'cards', id), fields as any);
}

/** Підписатись на оновлення колекції в реальному часі */
export async function subscribeToCards(
  callback: (cards: PlantCard[]) => void,
): Promise<Unsubscribe> {
  const col = await cardsCol();
  const q = query(col, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const cards = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<PlantCard, 'id' | 'createdAt'>),
      createdAt: (d.data().createdAt as Timestamp).toDate(),
    }));
    callback(cards);
  });
}
