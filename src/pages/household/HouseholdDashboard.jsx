import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AnimatedCounter, CircularProgress, CardSkeleton } from '../../components/UI';
import { mockLeaderboard } from '../../data/mockData';

export default function HouseholdDashboard() {
  const { currentUser, bins, scanHistory } = useApp();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const myBin = bins[0];

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  const quickActions = [
    { icon: '📷', label: 'Scan Waste', path: '/household/scan', color: 'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-400' },
    { icon: '🚛', label: 'Request Collection', path: '/household/bin', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-400' },
    { icon: '⭐', label: 'View Rewards', path: '/household/rewards', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-400' },
    { icon: '🚩', label: 'Report Issue', path: '/household/history', color: 'from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-400' },
  ];

  if (loading) return (
    <div className="space-y-4">
      <CardSkeleton />
      <div className="grid grid-cols-2 gap-4"><CardSkeleton /><CardSkeleton /></div>
      <CardSkeleton />
    </div>
  );

  const maxFill = Math.max(myBin.fillLevels.organic, myBin.fillLevels.recyclable, myBin.fillLevels.general);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-[#1a0a2e] to-[#2D0A4E] border border-purple-700 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <p className="text-purple-400 text-sm">Good morning,</p>
            <h1 className="text-white text-2xl font-black mt-1">{currentUser.name} 👋</h1>
            <p className="text-green-400 text-sm mt-1 font-medium">🔥 7-day sorting streak</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { label: 'Items Scanned', value: 47, suffix: '' },
                { label: 'KG Diverted', value: 23, suffix: 'kg' },
                { label: 'CO₂ Saved', value: 18, suffix: 'kg' },
              ].map(s => (
                <div key={s.label} className="bg-purple-900/40 rounded-xl p-3 text-center">
                  <p className="text-white text-xl font-black"><AnimatedCounter target={s.value} suffix={s.suffix} /></p>
                  <p className="text-purple-400 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={currentUser.sustainabilityScore} size={120} stroke={10} color="#22C55E"
              label={`${currentUser.sustainabilityScore}`} sublabel="Score" />
            <p className="text-purple-300 text-xs">Sustainability Score</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bin Status */}
        <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5 cursor-pointer hover:border-purple-600 transition-all"
          onClick={() => navigate('/household/bin')}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">My Bin Status</h2>
            {maxFill >= 80 && <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full border border-amber-500/30 animate-pulse">⚠️ Near Full</span>}
          </div>
          <div className="flex justify-around items-end">
            <BinCompartment label="Recyclable" value={myBin.fillLevels.recyclable} color="#3B82F6" />
            <BinCompartment label="Organic" value={myBin.fillLevels.organic} color="#22C55E" />
            <BinCompartment label="General" value={myBin.fillLevels.general} color="#EF4444" />
          </div>
          <p className="text-purple-500 text-xs text-center mt-3">Tap to manage bin →</p>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
          <h2 className="text-white font-bold mb-3">Recent Activity</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {scanHistory.slice(0, 5).map((item, i) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-purple-900/30 animate-slide-in"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.type}</p>
                  <p className="text-purple-400 text-xs">{new Date(item.date).toLocaleDateString()}</p>
                </div>
                <span className="text-green-400 text-sm font-bold">+{item.points}pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(a => (
            <button key={a.label} onClick={() => navigate(a.path)}
              className={`bg-gradient-to-br ${a.color} border rounded-xl p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95`}>
              <span className="text-3xl">{a.icon}</span>
              <span className="text-white text-xs font-semibold text-center">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Teaser */}
      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-3">🏆 Estate Leaderboard</h2>
        <div className="space-y-2">
          {mockLeaderboard.slice(0, 3).map(entry => (
            <div key={entry.rank} className={`flex items-center gap-3 p-3 rounded-xl ${entry.isUser ? 'bg-green-500/10 border border-green-500/30' : 'bg-purple-900/30'}`}>
              <span className="text-lg font-black text-purple-400 w-6">#{entry.rank}</span>
              <span className="text-xl">{entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}</span>
              <span className="text-white text-sm font-medium flex-1">{entry.name}</span>
              <span className="text-green-400 text-sm font-bold">{entry.score}</span>
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/household/history')} className="w-full mt-3 text-green-400 text-sm font-medium hover:text-green-300 transition-colors">
          View Full Leaderboard →
        </button>
      </div>
    </div>
  );
}

function BinCompartment({ label, value, color }) {
  const barColor = value >= 100 ? '#EF4444' : value >= 80 ? '#F59E0B' : color;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-12 h-28 bg-purple-900/50 rounded-lg overflow-hidden border border-purple-700">
        <div className={`absolute bottom-0 w-full transition-all duration-1000 ${value >= 80 ? 'animate-pulse' : ''}`}
          style={{ height: `${Math.min(value, 100)}%`, backgroundColor: barColor }} />
        {value >= 100 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[8px] text-white font-bold text-center leading-tight px-1">FULL</span>
          </div>
        )}
      </div>
      <span className="text-xs font-bold" style={{ color: barColor }}>{value}%</span>
      <span className="text-purple-400 text-[10px] text-center">{label}</span>
    </div>
  );
}
