import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet, EmptyState } from '../../components/UI';

const typeColors = {
  Plastics: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: '🧴' },
  Paper: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', icon: '📄' },
  Metals: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', icon: '🔩' },
  Glass: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30', icon: '🫙' },
};

const timeSlots = ['Today 10:00–12:00', 'Today 14:00–16:00', 'Tomorrow 09:00–11:00'];

export default function RecyclerMarketplace() {
  const { marketplaceListings, claimListing, addToast } = useApp();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Nearest');
  const [claimItem, setClaimItem] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [tab, setTab] = useState('available');

  const available = marketplaceListings.filter(l => !l.claimed);
  const claimed = marketplaceListings.filter(l => l.claimed);

  const filtered = available
    .filter(l => filter === 'All' || l.type === filter)
    .filter(l => l.type.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase()));

  const handleClaim = () => {
    if (!confirmed) { addToast('Please confirm the checkbox', 'warning'); return; }
    claimListing(claimItem.id);
    addToast(`Claimed ${claimItem.quantity}kg of ${claimItem.type} ♻️`, 'success');
    setClaimItem(null);
    setConfirmed(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-white text-2xl font-black">♻️ Marketplace</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {['available', 'claims'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-green-500 text-white' : 'bg-purple-900/40 text-purple-400 hover:text-white'}`}>
            {t === 'available' ? `Available (${available.length})` : `My Claims (${claimed.length})`}
          </button>
        ))}
      </div>

      {tab === 'available' ? (
        <>
          {/* Filters */}
          <div className="flex gap-2 flex-wrap items-center">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="bg-[#1a0a2e] border border-purple-700 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-green-500 w-40" />
            <div className="flex gap-2 overflow-x-auto">
              {['All', 'Plastics', 'Paper', 'Metals', 'Glass'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filter === f ? 'bg-green-500 border-green-500 text-white' : 'border-purple-700 text-purple-400 hover:border-purple-500'}`}>
                  {f}
                </button>
              ))}
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="ml-auto bg-[#1a0a2e] border border-purple-700 text-purple-300 text-xs rounded-xl px-2 py-2 outline-none">
              {['Nearest', 'Most Available', 'Newest'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon="🌿" title="No listings near you yet" subtitle="Check back soon or adjust your filters" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map(listing => {
                const c = typeColors[listing.type] || typeColors.Plastics;
                return (
                  <div key={listing.id} className="bg-[#1a0a2e] border border-purple-800 hover:border-purple-600 rounded-2xl p-4 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`${c.bg} ${c.border} border p-2 rounded-xl text-xl`}>{c.icon}</span>
                        <div>
                          <p className="text-white font-bold">{listing.type}</p>
                          <p className="text-purple-400 text-xs">{listing.location} · {listing.distance}</p>
                        </div>
                      </div>
                      <span className="text-white font-black text-lg">~{listing.quantity}kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`text-sm ${i < listing.quality ? 'text-amber-400' : 'text-purple-800'}`}>★</span>
                        ))}
                      </div>
                      <span className="text-purple-500 text-xs">{new Date(listing.posted).toLocaleDateString()}</span>
                    </div>
                    <button onClick={() => setClaimItem(listing)}
                      className="w-full mt-3 bg-green-500 hover:bg-green-400 text-white font-bold py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95">
                      Claim Pickup
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3">
          {claimed.length === 0 ? (
            <EmptyState icon="📌" title="No claims yet" subtitle="Claim listings from the marketplace" action="Browse Listings" onAction={() => setTab('available')} />
          ) : claimed.map(listing => {
            const c = typeColors[listing.type] || typeColors.Plastics;
            return (
              <div key={listing.id} className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-4 flex items-center gap-4">
                <span className="text-3xl">{c.icon}</span>
                <div className="flex-1">
                  <p className="text-white font-bold">{listing.type} — {listing.quantity}kg</p>
                  <p className="text-purple-400 text-xs">{listing.location}</p>
                </div>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2 py-1 rounded-full">Pending</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Claim Modal */}
      <BottomSheet open={!!claimItem} onClose={() => { setClaimItem(null); setConfirmed(false); }} title="Claim Pickup">
        {claimItem && (
          <div className="space-y-4">
            <div className="bg-purple-900/30 rounded-xl p-3">
              <p className="text-white font-bold">{claimItem.type} — ~{claimItem.quantity}kg</p>
              <p className="text-purple-400 text-sm">{claimItem.location} · {claimItem.distance}</p>
            </div>
            <div>
              <p className="text-purple-300 text-sm font-semibold mb-2">Select Pickup Time</p>
              <div className="space-y-2">
                {timeSlots.map((slot, i) => (
                  <button key={i} onClick={() => setSelectedSlot(i)}
                    className={`w-full p-3 rounded-xl border text-sm font-medium transition-all ${selectedSlot === i ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-purple-700 text-purple-300 hover:border-purple-500'}`}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-0.5 accent-green-500" />
              <span className="text-purple-300 text-sm">I confirm I will collect within the selected window</span>
            </label>
            <button onClick={handleClaim} className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl transition-all">
              Confirm Claim ✅
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
