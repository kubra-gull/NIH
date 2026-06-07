/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useHub } from "../context/HubContext";
import {
  Boxes,
  PlusCircle,
  TrendingUp,
  AlertTriangle,
  FolderMinus,
  CheckCircle,
  CalendarCheck,
  Building,
  ArrowRightLeft
} from "lucide-react";

export const InventoryManagementView: React.FC = () => {
  const { vaccines, addVaccineStock, reportWastedDoses } = useHub();

  const [selectedVaccineId, setSelectedVaccineId] = useState("");
  const [replenishAmount, setReplenishAmount] = useState<number>(500);
  const [customBatch, setCustomBatch] = useState("");
  const [customExpiry, setCustomExpiry] = useState("");

  const [wasteVaccineId, setWasteVaccineId] = useState("");
  const [wasteAmount, setWasteAmount] = useState<number>(10);
  const [wasteReason, setWasteReason] = useState("Vial breakage during handling");

  const [replenishSuccess, setReplenishSuccess] = useState("");
  const [wasteSuccess, setWasteSuccess] = useState("");

  const handleReplenish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVaccineId || replenishAmount <= 0) {
      alert("Please select a vaccine formulation and specify replenished quantity.");
      return;
    }

    addVaccineStock(selectedVaccineId, replenishAmount, customBatch || undefined, customExpiry || undefined);
    setReplenishSuccess(`Successfully restocked ${replenishAmount} doses inside active health reserve.`);
    
    // Reset form
    setSelectedVaccineId("");
    setReplenishAmount(500);
    setCustomBatch("");
    setCustomExpiry("");

    setTimeout(() => setReplenishSuccess(""), 4000);
  };

  const handleReportWaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteVaccineId || wasteAmount <= 0) {
      alert("Please select vaccine and quantity to write-off.");
      return;
    }

    reportWastedDoses(wasteVaccineId, wasteAmount, wasteReason);
    setWasteSuccess(`Deducted ${wasteAmount} damaged doses from available warehouse records.`);
    
    // Reset Form
    setWasteVaccineId("");
    setWasteAmount(10);
    setWasteReason("Vial breakage during handling");

    setTimeout(() => setWasteSuccess(""), 4000);
  };

  // Warehouse KPI calculation
  const totalDoses = vaccines.reduce((acc, v) => acc + v.dosesInStock, 0);
  const lowStockCount = vaccines.filter(v => v.status === "Low Stock" || v.dosesInStock <= v.lowStockThreshold).length;
  
  // Simulated near expiry helper (e.g. expiring within 2026)
  const expiringSoonCount = vaccines.filter(v => {
    const today = new Date("2026-06-07");
    const expiry = new Date(v.expiryDate);
    // expiring within 3 months of mock date
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 90;
  }).length;

  return (
    <div id="inventory-management-panel" className="space-y-6">
      
      {/* Stock Cards ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold block">Available Stock Pool</span>
          <p className="text-2xl font-black text-[#005F73] mt-1">{totalDoses.toLocaleString()}</p>
          <span className="text-[9px] text-neutral-400 font-mono mt-1 block">Accumulated Doses</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold block">Expiring Soon (&lt;90 days)</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{expiringSoonCount}</p>
          <span className="text-[9px] text-amber-600/75 mt-1 block">Requires priority dispatch</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold block">Low Stock Buffers</span>
          <p className="text-2xl font-black text-red-600 mt-1">{lowStockCount}</p>
          <span className="text-[9px] text-neutral-400 font-mono mt-1 block">Threshold breached</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold block">Wasted Doses (YTD)</span>
          <p className="text-2xl font-black text-neutral-700 mt-1">16 Doses</p>
          <span className="text-[9px] text-red-600 font-semibold mt-1 block">Wastage rate: 0.08% (Safe)</span>
        </div>

      </div>

      {/* Main Ledger grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ledger list */}
        <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-[#005F73]" /> Biological Stock Ledger
            </h3>
            <span className="text-[10px] text-[#005F73] font-mono font-semibold bg-[#00D4C7]/15 px-2.5 py-1 rounded">
              Warehouse Code: NIH-W16
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 text-neutral-400 font-mono text-[10px] uppercase border-b border-neutral-150">
                  <th className="p-2.5">Vaccine Antigen</th>
                  <th className="p-2.5">Batch</th>
                  <th className="p-2.5">Expiry</th>
                  <th className="p-2.5">Route</th>
                  <th className="p-2.5">Safety Temp</th>
                  <th className="p-2.5 text-right">Doses In Stock</th>
                  <th className="p-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-600">
                {vaccines.map((v) => {
                  const isLow = v.dosesInStock <= v.lowStockThreshold;
                  return (
                    <tr key={v.id} className="hover:bg-neutral-50/50">
                      <td className="p-2.5 font-bold text-neutral-800">{v.name}</td>
                      <td className="p-2.5 font-mono">{v.batchNumber}</td>
                      <td className="p-2.5 font-mono text-neutral-500">{v.expiryDate}</td>
                      <td className="p-2.5 font-mono text-neutral-400">{v.route} ({v.dosageMl}ml)</td>
                      <td className="p-2.5 font-mono text-neutral-500">{v.temperatureMinCelsius}°C to {v.temperatureMaxCelsius}°C</td>
                      <td className="p-2.5 font-bold text-right font-mono text-[#005F73]">{v.dosesInStock.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-bold">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          isLow
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-green-50 text-green-600 border border-green-100"
                        }`}>
                          {isLow ? "Low Stock" : "In Stock"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Action sidebar: Replenishment & Damaged logs */}
        <div className="space-y-6">
          
          {/* Replenish */}
          <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-3">
            <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-1.5 border-b border-neutral-100 pb-2 uppercase tracking-tight">
              <PlusCircle className="w-4 h-4 text-green-600" /> Stock Intake Replenishment
            </h4>

            {replenishSuccess && (
              <p className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-[11px] font-medium leading-relaxed">
                {replenishSuccess}
              </p>
            )}

            <form onSubmit={handleReplenish} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Select Vaccine Formulation *</label>
                <select
                  required
                  value={selectedVaccineId}
                  onChange={(e) => setSelectedVaccineId(e.target.value)}
                  className="w-full p-2 border border-neutral-200 rounded text-xs focus:ring-[#00D4C7]"
                >
                  <option value="">-- Choose Antigen --</option>
                  {vaccines.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Doses Quantity Replenished *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={replenishAmount}
                  onChange={(e) => setReplenishAmount(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-neutral-200 rounded text-xs focus:ring-[#00D4C7]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">New Batch Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. BCG-2026-99A"
                  value={customBatch}
                  onChange={(e) => setCustomBatch(e.target.value)}
                  className="w-full p-2 border border-neutral-200 rounded text-xs focus:ring-[#00D4C7]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">New Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={customExpiry}
                  onChange={(e) => setCustomExpiry(e.target.value)}
                  className="w-full p-2 border border-neutral-200 rounded text-xs focus:ring-[#00D4C7]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#005F73] hover:bg-[#00D4C7] hover:text-neutral-900 text-white font-bold rounded shadow transition-all cursor-pointer"
              >
                Intake Replenish Shipment
              </button>
            </form>
          </section>

          {/* Damaged / Lost */}
          <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-3">
            <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-1.5 border-b border-neutral-100 pb-2 uppercase tracking-tightColor">
              <FolderMinus className="w-4 h-4 text-red-600" /> Report Stock Wastage
            </h4>

            {wasteSuccess && (
              <p className="p-2 bg-red-50 text-red-800 border border-red-100 rounded text-[11px] font-medium leading-relaxed">
                {wasteSuccess}
              </p>
            )}

            <form onSubmit={handleReportWaste} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Select Depleted Antigen *</label>
                <select
                  required
                  value={wasteVaccineId}
                  onChange={(e) => setWasteVaccineId(e.target.value)}
                  className="w-full p-2 border border-neutral-200 rounded text-xs focus:ring-red-500"
                >
                  <option value="">-- Choose Vaccine --</option>
                  {vaccines.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Wasted Doses Count *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={wasteAmount}
                  onChange={(e) => setWasteAmount(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-neutral-200 rounded text-xs focus:ring-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Detailed Wastage Reason *</label>
                <select
                  required
                  value={wasteReason}
                  onChange={(e) => setWasteReason(e.target.value)}
                  className="w-full p-2 border border-neutral-200 rounded text-xs"
                >
                  <option value="Vial breakage during handling">Vial breakage during handling</option>
                  <option value="Cold chain anomaly / high temp exposure">Cold chain anomaly / high temperature exposure</option>
                  <option value="Leaked during transport campaign">Leaked during transport campaign</option>
                  <option value="Vial expired prior to administration">Vial expired prior to administration</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow transition-all cursor-pointer"
              >
                Log Wastage Write-off
              </button>
            </form>
          </section>

        </div>

      </div>

    </div>
  );
};
