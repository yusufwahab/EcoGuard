import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnimatedCounter, Confetti } from '../../components/UI';
import { mockRewards, mockBadges } from '../../data/mockData';

const tiers = [
  { name: 'Bronze', min: 0, max: 300, color: '#CD7F32' },
  { name: 'Silver', min: 300, max: 600, color: '#C0C0C0' },
  { name: 'Gold', min: 600, max: 1000, color: '#FFD700' },
  { name: 'Platinum', min: 1000, max: 2000, color: '#E5E4E2' },
];

export default function Rewards() {
  const { currentUser, addPoints, addToast } = useApp();
  const [confetti, setConfetti] = useState(false);
  const [confirmReward, setConfirmReward] = useState(null);
  const [redeemed, setRedeemed] = useState([]);

  const pts = currentUser.points;
  const currentTier = tiers.findLast(t => pts >= t.min) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const progress = nextTier ? ((pts - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  const handleRedeem = (reward) => {
    if (pts < reward.cost || redeemed.includes(reward.id)) return;
    setConfirmReward(reward);
  };

  const confirmRedeem = () => {
    if (!confirmReward) return;
    addPoints(-confirmReward.cost);
    setRedeemed(r => [...r, confirmReward.id]);
    setConfirmReward(null);
    setConfetti(true);
    addToast(`🎉 ${confirmReward.name} redeemed!`, 'success');
    setTimeout(() => setConfetti(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Confetti active={confetti} />
      <h1 className="text-white text-2xl font-black">⭐ Rewards</h1>

      {/* Points & Tier */}
      <div className="bg-gradient-to-br from-[#1a0a2e] to-[#2D0A4E] border border-purple-700 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">🏆</span>
          <div>
            <p className="text-purple-400 text-sm">Total Points</p>
            <p className="text-white text-4xl font-black"><AnimatedCounter target={pts} /></p>
          </div>
          <div className="ml-auto text-right">
            <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${currentTier.color}20`, color: currentTier.color, border: `1px solid ${currentTier.color}40` }}>
              {currentTier.name}
            </span>
          </div>
        </div>
        {nextTier && (
          <div>
            <div className="flex justify-between text-xs text-purple-400 mb-1">
              <span>{currentTier.name}</span>
              <span>{nextTier.name} — {nextTier.min - pts} pts away</span>
            </div>
            <div className="h-3 bg-purple-900 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1500" style={{ width: `${progress}%`, backgroundColor: nextTier.color }} />
            </div>
          </div>
        )}
      </div>

      {/* Rewards Catalogue */}
      <div>
        <h2 className="text-white font-bold mb-3">🎁 Rewards Catalogue</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {mockRewards.map(reward => {
            const canAfford = pts >= reward.cost;
            const done = redeemed.includes(reward.id);
            return (
              <div key={reward.id} className={`bg-[#1a0a2e] border rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${canAfford && !done ? 'border-purple-700 hover:border-green-500/50' : 'border-purple-900 opacity-60'}`}>
                <span className="text-4xl">{reward.image}</span>
                <p className="text-white text-sm font-bold text-center">{reward.name}</p>
                <p className="text-purple-400 text-xs">{reward.cost} pts</p>
                {done ? (
                  <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-3 py-1 rounded-full">✅ Redeemed</span>
                ) : canAfford ? (
                  <button onClick={() => handleRedeem(reward)}
                    className="w-full bg-green-500 hover:bg-green-400 text-white text-xs font-bold py-2 rounded-xl transition-all hover:scale-105">
                    Redeem
                  </button>
                ) : (
                  <span className="text-purple-500 text-xs text-center">Need {reward.cost - pts} more pts</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-white font-bold mb-3">🏅 Sustainability Badges</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {mockBadges.map(badge => (
            <div key={badge.id} className="shrink-0 flex flex-col items-center gap-2 group relative">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 transition-all ${badge.earned ? 'border-green-500 bg-green-500/10' : 'border-purple-800 bg-purple-900/30 grayscale opacity-50'}`}>
                {badge.earned ? badge.icon : '🔒'}
              </div>
              <p className="text-xs text-center text-purple-400 w-16 leading-tight">{badge.name}</p>
              {badge.earned && <span className="absolute -top-1 -right-1 text-sm">✅</span>}
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#2D0A4E] border border-purple-600 rounded-xl p-2 text-xs text-purple-300 w-36 text-center z-10 shadow-xl">
                {badge.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#1a0a2e] border border-purple-700 rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <span className="text-5xl">{confirmReward.image}</span>
            <h3 className="text-white font-black text-xl">{confirmReward.name}</h3>
            <p className="text-purple-400 text-sm">This will cost <span className="text-white font-bold">{confirmReward.cost} points</span>. You'll have <span className="text-green-400 font-bold">{pts - confirmReward.cost} pts</span> remaining.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmReward(null)} className="flex-1 border border-purple-700 text-purple-300 py-3 rounded-xl hover:border-purple-500 transition-all">Cancel</button>
              <button onClick={confirmRedeem} className="flex-1 bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl transition-all">Confirm 🎉</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
