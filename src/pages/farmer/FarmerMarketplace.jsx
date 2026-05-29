import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/UI';

const gradeColors = { A: 'bg-green-500/20 text-green-400 border-green-500/30', B: 'bg-amber-500/20 text-amber-400 border-amber-500/30', C: 'bg-red-500/20 text-red-400 border-red-500/30' };
const typeIcons = { 'Food Scraps': '🍱', 'Yard Waste': '🌿', 'Mixed Organic': '♻️' };

export default function FarmerMarketplace() {
  const { organicListings, setOrganicListings, addToast } = useApp();
  const [matchOpen, setMatchOpen] = useState(false);
  const [matching, setMatching] = useState(false);
  const [matched, setMatched] = useState([]);
  const [prefs, setPrefs] = useState({ radius: 10, type: 'Any', minQty: 50 });
  const [filter, setFilter] = useState('All');

  const available = organicListings.filter(l => !l.claimed);
  const filtered = filter === 'All' ? available : available.filter(l => l.type === filter);

  const handleMatch = () => {
    setMatching(true);
    setTimeout(() => {
      setMatching(false);
      const best = available.filter(l => l.compostGrade === 'A').slice(0, 2).map(l => l.id);
      setMatched(best);
      addToast('2 best matches found! 🌿', 'success');
      setMatchOpen(false);
    }, 1500);
  };

  const handleClaim = (id) => {
    setOrganicListings(l => l.map(x => x.id === id ? { ...x, claimed: true } : x));
    addToast('Organic batch claimed! 🌾', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      <h1 className="text-white text-2xl font-black">🌿 Organic Marketplace</h1>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['All', 'Food Scraps', 'Yard Waste', 'Mixed Organic'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filter === f ? 'bg-green-500 border-green-500 text-white' : 'border-green-900/50 text-green-700 hover:border-green-600'}`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🌿" title="No listings near you yet" subtitle="Adjust your filters or check back soon" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(listing => (
            <div key={listing.id}
              className={`bg-[#1a0a2e] border rounded-2xl p-4 transition-all ${matched.includes(listing.id) ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'border-green-900/40 hover:border-green-700/50'}`}>
              {matched.includes(listing.id) && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-2 py-0.5 rounded-full font-bold">⭐ Best Match</span>
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{typeIcons[listing.type] || '🌿'}</span>
                  <div>
                    <p className="text-white font-bold">{listing.type}</p>
                    <p className="text-green-700 text-xs">{listing.location}</p>
                  </div>
                </div>
                <span className={`border text-xs font-black px-2 py-1 rounded-lg ${gradeColors[listing.compostGrade]}`}>
                  Grade {listing.compostGrade}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="bg-green-900/20 rounded-lg p-2">
                  <p className="text-green-700">Quantity</p>
                  <p className="text-white font-bold">{listing.quantity}kg</p>
                </div>
                <div className="bg-green-900/20 rounded-lg p-2">
                  <p className="text-green-700">Available From</p>
                  <p className="text-white font-bold">{new Date(listing.availableFrom).toLocaleDateString()}</p>
                </div>
                <div className="bg-green-900/20 rounded-lg p-2 col-span-2">
                  <p className="text-green-700">Fertiliser Value</p>
                  <p className="text-green-400 font-bold">≈ ₦{listing.fertilizerValue.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => handleClaim(listing.id)}
                className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-2.5 rounded-xl transition-all hover:scale-[1.02]">
                Claim Batch 🌾
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Match Me FAB */}
      <button onClick={() => setMatchOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-4 bg-green-500 hover:bg-green-400 text-white font-bold px-5 py-3 rounded-2xl shadow-2xl transition-all hover:scale-105 flex items-center gap-2 z-30">
        <span>🎯</span> Match Me
      </button>

      {/* Match Me Panel */}
      {matchOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMatchOpen(false)} />
          <div className={`fixed top-0 right-0 h-full w-80 bg-[#1a0a2e] border-l border-green-900/50 z-50 flex flex-col transition-transform duration-300 ${matchOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b border-green-900/50">
              <h2 className="text-white font-bold">🎯 Match Preferences</h2>
              <button onClick={() => setMatchOpen(false)} className="text-green-700 hover:text-white text-2xl">×</button>
            </div>
            <div className="flex-1 p-4 space-y-4">
              <div>
                <label className="text-green-700 text-xs font-semibold block mb-1">Location Radius: {prefs.radius}km</label>
                <input type="range" min="1" max="50" value={prefs.radius} onChange={e => setPrefs(p => ({ ...p, radius: +e.target.value }))}
                  className="w-full accent-green-500" />
              </div>
              <div>
                <label className="text-green-700 text-xs font-semibold block mb-1">Preferred Waste Type</label>
                <select value={prefs.type} onChange={e => setPrefs(p => ({ ...p, type: e.target.value }))}
                  className="w-full bg-green-900/20 border border-green-900/50 text-white text-sm rounded-xl px-3 py-2 outline-none">
                  {['Any', 'Food Scraps', 'Yard Waste', 'Mixed Organic'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-green-700 text-xs font-semibold block mb-1">Minimum Quantity: {prefs.minQty}kg</label>
                <input type="range" min="10" max="200" value={prefs.minQty} onChange={e => setPrefs(p => ({ ...p, minQty: +e.target.value }))}
                  className="w-full accent-green-500" />
              </div>
            </div>
            <div className="p-4 border-t border-green-900/50">
              <button onClick={handleMatch} disabled={matching}
                className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                {matching ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Matching...</> : '🎯 Find Matches'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
