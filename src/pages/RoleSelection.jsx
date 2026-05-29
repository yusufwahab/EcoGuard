import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const roles = [
  { id: 'household', icon: '🏠', label: 'Household', desc: 'Scan waste, earn rewards, track your bin' },
  { id: 'collector', icon: '🚛', label: 'Collector', desc: 'Manage routes, accept jobs, track earnings' },
  { id: 'recycler', icon: '♻️', label: 'Recycler', desc: 'Browse & claim recyclable material listings' },
  { id: 'farmer', icon: '🌾', label: 'Farmer', desc: 'Source organic waste for composting & farming' },
  { id: 'admin', icon: '🛡️', label: 'Admin', desc: 'Monitor city-wide bins, analytics & users' },
];

export default function RoleSelection() {
  const { setRole } = useApp();
  const navigate = useNavigate();

  const handleSelect = (roleId) => {
    setRole(roleId);
    navigate(`/${roleId}`);
  };

  return (
    <div className="min-h-screen bg-[#2D0A4E] flex flex-col items-center justify-center p-6">
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-5xl">🌿</span>
          <h1 className="text-5xl font-black text-white tracking-tight">EcoGuard</h1>
        </div>
        <p className="text-green-400 text-lg font-medium tracking-wide">Smart Waste. Circular Economy. Digital Lagos.</p>
      </div>

      <p className="text-purple-300 text-sm mb-8 font-medium uppercase tracking-widest">Select your role to continue</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-5xl">
        {roles.map((role, i) => (
          <button key={role.id} onClick={() => handleSelect(role.id)}
            className="group bg-[#1a0a2e] border border-purple-700 hover:border-green-400 rounded-2xl p-6 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] cursor-pointer"
            style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{role.icon}</span>
            <span className="text-white font-bold text-lg">{role.label}</span>
            <span className="text-purple-400 text-xs text-center leading-relaxed">{role.desc}</span>
            <span className="mt-2 bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/30 group-hover:bg-green-500 group-hover:text-white transition-all">
              Enter →
            </span>
          </button>
        ))}
      </div>

      <p className="text-purple-600 text-xs mt-10">© 2025 EcoGuard — Powered by Azure AI & Smart IoT</p>
    </div>
  );
}
