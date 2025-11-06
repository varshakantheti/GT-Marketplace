// Banned words filter for listing content
const BANNED_WORDS = [
  'spam',
  'scam',
  'fake',
  'counterfeit',
  // Add more as needed
];

export function containsBannedWords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BANNED_WORDS.some(word => lowerText.includes(word));
}

export function filterBannedWords(text: string): string {
  let filtered = text;
  BANNED_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });
  return filtered;
}

