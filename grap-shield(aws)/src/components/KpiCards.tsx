import React from 'react';
import { VerifiedAirData, ReceptorExposure, SnsNotification } from '../types';
import {
  Wind,
  Flame,
  ShieldAlert,
  MapPin,
  Building2,
  Bell,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface KpiCardsProps {
  airData: VerifiedAirData | null;
  exposures: ReceptorExposure[];
  alerts: SnsNotification[];
  onSelectTab: (tab: any) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  airData,
  exposures,
  alerts,
  onSelectTab,
}) => {
  if (!airData || !airData.isAvailable) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {['PM2.5', 'PM10', 'AQI', 'GRAP', 'High-Risk', 'Vulnerable', 'Alerts'].map(title => (
          <div key={title} className="p-4 rounded-xl bg-[#0E1524] border border-slate-800 text-slate-500 text-xs">
            <div className="font-mono text-slate-400">{title}</div>
            <div className="mt-2 text-slate-400 text-sm">Source unavailable</div>
          </div>
        ))}
      </div>
    );
  }

  const highRiskCount = exposures.filter(e => e.riskLevel === 'HIGH' || e.riskLevel === 'CRITICAL').length;
  const criticalCount = exposures.filter(e => e.riskLevel === 'CRITICAL').length;

  const peakStation = airData.stations?.reduce((prev, curr) => (curr.pm2_5 > prev.pm2_5 ? curr : prev), airData.stations[0]);

  const cards = [
    {
      id: 'pm25',
      title: 'PM2.5 (Fine)',
      value: `${airData.urbanAvgPm25}`,
      unit: 'μg/m³',
      status: airData.urbanAvgPm25 > 120 ? 'CRITICAL' : airData.urbanAvgPm25 > 60 ? 'HIGH' : 'SAFE',
      statusColor: airData.urbanAvgPm25 > 120 ? 'text-red-400' : airData.urbanAvgPm25 > 60 ? 'text-amber-400' : 'text-emerald-400',
      source: 'Open-Meteo (CAMS)',
      icon: Wind,
      subtext: `Max: ${airData.urbanMaxPm25} μg/m³ (${peakStation?.stationName || 'Peak Station'})`,
      onClick: () => onSelectTab('map'),
    },
    {
      id: 'pm10',
      title: 'PM10 (Coarse)',
      value: `${airData.urbanAvgPm10}`,
      unit: 'μg/m³',
      status: airData.urbanAvgPm10 > 250 ? 'CRITICAL' : airData.urbanAvgPm10 > 100 ? 'HIGH' : 'SAFE',
      statusColor: airData.urbanAvgPm10 > 250 ? 'text-red-400' : airData.urbanAvgPm10 > 100 ? 'text-amber-400' : 'text-emerald-400',
      source: 'Open-Meteo (CAMS)',
      icon: Flame,
      subtext: `NAAQS Std: 100 μg/m³`,
      onClick: () => onSelectTab('map'),
    },
    {
      id: 'aqi',
      title: 'CPCB NAQI',
      value: `${airData.urbanAqi}`,
      unit: 'AQI',
      status: airData.urbanAqi > 400 ? 'SEVERE' : airData.urbanAqi > 300 ? 'VERY POOR' : airData.urbanAqi > 200 ? 'POOR' : 'MODERATE',
      statusColor: airData.urbanAqi > 400 ? 'text-red-400' : airData.urbanAqi > 300 ? 'text-amber-400' : 'text-yellow-400',
      source: `${airData.regulatoryBody || 'CPCB / SPCB'} Baseline`,
      icon: Activity,
      subtext: `${airData.cityName} Sub-Index`,
      onClick: () => onSelectTab('provenance'),
    },
    {
      id: 'grap',
      title: 'Graded Action',
      value: `Stage ${airData.grap.stage}`,
      unit: '',
      status: airData.grap.stageName.split('(')[1]?.replace(')', '') || 'ACTIVE',
      statusColor: airData.grap.stage >= 3 ? 'text-red-400' : airData.grap.stage === 2 ? 'text-amber-400' : 'text-yellow-400',
      source: airData.actionPlanName || 'Emergency Action Plan',
      icon: ShieldAlert,
      subtext: `${airData.regulatoryBody || 'Statutory Authority'}`,
      onClick: () => onSelectTab('grap'),
    },
    {
      id: 'highrisk',
      title: 'High-Risk Zones',
      value: `${highRiskCount}`,
      unit: `/${exposures.length}`,
      status: criticalCount > 0 ? `${criticalCount} CRITICAL` : 'ELEVATED',
      statusColor: highRiskCount > 0 ? 'text-red-400' : 'text-emerald-400',
      source: 'Digital Twin Engine',
      icon: MapPin,
      subtext: 'Hospitals & Schools at risk',
      onClick: () => onSelectTab('map'),
    },
    {
      id: 'vulnerable',
      title: 'Vulnerable Receptors',
      value: `${exposures.length}`,
      unit: 'Locations',
      status: 'MONITORED',
      statusColor: 'text-cyan-400',
      source: 'Spatial Registry',
      icon: Building2,
      subtext: '4 Hospitals · 4 Schools · 2 Shelters',
      onClick: () => onSelectTab('exposure-network'),
    },
    {
      id: 'alerts',
      title: 'Active Alerts',
      value: `${alerts.length}`,
      unit: 'Live',
      status: alerts.some(a => a.level === 'CRITICAL') ? 'CRITICAL' : 'DISPATCHED',
      statusColor: alerts.length > 0 ? 'text-amber-400' : 'text-slate-400',
      source: 'Amazon SNS',
      icon: Bell,
      subtext: 'Emergency Dispatch Feed',
      onClick: () => onSelectTab('alerts'),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      {cards.map(card => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            onClick={card.onClick}
            className="p-3.5 rounded-xl bg-[#0E1524] border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-cyan-950/20"
          >
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium truncate">{card.title}</span>
                <IconComponent className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </div>

              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-white font-mono tabular-nums tracking-tight">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-[10px] text-slate-400 font-mono">{card.unit}</span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] space-y-1">
              <div className="flex items-center justify-between">
                <span className={`font-mono font-semibold ${card.statusColor}`}>
                  {card.status}
                </span>
                <span className="text-slate-400 truncate max-w-[80px]" title={card.source}>
                  {card.source}
                </span>
              </div>
              <div className="text-[9px] text-slate-400 truncate">
                {card.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
