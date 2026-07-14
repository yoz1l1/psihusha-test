import { useState } from 'react';
import { historyEntries } from '../data';

export function HistorySection() {
  const [selected, setSelected] = useState(0);
  const entry = historyEntries[selected];
  const isClassified = entry.year === '???';

  return (
    <div className="crt-fade-in">
      <div className="mb-4 crt-text-dim font-mono text-xs">
        &gt; ПОДПАПКА: /ARCHIVE/HISTORY/<span className="crt-text">TIMELINE.LOG</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
        {/* Timeline list */}
        <div className="crt-border crt-bg-panel-dark p-3 max-h-[60vh] overflow-y-auto">
          <div className="crt-text-dim font-mono text-xs mb-3 pb-2 border-b border-[var(--crt-green-dark)]">
            ХРОНОЛОГИЯ СОБЫТИЙ
          </div>
          {historyEntries.map((e, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left font-mono text-sm px-2 py-1.5 mb-1 transition-all ${
                i === selected
                  ? 'crt-btn-active'
                  : 'crt-btn'
              }`}
            >
              <span className={isClassified && i === selected ? 'crt-text' : ''}>
                {e.year}
              </span>
              <span className="crt-text-gray ml-2 text-xs">
                {e.title.length > 20 ? e.title.slice(0, 18) + '..' : e.title}
              </span>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="crt-border crt-bg-panel-dark p-5 min-h-[40vh]">
          <div className="flex items-baseline gap-4 mb-4 pb-3 border-b border-[var(--crt-green-dark)]">
            <span
              className={`font-mono text-3xl ${isClassified ? 'glitch-text' : 'crt-text'}`}
              data-text={entry.year}
            >
              {entry.year}
            </span>
            <span className="crt-text-dim font-mono text-lg">{entry.title}</span>
          </div>
          <div className="font-mono text-sm crt-text-dim leading-relaxed whitespace-pre-line">
            {entry.text}
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--crt-green-dark)] flex justify-between crt-text-gray font-mono text-xs">
            <span>ЗАПИСЬ {selected + 1} / {historyEntries.length}</span>
            <span className="crt-pulse">
              {isClassified ? '[ ДОСТУП ОГРАНИЧЕН ]' : '[ ДОКУМЕНТ ОТКРЫТ ]'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
