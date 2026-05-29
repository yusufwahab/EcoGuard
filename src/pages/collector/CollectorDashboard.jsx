import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AnimatedCounter, CardSkeleton } from '../../components/UI';

const kpis = [
  { label: 'Jobs Today', value: 8, trend: 'up', delta: '+2', icon: '📦', color: 'text-blue-400' },
  { label: 'KG Collected', value: 342, suffix: 'kg', trend: 'up', delta: '+45kg', icon: '⚖️', color: 'text-green-400' },
  { label: 'Route Efficiency', value: 87, suffix: '%', trend: 'up', delta: '+5%', icon: '🗺️', color: 'text-purple-400' },
  { label: 'Earnings This Week', value: 12400, prefix: '₦', trend: 'down', delta: '-₦800', icon: '💰', color: 'text-amber-400' },
];

export default function CollectorDashboard() {
  const { collectionJobs, acceptJob, completeJob } = useApp();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  if (loading) return <div className="space-y-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{kpis.map((_, i) => <CardSkeleton key={i} />)}</div><CardSkeleton /><CardSkeleton /></div>;

  const activeJobs = collectionJobs.filter(j => j.status === 'active');
  const availableJobs = collectionJobs.filter(j => j.status === 'available');

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">📊 Collector Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{k.icon}</span>
              <span className={`text-xs font-bold ${k.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {k.trend === 'up' ? '↑' : '↓'} {k.delta}
              </span>
            </div>
            <p className={`text-2xl font-black ${k.color}`}>
              <AnimatedCounter target={k.value} prefix={k.prefix || ''} suffix={k.suffix || ''} />
            </p>
            <p className="text-purple-400 text-xs mt-1">{k.label}</p>
            <Sparkline trend={k.trend} />
          </div>
        ))}
      </div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div className="bg-[#1a0a2e] border border-green-500/30 rounded-2xl p-5">
          <h2 className="text-white font-bold mb-3">🟢 Active Jobs</h2>
          <div className="space-y-3">
            {activeJobs.map(job => (
              <JobCard key={job.id} job={job} onComplete={() => completeJob(job.id)} isActive />
            ))}
          </div>
        </div>
      )}

      {/* Available Jobs */}
      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold">📋 Available Jobs</h2>
          <button onClick={() => navigate('/collector/map')} className="text-green-400 text-sm hover:text-green-300">View Map →</button>
        </div>
        {availableJobs.length === 0 ? (
          <p className="text-purple-500 text-sm text-center py-8">No available jobs right now 🌿</p>
        ) : (
          <div className="space-y-3">
            {availableJobs.map(job => (
              <JobCard key={job.id} job={job} onAccept={() => acceptJob(job.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job, onAccept, onComplete, isActive }) {
  const urgencyColor = job.urgency === 'Urgent' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
    job.urgency === 'Normal' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
    'bg-blue-500/20 text-blue-400 border-blue-500/30';

  return (
    <div className={`p-4 rounded-xl border transition-all ${isActive ? 'bg-green-500/5 border-green-500/30' : 'bg-purple-900/20 border-purple-800 hover:border-purple-600'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white text-sm font-bold truncate">{job.location}</span>
            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${urgencyColor}`}>{job.urgency}</span>
          </div>
          <p className="text-purple-400 text-xs">{job.distance} away · {job.id}</p>
          <div className="flex gap-2 mt-2">
            {[
              { label: 'R', value: job.fillLevels.recyclable, color: '#3B82F6' },
              { label: 'O', value: job.fillLevels.organic, color: '#22C55E' },
              { label: 'G', value: job.fillLevels.general, color: '#EF4444' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-1">
                <div className="w-12 h-1.5 bg-purple-900 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${f.value}%`, backgroundColor: f.color }} />
                </div>
                <span className="text-purple-500 text-[10px]">{f.value}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-green-400 font-black text-sm">₦{job.earnings.toLocaleString()}</p>
          {isActive ? (
            <button onClick={onComplete} className="mt-2 bg-green-500 hover:bg-green-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">
              Mark Complete ✅
            </button>
          ) : (
            <button onClick={onAccept} className="mt-2 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">
              Accept Job
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Sparkline({ trend }) {
  const points = trend === 'up'
    ? [10, 15, 12, 18, 14, 20, 22]
    : [22, 20, 18, 15, 17, 13, 12];
  const max = Math.max(...points), min = Math.min(...points);
  const pts = points.map((p, i) => `${(i / 6) * 60},${20 - ((p - min) / (max - min)) * 18}`).join(' ');
  return (
    <svg width="60" height="20" className="mt-2 opacity-60">
      <polyline points={pts} fill="none" stroke={trend === 'up' ? '#22C55E' : '#EF4444'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
