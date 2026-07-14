import { useState } from 'react';
import { Lock, X, ShieldCheck, Stethoscope, Eye } from 'lucide-react';
import { sfx } from '../sfx';

export type Role = 'staff' | 'guard' | 'doctor' | null;

const ROLE_CODES: Record<Exclude<Role, null>, string> = {
  staff: 'Pers0nq3364558',
  guard: '0HHHSVGG67GXB_3',
  doctor: 'KFFWGEBVHGGN_54Uhgvbggg69',
};

const ROLE_INFO: Record<Exclude<Role, null>, { label: string; icon: typeof Lock; desc: string }> = {
  staff: { label: 'СОТРУДНИК БОЛЬНИЦЫ', icon: Stethoscope, desc: 'Доступ к архиву пациентов' },
  guard: { label: 'ОХРАНА', icon: ShieldCheck, desc: 'Доступ к записям камер' },
  doctor: { label: 'ГЛАВНЫЙ ВРАЧ', icon: Eye, desc: 'Полный доступ ко всем разделам' },
};

export function getRoleLabel(role: Role): string {
  if (!role) return 'НЕ АВТОРИЗОВАН';
  return ROLE_INFO[role].label;
}

export function AuthPanel({
  role,
  onLogin,
  onLogout,
}: {
  role: Role;
  onLogin: (r: Role) => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Exclude<Role, null>>('staff');
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ROLE_CODES[selectedRole]) {
      sfx.success();
      onLogin(selectedRole);
      setCode('');
      setError(false);
      setOpen(false);
    } else {
      sfx.error();
      setError(true);
      setCode('');
      setTimeout(() => setError(false), 600);
    }
  };

  const handleLogout = () => {
    sfx.logout();
    onLogout();
    setOpen(false);
  };

  if (role && !open) {
    const Info = ROLE_INFO[role].icon;
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 crt-border-dim crt-bg-panel px-3 py-1.5">
          <Info size={14} className="crt-text" />
          <span className="crt-text font-mono text-xs">{ROLE_INFO[role].label}</span>
          <span className="crt-text-gray font-mono text-xs">|</span>
          <span className="crt-text-dim font-mono text-xs">{ROLE_INFO[role].desc}</span>
        </div>
        <button
          onClick={handleLogout}
          className="crt-btn font-mono text-xs px-3 py-1.5"
        >
          ВЫЙТИ
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="crt-btn font-mono text-xs px-3 py-1.5 flex items-center gap-2"
      >
        <Lock size={14} />
        АВТОРИЗАЦИЯ
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200]"
        style={{ background: 'rgba(0, 0, 0, 0.7)' }}
        onClick={() => { setOpen(false); setError(false); setCode(''); }}
      />

      {/* Panel */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md px-4">
        <div className={`crt-border crt-bg-panel-dark p-6 crt-fade-in ${error ? 'crt-border-red crt-bg-red-panel' : ''}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--crt-green-dark)]">
            <div className="flex items-center gap-2">
              <Lock size={18} className="crt-text" />
              <span className="crt-text font-mono text-sm tracking-wider">
                ПАНЕЛЬ АВТОРИЗАЦИИ
              </span>
            </div>
            <button
              onClick={() => { setOpen(false); setError(false); setCode(''); }}
              className="crt-text-gray hover:crt-text"
            >
              <X size={18} />
            </button>
          </div>

          {/* Role selector */}
          <div className="mb-4">
            <div className="crt-text-gray font-mono text-xs mb-2">ВЫБЕРИТЕ УРОВЕНЬ ДОСТУПА:</div>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(ROLE_INFO) as Exclude<Role, null>[]).map((r) => {
                const Info = ROLE_INFO[r].icon;
                return (
                  <button
                    key={r}
                    onClick={() => { setSelectedRole(r); setError(false); setCode(''); }}
                    className={`flex items-center gap-3 px-3 py-2.5 font-mono text-sm transition-all ${
                      selectedRole === r ? 'crt-btn-active' : 'crt-btn'
                    }`}
                  >
                    <Info size={16} />
                    <div className="text-left">
                      <div>{ROLE_INFO[r].label}</div>
                      <div className="crt-text-gray text-xs">{ROLE_INFO[r].desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code input */}
          <form onSubmit={handleLogin}>
            <div className="crt-text-gray font-mono text-xs mb-2">
              ВВЕДИТЕ СЛУЖЕБНЫЙ КОД:
            </div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="КОД..."
              autoFocus
              className={`crt-input font-mono text-sm px-3 py-2 w-full mb-4 tracking-widest ${error ? 'crt-shake' : ''}`}
              style={error ? { color: 'var(--crt-red)', borderColor: 'var(--crt-red-dim)' } : {}}
            />
            <button
              type="submit"
              className="crt-btn font-mono text-sm px-4 py-2 w-full"
            >
              &gt; ВОЙТИ В СИСТЕМУ
            </button>
          </form>

          {error && (
            <div className="mt-4 crt-text-red font-mono text-xs text-center">
              [ ОШИБКА: НЕВЕРНЫЙ КОД | ДОСТУП ОТКЛОНЁН ]
            </div>
          )}

          {role && (
            <div className="mt-4 pt-4 border-t border-[var(--crt-green-dark)]">
              <button
                onClick={handleLogout}
                className="crt-btn font-mono text-xs px-3 py-2 w-full"
              >
                ВЫЙТИ ИЗ ТЕКУЩЕГО АККАУНТА
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
