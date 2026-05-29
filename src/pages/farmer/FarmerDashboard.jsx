import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AnimatedCounter, CardSkeleton } from '../../components/UI';

export default function FarmerDashboard() {
  const { organicListings } = useApp();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  if (loading) return <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><CardSkeleton /><CardSkeleton /></div><CardSkeleton /></div>;

  const available = organicListings.filter(l => !l.claimed);
  const totalKg = available.reduce((s, l) => s + l.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">🌾 Farmer Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Available Batches', value: available.length, icon: '🌿', color: 'text-green-400' },
          { label: 'Total KG Available', value: totalKg, suffix: 'kg', icon: '⚖️', color: 'text-emerald-400' },
          { label: 'Orders This Month', value: 12, icon: '📦', color: 'text-blue-400' },
          { label: 'Fertiliser Saved', value: 28400, prefix: '₦', icon: '💰', color: 'text-amber-400' },
        ].map(k => (
          <div key={k.label} className="bg-[#1a0a2e] border border-green-900/50 rounded-2xl p-4">
            <span className="text-2xl">{k.icon}</span>
            <p className={`text-2xl font-black mt-2 ${k.color}`}><AnimatedCounter target={k.value} prefix={k.prefix || ''} suffix={k.suffix || ''} /></p>
            <p className="text-green-700 text-xs mt-1">{k.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => navigate('/farmer/marketplace')} className="bg-[#1a0a2e] border border-green-900/50 hover:border-green-500/50 rounded-2xl p-5 text-left transition-all hover:scale-[1.02]">
          <span className="text-3xl">🌿</span>
          <h3 className="text-white font-bold mt-2">Organic Marketplace</h3>
          <p className="text-green-700 text-sm mt-1">{available.length} batches available near you</p>
        </button>
        <button onClick={() => navigate('/farmer/orders')} className="bg-[#1a0a2e] border border-green-900/50 hover:border-green-500/50 rounded-2xl p-5 text-left transition-all hover:scale-[1.02]">
          <span className="text-3xl">📦</span>
          <h3 className="text-white font-bold mt-2">My Orders</h3>
          <p className="text-green-700 text-sm mt-1">Track your organic waste orders</p>
        </button>
      </div>
    </div>
  );
}
