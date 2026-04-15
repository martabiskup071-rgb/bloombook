// Система XP та рівнів — ігрофікація колекції рослин
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

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

// --- Нагороди за дії ---
export const XP_REWARDS = {
  NEW_PLANT:    50,   // знайдена нова рослина
  NEW_FAMILY:  100,   // вперше в цій родині рослин!
  VOICE_MEMO:   20,   // записаний голосовий спогад
  CHALLENGE:   100,   // виконаний виклик
} as const;

// --- Рівні ---
export interface LevelInfo {
  level: number;
  name: string;
  emoji: string;
  minXP: number;
  maxXP: number;  // Infinity для останнього
}

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Паросток',        emoji: '🌱', minXP: 0,    maxXP: 99    },
  { level: 2, name: 'Любитель',        emoji: '🌿', minXP: 100,  maxXP: 299   },
  { level: 3, name: 'Збирач',          emoji: '🍀', minXP: 300,  maxXP: 599   },
  { level: 4, name: 'Натураліст',      emoji: '🌸', minXP: 600,  maxXP: 999   },
  { level: 5, name: 'Ботанік',         emoji: '🌺', minXP: 1000, maxXP: 1499  },
  { level: 6, name: 'Дослідник',       emoji: '🌲', minXP: 1500, maxXP: 2199  },
  { level: 7, name: 'Майстер природи', emoji: '🌳', minXP: 2200, maxXP: Infinity },
];

export interface XPState {
  totalXP: number;
  level: number;
  levelName: string;
  levelEmoji: string;
  xpInLevel: number;       // XP зароблені всередині поточного рівня
  xpNeededForLevel: number; // скільки XP потрібно для наступного рівня
  progressPercent: number; // 0-100
  isMaxLevel: boolean;
}

// Розрахунок рівня по сумарному XP
export function computeXPState(totalXP: number): XPState {
  const lvl = LEVELS.slice().reverse().find(l => totalXP >= l.minXP) ?? LEVELS[0];
  const isMaxLevel = lvl.level === LEVELS[LEVELS.length - 1].level;

  const xpInLevel = totalXP - lvl.minXP;
  const xpNeededForLevel = isMaxLevel ? 1 : (lvl.maxXP + 1) - lvl.minXP;
  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, Math.round((xpInLevel / xpNeededForLevel) * 100));

  return {
    totalXP,
    level: lvl.level,
    levelName: lvl.name,
    levelEmoji: lvl.emoji,
    xpInLevel,
    xpNeededForLevel,
    progressPercent,
    isMaxLevel,
  };
}

// --- Firestore ---
const STATS_DOC = 'stats/main';

export async function getTotalXP(): Promise<number> {
  try {
    const ref = doc(db, STATS_DOC);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data().totalXP ?? 0) : 0;
  } catch {
    return 0;
  }
}

export async function getXPState(): Promise<XPState> {
  const total = await getTotalXP();
  return computeXPState(total);
}

export async function addXP(amount: number): Promise<XPState> {
  try {
    const ref = doc(db, STATS_DOC);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { totalXP: increment(amount) });
    } else {
      await setDoc(ref, { totalXP: amount });
    }
    const newTotal = (snap.exists() ? (snap.data().totalXP ?? 0) : 0) + amount;
    return computeXPState(newTotal);
  } catch {
    return computeXPState(0);
  }
}

// Нарахувати XP за нову рослину (перевіряє чи нова родина)
export async function awardPlantXP(family: string): Promise<{ xpGained: number; newState: XPState; isNewFamily: boolean }> {
  try {
    const ref = doc(db, STATS_DOC);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    const families: string[] = data.families ?? [];

    const isNewFamily = !!family && !families.includes(family);
    let xpGained = XP_REWARDS.NEW_PLANT;
    if (isNewFamily) xpGained += XP_REWARDS.NEW_FAMILY;

    const currentXP = data.totalXP ?? 0;
    const newXP = currentXP + xpGained;

    await setDoc(ref, {
      totalXP: newXP,
      families: isNewFamily ? [...families, family] : families,
    }, { merge: true });

    return { xpGained, newState: computeXPState(newXP), isNewFamily };
  } catch {
    return { xpGained: 0, newState: computeXPState(0), isNewFamily: false };
  }
}
