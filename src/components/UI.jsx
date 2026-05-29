import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

// ── Toast System ──────────────────────────────────────────────
export function ToastContainer() {
  const { toasts, removeToast } = useApp();
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-medium min-w-[280px] animate-slide-in
            ${t.type === 'success' ? 'bg-green-500' : t.type === 'warning' ? 'bg-amber-500' : t.type === 'error' ? 'bg-red-500' : 'bg-purple-700'}`}>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="opacity-70 hover:opacity-100 text-lg leading-none">×</button>
        </div>
      ))}
    </div>
  );
}

// ── Notification Panel ────────────────────────────────────────
export function NotificationPanel({ open, onClose }) {
  const { notifications, markNotificationRead, unreadCount } = useApp();
  const today = notifications.filter(n => new Date(n.time) > new Date(Date.now() - 86400000));
  const earlier = notifications.filter(n => new Date(n.time) <= new Date(Date.now() - 86400000));

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-80 bg-[#1a0a2e] border-l border-purple-800 z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-purple-800">
          <h2 className="text-white font-bold text-lg">Notifications {unreadCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}</h2>
          <button onClick={onClose} className="text-purple-300 hover:text-white text-2xl">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {today.length > 0 && (
            <div>
              <p className="text-purple-400 text-xs font-semibold uppercase mb-2">Today</p>
              {today.map(n => <NotifItem key={n.id} n={n} onRead={markNotificationRead} />)}
            </div>
          )}
          {earlier.length > 0 && (
            <div>
              <p className="text-purple-400 text-xs font-semibold uppercase mb-2">Earlier</p>
              {earlier.map(n => <NotifItem key={n.id} n={n} onRead={markNotificationRead} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function NotifItem({ n, onRead }) {
  return (
    <div className={`p-3 rounded-xl mb-2 cursor-pointer transition-all ${n.read ? 'bg-purple-900/30' : 'bg-purple-900/60 border-l-4 border-purple-400'}`}
      onClick={() => onRead(n.id)}>
      <div className="flex gap-3 items-start">
        <span className="text-xl">{n.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">{n.title}</p>
          <p className="text-purple-300 text-xs mt-0.5">{n.body}</p>
          <p className="text-purple-500 text-xs mt-1">{new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        {!n.read && <span className="w-2 h-2 rounded-full bg-green-400 mt-1 shrink-0" />}
      </div>
    </div>
  );
}

// ── Bottom Sheet ──────────────────────────────────────────────
export function BottomSheet({ open, onClose, children, title }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />}
      <div className={`fixed bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center z-50 transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`bg-[#1a0a2e] border border-purple-700 rounded-t-3xl md:rounded-2xl w-full md:max-w-lg p-6 transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full md:translate-y-0 md:scale-95'}`}>
          <div className="w-12 h-1 bg-purple-600 rounded-full mx-auto mb-4 md:hidden" />
          {title && <h3 className="text-white font-bold text-lg mb-4">{title}</h3>}
          {children}
        </div>
      </div>
    </>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return <div className={`bg-purple-900/40 rounded-xl animate-pulse ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

// ── Animated Counter ──────────────────────────────────────────
export function AnimatedCounter({ target, duration = 1500, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ── Circular Progress ─────────────────────────────────────────
export function CircularProgress({ value, size = 80, stroke = 8, color = '#22C55E', label, sublabel }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2D0A4E" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        {label && <span className="text-white font-bold" style={{ fontSize: size * 0.2 }}>{label}</span>}
        {sublabel && <span className="text-purple-300" style={{ fontSize: size * 0.12 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

// ── Fill Bar ──────────────────────────────────────────────────
export function FillBar({ value, color, label }) {
  const barColor = value >= 100 ? '#EF4444' : value >= 80 ? '#F59E0B' : color;
  const pulse = value >= 80;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-8 h-32 bg-purple-900/50 rounded-full overflow-hidden">
        <div className={`absolute bottom-0 w-full rounded-full transition-all duration-1000 ${pulse ? 'animate-pulse' : ''}`}
          style={{ height: `${Math.min(value, 100)}%`, backgroundColor: barColor }} />
      </div>
      <span className="text-xs text-purple-300 font-medium">{value}%</span>
      {label && <span className="text-xs text-purple-400">{label}</span>}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────
export function EmptyState({ icon = '🌿', title, subtitle, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-purple-400 text-sm mb-6 max-w-xs">{subtitle}</p>
      {action && <button onClick={onAction} className="bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-2 rounded-xl transition-all">{action}</button>}
    </div>
  );
}

// ── Confetti ──────────────────────────────────────────────────
export function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 30 }, (_, i) => i);
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
      {pieces.map(i => (
        <div key={i} className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`, top: '-10px',
            width: `${6 + Math.random() * 8}px`, height: `${6 + Math.random() * 8}px`,
            backgroundColor: ['#22C55E', '#A855F7', '#F59E0B', '#3B82F6', '#EF4444'][i % 5],
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1 + Math.random()}s`,
          }} />
      ))}
    </div>
  );
}
