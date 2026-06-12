import { useState, useEffect, useRef } from 'react';
import { X, ChevronUp, ChevronDown, ChevronRight, MoreVertical,
         AlertTriangle, CheckCircle, XCircle, Info, Search,
         ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

// ── Colour helpers ─────────────────────────────────────────
const S = {
  critical: { dot: '#E53935', bg: 'rgba(229,57,53,0.12)',  text: '#F87171' },
  warning:  { dot: '#F57C00', bg: 'rgba(245,124,0,0.12)',  text: '#FDBA74' },
  success:  { dot: '#2E7D32', bg: 'rgba(46,125,50,0.12)',  text: '#4ADE80' },
  info:     { dot: '#1E88E5', bg: 'rgba(30,136,229,0.12)', text: '#60A5FA' },
  muted:    { dot: '#484F58', bg: 'rgba(72,79,88,0.15)',   text: '#8B949E' },
  brand:    { dot: '#1A7F4E', bg: 'rgba(26,127,78,0.12)',  text: '#34D399' },
};

// ── Badge ──────────────────────────────────────────────────
export function Badge({ variant = 'muted', children, className = '' }) {
  const s = S[variant] || S.muted;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide ${className}`}
      style={{ background: s.bg, color: s.text }}
    >
      {children}
    </span>
  );
}

// ── StatusDot ──────────────────────────────────────────────
export function StatusDot({ variant = 'muted', pulse = false }) {
  const s = S[variant] || S.muted;
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full shrink-0 ${pulse ? 'anim-pulse-dot' : ''}`}
      style={{ background: s.dot }}
    />
  );
}

// ── Button ─────────────────────────────────────────────────
const btnBase = 'inline-flex items-center justify-center gap-2 font-medium rounded transition-all duration-150 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-[13px] h-9 px-4';

export function Btn({ variant = 'primary', children, className = '', size = 'md', loading = false, ...props }) {
  const sizeClass = size === 'sm' ? '!h-7 !px-3 !text-[12px]' : size === 'lg' ? '!h-10 !px-5' : '';
  const style = variant === 'primary' ? { background: 'var(--brand)' }
              : variant === 'destructive' ? { background: 'var(--err)' }
              : variant === 'secondary' ? { borderColor: 'var(--brand)', border: '1px solid' }
              : {};
  const textColor = variant === 'primary' || variant === 'destructive' ? 'text-white'
                  : variant === 'secondary' ? 'text-[var(--brand)]'
                  : 'text-[var(--sub)] hover:text-[var(--ink)] hover:bg-[var(--active)]';
  return (
    <button
      className={`${btnBase} ${textColor} ${sizeClass} ${className}`}
      style={style}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
}

// ── IconBtn ────────────────────────────────────────────────
export function IconBtn({ children, className = '', ...props }) {
  return (
    <button
      className={`w-8 h-8 flex items-center justify-center rounded text-[var(--sub)] hover:text-[var(--ink)] hover:bg-[var(--active)] transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ── KPI Card ───────────────────────────────────────────────
export function KPICard({ label, value, delta, deltaType = 'neutral', suffix = '', prefix = '' }) {
  const arrow = deltaType === 'up' ? <ArrowUpRight size={12} /> : deltaType === 'down' ? <ArrowDownRight size={12} /> : <Minus size={12} />;
  const deltaColor = deltaType === 'up' ? 'text-[#4ADE80]' : deltaType === 'down' ? 'text-[#F87171]' : 'text-[var(--sub)]';
  return (
    <div className="p-5 rounded-md border border-[var(--wire)] bg-[var(--card)] anim-fade-up">
      <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--sub)] mb-3">{label}</p>
      <p className="text-3xl font-semibold text-[var(--ink)] leading-none tabular-nums">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </p>
      {delta !== undefined && (
        <p className={`flex items-center gap-1 mt-3 text-[12px] font-medium ${deltaColor}`}>
          {arrow}{delta}
        </p>
      )}
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────
export function Card({ children, className = '', pad = true }) {
  return (
    <div className={`rounded-md border border-[var(--wire)] bg-[var(--card)] ${pad ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

// ── Card Header ────────────────────────────────────────────
export function CardHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-5 ${className}`}>
      <div>
        <h3 className="text-[15px] font-semibold text-[var(--ink)]">{title}</h3>
        {subtitle && <p className="text-[12px] text-[var(--sub)] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

// ── Page Header ────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold text-[var(--ink)] leading-tight">{title}</h1>
        {subtitle && <p className="text-[13px] text-[var(--sub)] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

// ── Intelligence Panel ─────────────────────────────────────
export function IntelPanel({ title, body, actions, type = 'warning', updatedAt }) {
  const borderColor = type === 'warning' ? 'var(--warn)' : 'var(--info)';
  const bg = type === 'warning' ? 'rgba(245,124,0,0.04)' : 'rgba(30,136,229,0.04)';
  return (
    <div className="rounded-md border border-[var(--wire)] p-4" style={{ borderLeftColor: borderColor, borderLeftWidth: 3, background: bg }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--sub)]">{title}</p>
        {updatedAt && <p className="text-[11px] text-[var(--dim)] shrink-0">{updatedAt}</p>}
      </div>
      <p className="text-[13px] text-[var(--ink)] leading-relaxed">{body}</p>
      {actions && <div className="flex gap-2 mt-3">{actions}</div>}
    </div>
  );
}

// ── Activity Feed ──────────────────────────────────────────
const catColors = { critical: '#F87171', warning: '#FDBA74', success: '#4ADE80', info: '#60A5FA' };

export function ActivityFeed({ events = [], max = 10 }) {
  return (
    <div>
      {events.slice(0, max).map((ev) => (
        <div key={ev.id} className="flex items-start gap-3 py-2.5 border-b border-[var(--wire)] last:border-0">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: catColors[ev.category] || catColors.info }} />
          <p className="flex-1 text-[13px] text-[var(--sub)] leading-snug">{ev.text}</p>
          <span className="text-[11px] text-[var(--dim)] shrink-0 tabular-nums">{ev.time}</span>
        </div>
      ))}
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────
export function EmptyState({ title = 'No data', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-10 h-10 rounded-full bg-[var(--active)] flex items-center justify-center mb-4">
        <Minus size={18} className="text-[var(--dim)]" />
      </div>
      <p className="text-[14px] font-medium text-[var(--ink)] mb-1">{title}</p>
      {description && <p className="text-[13px] text-[var(--sub)] max-w-xs mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return <div className={`bg-[var(--active)] rounded animate-pulse ${className}`} />;
}

// ── Search Input ───────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dim)] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-8 pr-3 bg-[var(--card)] border border-[var(--wire)] rounded text-[13px] text-[var(--ink)] placeholder-[var(--dim)] focus:border-[var(--brand)] focus:outline-none transition-colors"
      />
    </div>
  );
}

// ── Select ─────────────────────────────────────────────────
export function Select({ value, onChange, children, className = '' }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`h-9 px-3 pr-8 bg-[var(--card)] border border-[var(--wire)] rounded text-[13px] text-[var(--ink)] focus:border-[var(--brand)] focus:outline-none cursor-pointer ${className}`}
    >
      {children}
    </select>
  );
}

// ── Fill Bar ───────────────────────────────────────────────
export function FillBar({ value, className = '' }) {
  const color = value >= 90 ? '#E53935' : value >= 60 ? '#F57C00' : '#2E7D32';
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 bg-[var(--active)] rounded-full overflow-hidden" style={{ minWidth: 60 }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[12px] font-mono text-[var(--sub)] w-8 text-right shrink-0">{value}%</span>
    </div>
  );
}

// ── Table ──────────────────────────────────────────────────
export function Table({ columns, data, onRowClick, emptyTitle = 'No records', emptyDesc }) {
  const [sort, setSort] = useState({ key: null, dir: 'asc' });
  const [sel, setSel] = useState(new Set());
  const [page, setPage] = useState(1);
  const perPage = 10;

  const sorted = sort.key
    ? [...data].sort((a, b) => {
        const va = a[sort.key], vb = b[sort.key];
        const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
        return sort.dir === 'asc' ? cmp : -cmp;
      })
    : data;

  const pages = Math.ceil(sorted.length / perPage);
  const slice = sorted.slice((page - 1) * perPage, page * perPage);
  const allSel = slice.length > 0 && slice.every(r => sel.has(r.id));

  const toggleAll = () => setSel(s => {
    const n = new Set(s);
    allSel ? slice.forEach(r => n.delete(r.id)) : slice.forEach(r => n.add(r.id));
    return n;
  });
  const toggleRow = (id) => setSel(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const handleSort = (key) => setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));

  return (
    <div>
      {sel.size > 0 && (
        <div className="flex items-center gap-3 mb-2 px-3 py-2 bg-[var(--brand-tint)] border border-[var(--brand)] rounded text-[13px] anim-fade-up">
          <span className="text-[var(--ink)] font-medium">{sel.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <Btn variant="ghost" size="sm">Export Selected</Btn>
            <Btn variant="ghost" size="sm" onClick={() => setSel(new Set())}>Deselect All</Btn>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-md border border-[var(--wire)]">
        <table className="w-full eg-table min-w-[600px]">
          <thead>
            <tr className="border-b border-[var(--wire)]">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={allSel} onChange={toggleAll} className="w-4 h-4 cursor-pointer" style={{ accentColor: 'var(--brand)' }} />
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-[11px] font-medium uppercase tracking-widest text-[var(--sub)] whitespace-nowrap ${col.sort !== false ? 'cursor-pointer select-none hover:text-[var(--ink)] transition-colors' : ''}`}
                  style={{ width: col.width }}
                  onClick={() => col.sort !== false && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sort.key === col.key && (sort.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr><td colSpan={columns.length + 1}><EmptyState title={emptyTitle} description={emptyDesc} /></td></tr>
            ) : slice.map(row => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-[var(--wire)] last:border-0 transition-colors
                  ${onRowClick ? 'cursor-pointer' : ''}
                  ${sel.has(row.id) ? 'bg-[rgba(13,46,30,0.4)]' : 'hover:bg-[var(--active)]'}`}
                style={sel.has(row.id) ? { borderLeft: '2px solid var(--brand)' } : {}}
              >
                <td className="px-4 py-3" onClick={e => { e.stopPropagation(); toggleRow(row.id); }}>
                  <input type="checkbox" checked={sel.has(row.id)} onChange={() => toggleRow(row.id)} className="w-4 h-4 cursor-pointer" style={{ accentColor: 'var(--brand)' }} />
                </td>
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-[13px] text-[var(--ink)] whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between mt-3 text-[12px] text-[var(--sub)]">
          <span>Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, sorted.length)} of {sorted.length}</span>
          <div className="flex items-center gap-1">
            <IconBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronRight size={14} className="rotate-180" />
            </IconBtn>
            {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded text-[12px] transition-colors ${page === n ? 'text-white' : 'hover:bg-[var(--active)] text-[var(--sub)]'}`}
                style={page === n ? { background: 'var(--brand)' } : {}}>
                {n}
              </button>
            ))}
            <IconBtn onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>
              <ChevronRight size={14} />
            </IconBtn>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, footer, width = 520 }) {
  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && onClose?.();
    if (open) document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div
        className="relative rounded-md border border-[var(--wire-strong)] bg-[var(--raised)] shadow-2xl anim-fade-up flex flex-col max-h-[90vh]"
        style={{ width: '100%', maxWidth: width }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--wire)] shrink-0">
          <h2 className="text-[16px] font-semibold text-[var(--ink)]">{title}</h2>
          <IconBtn onClick={onClose}><X size={16} /></IconBtn>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--wire)] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Drawer ─────────────────────────────────────────────────
export function Drawer({ open, onClose, title, children, width = 480 }) {
  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && onClose?.();
    if (open) document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [open, onClose]);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full bg-[var(--raised)] border-l border-[var(--wire-strong)] z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: Math.min(width, window.innerWidth) }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--wire)] shrink-0">
          <h2 className="text-[16px] font-semibold text-[var(--ink)]">{title}</h2>
          <IconBtn onClick={onClose}><X size={16} /></IconBtn>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </>
  );
}

// ── Toast ──────────────────────────────────────────────────
export function ToastContainer({ toasts = [], onRemove }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] space-y-2 pointer-events-none">
      {toasts.map(t => {
        const icon = t.type === 'success' ? <CheckCircle size={14} className="shrink-0" style={{ color: '#4ADE80' }} />
                   : t.type === 'error'   ? <XCircle size={14} className="shrink-0" style={{ color: '#F87171' }} />
                   : t.type === 'warning' ? <AlertTriangle size={14} className="shrink-0" style={{ color: '#FDBA74' }} />
                   : <Info size={14} className="shrink-0" style={{ color: '#60A5FA' }} />;
        return (
          <div key={t.id}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-md border border-[var(--wire-strong)] shadow-xl text-[13px] text-[var(--ink)] min-w-[280px] max-w-sm anim-slide-in"
            style={{ background: 'var(--raised)' }}
          >
            {icon}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => onRemove?.(t.id)} className="text-[var(--dim)] hover:text-[var(--sub)]">
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── Notification Panel ─────────────────────────────────────
export function NotificationPanel({ open, onClose, notifications = [], onMarkRead }) {
  const typeVariant = { critical: 'critical', warning: 'warning', success: 'success', info: 'info' };
  return (
    <Drawer open={open} onClose={onClose} title="Notifications" width={400}>
      {notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You are all caught up." />
      ) : (
        <div className="space-y-1">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => onMarkRead?.(n.id)}
              className={`p-3 rounded-md border cursor-pointer transition-colors
                ${n.read ? 'border-[var(--wire)] bg-transparent hover:bg-[var(--active)]' : 'border-[var(--wire-strong)] bg-[var(--active)]'}`}
            >
              <div className="flex items-start gap-2.5">
                <StatusDot variant={typeVariant[n.type] || 'info'} pulse={!n.read} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--ink)] truncate">{n.title}</p>
                  <p className="text-[12px] text-[var(--sub)] mt-0.5 leading-snug">{n.body}</p>
                  <p className="text-[11px] text-[var(--dim)] mt-1.5">{n.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
}

// ── Tabs ───────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-[var(--wire)] mb-5">
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)}
          className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
            active === t.key ? 'text-[var(--ink)] border-[var(--brand)]' : 'text-[var(--sub)] border-transparent hover:text-[var(--ink)]'
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span className="ml-2 text-[11px] px-1.5 py-0.5 rounded-full bg-[var(--active)] text-[var(--sub)]">{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Stat Row ───────────────────────────────────────────────
export function StatRow({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[var(--wire)] last:border-0">
      <span className="text-[12px] text-[var(--sub)]">{label}</span>
      <span className={`text-[13px] text-[var(--ink)] font-medium ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

// ── Chart Tooltip ──────────────────────────────────────────
export function ChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2.5 rounded-md border border-[var(--wire-strong)] text-[12px] shadow-xl" style={{ background: 'var(--raised)' }}>
      <p className="text-[var(--sub)] mb-2 font-medium">{label}</p>
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: e.color }} />
          <span style={{ color: e.color }}>{e.name}:</span>
          <span className="font-medium text-[var(--ink)]">{Number(e.value).toLocaleString()}{unit}</span>
        </div>
      ))}
    </div>
  );
}

// ── Kebab Menu ─────────────────────────────────────────────
export function KebabMenu({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <IconBtn onClick={() => setOpen(o => !o)}><MoreVertical size={14} /></IconBtn>
      {open && (
        <div className="absolute right-0 top-9 w-44 rounded-md border border-[var(--wire-strong)] bg-[var(--raised)] shadow-xl z-20 py-1 anim-fade-up">
          {items.map((item, i) => item === 'divider' ? (
            <hr key={i} className="my-1 border-[var(--wire)]" />
          ) : (
            <button
              key={i}
              onClick={() => { item.onClick?.(); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-[13px] transition-colors flex items-center gap-2
                ${item.destructive ? 'hover:bg-[rgba(229,57,53,0.1)]' : 'hover:bg-[var(--active)]'}`}
              style={{ color: item.destructive ? '#F87171' : 'var(--ink)' }}
            >
              {item.icon && <span className="text-[var(--sub)]">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Spinner ────────────────────────────────────────────────
export function Spinner({ size = 16 }) {
  return (
    <span
      className="inline-block border-2 border-[var(--wire)] border-t-[var(--brand)] rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );
}
