import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AnimatedCounter, CardSkeleton } from '../../components/UI';

export default function RecyclerDashboard() {
  const { marketplaceListings } = useApp();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  const available = marketplaceListings.filter(l => !l.claimed).length;
  const claimed = marketplaceListings.filter(l => l.claimed).length;

  if (loading) return <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><CardSkeleton /><CardSkeleton /></div><CardSkeleton /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">♻️ Recycler Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Available Listings', value: available, icon: '📋', color: 'text-blue-400' },
          { label: 'My Claims', value: claimed, icon: '📌', color: 'text-green-400' },
          { label: 'KG Processed', value: 1240, suffix: 'kg', icon: '⚖️', color: 'text-purple-400' },
          { label: 'Revenue This Month', value: 84000, prefix: '₦', icon: '💰', color: 'text-amber-400' },
        ].map(k => (
          <div key={k.label} className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-4">
            <span className="text-2xl">{k.icon}</span>
            <p className={`text-2xl font-black mt-2 ${k.color}`}><AnimatedCounter target={k.value} prefix={k.prefix || ''} suffix={k.suffix || ''} /></p>
            <p className="text-purple-400 text-xs mt-1">{k.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => navigate('/recycler/marketplace')} className="bg-[#1a0a2e] border border-purple-800 hover:border-green-500/50 rounded-2xl p-5 text-left transition-all hover:scale-[1.02]">
          <span className="text-3xl">♻️</span>
          <h3 className="text-white font-bold mt-2">Browse Marketplace</h3>
          <p className="text-purple-400 text-sm mt-1">{available} listings available near you</p>
        </button>
        <button onClick={() => navigate('/recycler/claims')} className="bg-[#1a0a2e] border border-purple-800 hover:border-green-500/50 rounded-2xl p-5 text-left transition-all hover:scale-[1.02]">
          <span className="text-3xl">📌</span>
          <h3 className="text-white font-bold mt-2">My Claims</h3>
          <p className="text-purple-400 text-sm mt-1">{claimed} active claims to manage</p>
        </button>
      </div>
    </div>
  );
}
