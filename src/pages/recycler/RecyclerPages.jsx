import { useApp } from '../../context/AppContext';
import { EmptyState, AnimatedCounter } from '../../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const barData = [
  { day: 'Mon', plastics: 40, paper: 25, metals: 10 },
  { day: 'Tue', plastics: 55, paper: 30, metals: 15 },
  { day: 'Wed', plastics: 35, paper: 20, metals: 8 },
  { day: 'Thu', plastics: 70, paper: 40, metals: 20 },
  { day: 'Fri', plastics: 60, paper: 35, metals: 18 },
  { day: 'Sat', plastics: 45, paper: 28, metals: 12 },
  { day: 'Sun', plastics: 30, paper: 15, metals: 6 },
];

const pieData = [
  { name: 'Plastics', value: 45, color: '#3B82F6' },
  { name: 'Paper', value: 28, color: '#F59E0B' },
  { name: 'Metals', value: 15, color: '#6B7280' },
  { name: 'Glass', value: 12, color: '#06B6D4' },
];

export function RecyclerClaims() {
  const { marketplaceListings } = useApp();
  const claimed = marketplaceListings.filter(l => l.claimed);
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">📌 My Claims</h1>
      {claimed.length === 0 ? (
        <EmptyState icon="📌" title="No claims yet" subtitle="Head to the marketplace to claim recyclable material pickups" />
      ) : (
        <div className="space-y-3">
          {claimed.map(l => (
            <div key={l.id} className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-4 flex items-center gap-4">
              <span className="text-3xl">♻️</span>
              <div className="flex-1">
                <p className="text-white font-bold">{l.type} — {l.quantity}kg</p>
                <p className="text-purple-400 text-xs">{l.location} · {l.distance}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2 py-1 rounded-full">Pending</span>
                <button className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-2 py-1 rounded-lg hover:bg-green-500/30 transition-all">Mark Collected</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RecyclerAnalytics() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">📈 Analytics</h1>
      <div className="grid grid-cols-3 gap-3">
        {[{ label: 'Total Processed', value: 1240, suffix: 'kg' }, { label: 'Recycling Rate', value: 87, suffix: '%' }, { label: 'Revenue', value: 84000, prefix: '₦' }].map(s => (
          <div key={s.label} className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-4 text-center">
            <p className="text-white text-2xl font-black"><AnimatedCounter target={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} /></p>
            <p className="text-purple-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
          <h2 className="text-white font-bold mb-4">Weekly Collection (kg)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="day" stroke="#7C3AED" tick={{ fill: '#A78BFA', fontSize: 11 }} />
              <YAxis stroke="#7C3AED" tick={{ fill: '#A78BFA', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1a0a2e', border: '1px solid #7C3AED', borderRadius: 12, color: '#fff' }} />
              <Bar dataKey="plastics" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="paper" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="metals" fill="#6B7280" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
          <h2 className="text-white font-bold mb-4">Waste Type Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1a0a2e', border: '1px solid #7C3AED', borderRadius: 12, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-purple-300 text-xs">{d.name} {d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecyclerHistory() {
  const { marketplaceListings } = useApp();
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">📋 History</h1>
      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5 space-y-2">
        {marketplaceListings.map(l => (
          <div key={l.id} className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-xl">
            <span className="text-xl">♻️</span>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{l.type} — {l.quantity}kg</p>
              <p className="text-purple-500 text-xs">{l.location}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full border ${l.claimed ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
              {l.claimed ? 'Claimed' : 'Available'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
