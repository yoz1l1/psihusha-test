import { useState, useEffect } from 'react';
import { BootSequence } from './components/BootSequence';
import { CRTOverlay } from './components/CRTOverlay';
import { AccessGate } from './components/AccessGate';
import { AuthPanel, getRoleLabel, type Role } from './components/AuthPanel';
import { HistorySection } from './sections/HistorySection';
import { PatientArchive } from './sections/PatientArchive';
import { AudioArchive } from './sections/AudioArchive';
import { CameraRecordings } from './sections/CameraRecordings';
import { sfx } from './sfx';
import { speech } from './speech';
import { Monitor, Users, Volume2, Video, Terminal, Lock } from 'lucide-react';

type Tab = 'history' | 'patients' | 'audio' | 'cameras';

const tabs: { id: Tab; label: string; icon: typeof Monitor; requiredRole: Exclude<Role, null> | null }[] = [
  { id: 'history', label: 'ИСТОРИЯ', icon: Terminal, requiredRole: null },
  { id: 'patients', label: 'АРХИВ ПАЦИЕНТОВ', icon: Users, requiredRole: 'staff' },
  { id: 'audio', label: 'АУДИОАРХИВ', icon: Volume2, requiredRole: 'doctor' },
  { id: 'cameras', label: 'ЗАПИСИ КАМЕР', icon: Video, requiredRole: 'guard' },
];

function hasAccess(tabRequiredRole: Exclude<Role, null> | null, role: Role): boolean {
  if (!tabRequiredRole) return true;
  if (role === 'doctor') return true;
  return role === tabRequiredRole;
}

function App() {
  const [booted, setBooted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [activeTab, setActiveTab] = useState<Tab>('history');
  const [glitchTab, setGlitchTab] = useState(false);
  const [denied, setDenied] = useState(false);
  const [deniedTab, setDeniedTab] = useState<Tab | null>(null);
  const [clock, setClock] = useState('');

  useEffect(() => {
    return () => {
      sfx.stopHiss();
      speech.stop();
    };
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      setClock(`${h}:${m}:${s}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;

    speech.stop();

    const tabConfig = tabs.find((t) => t.id === tab)!;
    if (!hasAccess(tabConfig.requiredRole, role)) {
      sfx.denied();
      setDeniedTab(tab);
      setDenied(true);
      setTimeout(() => setDenied(false), 1500);
      return;
    }

    sfx.tabSwitch();
    setGlitchTab(true);
    setTimeout(() => {
      setActiveTab(tab);
      setGlitchTab(false);
    }, 200);
  };

  if (!booted) {
    return (
      <>
        <BootSequence onComplete={() => { sfx.boot(); setBooted(true); }} />
        <CRTOverlay />
      </>
    );
  }

  if (!unlocked) {
    return (
      <>
        <AccessGate onUnlock={() => { sfx.startHiss(); setUnlocked(true); }} />
        <CRTOverlay />
      </>
    );
  }

  return (
    <div
      className="min-h-screen crt-scanline-bg crt-flicker-slow"
      style={{ background: 'var(--crt-bg)' }}
    >
      <CRTOverlay />

      {/* Header */}
      <header className="crt-border-dim border-x-0 border-t-0 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Monitor className="crt-text crt-flicker" size={28} />
            <div>
              <h1
                className="crt-text font-mono text-lg font-bold tracking-wider"
                style={{ textShadow: '0 0 6px rgba(51, 255, 102, 0.6)' }}
              >
                BLACKWOOD STATE ASYLUM
              </h1>
              <div className="crt-text-gray font-mono text-xs">
                АРХИВНАЯ СИСТЕМА | 1809 — 1953
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="crt-text-dim font-mono text-xs">
              <span className="crt-text-gray">СИСТ:</span> {clock}
            </div>
            <div className="crt-text-dim font-mono text-xs">
              <span className="crt-text-gray">УЗ:</span>{' '}
              <span className={role ? 'crt-text' : 'crt-text-gray'}>
                {getRoleLabel(role)}
              </span>
            </div>
            <AuthPanel
              role={role}
              onLogin={(r) => {
                setRole(r);
                setActiveTab('history');
              }}
              onLogout={() => {
                setRole(null);
                setActiveTab('history');
              }}
            />
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="crt-border-dim border-x-0 border-t-0 px-6 py-0">
        <div className="max-w-6xl mx-auto flex gap-1 flex-wrap">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isLocked = !hasAccess(t.requiredRole, role);
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`flex items-center gap-2 font-mono text-sm px-4 py-3 transition-all border-b-2 ${
                  isActive
                    ? 'crt-text border-[var(--crt-green)]'
                    : isLocked
                    ? 'crt-text-gray border-transparent'
                    : 'crt-text-gray border-transparent hover:crt-text-dim'
                }`}
                style={
                  isActive
                    ? { textShadow: '0 0 4px rgba(51, 255, 102, 0.5)' }
                    : {}
                }
              >
                <Icon size={16} />
                {t.label}
                {isLocked && <Lock size={12} className="ml-1" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Access denied overlay */}
      {denied && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
          <div className="crt-shake text-center">
            <div className="glitch-text crt-text-red font-mono text-3xl mb-4" data-text="ДОСТУП ЗАПРЕЩЁН">
              ДОСТУП ЗАПРЕЩЁН
            </div>
            <div className="crt-text-red-dim font-mono text-sm">
              ОШИБКА: НЕДОСТАТОЧНЫЙ УРОВЕНЬ ДОПУСКА
            </div>
            {deniedTab && (
              <div className="crt-text-red-dim font-mono text-xs mt-2">
                ТРЕБУЕТСЯ ДОСТУП: {getRoleLabel(tabs.find((t) => t.id === deniedTab)!.requiredRole)}
              </div>
            )}
            <div className="crt-text-red font-mono text-xs mt-4 crt-pulse">
              [ ОТКАЗАНО В ДОСТУПЕ | ОБРАТИТЕСЬ К АДМИНИСТРАТОРУ ]
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className={glitchTab ? 'crt-shake' : ''}>
          {activeTab === 'history' && <HistorySection />}
          {activeTab === 'patients' && <PatientArchive />}
          {activeTab === 'audio' && <AudioArchive />}
          {activeTab === 'cameras' && <CameraRecordings />}
        </div>
      </main>

      {/* Footer */}
      <footer className="crt-border-dim border-x-0 border-b-0 px-6 py-3 mt-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center crt-text-gray font-mono text-xs flex-wrap gap-2">
          <span>
            &gt; BLACKWOOD ASYLUM ARCHIVE SYSTEM v3.14.1953
          </span>
          <span className="crt-text-dim">
            [ НЕСАНКЦИОНИРОВАННЫЙ ДОСТУП ПРЕСЛЕДУЕТСЯ ]
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
