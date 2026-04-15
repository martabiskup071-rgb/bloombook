// Генератор "листа від рослини" — персональне повідомлення від кожного виду
import { type LangCode, t as tr } from '../constants/i18n';

export interface LetterData {
  emoji: string;
  character: string;   // характер рослини
  greeting: string;    // вітання від рослини
  fact: string;        // цікавий факт
  tip: string;         // порада або побажання
}

const familyLetters: Record<string, LetterData> = {
  Araceae: {
    emoji: '🌺',
    character: 'Тропічний мрійник',
    greeting: 'Я народилась у вологих тропічних лісах, де сонце ледь пробивається крізь гілки.',
    fact: 'Моя родина Araceae налічує понад 3700 видів! Деякі з нас вміють очищувати повітря у кімнаті.',
    tip: 'Якщо хочеш, щоб я квітла вдома — дай мені розсіяне світло та регулярний полив.',
  },
  Rosaceae: {
    emoji: '🌹',
    character: 'Вічний романтик',
    greeting: 'Я — символ кохання вже понад п\'ять тисяч років. Єгипетські фараони прикрашали мною свої садки.',
    fact: 'До моєї родини Rosaceae належать не лише троянди, а й яблука, груші, персики та полуниця!',
    tip: 'Подаруй мене комусь близькому — я завжди передаю найтепліші почуття 💕',
  },
  Asteraceae: {
    emoji: '🌻',
    character: 'Сонячний оптиміст',
    greeting: 'Моє "обличчя" — це не одна квітка, а сотні маленьких квіточок, зібраних разом!',
    fact: 'Родина Asteraceae — одна з найбільших у світі: понад 23 000 видів. Соняшник, ромашка, кульбаба — всі ми родичі.',
    tip: 'Подивись на мене уважніше — у центрі мільйони дрібних таємниць 🔍',
  },
  Fabaceae: {
    emoji: '🌿',
    character: 'Щедрий годувальник',
    greeting: 'Я годую людство вже тисячі років. Без мене не було б квасолі, сочевиці, арахісу та сої!',
    fact: 'Мої корені живуть у симбіозі з бактеріями, які перетворюють азот із повітря на добриво для ґрунту.',
    tip: 'Я роблю землю родючішою просто існуючи. Ось що значить бути корисним! 🌍',
  },
  Poaceae: {
    emoji: '🌾',
    character: 'Скромний велетень',
    greeting: 'Я вкриваю понад 40% суші Землі. Пшениця, рис, кукурудза, цукровий очерет — все це я.',
    fact: 'Бамбук — теж трава! Найшвидша рослина у світі: виростає до 90 см за добу.',
    tip: 'Не недооцінюй маленькі речі — саме вони тримають світ 🌏',
  },
  Orchidaceae: {
    emoji: '🌸',
    character: 'Загадкова аристократка',
    greeting: 'Я — найбільша родина квіткових рослин на планеті. Мене можна знайти на всіх континентах крім Антарктиди.',
    fact: 'Деякі орхідеї імітують вигляд і запах комах, щоб залучити запилювачів. Я справжній майстер маскування!',
    tip: 'Терпіння — мій головний урок. Я ціную тих, хто доглядає за мною з любов\'ю 🕊️',
  },
  Lamiaceae: {
    emoji: '💜',
    character: 'Ароматний цілитель',
    greeting: 'Закрий очі та вдихни — мій аромат заспокоює розум і зцілює душу.',
    fact: 'М\'ята, лаванда, розмарин, базилік, материнка — всі ми з родини Lamiaceae. Ми використовуємось у медицині вже 5000 років.',
    tip: 'Понюхай мене наступного разу — аромат знімає стрес краще за будь-які таблетки 🌬️',
  },
  Solanaceae: {
    emoji: '🍅',
    character: 'Подвійний агент',
    greeting: 'Я буваю їжею та отрутою одночасно. Томат, картопля, перець — мої родичі. Але й блекота теж.',
    fact: 'Родина Solanaceae подарувала Європі картоплю та томати лише у 16 столітті. До цього їх там не існувало!',
    tip: 'Всі ми маємо дві сторони — важливо знати, яку показувати світу 😉',
  },
  Cactaceae: {
    emoji: '🌵',
    character: 'Стійкий самітник',
    greeting: 'Я навчився виживати там, де інші здаються. Посуха, спека, кам\'яний ґрунт — для мене це норма.',
    fact: 'Деякі кактуси живуть понад 200 років. Я накопичую воду у своєму стеблі як резервуар.',
    tip: 'Найсильніші — це ті, хто навчився процвітати у найважчих умовах 💪',
  },
  Orchidaceae_alt: {
    emoji: '🌺',
    character: 'Екзотична красуня',
    greeting: 'Мільйони років еволюції зробили мене однією з найдосконаліших квіток на Землі.',
    fact: 'Ванільний аромат — це теж я! Ваніль видобувають із плодів орхідеї Vanilla planifolia.',
    tip: 'Краса потребує часу і терпіння 🌺',
  },
  Pinaceae: {
    emoji: '🌲',
    character: 'Мудрий старійшина',
    greeting: 'Я пам\'ятаю часи, коли людей ще не існувало. Деякі з моїх родичів живуть понад 5000 років.',
    fact: 'Сосна, ялина, ялиця, кедр — всі ми Pinaceae. Ми виробляємо кисень цілий рік, навіть взимку.',
    tip: 'Хочеш мудрості? Сядь під деревом, заплющ очі і просто послухай ліс 🍃',
  },
  Betulaceae: {
    emoji: '🌳',
    character: 'Тихий поет',
    greeting: 'Моя біла кора — як чистий аркуш паперу. Слов\'яни різьбили на моїй корі перші листи.',
    fact: 'Береза — символ України та Росії. З мого соку роблять напій, а деревина горить навіть волога.',
    tip: 'Я нагадую тобі: завжди є місце для чистого початку 🕊️',
  },
  Fagaceae: {
    emoji: '🌳',
    character: 'Могутній захисник',
    greeting: 'Я — дуб. Символ сили, довговічності та мудрості у десятках культур.',
    fact: 'Один дуб може бути домом для понад 500 видів комах, птахів та тварин. Я — ціла екосистема!',
    tip: 'З маленького жолудя виростає велетень. Ніколи не недооцінюй малий початок 🌱',
  },
  Brassicaceae: {
    emoji: '🥦',
    character: 'Корисний практик',
    greeting: 'Капуста, броколі, гірчиця, хрін, рукола — всі ми одна велика родина Brassicaceae!',
    fact: 'Я багата на вітамін C та антиоксиданти. Людство вирощує мене вже понад 6000 років.',
    tip: 'Їж своїх родичів частіше — вони дуже корисні для здоров\'я 😄',
  },
  Liliaceae: {
    emoji: '🌷',
    character: 'Весняна радість',
    greeting: 'Я перша прокидаюсь після зими, щоб сказати тобі: весна прийшла!',
    fact: 'Тюльпани у 17 столітті в Нідерландах коштували дорожче за будинки. Це називається "тюльпанна манія".',
    tip: 'Радій кожному новому дню, як я радію кожній весні 🌷',
  },
  Apiaceae: {
    emoji: '🌿',
    character: 'Кулінарний геній',
    greeting: 'Морква, петрушка, кріп, коріандр, кмин — ми прикрашаємо страви по всьому світу.',
    fact: 'Моя парасолькова форма суцвіття — ідеальний посадковий майданчик для комах-запилювачів.',
    tip: 'Найкращі речі в житті — прості та ароматні 🍃',
  },
  Malvaceae: {
    emoji: '🌺',
    character: 'Барвистий художник',
    greeting: 'Гібіскус, мальва, бавовна, какао — ми такі різні, але всі з однієї родини!',
    fact: 'Шоколад роблять із насіння Theobroma cacao — представника родини Malvaceae. Я смачна родина!',
    tip: 'Різноманітність — це сила. Чим більше кольорів, тим красивіший сад 🎨',
  },
  Euphorbiaceae: {
    emoji: '🌵',
    character: 'Таємничий хімік',
    greeting: 'Будь обережна зі мною — мій сік буває їдким. Але каучукове дерево теж моїй родич!',
    fact: ' Пуансетія (різдвяна зірка) — моя родичка. Каучук для шин та гумок — теж від нас, Euphorbiaceae.',
    tip: 'Обережність та повага до природи — це завжди мудро 🌿',
  },
};

const defaultLetter: LetterData = {
  emoji: '🌿',
  character: 'Загадковий мандрівник',
  greeting: 'Я подорожую цим світом вже мільйони років, і щоразу знаходжу нового друга.',
  fact: 'Рослини виробляють 70% кисню на планеті. Без нас не було б жодної тварини, жодної людини.',
  tip: 'Дякую, що помітила мене. Кожна рослина — це частина великого живого світу 🌍',
};

// Англійські тексти для не-українських мов
const familyLettersEn: Record<string, LetterData> = {
  Araceae: {
    emoji: '🌺',
    character: 'Tropical Dreamer',
    greeting: 'I was born in humid tropical forests where sunlight barely filters through the branches.',
    fact: 'My family Araceae has over 3,700 species! Some of us can even purify the air in your home.',
    tip: 'If you want me to bloom indoors — give me diffused light and regular watering.',
  },
  Rosaceae: {
    emoji: '🌹',
    character: 'Eternal Romantic',
    greeting: 'I am a symbol of love for over five thousand years. Egyptian pharaohs adorned their gardens with me.',
    fact: 'My family Rosaceae includes not only roses but also apples, pears, peaches, and strawberries!',
    tip: 'Give me to someone dear — I always carry the warmest feelings 💕',
  },
  Asteraceae: {
    emoji: '🌻',
    character: 'Sunny Optimist',
    greeting: 'My "face" is not one flower but hundreds of tiny flowers gathered together!',
    fact: 'Asteraceae is one of the largest families: over 23,000 species. Sunflower, daisy, dandelion — we are all related.',
    tip: 'Look at me more closely — millions of tiny secrets in the center 🔍',
  },
  Orchidaceae: {
    emoji: '🌸',
    character: 'Mysterious Aristocrat',
    greeting: 'I am the largest family of flowering plants on the planet, found on every continent except Antarctica.',
    fact: 'Some orchids mimic the appearance and scent of insects to attract pollinators. I am a true master of disguise!',
    tip: 'Patience is my greatest lesson. I cherish those who care for me with love 🕊️',
  },
  Cactaceae: {
    emoji: '🌵',
    character: 'Resilient Loner',
    greeting: 'I learned to survive where others give up. Drought, heat, rocky soil — this is my normal.',
    fact: 'Some cacti live over 200 years. I store water in my stem like a reservoir.',
    tip: 'The strongest are those who learned to thrive in the harshest conditions 💪',
  },
  Pinaceae: {
    emoji: '🌲',
    character: 'Wise Elder',
    greeting: 'I remember times when humans did not yet exist. Some of my relatives live over 5,000 years.',
    fact: 'Pine, spruce, fir, cedar — we are all Pinaceae. We produce oxygen all year, even in winter.',
    tip: 'Want wisdom? Sit under a tree, close your eyes, and just listen to the forest 🍃',
  },
  Poaceae: {
    emoji: '🌾',
    character: 'Humble Giant',
    greeting: 'I cover over 40% of Earth\'s land. Wheat, rice, corn, sugar cane — that\'s all me.',
    fact: 'Bamboo is also a grass! The fastest plant in the world: it can grow 90 cm in a single day.',
    tip: 'Never underestimate small things — they are what hold the world together 🌏',
  },
};

const defaultLetterEn: LetterData = {
  emoji: '🌿',
  character: 'Mysterious Wanderer',
  greeting: 'I have been traveling this world for millions of years, and each time I find a new friend.',
  fact: 'Plants produce 70% of the oxygen on the planet. Without us, no animal, no human would exist.',
  tip: 'Thank you for noticing me. Every plant is part of the great living world 🌍',
};

function getLetterData(family: string, lang: LangCode): LetterData {
  if (lang === 'uk') return familyLetters[family] ?? defaultLetter;
  return familyLettersEn[family] ?? defaultLetterEn;
}

export function generatePlantLetter(
  scientificName: string,
  commonName: string,
  family: string,
  foundDate: Date,
  lang: LangCode = 'uk'
): string {
  const data = getLetterData(family, lang);

  const displayName = commonName && commonName !== scientificName
    ? `${commonName} (${scientificName})`
    : scientificName;

  const locales: Record<LangCode, string> = {
    uk: 'uk-UA', en: 'en-GB', pl: 'pl-PL', de: 'de-DE', fr: 'fr-FR', es: 'es-ES',
  };
  const dateStr = foundDate.toLocaleDateString(locales[lang] ?? 'uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    `${data.emoji} ${tr(lang, 'letter_hi')} ${displayName}.\n\n` +
    `${data.greeting}\n\n` +
    `${tr(lang, 'letter_fact')} ${data.fact}\n\n` +
    `💬 ${data.tip}\n\n` +
    `${tr(lang, 'letter_found')} ${dateStr}. ${tr(lang, 'letter_footer')}`
  );
}

export function getPlantCharacter(family: string, lang: LangCode = 'uk'): string {
  return getLetterData(family, lang).character;
}

export function getPlantEmoji(family: string): string {
  return (familyLetters[family] ?? defaultLetter).emoji;
}
