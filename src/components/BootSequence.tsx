import { useEffect, useState } from 'react';

const bootLines = [
  'BLACKWOOD STATE ASYLUM',
  'АРХИВНАЯ СИСТЕМА v3.14.1953',
  '',
  '(C) 1953 BUREAU OF MENTAL HEALTH',
  'ВСЕ ПРАВА ЗАЩИЩЕНЫ',
  '',
  'ПРОВЕРКА ПАМЯТИ..................[ OK ]',
  'ЗАГРУЗКА ЯДРА.....................[ OK ]',
  'ПОДКЛЮЧЕНИЕ К АРХИВУ..............[ OK ]',
  'ПРОВЕРКА ЦЕЛОСТНОСТИ ДАННЫХ......[ ЧАСТИЧНО ]',
  '  2 ЗАПИСИ ПОВРЕЖДЕНЫ',
  '  4 ЗАПИСИ ЗАСЕКРЕЧЕНЫ',
  '  3 ЗАПИСИ НЕ НАЙДЕНЫ',
  '',
  'ПРЕДУПРЕЖДЕНИЕ: НЕКОТОРЫЕ ДАННЫЕ МОГУТ',
  'СОДЕРЖАТЬ МАТЕРИАЛЫ, НЕ ПОДЛЕЖАЩИЕ',
  'РАСПРОСТРАНЕНИЮ. ПРОСМОТР РЕКОМЕНДУЕТСЯ',
  'ТОЛЬКО УПОЛНОМОЧЕННОМУ ПЕРСОНАЛУ.',
  '',
  'ВНИМАНИЕ: ОБНАРУЖЕНА АНОМАЛИЯ В ПОДЗЕМНОМ',
  'ЯРУСЕ. КАМЕРЫ 3 И 6 АКТИВНЫ.',
  '',
  'ЗАГРУЗКА ИНТЕРФЕЙСА...............',
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showPressKey, setShowPressKey] = useState(false);

  useEffect(() => {
    if (visibleLines < bootLines.length) {
      const delay = bootLines[visibleLines] === '' ? 100 : 80 + Math.random() * 120;
      const t = setTimeout(() => setVisibleLines((n) => n + 1), delay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowPressKey(true), 400);
      return () => clearTimeout(t);
    }
  }, [visibleLines]);

  useEffect(() => {
    if (!showPressKey) return;
    const handler = () => onComplete();
    window.addEventListener('keydown', handler);
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('click', handler);
    };
  }, [showPressKey, onComplete]);

  return (
    <div
      className="min-h-screen flex items-center justify-center crt-scanline-bg"
      style={{ background: 'var(--crt-bg)' }}
      onClick={() => showPressKey && onComplete()}
    >
      <div className="max-w-2xl w-full px-8 py-12 font-mono text-sm">
        {bootLines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={
              line.startsWith('ВНИМАНИЕ') || line.startsWith('ПРЕДУПРЕЖДЕНИЕ')
                ? 'crt-text crt-flicker'
                : 'crt-text-dim'
            }
          >
            {line || '\u00A0'}
          </div>
        ))}
        {showPressKey && (
          <div className="mt-6 crt-text crt-cursor crt-pulse text-sm">
            [ НАЖМИТЕ ЛЮБУЮ КЛАВИШУ ДЛЯ ПРОДОЛЖЕНИЯ ]
          </div>
        )}
      </div>
    </div>
  );
}
