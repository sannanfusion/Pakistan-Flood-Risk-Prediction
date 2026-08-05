import { FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProvinceData } from '@/lib/types';
import { RISK_COLORS } from '@/lib/types';

interface RecentReportsCardProps {
  provinces: ProvinceData[];
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export function RecentReportsCard({ provinces }: RecentReportsCardProps) {
  const navigate = useNavigate();

  const reports = [...provinces]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      title: `${p.name} Flood Risk Report`,
      date: formatDate(p.lastFloodDate),
      size: `${(1.2 + p.historicalFloods * 0.35).toFixed(1)} MB`,
      color: RISK_COLORS[p.riskLevel],
    }));

  return (
    <section className="panel p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[13.5px] font-semibold text-foreground">Recent Flood Reports</h2>
        <button onClick={() => navigate('/reports')} className="text-[11px] font-semibold text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-2">
        {reports.length === 0 && (
          <div className="py-8 text-center text-[12px] text-muted-foreground">No reports available</div>
        )}
        {reports.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40 border border-border hover:border-primary/30 transition-colors"
          >
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${r.color}20`, border: `1px solid ${r.color}45` }}
            >
              <FileText className="w-4 h-4" style={{ color: r.color }} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12.5px] font-semibold text-foreground truncate">{r.title}</span>
              <span className="block text-[11px] text-muted-foreground">{r.date}</span>
            </span>
            <span className="text-[10.5px] font-mono text-muted-foreground shrink-0">{r.size}</span>
            <button
              onClick={() => navigate('/reports')}
              aria-label={`Open ${r.title}`}
              className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
