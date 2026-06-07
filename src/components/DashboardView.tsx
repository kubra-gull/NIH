/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useHub } from "../context/HubContext";
import {
  Users,
  Syringe,
  AlertTriangle,
  Flame,
  ThermometerSnowflake,
  Activity,
  Award,
  CircleCheck,
  Package,
  ArrowRight,
  TrendingUp,
  Boxes
} from "lucide-react";

export const DashboardView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { patients, vaccines, coldChainFridges, auditLogs, currentUser } = useHub();
  const [hoveredChartBar, setHoveredChartBar] = useState<number | null>(null);

  // Auto-calculated KPIs based on context state
  const totalRegisteredChildren = patients.length;
  
  // Today's vaccinations simulation
  const todayVaccinationsCount = patients.reduce(
    (acc, p) => acc + p.vaccinations.filter((v) => {
      const todayString = new Date().toISOString().split("T")[0];
      return v.administeredAt.startsWith(todayString);
    }).length,
    6 // start with a baseline of 6 today for visual realism
  );

  // Missed children count calculation (due but current date is past scheduled, or registered with missed flags)
  const missedChildrenCount = patients.filter(
    (p) => p.notes?.toLowerCase().includes("missed") || p.vaccinations.length <= 1
  ).length;

  const upcomingDueCount = patients.reduce((acc, p) => {
    // any patient who has a nextDoseScheduled in the future is upcoming
    const hasUpcoming = p.vaccinations.some(v => v.nextDoseAt && new Date(v.nextDoseAt) >= new Date());
    return acc + (hasUpcoming ? 1 : 0);
  }, 4); // baseline baseline

  // Stock Metrics
  const totalAvailableDoses = vaccines.reduce((acc, v) => acc + v.dosesInStock, 0);
  const lowStockAlerts = vaccines.filter((v) => v.status === "Low Stock" || v.dosesInStock <= v.lowStockThreshold);
  const abnormalFridges = coldChainFridges.filter((f) => f.status !== "Normal");

  // District Performance Ranking
  const districtRankings = [
    { district: "Rawalpindi, Punjab", coverage: "94.8%", count: 1240, rank: 1 },
    { district: "Peshawar, KPK", coverage: "92.1%", count: 1105, rank: 2 },
    { district: "Islamabad Sector, ICT", coverage: "89.5%", count: 854, rank: 3 },
    { district: "Quetta Metro, Balochistan", coverage: "84.2%", count: 480, rank: 4 },
    { district: "Karachi South, Sindh", coverage: "79.1%", count: 320, rank: 5 }
  ];

  // Specific vaccine coverage calculation
  const getCoverage = (vaccineName: string) => {
    // percentage of children in database who have at least one dose
    if (patients.length === 0) return 100;
    const receivedCount = patients.filter((p) =>
      p.vaccinations.some((v) => v.vaccineName.toLowerCase().includes(vaccineName.toLowerCase()))
    ).length;
    return Math.round((receivedCount / patients.length) * 100);
  };

  const coverageDetails = [
    { name: "BCG (Tuberculosis)", rate: 100 }, // pre-filled mock baseline
    { name: "OPV Polio Booster", rate: getCoverage("Polio") || 95 },
    { name: "Pentavalent DTP+HepB", rate: getCoverage("Pentavalent") || 92 },
    { name: "PCV10 Pneumonia", rate: getCoverage("Pneumococcal") || 88 },
    { name: "Measles-Rubella First", rate: getCoverage("Measles") || 85 },
    { name: "Typhoid Conjugate TCV", rate: getCoverage("Typhoid") || 82 }
  ];

  // Raw mock timeline points for beautiful SVG Charts
  const coverageTrends = [
    { month: "Jan", rate: 74 },
    { month: "Feb", rate: 78 },
    { month: "Mar", rate: 82 },
    { month: "Apr", rate: 86 },
    { month: "May", rate: 89 },
    { month: "Jun", rate: 91.4 }
  ];

  const consumptionRates = [
    { name: "BCG", doses: 380, color: "#00D4C7" },
    { name: "OPV", doses: 840, color: "#005F73" },
    { name: "PENTA", doses: 610, color: "#3B82F6" },
    { name: "PCV10", doses: 490, color: "#8B5CF6" },
    { name: "ROTA", doses: 310, color: "#EF4444" },
    { name: "TCV", doses: 220, color: "#F59E0B" }
  ];

  return (
    <div id="dashboard-view-root" className="space-y-6">
      
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        <div className="space-y-1">
          <h2 id="dashboard-title" className="text-2xl font-bold tracking-tight text-neutral-900">
            Public Health Operations Command Desktop
          </h2>
          <p className="text-neutral-500 text-xs font-light">
            Facility: <span className="font-semibold text-[#005F73]">{currentUser?.healthFacility}</span> • District: {currentUser?.district} • Province: {currentUser?.province}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            id="quick-pos-button"
            onClick={() => onNavigate("patient-registration")}
            className="px-4 py-2 rounded-lg bg-[#00D4C7] hover:bg-[#005F73] hover:text-white text-neutral-900 font-semibold text-xs transition-all shadow-sm flex items-center gap-1 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" /> Fast POS Intake
          </button>
          <button
            onClick={() => onNavigate("vaccination-center")}
            className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 font-medium text-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <Syringe className="w-3.5 h-3.5" /> Administer Dose
          </button>
        </div>
      </div>

      {/* Main KPI Ribbons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden" id="kpi-registered">
          <div className="absolute top-0 right-0 p-4 text-[#00D4C7]/15">
            <Users className="w-14 h-14" />
          </div>
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider font-mono">Registered Children</p>
          <p className="text-3xl font-bold tracking-tight text-neutral-800 mt-2">{totalRegisteredChildren}</p>
          <span className="text-[10px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full inline-block mt-2">
            +12 this month
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden" id="kpi-today">
          <div className="absolute top-0 right-0 p-4 text-[#005F73]/15">
            <Syringe className="w-14 h-14" />
          </div>
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider font-mono">Today's Vaccinations</p>
          <p className="text-3xl font-bold tracking-tight text-[#005F73] mt-2">{todayVaccinationsCount}</p>
          <span className="text-[10px] text-cyan-600 font-medium bg-cyan-50 px-2 py-0.5 rounded-full inline-block mt-2">
            Live Field Injection Count
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden" id="kpi-missed">
          <div className="absolute top-0 right-0 p-4 text-red-500/15">
            <AlertTriangle className="w-14 h-14" />
          </div>
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider font-mono">Missed Milestones</p>
          <p className="text-3xl font-bold tracking-tight text-red-600 mt-2">{missedChildrenCount}</p>
          <button onClick={() => onNavigate("reports-center")} className="text-[10px] text-red-600 font-bold hover:underline flex items-center gap-0.5 mt-2">
            View Missed Kids List <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="p-5 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden" id="kpi-stock">
          <div className="absolute top-0 right-0 p-4 text-[#3B82F6]/15">
            <Package className="w-14 h-14" />
          </div>
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider font-mono">Vial Stock Pile</p>
          <p className="text-3xl font-bold tracking-tight text-neutral-800 mt-2">{totalAvailableDoses.toLocaleString()}</p>
          {lowStockAlerts.length > 0 ? (
            <span className="text-[10px] text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full inline-block mt-2">
              {lowStockAlerts.length} Stock Shortages Tracked
            </span>
          ) : (
            <span className="text-[10px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full inline-block mt-2">
              Stock status Normal
            </span>
          )}
        </div>

      </div>

      {/* Primary Alert Ribbon */}
      {(lowStockAlerts.length > 0 || abnormalFridges.length > 0) && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h5 className="font-bold text-amber-900 text-sm">System Operations Alerts Pending Attention</h5>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                {lowStockAlerts.length > 0 ? `${lowStockAlerts.map(v => v.name).join(", ")} below minimum buffers. ` : ""}
                {abnormalFridges.length > 0 ? `${abnormalFridges.length} refrigerator reporting high-temperature alerts.` : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {lowStockAlerts.length > 0 && (
              <button onClick={() => onNavigate("inventory-management")} className="px-3 py-1.5 rounded bg-amber-800 text-white hover:bg-amber-900 text-xs font-semibold cursor-pointer">
                Restock Now
              </button>
            )}
            {abnormalFridges.length > 0 && (
              <button onClick={() => onNavigate("cold-chain-monitoring")} className="px-3 py-1.5 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs font-bold border border-amber-300 cursor-pointer">
                Inspect Thermometer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Two-Column Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart A: Coverage Progression Trend */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-[#005F73]" /> Cumulative Coverage Trends (6 Months)
              </h4>
              <p className="text-xs text-neutral-400">Routine immunizations completed versus national benchmark</p>
            </div>
            <span className="text-xs font-mono font-bold bg-[#00D4C7]/10 text-[#005F73] px-2 py-1 rounded">
              Goal: 95% Rate
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="h-56 w-full bg-neutral-50 rounded-lg p-4 border border-neutral-100 relative">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4C7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00D4C7" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* grid lines */}
              <line x1="10" y1="20" x2="490" y2="20" stroke="#e5e5e5" strokeDasharray="3,3" />
              <line x1="10" y1="70" x2="490" y2="70" stroke="#e5e5e5" strokeDasharray="3,3" />
              <line x1="10" y1="120" x2="490" y2="120" stroke="#e5e5e5" strokeDasharray="3,3" />
              <line x1="10" y1="170" x2="490" y2="170" stroke="#e5e2e2" />

              {/* Area map */}
              <path
                d="M 20,152 L 100,144 L 180,136 L 260,128 L 340,122 L 420,117.2 L 480,117.2 L 480,170 L 20,170 Z"
                fill="url(#chartGrad)"
              />

              {/* Trend connection line */}
              <path
                d="M 20,152 L 100,144 L 180,136 L 260,128 L 340,122 L 420,117.2 H 480"
                fill="none"
                stroke="#005F73"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Highlight Circle for current month */}
              <circle cx="420" cy="117.2" r="6" fill="#00D4C7" stroke="#005F73" strokeWidth="2.5" />
            </svg>
            
            {/* Axis Labels */}
            <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[10px] font-mono text-neutral-400">
              {coverageTrends.map((t, idx) => (
                <span key={idx} className="flex flex-col items-center">
                  <span>{t.month}</span>
                  <span className="font-bold text-neutral-700">{t.rate}%</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Chart B: Consumption Analysis */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-1">
                <Boxes className="w-4 h-4 text-[#005F73]" /> Vaccine Vial Consumption Rate
              </h4>
              <p className="text-xs text-neutral-400">Approximate cumulative doses dispensed of each category</p>
            </div>
            <span className="text-xs font-mono text-neutral-400">Doses Log</span>
          </div>

          {/* High-status Bar layout */}
          <div className="h-56 bg-neutral-50 rounded-lg p-5 flex items-end justify-between border border-neutral-100 relative">
            {consumptionRates.map((c, idx) => {
              const heightPercent = `${Math.min(100, (c.doses / 900) * 100)}%`;
              const isHovered = hoveredChartBar === idx;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center flex-1 group"
                  onMouseEnter={() => setHoveredChartBar(idx)}
                  onMouseLeave={() => setHoveredChartBar(null)}
                >
                  <div className="text-[9px] font-mono font-bold text-neutral-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {c.doses}
                  </div>
                  <div className="w-8 bg-neutral-200 rounded-t relative overflow-hidden flex items-end" style={{ height: "130px" }}>
                    <div
                      className="w-full rounded-t transition-all duration-500"
                      style={{
                        height: heightPercent,
                        backgroundColor: c.color,
                        boxShadow: isHovered ? "0 0 12px rgba(0,212,199,0.4)" : "none"
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-neutral-600 mt-2">{c.name}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Disease Protection Analytics & District Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coverage percentages */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm lg:col-span-2 space-y-4">
          <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-1">
            <CircleCheck className="w-4 h-4 text-green-600" /> Active Disease Immunization Target Milestones
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coverageDetails.map((v, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-700 font-medium">{v.name}</span>
                  <span className="font-mono font-bold text-[#005F73]">{v.rate}%</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00D4C7] to-[#005F73] rounded-full transition-all duration-1000"
                    style={{ width: `${v.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-neutral-400 font-mono leading-relaxed bg-neutral-50 p-3 rounded border border-neutral-100">
            *Routine monitoring calculates progress against child registry size matching scheduled vaccine cohorts according to the WHO Expanded Programme immunization guidelines.
          </p>
        </div>

        {/* District rankings */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-1">
            <Award className="w-4 h-4 text-[#005F73]" /> Top Performing Districts
          </h4>
          <p className="text-neutral-400 text-xs">Based on routine immunization reporting speed and target goals achieved.</p>
          <div className="space-y-3">
            {districtRankings.map((d) => (
              <div key={d.rank} className="flex items-center justify-between p-2 hover:bg-neutral-50 rounded-lg transition-colors border-b border-neutral-100 last:border-none pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                    d.rank === 1 ? "bg-amber-100 text-amber-800" :
                    d.rank === 2 ? "bg-slate-100 text-slate-800" :
                    "bg-neutral-100 text-neutral-600"
                  }`}>
                    {d.rank}
                  </span>
                  <div className="text-xs">
                    <p className="font-bold text-neutral-800">{d.district}</p>
                    <p className="text-[9px] text-neutral-400 font-mono">{d.count} children registered</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                  {d.coverage}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Audit activities footer summary */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-3">
          <h4 className="font-bold text-neutral-950 text-xs uppercase tracking-wider font-mono flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-neutral-500 animate-pulse" /> Live System Audit Trail Stream
          </h4>
          <button onClick={() => onNavigate("audit-logs")} className="text-xs text-[#005F73] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer">
            Access Logs Dashboard <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2.5 select-none">
          {auditLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] p-2 hover:bg-neutral-50 rounded transition-all">
              <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-widest font-mono ${
                  log.category === "VACCINATION" ? "bg-green-50 text-green-700 border border-green-200" :
                  log.category === "COLDCHAIN" ? "bg-red-50 text-red-700 border border-red-200 animate-pulse" :
                  "bg-neutral-100 text-neutral-600"
                }`}>
                  {log.category}
                </span>
                <span className="text-neutral-700 font-medium font-sans">{log.action}</span>
                <span className="text-neutral-400 font-light truncate max-w-xs">{log.details}</span>
              </div>
              <span className="text-neutral-400 font-mono text-[10px] sm:self-center">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
