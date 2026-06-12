import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Home, Truck, Recycle, Leaf, ChevronRight } from 'lucide-react';

const roles = [
  { key: 'admin',    icon: Shield,  label: 'Authority',     desc: 'System oversight, bin network management, compliance, and analytics.', accent: '#E53935' },
  { key: 'household',icon: Home,    label: 'Citizen',       desc: 'Report waste issues, track nearby bins, and earn rewards.',             accent: '#1A7F4E' },
  { key: 'collector',icon: Truck,   label: 'Collector',     desc: 'Manage collection routes, accept jobs, and track earnings.',            accent: '#1E88E5' },
  { key: 'recycler', icon: Recycle, label: 'Recycler',      desc: 'Source recyclable materials, manage marketplace listings, view data.',  accent: '#D4A017' },
  { key: 'farmer',   icon: Leaf,    label: 'Organic Buyer', desc: 'Purchase organic compostable materials for agricultural use.',          accent: '#2E7D32' },
];

export default function RoleSelection() {
  const { setRole } = useApp();
  const navigate = useNavigate();

  const select = (r) => { setRole(r); navigate(`/${r}`); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--canvas)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-[15px] font-bold" style={{ background: 'var(--brand)' }}>
          EG
        </div>
        <div>
          <p className="text-[18px] font-semibold leading-tight" style={{ color: 'var(--ink)' }}>Eko-Guard</p>
          <p className="text-[12px]" style={{ color: 'var(--sub)' }}>Environmental Intelligence Platform</p>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-8 max-w-sm">
        <h1 className="text-[26px] font-semibold mb-2" style={{ color: 'var(--ink)' }}>Select your workspace</h1>
        <p className="text-[14px] leading-relaxed" style={{ color: 'var(--sub)' }}>
          Choose the role matching your responsibilities. Switch workspaces anytime from the sidebar.
        </p>
      </div>

      {/* Cards */}
      <div className="w-full max-w-lg space-y-2">
        {roles.map(({ key, icon: Icon, label, desc, accent }) => (
          <button
            key={key}
            onClick={() => select(key)}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-md border text-left group anim-fade-up transition-all duration-150"
            style={{ background: 'var(--card)', borderColor: 'var(--wire)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--active)'; e.currentTarget.style.borderColor = 'var(--wire-strong)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.borderColor = 'var(--wire)'; }}
          >
            <div className="w-9 h-9 rounded flex items-center justify-center shrink-0" style={{ background: `${accent}1A`, color: accent }}>
              <Icon size={17} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>{label}</p>
              <p className="text-[12px] leading-snug mt-0.5 truncate" style={{ color: 'var(--sub)' }}>{desc}</p>
            </div>
            <ChevronRight size={15} style={{ color: 'var(--dim)' }} className="shrink-0" />
          </button>
        ))}
      </div>

      <p className="mt-10 text-[11px] text-center" style={{ color: 'var(--dim)' }}>
        Eko-Guard by EarthLies · Lagos, Nigeria
      </p>
    </div>
  );
}
