import { useState } from 'react';
import { useApp } from '../../context/AppContext';

const timeline = [
  { icon: '✅', label: 'Collection completed', time: '2025-01-10 08:00', type: 'collection' },
  { icon: '📷', label: 'Plastic bottle scanned', time: '2025-01-11 09:15', type: 'scan' },
  { icon: '📷', label: 'Banana peel scanned', time: '2025-01-11 10:30', type: 'scan' },
  { icon: '⚠️', label: 'General waste near full (88%)', time: '2025-01-12 07:00', type: 'alert' },
  { icon: '📷', label: 'Cardboard box scanned', time: '2025-01-12 09:00', type: 'scan' },
];

const tooltips = {
  recyclable: 'Plastics, paper, glass, metals — clean and dry items only.',
  organic: 'Food scraps, vegetable peels, yard waste — no liquids.',
  general: 'Non-recyclable, non-organic waste — last resort.',
};

export default function MyBin() {
  const { bins, setBins, addToast } = useApp();
  const [requested, setRequested] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const bin = bins[0];
  const { organic, recyclable, general } = bin.fillLevels;
  const canRequest = Math.max(organic, recyclable, general) >= 60;

  const handleRequest = () => {
    setBins(b => b.map((bn, i) => i === 0 ? { ...bn, status: 'collection_requested' } : bn));
    setRequested(true);
    addToast('Collection requested! ETA 2 hours 🚛', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-white text-2xl font-black">🗑️ My Bin</h1>

      {/* 3D Bin Visual */}
      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-bold">{bin.location}</h2>
            <p className="text-purple-400 text-xs">Last collected: {new Date(bin.lastCollected).toLocaleDateString()}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            bin.status === 'full' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
            bin.status === 'flagged' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
            'bg-green-500/20 text-green-400 border-green-500/30'
          }`}>{bin.status.toUpperCase()}</span>
        </div>

        {/* Bin illustration */}
        <div className="flex justify-around items-end py-4">
          {[
            { key: 'recyclable', label: 'Recyclable', value: recyclable, color: '#3B82F6', emoji: '♻️' },
            { key: 'organic', label: 'Organic', value: organic, color: '#22C55E', emoji: '🌿' },
            { key: 'general', label: 'General', value: general, color: '#EF4444', emoji: '🗑️' },
          ].map(c => {
            const barColor = c.value >= 100 ? '#EF4444' : c.value >= 80 ? '#F59E0B' : c.color;
            return (
              <div key={c.key} className="flex flex-col items-center gap-2 relative">
                <button onClick={() => setTooltip(tooltip === c.key ? null : c.key)}
                  className="text-purple-400 hover:text-white text-xs">ℹ️</button>
                {tooltip === c.key && (
                  <div className="absolute bottom-full mb-2 w-48 bg-[#2D0A4E] border border-purple-600 rounded-xl p-3 text-xs text-purple-300 z-10 shadow-xl">
                    {tooltips[c.key]}
                  </div>
                )}
                <div className="relative w-16 h-40 bg-purple-900/40 rounded-xl overflow-hidden border-2 border-purple-700"
                  style={{ borderColor: c.value >= 80 ? barColor : undefined }}>
                  <div className={`absolute bottom-0 w-full transition-all duration-1000 ${c.value >= 80 ? 'animate-pulse' : ''}`}
                    style={{ height: `${Math.min(c.value, 100)}%`, backgroundColor: barColor }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl">{c.emoji}</span>
                  </div>
                  {c.value >= 100 && (
                    <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-[9px] font-bold text-center py-0.5">FULL</div>
                  )}
                </div>
                <span className="text-sm font-black" style={{ color: barColor }}>{c.value}%</span>
                <span className="text-purple-400 text-xs">{c.label}</span>
                <span className="text-purple-500 text-[10px]">Updated now</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-4">📅 Bin Timeline</h2>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-purple-800" />
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4 items-start pl-2">
                <div className="relative z-10 w-8 h-8 rounded-full bg-[#2D0A4E] border-2 border-purple-600 flex items-center justify-center text-sm shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-purple-500 text-xs">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Request Collection */}
      <div className={`bg-[#1a0a2e] border-2 rounded-2xl p-5 transition-all duration-500 ${
        canRequest ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.15)] animate-pulse-border' : 'border-purple-800 opacity-60'
      }`}>
        <h2 className="text-white font-bold mb-2">🚛 Request Collection</h2>
        {canRequest ? (
          <>
            <p className="text-green-400 text-sm mb-1">Your bin is ready for collection!</p>
            <p className="text-purple-400 text-xs mb-4">Collector notified — ETA 2 hours</p>
            {requested ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-center">
                <p className="text-green-400 font-bold">✅ Collection Requested!</p>
                <p className="text-purple-400 text-xs mt-1">A collector will arrive within 2 hours</p>
              </div>
            ) : (
              <button onClick={handleRequest}
                className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95">
                Request Now
              </button>
            )}
          </>
        ) : (
          <p className="text-purple-500 text-sm">Fill levels must reach 60% to request collection. Current max: {Math.max(organic, recyclable, general)}%</p>
        )}
      </div>
    </div>
  );
}
