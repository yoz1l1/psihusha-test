import { useState, useEffect, useRef } from 'react';
import { audioRecords, type AudioRecord } from '../data';
import { speech } from '../speech';
import { sfx } from '../sfx';

export function AudioArchive() {
  const [selected, setSelected] = useState<AudioRecord | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      speech.stop();
      if (progressTimer.current) window.clearInterval(progressTimer.current);
    };
  }, []);

  const stopPlayback = () => {
    speech.stop();
    setPlaying(false);
    setProgress(0);
    if (progressTimer.current) {
      window.clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  };

  const handlePlay = (record: AudioRecord) => {
    if (playing) {
      stopPlayback();
      return;
    }

    if (record.restricted) {
      sfx.error();
      return;
    }

    setPlaying(true);
    setProgress(0);
    sfx.tabSwitch();

    // Simulate progress bar
    const durationSec = parseDuration(record.duration);
    const startTime = Date.now();
    if (progressTimer.current) window.clearInterval(progressTimer.current);
    progressTimer.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const pct = Math.min((elapsed / durationSec) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        stopPlayback();
      }
    }, 200);

    speech.speak(record.transcript, () => {
      stopPlayback();
    });
  };

  if (selected) {
    return (
      <div className="crt-fade-in">
        <button
          onClick={() => { stopPlayback(); setSelected(null); }}
          className="crt-btn font-mono text-sm px-3 py-1.5 mb-4"
        >
          &lt; НАЗАД К СПИСКУ
        </button>

        <div className="crt-border crt-bg-panel-dark p-6">
          <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-[var(--crt-green-dark)]">
            <span className={`font-mono text-xl ${selected.restricted ? 'glitch-text' : 'crt-text'}`} data-text={selected.id}>
              {selected.id}
            </span>
            <span className="crt-text-dim font-mono text-sm">{selected.date}</span>
          </div>

          <h3 className="crt-text font-mono text-lg mb-2">{selected.title}</h3>
          <div className="crt-text-gray font-mono text-xs mb-4">
            ОБЪЕКТ: {selected.subject} | ДЛИТЕЛЬНОСТЬ: {selected.duration}
          </div>

          {/* Audio player */}
          <div className="crt-border-dim crt-bg-panel p-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handlePlay(selected)}
                disabled={selected.restricted}
                className={`crt-btn font-mono text-sm px-4 py-2 ${
                  playing ? 'crt-btn-active' : ''
                } ${selected.restricted ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {selected.restricted ? '[ ЗАПРЕЩЕНО ]' : playing ? '|| ОСТАНОВИТЬ' : '> ВОСПРОИЗВЕСТИ'}
              </button>
              <div className="flex-1">
                <div className="crt-border-dim h-3 relative overflow-hidden">
                  {playing && (
                    <div
                      className="absolute inset-0 crt-static-noise"
                      style={{ background: 'rgba(51, 255, 102, 0.1)' }}
                    />
                  )}
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${progress}%`,
                      background: 'rgba(51, 255, 102, 0.2)',
                      transition: 'width 0.2s linear',
                    }}
                  />
                </div>
              </div>
              <span className="crt-text-dim font-mono text-xs">{selected.duration}</span>
            </div>
            {playing && (
              <div className="mt-3 crt-text crt-pulse font-mono text-xs">
                [ ВОСПРОИЗВЕДЕНИЕ... ГОЛОСОВАЯ СИНТЕЗАЦИЯ ]
              </div>
            )}
            {selected.restricted && (
              <div className="mt-3 crt-text-red font-mono text-xs">
                [ ОШИБКА: ВОСПРОИЗВЕДЕНИЕ ЗАПРЕЩЕНО | УРОВЕНЬ ДОСТУПА: ОМЕГА ]
              </div>
            )}
          </div>

          {/* Transcript */}
          <div className="mt-4">
            <div className="crt-text-gray font-mono text-xs mb-2">ТРАНСКРИПЦИЯ ЗАПИСИ:</div>
            <div className="crt-border-dim crt-bg-panel p-4 max-h-[40vh] overflow-y-auto">
              <div className="crt-text-dim font-mono text-sm leading-relaxed whitespace-pre-line">
                {selected.transcript}
              </div>
            </div>
          </div>

          {selected.restricted && (
            <div className="mt-6 p-4 crt-border-dim crt-bg-panel">
              <div className="crt-text crt-pulse font-mono text-sm">
                [ ВНИМАНИЕ: ЗАПИСЬ ОГРАНИЧЕНА ]<br />
                [ УРОВЕНЬ ДОСТУПА: ОМЕГА ]<br />
                [ ПОЛНОЕ ВОСПРОИЗВЕДЕНИЕ НЕВОЗМОЖНО ]
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="crt-fade-in">
      <div className="mb-4 crt-text-dim font-mono text-xs">
        &gt; ПОДПАПКА: /ARCHIVE/AUDIO/<span className="crt-text">RECORDINGS.WAV</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {audioRecords.map((r) => (
          <button
            key={r.id}
            onClick={() => { stopPlayback(); setSelected(r); }}
            className="crt-border crt-bg-panel-dark p-4 text-left crt-btn transition-all"
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className={`font-mono text-sm ${r.restricted ? 'crt-text-gray' : 'crt-text'}`}>
                {r.id}
              </span>
              <span className="crt-text-gray font-mono text-xs">{r.duration}</span>
            </div>
            <div className={`font-mono text-sm mb-2 ${r.restricted ? 'crt-text-gray' : 'crt-text-dim'}`}>
              {r.title}
            </div>
            <div className="crt-text-gray font-mono text-xs">
              {r.date} | {r.subject}
            </div>
            {r.restricted && (
              <div className="mt-2 crt-text crt-pulse font-mono text-xs">
                [ ДОСТУП ОГРАНИЧЕН ]
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function parseDuration(d: string): number {
  const parts = d.split(':').map(Number);
  if (parts.some(isNaN)) return 60;
  return parts.reduce((acc, v) => acc * 60 + v, 0);
}
