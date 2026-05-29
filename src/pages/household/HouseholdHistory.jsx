import { useApp } from '../../context/AppContext';
import { mockLeaderboard } from '../../data/mockData';

export default function HouseholdHistory() {
  const { scanHistory } = useApp();
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-white text-2xl font-black">📋 History & Leaderboard</h1>

      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-4">🏆 Full Leaderboard</h2>
        <div className="space-y-2">
          {mockLeaderboard.map(entry => (
            <div key={entry.rank} className={`flex items-center gap-3 p-3 rounded-xl ${entry.isUser ? 'bg-green-500/10 border border-green-500/30' : 'bg-purple-900/30'}`}>
              <span className="text-lg font-black text-purple-400 w-6">#{entry.rank}</span>
              <span className="text-xl">{entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : '👤'}</span>
              <span className="text-white text-sm font-medium flex-1">{entry.name}{entry.isUser ? ' (You)' : ''}</span>
              <span className="text-purple-400 text-xs">{entry.points} pts</span>
              <span className="text-green-400 text-sm font-bold">{entry.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-4">📷 All Scans</h2>
        <div className="space-y-2">
          {scanHistory.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-purple-900/30 rounded-xl">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{item.type}</p>
                <p className="text-purple-500 text-xs">{new Date(item.date).toLocaleString()}</p>
              </div>
              <span className="text-purple-400 text-xs">{item.confidence}%</span>
              <span className="text-green-400 text-sm font-bold">+{item.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
