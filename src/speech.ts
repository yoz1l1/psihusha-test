// Speech synthesis utility — reads audio archive transcripts aloud
// using the browser's SpeechSynthesis API with a low, slow, eerie voice.

function cleanTranscript(text: string): string {
  return text
    .replace(/\[ЗВУК\]|\[ЗВУК\]:|\[ПОМЕХИ\]|\[СИЛЬНЫЕ ПОМЕХИ\]|\[помехи\]|\[повреждение плёнки\]/g, ' ')
    .replace(/\[КРЕЙН\]:/g, 'Доктор Крейн:')
    .replace(/\[ИНТЕРВЬЮЕР\]:/g, 'Интервьюер:')
    .replace(/\[ПАЦИЕНТКА\]:/g, 'Пациентка:')
    .replace(/\[ВРАЧ\]:/g, 'Врач:')
    .replace(/\[ЛОУСОН\]:/g, 'Лоусон:')
    .replace(/\[ГОЛОС \d\]:/g, 'Голос:')
    .replace(/\[ГОЛОС \d+\]:/g, 'Голос:')
    .replace(/\[\d{2}:\d{2}\]/g, ' ')
    .replace(/\[\d{2}:\d{2}:\d{2}\]/g, ' ')
    .replace(/\[.*?\]/g, ' ')
    .replace(/\(.*?\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const speech = {
  speak(text: string, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();

    const cleaned = cleanTranscript(text);
    if (!cleaned) {
      onEnd?.();
      return;
    }

    const sentences = cleaned.match(/[^.!?]+[.!?]*/g) ?? [cleaned];
    let idx = 0;

    const speakNext = () => {
      if (idx >= sentences.length) {
        onEnd?.();
        return;
      }

      const chunk = sentences[idx].trim();
      idx++;

      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.85;
      utterance.pitch = 0.6;
      utterance.volume = 0.7;

      const voices = window.speechSynthesis.getVoices();
      const ruVoice = voices.find((v) => v.lang.startsWith('ru'));
      if (ruVoice) utterance.voice = ruVoice;

      utterance.onend = speakNext;
      utterance.onerror = speakNext;

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  },

  stop(): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  },

  isSpeaking(): boolean {
    if (typeof window === 'undefined' || !window.speechSynthesis) return false;
    return window.speechSynthesis.speaking;
  },
};
