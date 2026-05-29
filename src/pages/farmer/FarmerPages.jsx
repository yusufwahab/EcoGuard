import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/UI';

export function FarmerOrders() {
  const { organicListings } = useApp();
  const orders = organicListings.filter(l => l.claimed);
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">📦 My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState icon="📦" title="No orders yet" subtitle="Claim organic batches from the marketplace" />
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="bg-[#1a0a2e] border border-green-900/40 rounded-2xl p-4 flex items-center gap-4">
              <span className="text-3xl">🌿</span>
              <div className="flex-1">
                <p className="text-white font-bold">{o.type} — {o.quantity}kg</p>
                <p className="text-green-700 text-xs">{o.location} · Grade {o.compostGrade}</p>
                <p className="text-green-600 text-xs">≈ ₦{o.fertilizerValue.toLocaleString()} fertiliser value</p>
              </div>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2 py-1 rounded-full">In Transit</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FarmerProfile() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">🌾 Farm Profile</h1>
      <div className="bg-[#1a0a2e] border border-green-900/40 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-4xl">🌾</div>
          <div>
            <h2 className="text-white font-black text-xl">Green Acres Farm</h2>
            <p className="text-green-700 text-sm">Ikorodu, Lagos State</p>
          </div>
        </div>
        {[
          { label: 'Farm Size', value: '5 hectares' },
          { label: 'Primary Crop', value: 'Vegetables & Herbs' },
          { label: 'Composting Capacity', value: '500kg/month' },
          { label: 'Member Since', value: 'October 2024' },
          { label: 'Organic Waste Used', value: '1,240kg total' },
          { label: 'CO₂ Offset', value: '~620kg' },
        ].map(f => (
          <div key={f.label} className="flex justify-between py-2 border-b border-green-900/30">
            <span className="text-green-700 text-sm">{f.label}</span>
            <span className="text-white text-sm font-semibold">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FarmerHistory() {
  const { organicListings } = useApp();
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">📋 History</h1>
      <div className="bg-[#1a0a2e] border border-green-900/40 rounded-2xl p-5 space-y-2">
        {organicListings.map(l => (
          <div key={l.id} className="flex items-center gap-3 p-3 bg-green-900/10 rounded-xl">
            <span className="text-xl">🌿</span>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{l.type} — {l.quantity}kg</p>
              <p className="text-green-700 text-xs">{l.location} · Grade {l.compostGrade}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full border ${l.claimed ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
              {l.claimed ? 'Ordered' : 'Available'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
