/**
 * Speech synthesis utility for Arabic pronunciation
 */
export function speakArabic(text: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.85; // slightly slower for clear learning pronunciation
  utterance.pitch = 1.0;

  // Try to find an Arabic voice
  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find(
    (voice) => voice.lang.startsWith('ar') || voice.lang.includes('ar-SA')
  );

  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}
