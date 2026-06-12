import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, KPICard, Card, CardHeader, Badge, Btn, Modal } from '../../components/UI';
import { mockRewards, mockBadges, mockLeaderboard } from '../../data/mockData';
import { Star, Trophy, CheckCircle } from 'lucide-react';

export default function Rewards() {
  const { currentUser, addPoints, addToast } = useApp();
  const [selected, setSelected] = useState(null);
  const [redeemed, setRedeemed] = useState(new Set());

  const handleRedeem = () => {
    if (!selected || redeemed.has(selected.id)) return;
    if (currentUser.points < selected.cost) {
      addToast('Insufficient points for this reward.', 'error');
      setSelected(null);
      return;
    }
    addPoints(-selected.cost);
    setRedeemed(s => new Set([...s, selected.id]));
    addToast(`Reward redeemed: ${selected.name}`, 'success');
    setSelected(null);
  };

  return (
    <div className="space-y-5 anim-fade-up">
      <PageHeader title="Rewards" subtitle="Redeem points for vouchers, products, and impact credits" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Your Points"   value={currentUser.points} delta="Available to spend" deltaType="neutral" />
        <KPICard label="Badges Earned" value={mockBadges.filter(b => b.earned).length} suffix={`/${mockBadges.length}`} />
        <KPICard label="Leaderboard"   value="#4" delta="Top 25% this month" deltaType="up" />
        <KPICard label="Total Redeemed" value={redeemed.size} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Rewards grid */}
        <div className="lg:col-span-2">
          <Card pad={false}>
            <div className="p-5 pb-3">
              <CardHeader title="Available Rewards" subtitle={`${currentUser.points} pts to spend`} />
            </div>
            <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockRewards.map(r => {
                const done     = redeemed.has(r.id);
                const canAfford = currentUser.points >= r.cost;
                return (
                  <div key={r.id}
                    className="p-4 rounded-md border transition-all"
                    style={{ background: 'var(--active)', borderColor: done ? 'var(--brand)' : 'var(--wire)' }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>{r.name}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--sub)' }}>{r.category}</p>
                      </div>
                      {done && <CheckCircle size={16} style={{ color: '#4ADE80' }} />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium" style={{ color: '#D4A017' }}>
                        <Star size={11} className="inline mr-1" />{r.cost.toLocaleString()} pts
                      </span>
                      {done ? (
                        <Badge variant="success">Redeemed</Badge>
                      ) : (
                        <Btn size="sm" variant={canAfford ? 'primary' : 'outline'} onClick={() => canAfford && setSelected(r)} disabled={!canAfford}>
                          Redeem
                        </Btn>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Badges */}
          <Card pad={false}>
            <div className="p-4 pb-3">
              <CardHeader title="Badges" />
            </div>
            <div className="px-4 pb-4 grid grid-cols-3 gap-3">
              {mockBadges.map(b => (
                <div key={b.id} className="flex flex-col items-center gap-1.5 p-2 rounded-md text-center" title={b.description}
                  style={{ background: 'var(--active)', opacity: b.earned ? 1 : 0.4 }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: b.earned ? 'rgba(26,127,78,0.15)' : 'var(--card)' }}>
                    <Trophy size={14} style={{ color: b.earned ? '#4ADE80' : 'var(--dim)' }} />
                  </div>
                  <span className="text-[10px] leading-tight" style={{ color: b.earned ? 'var(--ink)' : 'var(--dim)' }}>{b.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Leaderboard */}
          <Card pad={false}>
            <div className="p-4 pb-3">
              <CardHeader title="Leaderboard" subtitle="Zone ranking" />
            </div>
            <div className="px-4 pb-4 space-y-1">
              {mockLeaderboard.map(e => (
                <div key={e.rank}
                  className="flex items-center gap-3 py-2.5 rounded-md px-2 transition-colors"
                  style={{ background: e.isUser ? 'rgba(26,127,78,0.1)' : 'transparent', borderLeft: e.isUser ? '2px solid var(--brand)' : 'none' }}
                >
                  <span className="w-5 text-[12px] font-medium text-center shrink-0"
                    style={{ color: e.rank <= 3 ? '#D4A017' : 'var(--dim)' }}>
                    {e.rank}
                  </span>
                  <span className="flex-1 text-[13px] font-medium" style={{ color: e.isUser ? 'var(--brand)' : 'var(--ink)' }}>
                    {e.name}
                  </span>
                  <span className="text-[12px] font-mono" style={{ color: 'var(--sub)' }}>{e.points.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Confirm Redemption"
        footer={
          <>
            <Btn variant="outline" onClick={() => setSelected(null)}>Cancel</Btn>
            <Btn onClick={handleRedeem}>Confirm Redemption</Btn>
          </>
        }
      >
        {selected && (
          <div className="space-y-3">
            <p className="text-[13px]" style={{ color: 'var(--sub)' }}>You are about to redeem:</p>
            <div className="p-3 rounded-md border" style={{ background: 'var(--active)', borderColor: 'var(--wire)' }}>
              <p className="text-[15px] font-semibold mb-1" style={{ color: 'var(--ink)' }}>{selected.name}</p>
              <p className="text-[13px]" style={{ color: '#D4A017' }}>{selected.cost.toLocaleString()} points</p>
            </div>
            <p className="text-[12px]" style={{ color: 'var(--sub)' }}>
              After redemption you will have <strong style={{ color: 'var(--ink)' }}>{(currentUser.points - selected.cost).toLocaleString()} pts</strong> remaining.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
