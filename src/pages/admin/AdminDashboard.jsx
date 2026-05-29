import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AnimatedCounter, CardSkeleton } from '../../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockUsers } from '../../data/mockData';

const barData = [
  { day: 'Mon', recyclable: 120, organic: 80, general: 60 },
  { day: 'Tue', recyclable: 150, organic: 95, general: 75 },
  { day: 'Wed', recyclable: 100, organic: 70, general: 50 },
  { day: 'Thu', recyclable: 180, organic: 110, general: 90 },
  { day: 'Fri', recyclable: 160, organic: 100, general: 80 },
  { day: 'Sat', recyclable: 130, organic: 85, general: 65 },
  { day: 'Sun', recyclable: 90, organic: 60, general: 40 },
];

const pieData = [
  { name: 'Recyclable', value: 45, color: '#3B82F6' },
  { name: 'Organic', value: 35, color: '#22C55E' },
  { name: 'General', value: 20, color: '#EF4444' },
];

export default function AdminDashboard() {
  const { bins, addToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [flaggedBins, setFlaggedBins] = useState(bins.filter(b => b.status === 'flagged' || b.status === 'full'));
  const [users, setUsers] = useState(mockUsers);
  const [userSearch, setUserSearch] = useState('');
  const [hoveredBin, setHoveredBin] = useState(null);

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  const resolveFlag = (id) => {
    setFlaggedBins(fb => fb.map(b => b.id === id ? { ...b, status: 'active' } : b));
    addToast(`Bin ${id} resolved ✅`, 'success');
  };

  const toggleUser = (id) => {
    setUsers(u => u.map(x => x.id === id ? { ...x, status: x.status === 'active' ? 'suspended' : 'active' } : x));
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.role.includes(userSearch.toLowerCase()));

  // Map positions for bins
  const binMapPositions = [
    { id: 'BIN-001', x: 420, y: 280, bin: bins[0] },
    { id: 'BIN-002', x: 380, y: 220, bin: bins[1] },
    { id: 'BIN-003', x: 440, y: 180, bin: bins[2] },
    { id: 'BIN-004', x: 200, y: 200, bin: bins[3] },
    { id: 'BIN-005', x: 220, y: 150, bin: bins[4] },
    { id: 'BIN-006', x: 160, y: 80, bin: bins[5] },
    { id: 'BIN-007', x: 500, y: 320, bin: bins[6] },
    { id: 'BIN-008', x: 240, y: 100, bin: bins[7] },
  ];

  const getDotColor = (bin) => {
    if (bin.status === 'full') return '#EF4444';
    if (bin.status === 'flagged') return '#F59E0B';
    return '#22C55E';
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">{Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
      <CardSkeleton />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">🛡️ Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Active Bins', value: bins.filter(b => b.status === 'active').length, icon: '🗑️', color: 'text-green-400' },
          { label: 'Classified Today', value: 1247, icon: '📷', color: 'text-blue-400' },
          { label: 'Recycling Rate', value: 67, suffix: '%', icon: '♻️', color: 'text-purple-400' },
          { label: 'Organic Diverted', value: 842, suffix: 'kg', icon: '🌿', color: 'text-emerald-400' },
          { label: 'Active Users', value: users.filter(u => u.status === 'active').length, icon: '👥', color: 'text-amber-400' },
        ].map(k => (
          <div key={k.label} className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-4">
            <span className="text-2xl">{k.icon}</span>
            <p className={`text-2xl font-black mt-2 ${k.color}`}><AnimatedCounter target={k.value} suffix={k.suffix || ''} /></p>
            <p className="text-purple-400 text-xs mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* City Map */}
      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-purple-800">
          <h2 className="text-white font-bold">🗺️ City Bin Map — Lagos</h2>
          <div className="flex items-center gap-3 text-xs">
            {[{ color: '#22C55E', label: 'Active' }, { color: '#F59E0B', label: 'Flagged' }, { color: '#EF4444', label: 'Full' }].map(l => (
              <div key={l.label} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-purple-400">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 320 }}>
          <svg width="100%" height="320" viewBox="0 0 600 320">
            <rect width="600" height="320" fill="#0f0520" />
            {[80, 160, 240, 320, 400, 480].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="320" stroke="#2D0A4E" strokeWidth="1" />)}
            {[80, 160, 240].map(y => <line key={`h${y}`} x1="0" y1={y} x2="600" y2={y} stroke="#2D0A4E" strokeWidth="1" />)}
            <line x1="0" y1="160" x2="600" y2="160" stroke="#3D1A5E" strokeWidth="3" />
            <line x1="300" y1="0" x2="300" y2="320" stroke="#3D1A5E" strokeWidth="3" />
            <line x1="0" y1="100" x2="600" y2="220" stroke="#3D1A5E" strokeWidth="2" />
            {binMapPositions.map((bp) => {
              const color = getDotColor(bp.bin);
              return (
                <g key={bp.id} onMouseEnter={() => setHoveredBin(bp)} onMouseLeave={() => setHoveredBin(null)} style={{ cursor: 'pointer' }}>
                  <circle cx={bp.x} cy={bp.y} r="12" fill={color} opacity="0.15" />
                  <circle cx={bp.x} cy={bp.y} r="7" fill={color} />
                  <circle cx={bp.x} cy={bp.y} r="7" fill="none" stroke={color} strokeWidth="2" opacity="0.5">
                    <animate attributeName="r" from="7" to="14" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}
            {hoveredBin && (
              <g>
                <rect x={Math.min(hoveredBin.x + 12, 450)} y={hoveredBin.y - 70} width="140" height="80" rx="8" fill="#1a0a2e" stroke="#7C3AED" strokeWidth="1" />
                <text x={Math.min(hoveredBin.x + 20, 458)} y={hoveredBin.y - 52} fill="white" fontSize="9" fontWeight="bold">{hoveredBin.id}</text>
                <text x={Math.min(hoveredBin.x + 20, 458)} y={hoveredBin.y - 38} fill="#A78BFA" fontSize="8">{hoveredBin.bin.location.slice(0, 22)}</text>
                <text x={Math.min(hoveredBin.x + 20, 458)} y={hoveredBin.y - 24} fill="#22C55E" fontSize="8">
                  R:{hoveredBin.bin.fillLevels.recyclable}% O:{hoveredBin.bin.fillLevels.organic}%
                </text>
                <text x={Math.min(hoveredBin.x + 20, 458)} y={hoveredBin.y - 10} fill="#EF4444" fontSize="8">
                  G:{hoveredBin.bin.fillLevels.general}% · {hoveredBin.bin.status}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
          <h2 className="text-white font-bold mb-4">Waste Collected (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="day" stroke="#7C3AED" tick={{ fill: '#A78BFA', fontSize: 11 }} />
              <YAxis stroke="#7C3AED" tick={{ fill: '#A78BFA', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1a0a2e', border: '1px solid #7C3AED', borderRadius: 12, color: '#fff' }} />
              <Bar dataKey="recyclable" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="organic" fill="#22C55E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="general" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
          <h2 className="text-white font-bold mb-4">Waste Type Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1a0a2e', border: '1px solid #7C3AED', borderRadius: 12, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-purple-300 text-xs">{d.name} {d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flagged Bins Table */}
      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-4">⚠️ Flagged Bins</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-purple-400 text-xs border-b border-purple-800">
                {['Bin ID', 'Location', 'Issue', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left py-2 pr-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flaggedBins.map(bin => (
                <tr key={bin.id} className="border-b border-purple-900/50 hover:bg-purple-900/20 transition-colors">
                  <td className="py-3 pr-4 text-white font-mono text-xs">{bin.id}</td>
                  <td className="py-3 pr-4 text-purple-300 text-xs max-w-[140px] truncate">{bin.location}</td>
                  <td className="py-3 pr-4 text-xs">
                    <span className="text-amber-400">
                      {Math.max(...Object.values(bin.fillLevels)) >= 90 ? 'Overflow risk' : 'Near capacity'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-1 rounded-full border font-semibold transition-all ${bin.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                      {bin.status === 'active' ? '✅ Resolved' : bin.status.charAt(0).toUpperCase() + bin.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      {bin.status !== 'active' && (
                        <button onClick={() => resolveFlag(bin.id)}
                          className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-2 py-1 rounded-lg hover:bg-green-500/30 transition-all">
                          Resolve
                        </button>
                      )}
                      <button className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-2 py-1 rounded-lg hover:bg-blue-500/30 transition-all">
                        Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold">👥 User Management</h2>
          <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search users..."
            className="bg-purple-900/40 border border-purple-700 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-green-500 w-40" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-purple-400 text-xs border-b border-purple-800">
                {['Name', 'Role', 'Joined', 'Activity', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left py-2 pr-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-purple-900/50 hover:bg-purple-900/20 transition-colors">
                  <td className="py-3 pr-4 text-white text-xs font-medium">{user.name}</td>
                  <td className="py-3 pr-4">
                    <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs px-2 py-0.5 rounded-full capitalize">{user.role}</span>
                  </td>
                  <td className="py-3 pr-4 text-purple-400 text-xs">{new Date(user.joined).toLocaleDateString()}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-purple-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-green-400" style={{ width: `${user.activityScore}%` }} />
                      </div>
                      <span className="text-purple-400 text-xs">{user.activityScore}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-1 rounded-full border ${user.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button onClick={() => toggleUser(user.id)}
                      className={`text-xs px-3 py-1 rounded-lg border transition-all ${user.status === 'active' ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'}`}>
                      {user.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
