import { useApp } from '../../context/AppContext';
import { AnimatedCounter } from '../../components/UI';

export function CollectionJobs() {
  const { collectionJobs, acceptJob, completeJob } = useApp();
  const active = collectionJobs.filter(j => j.status === 'active');
  const available = collectionJobs.filter(j => j.status === 'available');
  const completed = collectionJobs.filter(j => j.status === 'completed');

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">📦 Collection Jobs</h1>
      {active.length > 0 && (
        <Section title="🟢 Active Jobs" color="border-green-500/30">
          {active.map(job => <JobRow key={job.id} job={job} onComplete={() => completeJob(job.id)} isActive />)}
        </Section>
      )}
      <Section title="📋 Available Jobs">
        {available.length === 0 ? <p className="text-purple-500 text-sm py-4 text-center">No available jobs 🌿</p> :
          available.map(job => <JobRow key={job.id} job={job} onAccept={() => acceptJob(job.id)} />)}
      </Section>
      {completed.length > 0 && (
        <Section title="✅ Completed Today">
          {completed.map(job => <JobRow key={job.id} job={job} isDone />)}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children, color = 'border-purple-800' }) {
  return (
    <div className={`bg-[#1a0a2e] border ${color} rounded-2xl p-5`}>
      <h2 className="text-white font-bold mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function JobRow({ job, onAccept, onComplete, isActive, isDone }) {
  const urgencyColor = job.urgency === 'Urgent' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
    job.urgency === 'Normal' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
    'bg-blue-500/20 text-blue-400 border-blue-500/30';
  return (
    <div className={`p-4 rounded-xl border ${isActive ? 'bg-green-500/5 border-green-500/20' : isDone ? 'bg-purple-900/10 border-purple-900 opacity-60' : 'bg-purple-900/20 border-purple-800'}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white text-sm font-bold">{job.location}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${urgencyColor}`}>{job.urgency}</span>
          </div>
          <p className="text-purple-400 text-xs mt-0.5">{job.distance} · {job.id}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-green-400 font-black">₦{job.earnings.toLocaleString()}</p>
          {isActive && <button onClick={onComplete} className="mt-1 bg-green-500 hover:bg-green-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">Complete ✅</button>}
          {!isActive && !isDone && <button onClick={onAccept} className="mt-1 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">Accept</button>}
          {isDone && <span className="text-green-400 text-xs">✅ Done</span>}
        </div>
      </div>
    </div>
  );
}

export function CollectorEarnings() {
  const { collectionJobs } = useApp();
  const completed = collectionJobs.filter(j => j.status === 'completed');
  const total = completed.reduce((s, j) => s + j.earnings, 0) + 12400;
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">💰 Earnings</h1>
      <div className="bg-gradient-to-br from-[#1a0a2e] to-[#2D0A4E] border border-purple-700 rounded-2xl p-6 text-center">
        <p className="text-purple-400 text-sm">Total Earnings This Week</p>
        <p className="text-white text-5xl font-black mt-2">₦<AnimatedCounter target={total} /></p>
        <p className="text-green-400 text-sm mt-2">↑ 12% vs last week</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{ label: 'Jobs Done', value: 8 + completed.length }, { label: 'KG Collected', value: 342 }, { label: 'Avg per Job', value: Math.round(total / (8 + completed.length)) }].map(s => (
          <div key={s.label} className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-4 text-center">
            <p className="text-white text-2xl font-black"><AnimatedCounter target={s.value} /></p>
            <p className="text-purple-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CollectorHistory() {
  const { collectionJobs } = useApp();
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-white text-2xl font-black">📋 Collection History</h1>
      <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5 space-y-2">
        {collectionJobs.map(job => (
          <div key={job.id} className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-xl">
            <span className="text-xl">{job.status === 'completed' ? '✅' : job.status === 'active' ? '🟢' : '📦'}</span>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{job.location}</p>
              <p className="text-purple-500 text-xs">{job.id} · {job.distance}</p>
            </div>
            <span className="text-green-400 font-bold text-sm">₦{job.earnings.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
