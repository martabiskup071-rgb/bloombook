// Переклади для Bloombook — 2 мови
export type LangCode = 'uk' | 'en';

export const LANGUAGES: { code: LangCode; flag: string; label: string }[] = [
  { code: 'uk', flag: '🇺🇦', label: 'Українська' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
];

export type TranslationKey =
  // Common
  | 'loading'
  | 'back'
  | 'delete'
  | 'cancel'
  | 'save'
  | 'saved'
  | 'error'
  | 'family'
  // Index / Onboarding
  | 'onboarding_tagline'
  | 'onboarding_feature_photo'
  | 'onboarding_feature_scan'
  | 'onboarding_feature_voice'
  | 'onboarding_feature_map'
  | 'onboarding_start'
  // Album
  | 'album_title'
  | 'album_empty_title'
  | 'album_empty_text'
  // Camera
  | 'camera_title'
  | 'camera_btn_camera'
  | 'camera_btn_gallery'
  | 'camera_btn_recognize'
  | 'camera_recognizing'
  | 'camera_hint'
  | 'camera_error_notfound'
  | 'camera_error_photo'
  | 'camera_not_recognized'
  | 'camera_perm_text'
  | 'camera_perm_btn'
  // Results
  | 'results_title'
  | 'results_subtitle'
  | 'results_hint'
  | 'results_score_high'
  | 'results_score_mid'
  | 'results_score_low'
  | 'results_saving'
  | 'results_error'
  // Card detail
  | 'card_accuracy'
  | 'card_voice_title'
  | 'card_mood_title'
  | 'card_note_title'
  | 'card_note_placeholder'
  | 'card_delete_btn'
  | 'card_delete_confirm_title'
  | 'card_delete_confirm_msg'
  | 'card_letter_title'
  | 'card_letter_expand'
  | 'card_letter_collapse'
  | 'card_not_found'
  | 'card_unknown_location'
  // Moods
  | 'mood_delight'
  | 'mood_joy'
  | 'mood_love'
  | 'mood_calm'
  | 'mood_inspired'
  | 'mood_curious'
  // Map
  | 'map_mobile_only'
  // Bingo
  | 'bingo_title'
  | 'bingo_completed'
  | 'bingo_total'
  | 'bingo_free'
  | 'bingo_legend_done'
  | 'bingo_legend_bingo'
  // Plant letter
  | 'letter_hi'
  | 'letter_fact'
  | 'letter_found'
  | 'letter_footer'
  // XP bar
  | 'xp_level'
  | 'xp_to_next'
  | 'xp_max_level'
  | 'xp_lvl1' | 'xp_lvl2' | 'xp_lvl3' | 'xp_lvl4' | 'xp_lvl5' | 'xp_lvl6' | 'xp_lvl7'
  // Family
  | 'family_setup_title'
  | 'family_setup_subtitle'
  | 'family_your_name'
  | 'family_name_placeholder'
  | 'family_create'
  | 'family_join'
  | 'family_code_label'
  | 'family_code_share'
  | 'family_enter_code'
  | 'family_continue'
  | 'family_added_by'
  | 'family_members'
  | 'family_leave'
  | 'family_leave_confirm'
  | 'family_invite_title'
  | 'family_invite_steps'
  | 'family_share_btn'
  // Search / filter
  | 'search_placeholder'
  | 'sort_newest'
  | 'sort_oldest'
  | 'filter_all'
  // Language picker
  | 'lang_title'
  // Voice memo
  | 'voice_add'
  | 'voice_recording'
  | 'voice_memo'
  | 'voice_play'
  | 'voice_stop';

type Translations = Record<TranslationKey, string>;

const uk: Translations = {
  loading: 'Завантаження...',
  back: '←',
  delete: 'Видалити',
  cancel: 'Скасувати',
  save: 'Зберегти',
  saved: '✓ Збережено!',
  error: 'Помилка',
  family: 'Родина',
  onboarding_tagline: 'Відкривай світ рослин.\nЗберігай живі спогади.',
  onboarding_feature_photo: 'Фотографуй рослини',
  onboarding_feature_scan: 'Розпізнавання за секунди',
  onboarding_feature_voice: 'Голосові спогади',
  onboarding_feature_map: 'Карта знахідок',
  onboarding_start: 'Почати збирати 🌱',
  album_title: 'Мій альбом 🌿',
  album_empty_title: 'Поки що порожньо',
  album_empty_text: 'Сфотографуй першу рослину, щоб почати колекцію',
  camera_title: 'Розпізнати рослину',
  camera_btn_camera: 'Камера',
  camera_btn_gallery: 'Галерея',
  camera_btn_recognize: '🔍 Розпізнати рослину',
  camera_recognizing: 'Розпізнаю...',
  camera_hint: 'Зроби чітке фото листя, квітки або всієї рослини',
  camera_error_notfound: 'Спробуй інше фото — ближче або з іншого кута',
  camera_error_photo: 'Не вдалося зробити фото',
  camera_not_recognized: 'Не розпізнано',
  camera_perm_text: 'Потрібен доступ до камери',
  camera_perm_btn: 'Дозволити',
  results_title: 'Оберіть рослину',
  results_subtitle: 'Pl@ntNet знайшов',
  results_hint: '💡 Перший варіант — найбільш імовірний. Tap щоб зберегти у колекцію.',
  results_score_high: 'Висока',
  results_score_mid: 'Середня',
  results_score_low: 'Низька',
  results_saving: 'Збереження...',
  results_error: 'Не вдалося зберегти картку',
  card_accuracy: 'Точність',
  card_voice_title: 'Голосовий спогад',
  card_mood_title: 'Як ти себе почувала?',
  card_note_title: '📝 Мої спостереження',
  card_note_placeholder: 'Напиши свій спогад про цю рослину...',
  card_delete_btn: 'Видалити картку',
  card_delete_confirm_title: 'Видалити?',
  card_delete_confirm_msg: 'Цю картку буде видалено назавжди',
  card_letter_title: 'Лист від рослини',
  card_letter_expand: '▼ Читати далі',
  card_letter_collapse: '▲ Згорнути',
  card_not_found: 'Картку не знайдено',
  card_unknown_location: 'Невідоме місце',
  mood_delight: 'Захоплення',
  mood_joy: 'Радість',
  mood_love: 'Любов',
  mood_calm: 'Спокій',
  mood_inspired: 'Натхнення',
  mood_curious: 'Цікавість',
  family_setup_title: 'Сімейна колекція 🌿',
  family_setup_subtitle: 'Збирайте рослини разом — діти, батьки, бабусі та дідусі бачать одну колекцію',
  family_your_name: 'Як тебе звати?',
  family_name_placeholder: "Ім'я",
  family_create: 'Створити нову сім\'ю',
  family_join: 'Приєднатись до сім\'ї',
  family_code_label: 'Код вашої сім\'ї',
  family_code_share: 'Поділись цим кодом з родиною',
  family_enter_code: 'Введи код сім\'ї',
  family_continue: 'Продовжити →',
  family_added_by: 'Додав(ла)',
  family_members: 'Учасники',
  family_leave: 'Покинути сім\'ю',
  family_leave_confirm: 'Покинути сім\'ю? Твої дані залишаться в хмарі.',
  family_invite_title: 'Як запросити родину?',
  family_invite_steps: '1. Натисни "Поділитись" і надішли код\n2. Родич відкриває Bloombook\n3. Натискає "Приєднатись до сім\'ї"\n4. Вводить код\n5. Всі бачать одну колекцію! 🌿',
  family_share_btn: '📤 Поділитись',
  search_placeholder: 'Пошук рослин...',
  sort_newest: 'Нові спочатку',
  sort_oldest: 'Старі спочатку',
  filter_all: 'Всі',
  lang_title: 'Мова',
  voice_add: 'Додати голос',
  voice_recording: 'Запис...',
  voice_memo: 'Голосовий спогад',
  voice_play: '▶ Відтворити',
  voice_stop: '⏹ Стоп',
  map_mobile_only: 'Карта доступна лише в мобільному застосунку',
  bingo_title: 'Природне Бінго 🌿',
  bingo_completed: 'виконано',
  bingo_total: 'всього',
  bingo_free: 'FREE',
  bingo_legend_done: 'Виконано',
  bingo_legend_bingo: 'Bingo лінія!',
  letter_hi: 'Привіт! Я —',
  letter_fact: '📚 Цікавий факт:',
  letter_found: 'Ти знайшла мене',
  letter_footer: 'Тепер я назавжди у твоїй книзі спогадів. Бережи природу! 🌱',
  xp_level: 'Рівень',
  xp_to_next: 'XP до наступного рівня',
  xp_max_level: '🏆 Максимальний рівень досягнуто!',
  xp_lvl1: 'Паросток',
  xp_lvl2: 'Любитель',
  xp_lvl3: 'Збирач',
  xp_lvl4: 'Натураліст',
  xp_lvl5: 'Ботанік',
  xp_lvl6: 'Дослідник',
  xp_lvl7: 'Майстер природи',
};

const en: Translations = {
  loading: 'Loading...',
  back: '←',
  delete: 'Delete',
  cancel: 'Cancel',
  save: 'Save',
  saved: '✓ Saved!',
  error: 'Error',
  family: 'Family',
  onboarding_tagline: 'Discover the world of plants.\nCapture living memories.',
  onboarding_feature_photo: 'Photograph plants',
  onboarding_feature_scan: 'Recognition in seconds',
  onboarding_feature_voice: 'Voice memories',
  onboarding_feature_map: 'Map of discoveries',
  onboarding_start: 'Start collecting 🌱',
  album_title: 'My Album 🌿',
  album_empty_title: 'Nothing here yet',
  album_empty_text: 'Photograph your first plant to start a collection',
  camera_title: 'Identify a plant',
  camera_btn_camera: 'Camera',
  camera_btn_gallery: 'Gallery',
  camera_btn_recognize: '🔍 Identify plant',
  camera_recognizing: 'Identifying...',
  camera_hint: 'Take a clear photo of a leaf, flower or the whole plant',
  camera_error_notfound: 'Try another photo — closer or from a different angle',
  camera_error_photo: 'Failed to take a photo',
  camera_not_recognized: 'Not recognized',
  camera_perm_text: 'Camera access is required',
  camera_perm_btn: 'Allow',
  results_title: 'Choose a plant',
  results_subtitle: 'Pl@ntNet found',
  results_hint: '💡 The first option is the most likely. Tap to save to collection.',
  results_score_high: 'High',
  results_score_mid: 'Medium',
  results_score_low: 'Low',
  results_saving: 'Saving...',
  results_error: 'Could not save the card',
  card_accuracy: 'Accuracy',
  card_voice_title: 'Voice memory',
  card_mood_title: 'How did you feel?',
  card_note_title: '📝 My observations',
  card_note_placeholder: 'Write your memory about this plant...',
  card_delete_btn: 'Delete card',
  card_delete_confirm_title: 'Delete?',
  card_delete_confirm_msg: 'This card will be deleted permanently',
  card_letter_title: 'Letter from the plant',
  card_letter_expand: '▼ Read more',
  card_letter_collapse: '▲ Collapse',
  card_not_found: 'Card not found',
  card_unknown_location: 'Unknown location',
  mood_delight: 'Delight',
  mood_joy: 'Joy',
  mood_love: 'Love',
  mood_calm: 'Calm',
  mood_inspired: 'Inspired',
  mood_curious: 'Curious',
  family_setup_title: 'Family Collection 🌿',
  family_setup_subtitle: 'Collect plants together — children, parents, grandparents share one collection',
  family_your_name: 'What is your name?',
  family_name_placeholder: 'Name',
  family_create: 'Create new family',
  family_join: 'Join a family',
  family_code_label: 'Your family code',
  family_code_share: 'Share this code with your family',
  family_enter_code: 'Enter family code',
  family_continue: 'Continue →',
  family_added_by: 'Added by',
  family_members: 'Members',
  family_leave: 'Leave family',
  family_leave_confirm: 'Leave family? Your data will remain in the cloud.',
  family_invite_title: 'How to invite family?',
  family_invite_steps: '1. Tap "Share" and send the code\n2. Family member opens Bloombook\n3. Taps "Join a family"\n4. Enters the code\n5. Everyone sees the same collection! 🌿',
  family_share_btn: '📤 Share',
  search_placeholder: 'Search plants...',
  sort_newest: 'Newest first',
  sort_oldest: 'Oldest first',
  filter_all: 'All',
  lang_title: 'Language',
  voice_add: 'Add voice',
  voice_recording: 'Recording...',
  voice_memo: 'Voice memory',
  voice_play: '▶ Play',
  voice_stop: '⏹ Stop',
  map_mobile_only: 'Map is available in the mobile app only',
  bingo_title: 'Nature Bingo 🌿',
  bingo_completed: 'completed',
  bingo_total: 'total',
  bingo_free: 'FREE',
  bingo_legend_done: 'Completed',
  bingo_legend_bingo: 'Bingo line!',
  letter_hi: 'Hello! I am —',
  letter_fact: '📚 Fun fact:',
  letter_found: 'You found me on',
  letter_footer: 'Now I am forever in your memory book. Protect nature! 🌱',
  xp_level: 'Level',
  xp_to_next: 'XP to next level',
  xp_max_level: '🏆 Maximum level reached!',
  xp_lvl1: 'Sprout',
  xp_lvl2: 'Enthusiast',
  xp_lvl3: 'Collector',
  xp_lvl4: 'Naturalist',
  xp_lvl5: 'Botanist',
  xp_lvl6: 'Explorer',
  xp_lvl7: 'Master of Nature',
};

export const translations: Record<LangCode, Translations> = { uk, en };

export function t(lang: LangCode, key: TranslationKey): string {
  return translations[lang]?.[key] ?? translations['uk'][key] ?? key;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unused_pl: Translations = {
  loading: 'Ładowanie...',
  back: '←',
  delete: 'Usuń',
  cancel: 'Anuluj',
  save: 'Zapisz',
  saved: '✓ Zapisano!',
  error: 'Błąd',
  family: 'Rodzina',
  onboarding_tagline: 'Odkryj świat roślin.\nZachowaj żywe wspomnienia.',
  onboarding_feature_photo: 'Fotografuj rośliny',
  onboarding_feature_scan: 'Rozpoznawanie w sekundy',
  onboarding_feature_voice: 'Wspomnienia głosowe',
  onboarding_feature_map: 'Mapa odkryć',
  onboarding_start: 'Zacznij zbierać 🌱',
  album_title: 'Mój album 🌿',
  album_empty_title: 'Na razie pusto',
  album_empty_text: 'Sfotografuj pierwszą roślinę, aby rozpocząć kolekcję',
  camera_title: 'Rozpoznaj roślinę',
  camera_btn_camera: 'Aparat',
  camera_btn_gallery: 'Galeria',
  camera_btn_recognize: '🔍 Rozpoznaj roślinę',
  camera_recognizing: 'Rozpoznaję...',
  camera_hint: 'Zrób wyraźne zdjęcie liścia, kwiatu lub całej rośliny',
  camera_error_notfound: 'Spróbuj innego zdjęcia — bliżej lub pod innym kątem',
  camera_error_photo: 'Nie udało się zrobić zdjęcia',
  camera_not_recognized: 'Nie rozpoznano',
  camera_perm_text: 'Wymagany dostęp do aparatu',
  camera_perm_btn: 'Zezwól',
  results_title: 'Wybierz roślinę',
  results_subtitle: 'Pl@ntNet znalazł',
  results_hint: '💡 Pierwsza opcja jest najbardziej prawdopodobna. Dotknij, aby zapisać w kolekcji.',
  results_score_high: 'Wysoka',
  results_score_mid: 'Średnia',
  results_score_low: 'Niska',
  results_saving: 'Zapisywanie...',
  results_error: 'Nie udało się zapisać karty',
  card_accuracy: 'Dokładność',
  card_voice_title: 'Wspomnienie głosowe',
  card_mood_title: 'Jak się czułaś?',
  card_note_title: '📝 Moje obserwacje',
  card_note_placeholder: 'Napisz swoje wspomnienie o tej roślinie...',
  card_delete_btn: 'Usuń kartę',
  card_delete_confirm_title: 'Usunąć?',
  card_delete_confirm_msg: 'Ta karta zostanie trwale usunięta',
  card_letter_title: 'List od rośliny',
  card_letter_expand: '▼ Czytaj więcej',
  card_letter_collapse: '▲ Zwiń',
  card_not_found: 'Karta nie została znaleziona',
  card_unknown_location: 'Nieznane miejsce',
  mood_delight: 'Zachwyt',
  mood_joy: 'Radość',
  mood_love: 'Miłość',
  mood_calm: 'Spokój',
  mood_inspired: 'Inspiracja',
  mood_curious: 'Ciekawość',
  family_setup_title: 'Kolekcja rodzinna 🌿',
  family_setup_subtitle: 'Zbierajcie rośliny razem — dzieci, rodzice, dziadkowie widzą jedną kolekcję',
  family_your_name: 'Jak masz na imię?',
  family_name_placeholder: 'Imię',
  family_create: 'Utwórz nową rodzinę',
  family_join: 'Dołącz do rodziny',
  family_code_label: 'Kod twojej rodziny',
  family_code_share: 'Udostępnij ten kod rodzinie',
  family_enter_code: 'Wprowadź kod rodziny',
  family_continue: 'Kontynuuj →',
  family_added_by: 'Dodał(a)',
  family_members: 'Członkowie',
  family_leave: 'Opuść rodzinę',
  family_leave_confirm: 'Opuścić rodzinę? Twoje dane pozostaną w chmurze.',
  family_invite_title: 'Jak zaprosić rodzinę?',
  family_invite_steps: '1. Naciśnij "Udostępnij" i wyślij kod\n2. Krewny otwiera Bloombook\n3. Naciska "Dołącz do rodziny"\n4. Wpisuje kod\n5. Wszyscy widzą tę samą kolekcję! 🌿',
  family_share_btn: '📤 Udostępnij',
  lang_title: 'Język',
  voice_add: 'Dodaj głos',
  voice_recording: 'Nagrywanie...',
  voice_memo: 'Wspomnienie głosowe',
  voice_play: '▶ Odtwórz',
  voice_stop: '⏹ Stop',
  letter_hi: 'Cześć! Jestem —',
  letter_fact: '📚 Ciekawostka:',
  letter_found: 'Znalazłaś mnie',
  letter_footer: 'Teraz jestem na zawsze w Twojej księdze wspomnień. Chroń przyrodę! 🌱',
  xp_level: 'Poziom',
  xp_to_next: 'XP do następnego poziomu',
  xp_max_level: '🏆 Osiągnięto maksymalny poziom!',
  xp_lvl1: 'Kiełek',
  xp_lvl2: 'Entuzjasta',
  xp_lvl3: 'Kolekcjoner',
  xp_lvl4: 'Przyrodnik',
  xp_lvl5: 'Botanik',
  xp_lvl6: 'Odkrywca',
  xp_lvl7: 'Mistrz natury',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unused_de: Translations = {
  loading: 'Laden...',
  back: '←',
  delete: 'Löschen',
  cancel: 'Abbrechen',
  save: 'Speichern',
  saved: '✓ Gespeichert!',
  error: 'Fehler',
  family: 'Familie',
  onboarding_tagline: 'Entdecke die Welt der Pflanzen.\nBewahrst lebendige Erinnerungen.',
  onboarding_feature_photo: 'Pflanzen fotografieren',
  onboarding_feature_scan: 'Erkennung in Sekunden',
  onboarding_feature_voice: 'Spracherinnerungen',
  onboarding_feature_map: 'Entdeckungskarte',
  onboarding_start: 'Sammeln beginnen 🌱',
  album_title: 'Mein Album 🌿',
  album_empty_title: 'Noch nichts hier',
  album_empty_text: 'Fotografiere deine erste Pflanze, um eine Sammlung zu starten',
  camera_title: 'Pflanze erkennen',
  camera_btn_camera: 'Kamera',
  camera_btn_gallery: 'Galerie',
  camera_btn_recognize: '🔍 Pflanze erkennen',
  camera_recognizing: 'Erkenne...',
  camera_hint: 'Mache ein klares Foto eines Blattes, einer Blüte oder der ganzen Pflanze',
  camera_error_notfound: 'Versuche ein anderes Foto — näher oder aus einem anderen Winkel',
  camera_error_photo: 'Foto konnte nicht aufgenommen werden',
  camera_not_recognized: 'Nicht erkannt',
  camera_perm_text: 'Kamerazugriff erforderlich',
  camera_perm_btn: 'Erlauben',
  results_title: 'Pflanze wählen',
  results_subtitle: 'Pl@ntNet hat gefunden',
  results_hint: '💡 Die erste Option ist am wahrscheinlichsten. Tippe zum Speichern in der Sammlung.',
  results_score_high: 'Hoch',
  results_score_mid: 'Mittel',
  results_score_low: 'Niedrig',
  results_saving: 'Speichern...',
  results_error: 'Karte konnte nicht gespeichert werden',
  card_accuracy: 'Genauigkeit',
  card_voice_title: 'Spracherinnerung',
  card_mood_title: 'Wie hast du dich gefühlt?',
  card_note_title: '📝 Meine Beobachtungen',
  card_note_placeholder: 'Schreibe deine Erinnerung an diese Pflanze...',
  card_delete_btn: 'Karte löschen',
  card_delete_confirm_title: 'Löschen?',
  card_delete_confirm_msg: 'Diese Karte wird dauerhaft gelöscht',
  card_letter_title: 'Brief von der Pflanze',
  card_letter_expand: '▼ Mehr lesen',
  card_letter_collapse: '▲ Einklappen',
  card_not_found: 'Karte nicht gefunden',
  card_unknown_location: 'Unbekannter Ort',
  mood_delight: 'Begeisterung',
  mood_joy: 'Freude',
  mood_love: 'Liebe',
  mood_calm: 'Ruhe',
  mood_inspired: 'Inspiration',
  mood_curious: 'Neugier',
  family_setup_title: 'Familiensammlung 🌿',
  family_setup_subtitle: 'Sammelt Pflanzen gemeinsam — Kinder, Eltern, Großeltern sehen eine Sammlung',
  family_your_name: 'Wie heißt du?',
  family_name_placeholder: 'Name',
  family_create: 'Neue Familie erstellen',
  family_join: 'Familie beitreten',
  family_code_label: 'Dein Familiencode',
  family_code_share: 'Teile diesen Code mit deiner Familie',
  family_enter_code: 'Familiencode eingeben',
  family_continue: 'Weiter →',
  family_added_by: 'Hinzugefügt von',
  family_members: 'Mitglieder',
  family_leave: 'Familie verlassen',
  family_leave_confirm: 'Familie verlassen? Deine Daten bleiben in der Cloud.',
  family_invite_title: 'Wie Familie einladen?',
  family_invite_steps: '1. Tippe "Teilen" und sende den Code\n2. Familienmitglied öffnet Bloombook\n3. Tippt "Familie beitreten"\n4. Gibt den Code ein\n5. Alle sehen dieselbe Sammlung! 🌿',
  family_share_btn: '📤 Teilen',
  lang_title: 'Sprache',
  voice_add: 'Stimme hinzufügen',
  voice_recording: 'Aufnahme...',
  voice_memo: 'Spracherinnerung',
  voice_play: '▶ Abspielen',
  voice_stop: '⏹ Stop',
  letter_hi: 'Hallo! Ich bin —',
  letter_fact: '📚 Wissenswertes:',
  letter_found: 'Du hast mich gefunden am',
  letter_footer: 'Jetzt bin ich für immer in deinem Erinnerungsbuch. Schütze die Natur! 🌱',
  xp_level: 'Ebene',
  xp_to_next: 'XP bis zur nächsten Ebene',
  xp_max_level: '🏆 Maximale Ebene erreicht!',
  xp_lvl1: 'Keimling',
  xp_lvl2: 'Enthusiast',
  xp_lvl3: 'Sammler',
  xp_lvl4: 'Naturalist',
  xp_lvl5: 'Botaniker',
  xp_lvl6: 'Entdecker',
  xp_lvl7: 'Meister der Natur',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unused_fr: Translations = {
  loading: 'Chargement...',
  back: '←',
  delete: 'Supprimer',
  cancel: 'Annuler',
  save: 'Enregistrer',
  saved: '✓ Enregistré !',
  error: 'Erreur',
  family: 'Famille',
  onboarding_tagline: 'Découvrez le monde des plantes.\nConservez des souvenirs vivants.',
  onboarding_feature_photo: 'Photographiez des plantes',
  onboarding_feature_scan: 'Reconnaissance en secondes',
  onboarding_feature_voice: 'Souvenirs vocaux',
  onboarding_feature_map: 'Carte des découvertes',
  onboarding_start: 'Commencer à collecter 🌱',
  album_title: 'Mon album 🌿',
  album_empty_title: 'Rien pour l\'instant',
  album_empty_text: 'Photographiez votre première plante pour commencer une collection',
  camera_title: 'Identifier une plante',
  camera_btn_camera: 'Appareil photo',
  camera_btn_gallery: 'Galerie',
  camera_btn_recognize: '🔍 Identifier la plante',
  camera_recognizing: 'Identification...',
  camera_hint: 'Prenez une photo nette d\'une feuille, d\'une fleur ou de toute la plante',
  camera_error_notfound: 'Essayez une autre photo — plus proche ou sous un autre angle',
  camera_error_photo: 'Impossible de prendre la photo',
  camera_not_recognized: 'Non reconnu',
  camera_perm_text: 'Accès à la caméra requis',
  camera_perm_btn: 'Autoriser',
  results_title: 'Choisissez une plante',
  results_subtitle: 'Pl@ntNet a trouvé',
  results_hint: '💡 La première option est la plus probable. Appuyez pour enregistrer dans la collection.',
  results_score_high: 'Élevée',
  results_score_mid: 'Moyenne',
  results_score_low: 'Faible',
  results_saving: 'Enregistrement...',
  results_error: 'Impossible d\'enregistrer la carte',
  card_accuracy: 'Précision',
  card_voice_title: 'Souvenir vocal',
  card_mood_title: 'Comment vous sentiez-vous ?',
  card_note_title: '📝 Mes observations',
  card_note_placeholder: 'Écrivez votre souvenir sur cette plante...',
  card_delete_btn: 'Supprimer la carte',
  card_delete_confirm_title: 'Supprimer ?',
  card_delete_confirm_msg: 'Cette carte sera supprimée définitivement',
  card_letter_title: 'Lettre de la plante',
  card_letter_expand: '▼ Lire la suite',
  card_letter_collapse: '▲ Réduire',
  card_not_found: 'Carte introuvable',
  card_unknown_location: 'Lieu inconnu',
  mood_delight: 'Émerveillement',
  mood_joy: 'Joie',
  mood_love: 'Amour',
  mood_calm: 'Calme',
  mood_inspired: 'Inspiration',
  mood_curious: 'Curiosité',
  family_setup_title: 'Collection familiale 🌿',
  family_setup_subtitle: 'Collectez des plantes ensemble — enfants, parents, grands-parents voient une collection',
  family_your_name: 'Comment tu t\'appelles ?',
  family_name_placeholder: 'Prénom',
  family_create: 'Créer une nouvelle famille',
  family_join: 'Rejoindre une famille',
  family_code_label: 'Code de ta famille',
  family_code_share: 'Partage ce code avec ta famille',
  family_enter_code: 'Entrer le code famille',
  family_continue: 'Continuer →',
  family_added_by: 'Ajouté par',
  family_members: 'Membres',
  family_leave: 'Quitter la famille',
  family_leave_confirm: 'Quitter la famille ? Vos données resteront dans le cloud.',
  family_invite_title: 'Comment inviter la famille ?',
  family_invite_steps: '1. Appuie sur "Partager" et envoie le code\n2. Le membre de la famille ouvre Bloombook\n3. Appuie sur "Rejoindre une famille"\n4. Entre le code\n5. Tout le monde voit la même collection ! 🌿',
  family_share_btn: '📤 Partager',
  lang_title: 'Langue',
  voice_add: 'Ajouter une voix',
  voice_recording: 'Enregistrement...',
  voice_memo: 'Souvenir vocal',
  voice_play: '▶ Lire',
  voice_stop: '⏹ Stop',
  letter_hi: 'Bonjour ! Je suis —',
  letter_fact: '📚 Le saviez-vous :',
  letter_found: 'Vous m\'avez trouvé le',
  letter_footer: 'Je suis désormais à jamais dans votre livre de souvenirs. Protégez la nature ! 🌱',
  xp_level: 'Niveau',
  xp_to_next: 'XP jusqu\'au niveau suivant',
  xp_max_level: '🏆 Niveau maximum atteint !',
  xp_lvl1: 'Pousse',
  xp_lvl2: 'Passionné',
  xp_lvl3: 'Collecteur',
  xp_lvl4: 'Naturaliste',
  xp_lvl5: 'Botaniste',
  xp_lvl6: 'Explorateur',
  xp_lvl7: 'Maître de la nature',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unused_es: Translations = {
  loading: 'Cargando...',
  back: '←',
  delete: 'Eliminar',
  cancel: 'Cancelar',
  save: 'Guardar',
  saved: '✓ ¡Guardado!',
  error: 'Error',
  family: 'Familia',
  onboarding_tagline: 'Descubre el mundo de las plantas.\nGuarda recuerdos vivos.',
  onboarding_feature_photo: 'Fotografía plantas',
  onboarding_feature_scan: 'Reconocimiento en segundos',
  onboarding_feature_voice: 'Recuerdos de voz',
  onboarding_feature_map: 'Mapa de descubrimientos',
  onboarding_start: 'Empezar a coleccionar 🌱',
  album_title: 'Mi álbum 🌿',
  album_empty_title: 'Aún vacío',
  album_empty_text: 'Fotografía tu primera planta para comenzar una colección',
  camera_title: 'Identificar una planta',
  camera_btn_camera: 'Cámara',
  camera_btn_gallery: 'Galería',
  camera_btn_recognize: '🔍 Identificar planta',
  camera_recognizing: 'Identificando...',
  camera_hint: 'Toma una foto clara de una hoja, flor o toda la planta',
  camera_error_notfound: 'Prueba con otra foto — más cerca o desde otro ángulo',
  camera_error_photo: 'No se pudo tomar la foto',
  camera_not_recognized: 'No reconocido',
  camera_perm_text: 'Se requiere acceso a la cámara',
  camera_perm_btn: 'Permitir',
  results_title: 'Elige una planta',
  results_subtitle: 'Pl@ntNet encontró',
  results_hint: '💡 La primera opción es la más probable. Toca para guardar en la colección.',
  results_score_high: 'Alta',
  results_score_mid: 'Media',
  results_score_low: 'Baja',
  results_saving: 'Guardando...',
  results_error: 'No se pudo guardar la tarjeta',
  card_accuracy: 'Precisión',
  card_voice_title: 'Recuerdo de voz',
  card_mood_title: '¿Cómo te sentías?',
  card_note_title: '📝 Mis observaciones',
  card_note_placeholder: 'Escribe tu recuerdo sobre esta planta...',
  card_delete_btn: 'Eliminar tarjeta',
  card_delete_confirm_title: '¿Eliminar?',
  card_delete_confirm_msg: 'Esta tarjeta se eliminará permanentemente',
  card_letter_title: 'Carta de la planta',
  card_letter_expand: '▼ Leer más',
  card_letter_collapse: '▲ Contraer',
  card_not_found: 'Tarjeta no encontrada',
  card_unknown_location: 'Ubicación desconocida',
  mood_delight: 'Asombro',
  mood_joy: 'Alegría',
  mood_love: 'Amor',
  mood_calm: 'Calma',
  mood_inspired: 'Inspiración',
  mood_curious: 'Curiosidad',
  family_setup_title: 'Colección familiar 🌿',
  family_setup_subtitle: 'Recolectad plantas juntos — niños, padres, abuelos ven una colección',
  family_your_name: '¿Cómo te llamas?',
  family_name_placeholder: 'Nombre',
  family_create: 'Crear nueva familia',
  family_join: 'Unirse a una familia',
  family_code_label: 'Código de tu familia',
  family_code_share: 'Comparte este código con tu familia',
  family_enter_code: 'Introducir código familiar',
  family_continue: 'Continuar →',
  family_added_by: 'Añadido por',
  family_members: 'Miembros',
  family_leave: 'Dejar la familia',
  family_leave_confirm: '¿Dejar la familia? Tus datos permanecerán en la nube.',
  family_invite_title: '¿Cómo invitar a la familia?',
  family_invite_steps: '1. Toca "Compartir" y envía el código\n2. El familiar abre Bloombook\n3. Toca "Unirse a una familia"\n4. Introduce el código\n5. ¡Todos ven la misma colección! 🌿',
  family_share_btn: '📤 Compartir',
  lang_title: 'Idioma',
  voice_add: 'Agregar voz',
  voice_recording: 'Grabando...',
  voice_memo: 'Recuerdo de voz',
  voice_play: '▶ Reproducir',
  voice_stop: '⏹ Stop',
  letter_hi: '¡Hola! Soy —',
  letter_fact: '📚 Dato curioso:',
  letter_found: 'Me encontraste el',
  letter_footer: '¡Ahora estoy para siempre en tu libro de recuerdos. ¡Protege la naturaleza! 🌱',
  xp_level: 'Nivel',
  xp_to_next: 'XP hasta el siguiente nivel',
  xp_max_level: '🏆 ¡Nivel máximo alcanzado!',
  xp_lvl1: 'Brote',
  xp_lvl2: 'Entusiasta',
  xp_lvl3: 'Coleccionista',
  xp_lvl4: 'Naturalista',
  xp_lvl5: 'Botánico',
  xp_lvl6: 'Explorador',
  xp_lvl7: 'Maestro de la naturaleza',
};

