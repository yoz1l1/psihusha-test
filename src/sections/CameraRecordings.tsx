import { useState } from 'react';
import { cameraRecords, type CameraRecord } from '../data';

export function CameraRecordings() {
  const [selected, setSelected] = useState<CameraRecord | null>(null);

  if (selected) {
    return (
      <div className="crt-fade-in">
        <button
          onClick={() => setSelected(null)}
          className="crt-btn font-mono text-sm px-3 py-1.5 mb-4"
        >
          &lt; НАЗАД К СПИСКУ
        </button>

        <div className="crt-border crt-bg-panel-dark p-6">
          <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-[var(--crt-green-dark)]">
            <span className={`font-mono text-xl ${selected.status === 'CORRUPTED' ? 'glitch-text' : 'crt-text'}`} data-text={selected.id}>
              {selected.id}
            </span>
            <span className={`font-mono text-sm ${
              selected.status === 'RECOVERED' ? 'crt-text-dim' :
              selected.status === 'PARTIAL' ? 'crt-text crt-pulse' :
              'crt-text-gray'
            }`}>
              [{selected.status}]
            </span>
          </div>

          <h3 className="crt-text font-mono text-lg mb-1">{selected.location}</h3>
          <div className="crt-text-gray font-mono text-xs mb-4">
            {selected.date} | {selected.duration}
          </div>

          {/* Video mockup */}
          <div className="crt-border-dim crt-bg-panel-dark p-4 mb-6">
            <div className="relative aspect-video crt-border-dim overflow-hidden crt-static-noise" style={{ background: 'var(--crt-bg)' }}>
              {/* Simulated CCTV overlay */}
              <div className="absolute top-2 left-2 crt-text-dim font-mono text-xs crt-flicker">
                REC ● {selected.id}
              </div>
              <div className="absolute top-2 right-2 crt-text-dim font-mono text-xs">
                {selected.date}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="crt-text-gray font-mono text-sm crt-pulse">
                  {selected.status === 'CORRUPTED' ? '[ СИГНАЛ ПОТЕРЯН ]' : '[ НЕТ ВИДЕОСИГНАЛА ]'}
                </div>
              </div>
              <div className="absolute bottom-2 left-2 crt-text-dim font-mono text-xs">
                CAM: {selected.location}
              </div>
              <div className="absolute bottom-2 right-2 crt-text-dim font-mono text-xs crt-cursor">
                {selected.duration}
              </div>
            </div>
          </div>

          <div className="crt-text-gray font-mono text-xs mb-2">ОПИСАНИЕ:</div>
          <div className="crt-text-dim font-mono text-sm mb-4">{selected.description}</div>

          <div className="mt-4">
            <div className="crt-text-gray font-mono text-xs mb-2">ПРОТОКОЛ НАБЛЮДЕНИЯ:</div>
            <div className="crt-border-dim crt-bg-panel p-4 max-h-[40vh] overflow-y-auto">
              <div className="crt-text-dim font-mono text-sm leading-relaxed whitespace-pre-line">
                {selected.transcript}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crt-fade-in">
      <div className="mb-4 crt-text-dim font-mono text-xs">
        &gt; ПОДПАПКА: /ARCHIVE/CCTV/<span className="crt-text">FOOTAGE.VHS</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cameraRecords.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            className="crt-border crt-bg-panel-dark p-4 text-left crt-btn transition-all"
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className={`font-mono text-sm ${c.status === 'CORRUPTED' ? 'crt-text-gray' : 'crt-text'}`}>
                {c.id}
              </span>
              <span className={`font-mono text-xs ${
                c.status === 'RECOVERED' ? 'crt-text-dim' :
                c.status === 'PARTIAL' ? 'crt-text' :
                'crt-text-gray'
              }`}>
                [{c.status}]
              </span>
            </div>
            <div className={`font-mono text-sm mb-2 ${c.status === 'CORRUPTED' ? 'crt-text-gray' : 'crt-text-dim'}`}>
              {c.location}
            </div>
            <div className="crt-text-gray font-mono text-xs">
              {c.date} | {c.duration}
            </div>
            <div className="mt-2 crt-text-gray font-mono text-xs line-clamp-2">
              {c.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
