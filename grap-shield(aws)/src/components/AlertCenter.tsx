import React, { useState } from 'react';
import { SnsNotification } from '../types';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  Radio,
  ExternalLink,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface AlertCenterProps {
  alerts: SnsNotification[];
  onOpenGrap: () => void;
  onOpenSimulator: () => void;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({
  alerts,
  onOpenGrap,
  onOpenSimulator,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ALL') return true;
    return a.level === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1524] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-red-400">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Emergency Dispatch Feed · Amazon SNS Topic</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            URBAN RISK ALERT CENTER
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Topic ARN: arn:aws:sns:ap-south-1:973045801624:grap-shield-emergency-alerts
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
          {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === lvl
                  ? 'bg-slate-800 text-white font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl} ({lvl === 'ALL' ? alerts.length : alerts.filter(a => a.level === lvl).length})
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0E1524] border border-slate-800 text-slate-500 font-mono text-xs">
            No active alerts matching filter. All monitored corridors operating within baseline parameters.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.level === 'CRITICAL';
            const isWarning = alert.level === 'WARNING';

            const borderClass = isCritical ? 'border-red-500/40 bg-red-950/15' : isWarning ? 'border-amber-500/40 bg-amber-950/15' : 'border-slate-800 bg-slate-900/40';
            const badgeClass = isCritical ? 'bg-red-500/20 text-red-400 border-red-500/40' : isWarning ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
            const IconComp = isCritical ? AlertCircle : isWarning ? AlertTriangle : Info;

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border transition-all ${borderClass}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-lg bg-slate-900 shrink-0 mt-0.5">
                      <IconComp className={`w-5 h-5 ${isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-cyan-400'}`} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badgeClass}`}>
                          {alert.level}
                        </span>
                        <h3 className="text-sm font-bold text-white">
                          {alert.subject}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-300 font-mono leading-relaxed">
                        {alert.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-slate-400 font-mono">
                        <span>Affected Sectors:</span>
                        {alert.affectedSectors.map((sec, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {sec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>

                    {isCritical && (
                      <button
                        onClick={onOpenGrap}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        Enforce GRAP Orders
                      </button>
                    )}
                    {isWarning && (
                      <button
                        onClick={onOpenSimulator}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        Simulate Mitigation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
