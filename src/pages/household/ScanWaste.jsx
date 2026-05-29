import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../../components/UI';
import { mockWasteClassifications } from '../../data/mockData';

const categoryConfig = {
  recyclable: { label: 'Recyclable', color: '#3B82F6', bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
  organic: { label: 'Organic', color: '#22C55E', bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' },
  general: { label: 'General Waste', color: '#EF4444', bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' },
};

const filters = ['All', 'Organic', 'Recyclable', 'General'];

export default function ScanWaste() {
  const { addPoints, addScan, addToast, scanHistory } = useApp();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [pointsBounce, setPointsBounce] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setResult(null);
    setConfirmed(false);
    setTimeout(() => {
      const r = mockWasteClassifications[Math.floor(Math.random() * mockWasteClassifications.length)];
      setResult(r);
      setScanning(false);
    }, 2000);
  };

  const handleConfirm = () => {
    if (!result) return;
    addPoints(result.points);
    addScan({ id: Date.now(), type: result.type, category: result.category, date: new Date().toISOString(), confidence: result.confidence, points: result.points, icon: result.icon });
    setConfirmed(true);
    setPointsBounce(true);
    addToast(`+${result.points} points earned! ${result.icon}`, 'success');
    setTimeout(() => { setResult(null); setConfirmed(false); setPointsBounce(false); }, 1500);
  };

  const handleOverride = (item) => {
    setResult(item);
    setOverrideOpen(false);
  };

  const filtered = filter === 'All' ? scanHistory : scanHistory.filter(s => s.category === filter.toLowerCase());
  const cat = result ? categoryConfig[result.category] : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-white text-2xl font-black">📷 Scan Waste</h1>

      {/* Viewfinder */}
      <div className="relative bg-black border-2 border-dashed border-purple-600 rounded-3xl overflow-hidden" style={{ height: 300 }}>
        {/* Waste image — looks like a live camera feed */}
        <img
          src="/Sorted_Waste.png"
          alt="Sorted waste being scanned"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${scanning ? 'brightness-75 scale-105' : 'brightness-90'}`}
        />
        {/* Dark overlay to give it a camera-feed feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        {/* Scanning pulse overlay */}
        {scanning && <div className="absolute inset-0 bg-green-500/10 animate-pulse" />}
        {/* Scan line */}
        <div className="absolute left-0 right-0 h-0.5 bg-green-400 opacity-90 animate-scan-line" style={{ boxShadow: '0 0 16px #22C55E, 0 0 4px #22C55E' }} />
        {/* Corner brackets */}
        {[['top-3 left-3', 'border-t-2 border-l-2'], ['top-3 right-3', 'border-t-2 border-r-2'], ['bottom-3 left-3', 'border-b-2 border-l-2'], ['bottom-3 right-3', 'border-b-2 border-r-2']].map(([pos, border], i) => (
          <div key={i} className={`absolute ${pos} w-8 h-8 border-green-400 ${border}`} />
        ))}
        {/* Bottom label */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
          <span className="bg-black/60 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/30 backdrop-blur-sm">
            {scanning ? '🔍 Analysing waste...' : '🎯 Waste item detected — tap Scan'}
          </span>
        </div>
      </div>

      {/* Scan Button */}
      <button onClick={handleScan} disabled={scanning}
        className="w-full bg-[#2D0A4E] hover:bg-purple-800 disabled:opacity-70 border-2 border-purple-600 hover:border-green-400 text-white font-bold text-lg py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3">
        {scanning ? (
          <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Analysing...</span></>
        ) : (
          <><span className="text-2xl">🔍</span><span>Scan Item</span></>
        )}
      </button>

      {/* Result Card */}
      {result && !confirmed && (
        <div className="bg-[#1a0a2e] border border-purple-700 rounded-2xl p-5 animate-slide-up space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{result.icon}</span>
            <div>
              <p className="text-purple-400 text-xs">Azure AI Detection</p>
              <h2 className="text-white text-xl font-black">{result.type}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-purple-900 rounded-full h-2 w-32">
                  <div className="h-2 rounded-full bg-green-400 transition-all duration-1000" style={{ width: `${result.confidence}%` }} />
                </div>
                <span className="text-green-400 text-xs font-bold">{result.confidence}% confidence</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`${cat.bg} ${cat.border} ${cat.text} border text-sm font-bold px-3 py-1.5 rounded-xl`}>
              → {cat.label}
            </span>
            <Minibin active={result.category} />
          </div>

          <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl p-3">
            <span className="text-white font-medium">Points Earned</span>
            <span className={`text-green-400 text-2xl font-black ${pointsBounce ? 'animate-bounce' : ''}`}>+{result.points}</span>
          </div>

          <div className="flex gap-3">
            <button onClick={handleConfirm} className="flex-1 bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl transition-all">
              ✅ Confirm & Log
            </button>
            <button onClick={() => setOverrideOpen(true)} className="flex-1 border border-purple-600 hover:border-purple-400 text-purple-300 hover:text-white font-bold py-3 rounded-xl transition-all">
              Override
            </button>
          </div>
        </div>
      )}

      {confirmed && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 text-center animate-slide-up">
          <span className="text-5xl">✅</span>
          <p className="text-green-400 font-bold text-lg mt-2">Logged Successfully!</p>
        </div>
      )}

      {/* Scan History */}
      <div>
        <h2 className="text-white font-bold mb-3">Scan History</h2>
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                ${filter === f ? 'bg-green-500 border-green-500 text-white' : 'border-purple-700 text-purple-400 hover:border-purple-500'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <p className="text-purple-500 text-sm text-center py-8">No scans yet 🌿</p>
          ) : filtered.map(item => {
            const c = categoryConfig[item.category];
            const isWillerbin = item.id === 0;
            return (
              <div key={item.id} className={`flex items-center gap-3 bg-[#1a0a2e] border rounded-xl p-3 ${isWillerbin ? 'border-green-500/40 bg-green-500/5' : 'border-purple-800'}`}>
                {isWillerbin ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-green-500/30">
                    <img src="/Sorted_Waste.png" alt="Sorted waste" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <span className="text-2xl">{item.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium">{item.type}</p>
                    {isWillerbin && <span className="text-green-400 text-[10px] font-bold bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full">Latest</span>}
                  </div>
                  <p className="text-purple-500 text-xs">{new Date(item.date).toLocaleString()}</p>
                </div>
                <span className={`${c.bg} ${c.text} ${c.border} border text-xs px-2 py-0.5 rounded-full`}>{c.label}</span>
                <span className="text-green-400 text-sm font-bold">+{item.points}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Override Sheet */}
      <BottomSheet open={overrideOpen} onClose={() => setOverrideOpen(false)} title="Override Classification">
        <div className="space-y-3">
          {mockWasteClassifications.slice(0, 3).map(item => (
            <button key={item.type} onClick={() => handleOverride(item)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all
                ${result?.type === item.type ? 'border-green-500 bg-green-500/10' : 'border-purple-700 bg-purple-900/30 hover:border-purple-500'}`}>
              <span className="text-3xl">{item.icon}</span>
              <div className="text-left">
                <p className="text-white font-semibold">{item.type}</p>
                <p className={`text-xs ${categoryConfig[item.category].text}`}>{categoryConfig[item.category].label}</p>
              </div>
              {result?.type === item.type && <span className="ml-auto text-green-400">✓</span>}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}

function Minibin({ active }) {
  return (
    <div className="flex gap-1 items-end">
      {[
        { key: 'recyclable', color: '#3B82F6', h: 20 },
        { key: 'organic', color: '#22C55E', h: 24 },
        { key: 'general', color: '#EF4444', h: 20 },
      ].map(c => (
        <div key={c.key} className="relative w-5 rounded-sm border border-purple-700 overflow-hidden" style={{ height: c.h }}>
          <div className="absolute bottom-0 w-full transition-all duration-500"
            style={{ height: active === c.key ? '100%' : '30%', backgroundColor: c.color, opacity: active === c.key ? 1 : 0.3 }} />
          {active === c.key && <div className="absolute inset-0 flex items-center justify-center"><span className="text-[8px]">↓</span></div>}
        </div>
      ))}
    </div>
  );
}
