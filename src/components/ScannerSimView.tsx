/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useHub } from "../context/HubContext";
import {
  Scan,
  Sparkles,
  Search,
  CheckCircle,
  FileCheck,
  AlertCircle,
  Barcode,
  ArrowRight,
  QrCode
} from "lucide-react";

export const ScannerSimView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { patients, vaccines, addAuditLog } = useHub();

  const [inputVal, setInputVal] = useState("");
  const [scannedResult, setScannedResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const simulateScan = (code: string) => {
    setIsScanning(true);
    setScannedResult(null);
    setErrorMsg("");

    setTimeout(() => {
      setIsScanning(false);
      parseScannedCode(code);
    }, 1200); // 1.2 second scanning delay
  };

  const parseScannedCode = (code: string) => {
    const uppercaseCode = code.trim().toUpperCase();
    
    // 1. Try Patient ID lookup (e.g. NIH-2026-0120)
    const foundPatient = patients.find(p => p.id.toUpperCase() === uppercaseCode);
    if (foundPatient) {
      setScannedResult({
        type: "PATIENT",
        title: "Digital Vaccination Passport Card Scanned",
        details: foundPatient,
        id: foundPatient.id,
        label: foundPatient.fullName,
        info: `Guardian: ${foundPatient.guardianName} • Phone: ${foundPatient.guardianPhone}`
      });
      addAuditLog("REGISTRATION", "Barcode Scan Verification", `Successfully read and parsed QR codes for Patient ID: ${foundPatient.id}`);
      return;
    }

    // 2. Try Vaccine Batch lookup (e.g. OPV-26M01)
    const foundVaccine = vaccines.find(
      v => v.batchNumber.toUpperCase() === uppercaseCode || v.id.toUpperCase() === uppercaseCode
    );
    if (foundVaccine) {
      setScannedResult({
        type: "VACCINE",
        title: "Vaccine Vial Manufacturer Code Verified",
        details: foundVaccine,
        id: foundVaccine.id,
        label: foundVaccine.name,
        info: `Batch: ${foundVaccine.batchNumber} • Expiry: ${foundVaccine.expiryDate} • Safe Temp Range: ${foundVaccine.temperatureMinCelsius}°C to ${foundVaccine.temperatureMaxCelsius}°C`
      });
      addAuditLog("INVENTORY", "Vial QR Barcode Scanned", `Parsed biological barcode batch verification for ${foundVaccine.name} (Batch: ${foundVaccine.batchNumber})`);
      return;
    }

    // 3. Fallback Parse error
    setErrorMsg("No matching target found in regional database registry. Code unknown.");
    addAuditLog("AUTH", "Failed Barcode Stream Parse", `Anomalous scan string scanned: "${code}"`);
  };

  return (
    <div id="simulated-scanner-component" className="space-y-6">
      
      {/* Visual Header */}
      <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
            <Scan className="text-[#005F73] w-4.5 h-4.5" /> High-Resolution Barcode & QR Code Scanner
          </h3>
          <p className="text-neutral-400 text-xs font-light">
            EPI-compliant laser matrix parser. Auto-scans physical vaccine vials batch and digital Patient vaccination booklets.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-[#00D4C7]/10 text-[#005F73] px-3 py-1.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Camera HUD Active
        </span>
      </section>

      {/* Grid layouts: Sweep feed vs. Quick testers */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Visual Cam Feed Mock */}
        <section className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 lg:col-span-3 flex flex-col items-center justify-center text-center relative overflow-hidden h-96">
          
          {/* Laser crt sweep sweep */}
          {isScanning && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#00D4C7]/80 shadow-[0_0_12px_#00D4C7] animate-[sweep_2.4s_infinite_linear]" />
          )}

          {/* Camera reticle brackets */}
          <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-[#00D4C7]/60" />
          <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-[#00D4C7]/60" />
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-[#00D4C7]/60" />
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-[#00D4C7]/60" />

          {/* Center scan zone */}
          <div className="w-48 h-48 rounded border border-white/10 flex flex-col items-center justify-center bg-white/5 backdrop-blur-xs text-center space-y-3 relative">
            <Scan className={`w-12 h-12 text-white/40 ${isScanning ? "animate-pulse" : ""}`} />
            <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-400">Position barcode here</span>
          </div>

          <div className="pt-6 relative z-10 space-y-1">
            <span className="text-xs text-neutral-300 font-mono">Simulating Optical Stream feed</span>
            <p className="text-[10px] text-neutral-500 font-mono">STATUS: {isScanning ? "PARSING LASER TRACK..." : "WAITING FOR BEAM INPUT"}</p>
          </div>

        </section>

        {/* Quick Simulator Controller buttons */}
        <div className="lg:col-span-2 space-y-6">
          
          <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-3">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-neutral-100 pb-2">
              <Sparkles className="w-4 h-4 text-[#005F73]" /> Demo Batch Quick Trigger Simulation
            </h4>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Click any quick trigger option to simulate scanning a physical immunization card or manufacturer vaccine vial.
            </p>

            <div className="space-y-2">
              <button
                id="scan-patient-zainab"
                onClick={() => simulateScan("NIH-2026-0120")}
                className="w-full p-3 border border-neutral-200 rounded-lg hover:bg-[#00D4C7]/10 hover:border-[#00D4C7] text-left transition-all text-xs flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-bold text-neutral-800 block">Scan Patient ID: NIH-2026-0120</span>
                  <span className="text-[10px] text-neutral-400 font-mono">Zainab Fatima (Digital Booklet Passport QR)</span>
                </div>
                <QrCode className="w-4 h-4 text-neutral-400 shrink-0" />
              </button>

              <button
                id="scan-patient-bilal"
                onClick={() => simulateScan("NIH-2026-0545")}
                className="w-full p-3 border border-neutral-200 rounded-lg hover:bg-[#00D4C7]/10 hover:border-[#00D4C7] text-left transition-all text-xs flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-bold text-neutral-800 block">Scan Patient ID: NIH-2026-0545</span>
                  <span className="text-[10px] text-neutral-400 font-mono">Bilal Ahmad (Newborn register tag)</span>
                </div>
                <QrCode className="w-4 h-4 text-neutral-400 shrink-0" />
              </button>

              <button
                id="scan-batch-opv"
                onClick={() => simulateScan("OPV-26M01")}
                className="w-full p-3 border border-neutral-200 rounded-lg hover:bg-neutral-800/5 hover:border-neutral-500 text-left transition-all text-xs flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-bold text-neutral-800 block">Scan Batch: OPV-26M01</span>
                  <span className="text-[10px] text-neutral-400 font-mono">Oral Polio Vaccine (Vial barcode ledger)</span>
                </div>
                <Barcode className="w-4 h-4 text-neutral-400 shrink-0" />
              </button>

              <button
                id="scan-batch-penta"
                onClick={() => simulateScan("PEN-99882")}
                className="w-full p-3 border border-neutral-200 rounded-lg hover:bg-neutral-800/5 hover:border-neutral-500 text-left transition-all text-xs flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-bold text-neutral-800 block">Scan Batch: PEN-99882</span>
                  <span className="text-[10px] text-neutral-400 font-mono">Pentavalent GlaxoSmithKline Batch (Vial barcode)</span>
                </div>
                <Barcode className="w-4 h-4 text-neutral-400 shrink-0" />
              </button>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <span className="text-[10px] text-neutral-400 block pb-1">Or type manual barcode sequence String:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. NIH-2026-0120"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="w-full p-2 border border-neutral-200 rounded text-xs focus:ring-[#00D4C7] bg-neutral-50"
                />
                <button
                  onClick={() => simulateScan(inputVal)}
                  className="px-3.5 py-2 bg-neutral-950 text-white rounded font-bold hover:bg-neutral-800 flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Search className="w-3.5 h-3.5" /> Verify
                </button>
              </div>
            </div>
          </section>

        </div>

      </div>

      {/* Output results card */}
      {scannedResult && (
        <section className="bg-white p-6 rounded-xl border border-emerald-200 shadow-md animate-fade-in space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 text-sm">{scannedResult.title}</h4>
              <p className="text-neutral-400 text-xs font-mono">Code verified successfully</p>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-lg space-y-1.5 text-xs">
            <p className="font-bold text-neutral-800 text-sm">{scannedResult.label}</p>
            <p className="font-mono text-[11px] text-neutral-400 uppercase">SYS UID: {scannedResult.id}</p>
            <p className="text-neutral-600 leading-relaxed font-light">{scannedResult.info}</p>
          </div>

          <div className="flex justify-end pt-2">
            {scannedResult.type === "PATIENT" ? (
              <button
                onClick={() => onNavigate("patient-registration")}
                className="px-4 py-2 bg-[#005F73] hover:bg-[#00D4C7] hover:text-neutral-900 text-white font-bold text-xs rounded transition-all cursor-pointer flex items-center gap-1"
              >
                Inspect Child Medical Folder <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate("inventory-management")}
                className="px-4 py-2 bg-[#005F73] hover:bg-[#00D4C7] hover:text-neutral-900 text-white font-bold text-xs rounded transition-all cursor-pointer flex items-center gap-1"
              >
                Inspect Stocks Ledger <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>
      )}

      {errorMsg && (
        <section className="bg-white p-5 rounded-xl border border-red-250 shadow-sm animate-fade-in flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-650 shrink-0" />
          <div className="text-xs">
            <h5 className="font-bold text-red-950">Barcode laser scan error</h5>
            <p className="text-red-700 font-light mt-0.5">{errorMsg}</p>
          </div>
        </section>
      )}

    </div>
  );
};
