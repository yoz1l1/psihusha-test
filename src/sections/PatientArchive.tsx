import { useState } from 'react';
import { patients, type Patient } from '../data';

export function PatientArchive() {
  const [selected, setSelected] = useState<Patient | null>(null);
  const [search, setSearch] = useState('');

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    return <PatientDetail patient={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="crt-fade-in">
      <div className="mb-4 crt-text-dim font-mono text-xs">
        &gt; ПОДПАПКА: /ARCHIVE/PATIENTS/<span className="crt-text">REGISTRY.DAT</span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ПОИСК ПО ИМЕНИ / ID / ДИАГНОЗУ..."
          className="crt-input font-mono text-sm px-3 py-2 w-full max-w-md"
        />
      </div>

      <div className="crt-border crt-bg-panel-dark">
        <div className="grid grid-cols-[100px_1fr_120px_120px_100px] gap-2 px-4 py-2 crt-text-gray font-mono text-xs border-b border-[var(--crt-green-dark)]">
          <span>ID</span>
          <span>ИМЯ</span>
          <span>СТАТУС</span>
          <span>ДАТА ПОСТУПЛЕНИЯ</span>
          <span>ДОСТУП</span>
        </div>
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="w-full text-left grid grid-cols-[100px_1fr_120px_120px_100px] gap-2 px-4 py-2.5 font-mono text-sm crt-btn border-b border-[var(--crt-green-dark)] last:border-0"
          >
            <span className="crt-text-dim">{p.id}</span>
            <span className={p.classified ? 'crt-text-gray' : 'crt-text'}>
              {p.name}
            </span>
            <span className={
              p.status === 'УМЕР' || p.status === 'УМЕРЛА' ? 'crt-text-gray' :
              p.status === 'ПРОПАЛ БЕЗ ВЕСТИ' || p.status === 'ПРОПАЛА БЕЗ ВЕСТИ' ? 'crt-text-dim' :
              'crt-text-dim'
            }>
              {p.status}
            </span>
            <span className="crt-text-dim">{p.admitted}</span>
            <span className={p.classified ? 'crt-text crt-pulse' : 'crt-text-gray'}>
              {p.classified ? 'ЗАПРЕТ' : 'ОТКРЫТ'}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="px-4 py-8 crt-text-gray font-mono text-sm text-center">
            НИЧЕГО НЕ НАЙДЕНО
          </div>
        )}
      </div>

      <div className="mt-3 crt-text-gray font-mono text-xs">
        ЗАПИСЕЙ В БАЗЕ: {patients.length} | ОТОБРАЖЕНО: {filtered.length}
      </div>
    </div>
  );
}

function PatientDetail({ patient, onBack }: { patient: Patient; onBack: () => void }) {
  return (
    <div className="crt-fade-in">
      <button
        onClick={onBack}
        className="crt-btn font-mono text-sm px-3 py-1.5 mb-4"
      >
        &lt; НАЗАД К СПИСКУ
      </button>

      <div className="crt-border crt-bg-panel-dark p-6">
        <div className="flex items-baseline gap-4 mb-6 pb-4 border-b border-[var(--crt-green-dark)]">
          <span className={`font-mono text-2xl ${patient.classified ? 'glitch-text' : 'crt-text'}`} data-text={patient.id}>
            {patient.id}
          </span>
          <span className="crt-text-dim font-mono text-xl">{patient.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 font-mono text-sm">
          <DetailRow label="ДАТА ПОСТУПЛЕНИЯ" value={patient.admitted} />
          <DetailRow label="ДАТА ВЫПИСКИ" value={patient.discharged ?? '—'} />
          <DetailRow label="СТАТУС" value={patient.status} highlight={patient.status.includes('ПРОПАЛ')} />
          <DetailRow label="ПАЛАТА" value={patient.ward} />
          <DetailRow label="ЛЕЧАЩИЙ ВРАЧ" value={patient.doctor} />
          <DetailRow label="ДИАГНОЗ" value={patient.diagnosis} />
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--crt-green-dark)]">
          <div className="crt-text-gray font-mono text-xs mb-2">МЕДИЦИНСКИЕ ЗАПИСИ:</div>
          <div className="crt-text-dim font-mono text-sm leading-relaxed whitespace-pre-line">
            {patient.notes}
          </div>
        </div>

        {patient.classified && (
          <div className="mt-6 p-4 crt-border-dim crt-bg-panel">
            <div className="crt-text crt-pulse font-mono text-sm">
              [ ВНИМАНИЕ: ИНФОРМАЦИЯ ОГРАНИЧЕНА ]<br />
              [ УРОВЕНЬ ДОСТУПА: ОМЕГА ]<br />
              [ ПОЛНЫЙ ДОСТУП НЕВОЗМОЖЕН В ТЕКУЩЕЙ СЕССИИ ]
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="crt-text-gray text-xs">{label}</span>
      <span className={highlight ? 'crt-text crt-pulse' : 'crt-text-dim'}>{value}</span>
    </div>
  );
}
