/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useHub } from "../context/HubContext";
import {
  Activity,
  PlusCircle,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  FileSignature,
  DollarSign,
  TrendingDown,
  Building,
  Clock
} from "lucide-react";

export const EodReconciliationView: React.FC = () => {
  const { eodLogs, submitEodReconciliation, currentUser } = useHub();

  const [dateField, setDateField] = useState(new Date().toISOString().split("T")[0]);
  const [digitalCount, setDigitalCount] = useState<number>(35);
  const [physicalCount, setPhysicalCount] = useState<number>(35);
  const [wastedVials, setWastedVials] = useState<number>(1);
  const [notesText, setNotesText] = useState("Vial count matches perfectly with the digital register. Disposed vaccine vials autoclaved safely.");
  
  const [success, setSuccess] = useState("");

  const handleReconcileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateField || digitalCount === undefined || physicalCount === undefined) {
      alert("Please fill in the daily digital register entries count & physical count.");
      return;
    }

    submitEodReconciliation({
      date: dateField,
      vaccinatorName: currentUser?.fullName || "Zafar Iqbal (LHV)",
      employeeId: currentUser?.employeeId || "NIH-2026-6625",
      facilityName: currentUser?.healthFacility || "Rawalpindi District Site Hub",
      digitalDosesDispensedCount: digitalCount,
      physicalDosesVialsCount: physicalCount,
      vialsWastedCount: wastedVials,
      notes: notesText
    });

    setSuccess("Daily End-of-Day reconciliation report successfully computed, signed, and authorized.");
    
    // reset form
    setDigitalCount(35);
    setPhysicalCount(35);
    setWastedVials(1);
    setNotesText("");

    setTimeout(() => setSuccess(""), 4000);
  };

  const calculatedVariance = physicalCount - digitalCount;

  return (
    <div id="eod-panel-container" className="space-y-6">
      
      {/* Overview reconciliation widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold block">Digital Injections Verified</span>
          <p className="text-2xl font-black text-[#005F73] mt-1">294 Doses</p>
          <span className="text-[9px] text-green-600 font-bold mt-1 block">100% Matching index</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold block">Physical Glass Vials Count</span>
          <p className="text-2xl font-black text-neutral-800 mt-1">294 Dials</p>
          <span className="text-[9px] text-[#00D4C7] font-semibold mt-1 block">Autoclaved disposed safely</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold block">Net Variance (YTD)</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">0</p>
          <span className="text-[9px] text-neutral-400 font-mono mt-1 block">Z-Variance Compliance</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold block">Supervisor Signatures API</span>
          <p className="text-2xl font-black text-blue-600 mt-1">100%</p>
          <span className="text-[9px] text-blue-400 font-bold mt-1 block">Standard verified lockouts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily closing ledger registration form */}
        <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div className="border-b border-neutral-100 pb-2">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1">
              <PlusCircle className="w-4 h-4 text-[#005F73]" /> Submit Daily Balance Reconciliation
            </h4>
            <p className="text-neutral-400 text-[10px] mt-1">
              File closing balances matching the current clinic Shift.
            </p>
          </div>

          {success && (
            <p className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-[11px] font-medium leading-relaxed">
              {success}
            </p>
          )}

          <form onSubmit={handleReconcileSubmit} className="space-y-3.5 text-xs font-sans">
            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Reconciliation Date *</label>
              <input
                type="date"
                required
                value={dateField}
                onChange={(e) => setDateField(e.target.value)}
                className="w-full p-2 border border-neutral-200 rounded text-xs select-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Digital Logged Injections *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={digitalCount}
                  onChange={(e) => setDigitalCount(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-neutral-200 rounded"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Physical Vial Count *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={physicalCount}
                  onChange={(e) => setPhysicalCount(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-neutral-200 rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700 font-sans">Wasted / Damaged Vials Count (Defects) *</label>
              <input
                type="number"
                required
                min={0}
                value={wastedVials}
                onChange={(e) => setWastedVials(parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-neutral-200 rounded"
              />
            </div>

            {/* Simulated Live status feedback computation */}
            <div className="p-3 bg-neutral-50 rounded border border-neutral-200 leading-relaxed font-mono text-[10px] space-y-1 text-neutral-600">
              <strong className="text-neutral-700 uppercase block">[Auto reconciliation status]</strong>
              <p>Calculated Net Variance: <span className={calculatedVariance === 0 ? "text-green-600 font-bold" : "text-red-650 font-bold font-mono"}>{calculatedVariance}</span></p>
              <p>Wastage balance adjustment: {wastedVials} Vials</p>
              <p>Audit rating: {calculatedVariance === 0 ? "🟢 CERTIFIED VERIFIED" : "⚠️ VARIANCE DETECTED (Alert will trigger)"}</p>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Explanatory Comments (Auditors review)</label>
              <textarea
                placeholder="Declare syringe recounts, syringe waste buckets, disposal methods verified..."
                rows={3}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                className="w-full p-2 border border-neutral-150 rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-neutral-900 hover:bg-[#00D4C7] hover:text-neutral-900 text-white font-bold rounded transition-all cursor-pointer text-xs"
            >
              Sign with ID & Freeze Ledger
            </button>
          </form>
        </section>

        {/* Ledger logs tracking list */}
        <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm lg:col-span-2 space-y-4">
          <h4 className="font-bold text-neutral-950 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <Activity className="w-4 h-4 text-[#005F73]" /> Certified Daily EOD Submissions
          </h4>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {eodLogs.map((e) => {
              const hasAlert = e.varianceCount !== 0;
              return (
                <div key={e.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-neutral-200/60 font-mono font-bold px-2 py-0.5 rounded text-neutral-700">
                        Date: {e.date}
                      </span>
                      <h5 className="font-bold text-neutral-800 text-xs mt-1.5 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#005F73]" /> {e.facilityName}
                      </h5>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                      e.supervisorApproval === "Approved"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                    }`}>
                      {e.supervisorApproval}
                    </span>
                  </div>

                  {/* Core metric counts block */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-neutral-150 text-center font-mono text-[10px]">
                    <div>
                      <span className="text-neutral-400 text-[9px]">Dispensed</span>
                      <p className="font-bold mt-0.5 text-[#005F73]">{e.digitalDosesDispensedCount} Doses</p>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[9px]">Physical</span>
                      <p className="font-bold mt-0.5 text-neutral-800">{e.physicalDosesVialsCount} Vials</p>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[9px]">Variance</span>
                      <p className={`font-bold mt-0.5 ${hasAlert ? "text-red-650" : "text-emerald-600"}`}>
                        {e.varianceCount} (Z)
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-500 font-sans leading-relaxed italic block pt-1">
                    "{e.notes}"
                  </p>

                  <div className="flex justify-between items-center text-[9px] text-neutral-400 font-mono pt-1.5 mt-1 border-t border-neutral-100">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> Submitted {e.timestamp}
                    </span>
                    <span className="font-bold">By: {e.vaccinatorName} ({e.employeeId})</span>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

      </div>

    </div>
  );
};
