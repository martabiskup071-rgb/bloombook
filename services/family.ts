import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const FAMILY_CODE_KEY = '@bloombook_family_code';
const MEMBER_NAME_KEY = '@bloombook_member_name';

// Символи без схожих (без 0/O, 1/I)
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateFamilyCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  return AsyncStorage.getItem(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try { localStorage.setItem(key, value); } catch {}
    return;
  }
  return AsyncStorage.setItem(key, value);
}

async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try { localStorage.removeItem(key); } catch {}
    return;
  }
  return AsyncStorage.removeItem(key);
}

/** Повертає збережений код сім'ї або null */
export async function getFamilyCode(): Promise<string | null> {
  return getItem(FAMILY_CODE_KEY);
}

/** Повертає ім'я учасника або null */
export async function getMemberName(): Promise<string | null> {
  return getItem(MEMBER_NAME_KEY);
}

/** Створити нову сім'ю — генерує код і зберігає ім'я */
export async function createFamily(memberName: string): Promise<string> {
  const code = generateFamilyCode();
  await setItem(FAMILY_CODE_KEY, code);
  await setItem(MEMBER_NAME_KEY, memberName.trim());
  return code;
}

/** Приєднатись до існуючої сім'ї */
export async function joinFamily(code: string, memberName: string): Promise<void> {
  await setItem(FAMILY_CODE_KEY, code.toUpperCase().replace(/\s/g, ''));
  await setItem(MEMBER_NAME_KEY, memberName.trim());
}

/** Покинути сім'ю (дані в хмарі залишаються) */
export async function leaveFamily(): Promise<void> {
  await removeItem(FAMILY_CODE_KEY);
  await removeItem(MEMBER_NAME_KEY);
}
