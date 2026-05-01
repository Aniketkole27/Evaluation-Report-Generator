import type { LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

interface DashboardStatsProps {
  stats: StatItem[];
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((stat) => (
      <div key={stat.label} className="bg-bg-secondary p-6 rounded-2xl border border-border-subtle hover:border-border-strong transition-all group">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
            <stat.icon size={24} />
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
            {stat.change}
          </span>
        </div>
        <h3 className="text-text-secondary text-sm font-medium">{stat.label}</h3>
        <p className="text-3xl font-extrabold text-text-primary mt-1">{stat.value}</p>
      </div>
    ))}
  </div>
);
