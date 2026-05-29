import { useApp } from '../../context/AppContext';
import { AnimatedCounter } from '../../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const weekData = [
  { day: 'Mon', total: 260 }, { day: 'Tue', total: 320 }, { day: 'Wed', total: 220 },
  { day: 'Thu', total: 380 }, { day: 'Fri', total: 340 }, { day: 'Sat', total: 280 }, { day: 'Sun', total: 190 },
];

export function AdminBinsMap() {
  const { bins } = useApp();
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">🗺️ All Bins Map</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {bins.map(bin => {
          const max = Math.max(...Object.values(bin.fillLevels));
          const statusColor = bin.status === 'full' ? 'border-red-500/30 bg-red-500/5' : bin.status === 'flagged' ? 'border-amber-500/30 bg-amber-500/5' : 'border-purple-800';
          return (
            <div key={bin.id} className={`bg-[#1a0a2e] border ${statusColor} rounded-2xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold text-sm">{bin.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${bin.status === 'full' ? 'bg-red-500/20 text-red-400 border-red-500/30' : bin.status === 'flagged' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                  {bin.status}
                </span>
              </div>
              <p className="text-purple-400 text-xs mb-3">{bin.location}</p>
              <div className="flex gap-3">
                {[{ label: 'R', value: bin.fillLevels.recyclable, color: '#3B82F6' }, { label: 'O', value: bin.fillLevels.organic, color: '#22C55E' }, { label: 'G', value: bin.fillLevels.general, color: '#EF4444' }].map(f => (
                  <div key={f.label} className="flex-1">
                    <div className="h-2 bg-purple-900 rounded-full overflow-hidden mb-1">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${f.value}%`, backgroundColor: f.color }} />
                    </div>
                    <p className="text-purple-500 text-[10px]">{f.label}: {f.value}%</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdminAnalytics() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">📈 Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ label: 'Total Waste (Month)', value: 12400, suffix: 'kg' }, { label: 'Recycling Rate', value: 67, suffix: '%' }, { label: 'Active Collectors', value: 24 }, { label: 'CO₂ Offset', value: 6200, suffix: 'kg' }].map(s => (
          <div key={s.label} className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-4 text-center">
            <p className="text-white text-2xl font-black"><AnimatedCounter target={s.value} suffix={s.suffix || ''} /></p>
            <p className="text-purple-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-4">Daily Waste Collection Trend</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weekData}>
            <XAxis dataKey="day" stroke="#7C3AED" tick={{ fill: '#A78BFA', fontSize: 11 }} />
            <YAxis stroke="#7C3AED" tick={{ fill: '#A78BFA', fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1a0a2e', border: '1px solid #7C3AED', borderRadius: 12, color: '#fff' }} />
            <Line type="monotone" dataKey="total" stroke="#22C55E" strokeWidth={2.5} dot={{ fill: '#22C55E', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AdminUsers() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">👥 User Management</h1>
      <p className="text-purple-400 text-sm">Full user management is available on the main Admin Dashboard.</p>
    </div>
  );
}

export function AdminReports() {
  const reports = [
    { title: 'Monthly Waste Summary — January 2025', date: '2025-01-12', type: 'PDF', size: '2.4 MB' },
    { title: 'Recycling Rate Report Q4 2024', date: '2025-01-01', type: 'PDF', size: '1.8 MB' },
    { title: 'Collector Performance Report', date: '2024-12-31', type: 'CSV', size: '0.5 MB' },
    { title: 'Organic Diversion Analysis', date: '2024-12-15', type: 'PDF', size: '3.1 MB' },
  ];
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">📄 Reports</h1>
      <div className="space-y-3">
        {reports.map((r, i) => (
          <div key={i} className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-4 flex items-center gap-4 hover:border-purple-600 transition-all">
            <span className="text-3xl">{r.type === 'PDF' ? '📄' : '📊'}</span>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{r.title}</p>
              <p className="text-purple-500 text-xs">{new Date(r.date).toLocaleDateString()} · {r.size}</p>
            </div>
            <button className="bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
