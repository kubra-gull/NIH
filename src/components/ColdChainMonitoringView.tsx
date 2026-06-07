/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useHub } from "../context/HubContext";
import {
  ThermometerSnowflake,
  BatteryCharging,
  Zap,
  ShieldCheck,
  AlertOctagon,
  Clock,
  PlusCircle,
  TrendingDown,
  Gauge
} from "lucide-react";

export const ColdChainMonitoringView: React.FC = () => {
  const { coldChainFridges, tempLogs, logTemperature, currentUser } = useHub();

  const [selectedFridgeId, setSelectedFridgeId] = useState("");
  const [manualTemp, setManualTemp] = useState<number>(4.0);
  const [success, setSuccess] = useState("");

  const handleLogTemp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFridgeId || manualTemp === undefined) {
      alert("Please select a refrigerator unit and write temp sensor reading.");
      return;
    }

    logTemperature(selectedFridgeId, manualTemp, currentUser?.fullName || "System Sensor Autolog");
    setSuccess(`Logged temperature ${manualTemp}°C to system database registry.`);
    
    // Clear Form
    setSelectedFridgeId("");
    setManualTemp(4.0);

    setTimeout(() => setSuccess(""), 4000);
  };

  const activeFridge = coldChainFridges.find(f => f.id === selectedFridgeId);

  // Spark grid telemetry calculations
  const totalStationsChecked = coldChainFridges.length;
  const warningsTracked = coldChainFridges.filter(f => f.status !== "Normal").length;

  return (
    <div id="cold-chain-panel-container" className="space-y-6">
      
      {/* Overview stats ribbons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold block">Monitored Cooling units</span>
          <p className="text-2xl font-black text-[#005F73] mt-1">{totalStationsChecked}</p>
          <span className="text-[9px] text-[#00D4C7] font-semibold mt-1 block">Live telemetry stream</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold block">Status Warnings</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{warningsTracked}</p>
          <span className="text-[9px] text-neutral-400 font-mono mt-1 block">Requires priority defrost</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold block">EPI Vaccine Safe Zone</span>
          <p className="text-2xl font-black text-green-600 mt-1">98.2%</p>
          <span className="text-[9px] text-neutral-400 font-mono mt-1 block">Routine temperature compliance</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold block">Power Fail Backup Rate</span>
          <p className="text-2xl font-black text-neutral-800 mt-1">100%</p>
          <span className="text-[9px] text-green-600 font-bold mt-1 block">Solar micro-grid verified</span>
        </div>

      </div>

      {/* Fridges State Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="cc-stations-grid">
        {coldChainFridges.map((f) => {
          const isNormal = f.status === "Normal";
          const isWarning = f.status === "Warning";
          return (
            <div
              key={f.id}
              className="p-5 bg-white rounded-xl border border-neutral-250 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-64"
              id={`station-${f.id}`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 text-[#005F73]">
                <ThermometerSnowflake className="w-16 h-16" />
              </div>

              {/* Station title block */}
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-[#005F73] font-mono font-bold bg-[#00D4C7]/10 px-2.5 py-0.5 rounded-full">
                      ID: {f.id}
                    </span>
                    <h4 className="font-bold text-neutral-900 text-sm mt-1.5">{f.fridgeName}</h4>
                    <p className="text-neutral-400 text-[10px] font-sans">{f.facilityName}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    isNormal ? "bg-green-50 text-green-700 border border-green-200" :
                    isWarning ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse" :
                    "bg-red-50 text-red-700 border border-red-200 animate-pulse"
                  }`}>
                    {f.status}
                  </span>
                </div>

                {/* Stored Biological antigens display */}
                <p className="text-[10px] text-neutral-500 font-sans mt-3 truncate">
                  <strong className="text-neutral-700 font-mono uppercase text-[9px]">Stored Antigens:</strong> {f.vaccinesStored.join(", ")}
                </p>
              </div>

              {/* Key Measurements */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-100 font-mono text-center">
                <div>
                  <span className="text-[9px] text-neutral-400">Current Temp</span>
                  <p className={`text-lg font-black mt-0.5 ${
                    isNormal ? "text-green-600" : "text-amber-600"
                  }`}>
                    {f.currentTemperatureCelsius}°C
                  </p>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400">Target Range</span>
                  <p className="text-xs font-semibold text-neutral-700 mt-1">
                    {f.targetTempMinCelsius}°C to {f.targetTempMaxCelsius}°C
                  </p>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400">Power Source</span>
                  <p className="text-[9px] font-sans font-bold text-neutral-800 mt-1.5 flex items-center justify-center gap-0.5">
                    <Zap className="w-3 h-3 text-amber-500 shrink-0" /> {f.powerSource}
                  </p>
                </div>
              </div>

              {/* Battery charge and last verified timeline */}
              <div className="flex justify-between items-center pt-2.5 border-t border-neutral-100 text-[10px] text-neutral-500 font-mono">
                <span className="flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-green-500" /> 100% Charged
                </span>
                <span className="flex items-center gap-0.5 font-light">
                  <Clock className="w-3 h-3 text-neutral-400" /> Checked {new Date(f.lastVerifiedAt).toLocaleTimeString()}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Temperature Charts Visual Analytics and Manual Registration Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic Waveform Graph widget */}
        <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
            <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-1">
              <Gauge className="w-4 h-4 text-[#005F73]" /> Waveform Sensor Temperature Progression
            </h4>
            <span className="text-xs font-mono text-neutral-400">[24 Hour Trace]</span>
          </div>

          <div className="h-60 bg-neutral-900 rounded-lg p-5 relative overflow-hidden">
            {/* Warning zone gradient templates */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-red-500/10 border-b border-red-500/20" />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-blue-500/10 border-t border-blue-500/20" />
            
            {/* Safe boundaries zone labels */}
            <span className="absolute top-2 left-3 text-[8px] font-mono text-red-500 uppercase tracking-widest font-semibold">Critical High Limit &gt;8°C</span>
            <span className="absolute top-[3.5rem] left-3 text-[8px] font-mono text-green-400 uppercase tracking-widest font-semibold">Safe Routine zone (2°C - 8°C)</span>
            <span className="absolute bottom-2 left-3 text-[8px] font-mono text-blue-400 uppercase tracking-widest font-semibold">Sub-zero Freezers bounds</span>

            {/* Custom SVG line plot chart wave */}
            <svg className="w-full h-full relative z-10" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Reference Grid lines */}
              <line x1="20" y1="50" x2="480" y2="50" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="20" y1="150" x2="480" y2="150" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="3,3" />

              {/* Safe Zone bounds color block */}
              <rect x="20" y="50" width="460" height="100" fill="rgba(16,185,129,0.04)" />

              {/* Wave Trace line */}
              <path
                d="M 20,80 Q 80,45 140,75 T 260,95 T 380,68 T 480,88"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Critical warning node */}
              <circle cx="95" cy="52" r="6.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
            
            <span className="absolute top-[3rem] left-24 text-[8px] font-mono text-red-500 bg-red-950 px-1 py-0.5 rounded border border-red-900 z-20 font-bold uppercase tracking-wider animate-pulse">Thermometer Alert at 08h00</span>
          </div>
        </section>

        {/* Manual Temperature logger */}
        <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-3">
          <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-1.5 border-b border-neutral-100 pb-2 uppercase tracking-tight">
            <PlusCircle className="w-4 h-4 text-cyan-600" /> Manual Cold Store Register
          </h4>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            EPI healthcare standards assert manual logging checks must be registered every 12 hours.
          </p>

          {success && (
            <p className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-[11px] font-medium leading-relaxed">
              {success}
            </p>
          )}

          <form onSubmit={handleLogTemp} className="space-y-3.5 text-xs font-sans">
            <div className="space-y-1">
              <label className="font-bold text-neutral-700 block">Select Refrigerator Station *</label>
              <select
                required
                value={selectedFridgeId}
                onChange={(e) => setSelectedFridgeId(e.target.value)}
                className="w-full p-2 border border-neutral-200 rounded text-xs focus:ring-[#00D4C7]"
              >
                <option value="">-- Choose Cooler unit --</option>
                {coldChainFridges.map(f => (
                  <option key={f.id} value={f.id}>{f.fridgeName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-neutral-700">Thermometer Reading (°C) *</label>
                <span className="font-bold font-mono text-[#005F73] bg-[#00D4C7]/10 px-1.5 py-0.5 rounded">
                  {manualTemp}°C
                </span>
              </div>
              <input
                type="range"
                required
                min={-25}
                max={15}
                step={0.1}
                value={manualTemp}
                onChange={(e) => setManualTemp(parseFloat(e.target.value))}
                className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#005F73] mt-2"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                <span>-25.0°C</span>
                <span>0.0°C</span>
                <span>+15.0°C</span>
              </div>
            </div>

            {/* Assessment feedback of input slider */}
            {activeFridge && (
              <div className="p-3 rounded bg-neutral-50 border border-neutral-150 text-[10px] font-mono leading-relaxed space-y-1 text-neutral-600">
                <span className="font-bold text-neutral-700 uppercase">[Thermal Bounds Warning]</span>
                <p>Safety Range: {activeFridge.targetTempMinCelsius}°C to {activeFridge.targetTempMaxCelsius}°C</p>
                <p>Status Outcome: {
                  manualTemp < activeFridge.targetTempMinCelsius || manualTemp > activeFridge.targetTempMaxCelsius
                    ? <span className="text-red-600 font-bold uppercase animate-pulse">Critical Breach Alert!</span>
                    : <span className="text-green-600 font-bold uppercase">Stable safe zone</span>
                }</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-[#005F73] hover:bg-[#00D4C7] hover:text-neutral-900 text-white font-bold rounded shadow transition-all cursor-pointer text-xs"
            >
              Sign & Save Thermometer Log
            </button>
          </form>
        </section>

      </div>

      {/* Temperature logs scroll */}
      <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-3">
        <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-1 bg-neutral-50 p-2 rounded">
          <Clock className="w-4 h-4 text-neutral-500" /> Hourly Temperature Sensors Historical Logs
        </h4>
        <div className="overflow-x-auto max-h-56">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-neutral-50 text-neutral-400 font-mono text-[10px] border-b border-neutral-100">
                <th className="p-2">Timestamp</th>
                <th className="p-2">Refrigerator Station</th>
                <th className="p-2">Celsius Temperature</th>
                <th className="p-2">Status Flag</th>
                <th className="p-2">Checked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-600 font-sans">
              {tempLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-50/50">
                  <td className="p-2 font-mono text-neutral-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-2 font-semibold text-neutral-800">{log.fridgeName}</td>
                  <td className="p-2 font-bold font-mono text-[#005F73]">{log.recordedTemperatureCelsius}°C</td>
                  <td className="p-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      log.status === "Normal" ? "bg-green-50 text-green-600 border border-green-200" :
                      log.status === "Warning" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                      "bg-red-50 text-red-600 border border-red-200 animate-pulse"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-2">{log.loggedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
