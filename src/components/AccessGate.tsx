import { useState } from 'react';
import { sfx } from '../sfx';

const SITE_CODE = 'GT48_IJDWH';

export function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === SITE_CODE) {
      sfx.success();
      onUnlock();
    } else {
      sfx.error();
      setError(true);
      setAttempts((a) => a + 1);
      setCode('');
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center crt-scanline-bg crt-flicker-slow"
      style={{ background: 'var(--crt-bg)' }}
    >
      <div className={`max-w-md w-full px-8 py-12 ${error ? 'crt-shake' : ''}`}>
        <div className="text-center mb-8">
          <div className="crt-text font-mono text-xs crt-pulse mb-2">
            [ ДОСТУП ОГРАНИЧЕН ]
          </div>
          <h2 className="crt-text font-mono text-xl tracking-wider mb-2">
            АВТОРИЗАЦИЯ ДОСТУПА
          </h2>
          <div className="crt-text-gray font-mono text-xs">
            BLACKWOOD STATE ASYLUM
          </div>
        </div>

        <div className={`crt-border crt-bg-panel-dark p-6 ${error ? 'crt-border-red crt-bg-red-panel' : ''}`}>
          <div className="crt-text-dim font-mono text-xs mb-4 leading-relaxed">
            &gt; ВВЕДИТЕ КОД ДОСТУПА ДЛЯ ПРОСМОТРА
            <br />
            &gt; АРХИВНЫХ МАТЕРИАЛОВ СИСТЕМЫ
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="КОД ДОСТУПА..."
              autoFocus
              className={`crt-input font-mono text-sm px-3 py-2 w-full mb-4 tracking-widest ${
                error ? 'crt-border-red' : ''
              }`}
              style={error ? { color: 'var(--crt-red)', borderColor: 'var(--crt-red-dim)' } : {}}
            />
            <button
              type="submit"
              className="crt-btn font-mono text-sm px-4 py-2 w-full"
            >
              &gt; ПОДТВЕРДИТЬ
            </button>
          </form>

          {error && (
            <div className="mt-4 crt-text-red font-mono text-xs text-center">
              [ ОШИБКА: НЕВЕРНЫЙ КОД ДОСТУПА ]
              {attempts >= 3 && (
                <div className="mt-1 crt-text-red-dim">
                  ПОПЫТОК: {attempts} | ДОСТУП ЗАПИСЫВАЕТСЯ
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 text-center crt-text-gray font-mono text-xs">
          [ НЕСАНКЦИОНИРОВАННЫЙ ДОСТУП ПРЕСЛЕДУЕТСЯ ]
        </div>
      </div>
    </div>
  );
}
