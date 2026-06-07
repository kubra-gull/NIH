/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { useHub } from "../context/HubContext";
import {
  Syringe,
  User,
  ShieldAlert,
  CalendarDays,
  FileCheck2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Signature
} from "lucide-react";

export const VaccinationCenterView: React.FC = () => {
  const { patients, vaccines, administerVaccine, currentUser } = useHub();

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedVaccineId, setSelectedVaccineId] = useState("");
  const [doseNumber, setDoseNumber] = useState(1);
  const [nextDoseWeeks, setNextDoseWeeks] = useState(4); // default +4 weeks
  
  const [adverseEventReported, setAdverseEventReported] = useState(false);
  const [adverseEventNotes, setAdverseEventNotes] = useState("");
  const [digitalSignatureType, setDigitalSignatureType] = useState<"draw" | "stamp">("stamp");
  const [stampName, setStampName] = useState(currentUser?.fullName || "AUTHORIZED VACCINATOR");
  
  const [successMsg, setSuccessMsg] = useState("");
  
  // Drawing Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Auto calculate dose recommendation
  const activePatient = patients.find((p) => p.id === selectedPatientId);
  const activeVaccine = vaccines.find((v) => v.id === selectedVaccineId);

  // Auto-calculated fields when vaccine or patient changes
  useEffect(() => {
    if (activePatient && activeVaccine) {
      // Find historical doses for this patient of this specific vaccine
      const historicalDosesCount = activePatient.vaccinations.filter(
        (v) => v.vaccineId === selectedVaccineId
      ).length;
      setDoseNumber(historicalDosesCount + 1);

      // Auto-set recommended next dose delay (e.g. OPV is 4-6 weeks, Measles is 26 weeks, BCG is null)
      if (activeVaccine.name.includes("BCG")) {
        setNextDoseWeeks(0); // single dose
      } else if (activeVaccine.name.includes("Polio") || activeVaccine.name.includes("Pentavalent")) {
        setNextDoseWeeks(4);
      } else if (activeVaccine.name.includes("Measles") || activeVaccine.name.includes("MR")) {
        setNextDoseWeeks(26); // second dose is months later
      } else {
        setNextDoseWeeks(4);
      }
    }
  }, [selectedPatientId, selectedVaccineId, activePatient, activeVaccine]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#005F73";
    ctx.lineCap = "round";
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setHasSigned(true);
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedVaccineId) {
      alert("Please select a valid children patient file and immunizing biological.");
      return;
    }

    if (activeVaccine && activeVaccine.dosesInStock <= 0) {
      alert("Cannot administer. This vaccine formulation is depleted out of stock.");
      return;
    }

    const nextDoseDateStr = nextDoseWeeks > 0
      ? new Date(Date.now() + nextDoseWeeks * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      : null;

    // Signature data representation
    const sigValue = digitalSignatureType === "stamp"
      ? `[STAMP APPROVED: ${stampName} | EMPID: ${currentUser?.employeeId || "VAC-ADMIN"}]`
      : "[DIGITAL VECTOR AUTOGRAPH PATHWAYS RECORDED]";

    administerVaccine({
      patientId: selectedPatientId,
      patientName: activePatient?.fullName || "N/A",
      vaccineId: selectedVaccineId,
      vaccineName: activeVaccine?.name || "N/A",
      doseNumber,
      batchNumber: activeVaccine?.batchNumber || "UNBATCHED",
      facilityName: currentUser?.healthFacility || "National Institute of Health Clinic",
      nextDoseAt: nextDoseDateStr,
      digitalSignature: sigValue,
      adverseEventReported,
      adverseEventNotes: adverseEventReported ? adverseEventNotes : undefined
    });

    setSuccessMsg(`Vaccine dose recorded successfully! Next routine appointment calculated for ${nextDoseDateStr || "N/A"}.`);
    
    // Clear Admin Status
    setSelectedPatientId("");
    setSelectedVaccineId("");
    setAdverseEventReported(false);
    setAdverseEventNotes("");
    clearCanvas();

    setTimeout(() => {
      setSuccessMsg("");
    }, 5000);
  };

  return (
    <div id="vaccination-center-panel" className="space-y-6">
      
      {/* Dynamic Success Toast */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3 shadow-sm select-none">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-emerald-900">EPI Immunization Record Saved</p>
            <p className="text-emerald-700 font-light mt-0.5">{successMsg}</p>
          </div>
        </div>
      )}

      {/* Main Core View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Step-by-Step Administration Desk */}
        <section className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm lg:col-span-3 space-y-5">
          <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <Syringe className="w-4 h-4 text-[#005F73] bg-[#00D4C7]/20 p-0.5 rounded" /> Enterprise Vaccinators Console
          </h3>

          <form id="vax-administration-form" onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            
            {/* Child Selection */}
            <div className="space-y-1">
              <label className="font-bold text-neutral-700 block">Select Target Patient Child Record *</label>
              <select
                id="vax-select-patient"
                required
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full p-2.5 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00D4C7]"
              >
                <option value="">-- Choose child name or ID --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} (EPI ID: {p.id}) • DoB: {p.dateOfBirth}
                  </option>
                ))}
              </select>
            </div>

            {/* Vaccine Selection */}
            <div className="space-y-1">
              <label className="font-bold text-neutral-700 block">Select Immunizing Agent / Antigen Vial *</label>
              <select
                id="vax-select-vaccine"
                required
                value={selectedVaccineId}
                onChange={(e) => setSelectedVaccineId(e.target.value)}
                className="w-full p-2.5 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00D4C7]"
              >
                <option value="">-- Select stocked vaccine formulation --</option>
                {vaccines.map((v) => (
                  <option key={v.id} value={v.id} disabled={v.dosesInStock <= 0}>
                    {v.name} • Batch: {v.batchNumber} ({v.dosesInStock} doses remaining) {v.dosesInStock <= 0 ? "[OUT OF STOCK]" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto calculations display */}
            {activePatient && activeVaccine && (
              <div className="p-4 bg-neutral-50 rounded-lg space-y-2 border border-neutral-150">
                <p className="font-bold text-[#005F73] text-xs flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <FileCheck2 className="w-3.5 h-3.5" /> EPI Assessment Output
                </p>
                <div className="grid grid-cols-2 gap-4 text-[11px] font-mono mt-2">
                  <div>
                    <span className="text-neutral-400">Target Child</span>
                    <p className="font-bold text-neutral-800">{activePatient.fullName}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Assessed Dose Count</span>
                    <p className="font-bold text-neutral-800">Dose #{doseNumber}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Manufacturer Batch</span>
                    <p className="font-bold text-neutral-800">{activeVaccine.batchNumber}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Ecular route / Dosage</span>
                    <p className="font-semibold text-neutral-800">{activeVaccine.dosageMl} mL • {activeVaccine.route}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200">
                  <span className="text-neutral-400 block pb-1">Recommended Appointment Delay</span>
                  <div className="flex gap-2">
                    {[0, 4, 6, 12, 26].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setNextDoseWeeks(w)}
                        className={`px-3 py-1 rounded text-[10px] font-semibold border ${
                          nextDoseWeeks === w
                            ? "bg-[#00D4C7] text-neutral-900 border-[#00D4C7]"
                            : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                        }`}
                      >
                        {w === 0 ? "Complete" : `+${w} Weeks`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Adverse Event gateway */}
            <div className="p-4 bg-red-50/50 rounded-lg border border-red-100 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="vax-adverse-event-chk"
                  type="checkbox"
                  checked={adverseEventReported}
                  onChange={(e) => setAdverseEventReported(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="vax-adverse-event-chk" className="font-bold text-red-900 flex items-center gap-1 cursor-pointer">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Report AEFI (Adverse Event Following Immunization)
                </label>
              </div>
              
              {adverseEventReported && (
                <div className="space-y-1">
                  <span className="text-[10px] text-red-700">Enter physical details of symptom reaction:</span>
                  <textarea
                    id="vax-adverse-event-notes"
                    placeholder="Mild post-injection fever, severe localized swelling, allergic congestion..."
                    rows={2}
                    value={adverseEventNotes}
                    onChange={(e) => setAdverseEventNotes(e.target.value)}
                    className="w-full p-2 border border-red-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 text-xs text-neutral-700 bg-white"
                  />
                </div>
              )}
            </div>

            {/* Digital Signature section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-bold text-neutral-700 block text-xs">Vaccinating Officer Verification Signoff *</label>
                <div className="flex bg-neutral-100 p-0.5 rounded border border-neutral-200 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setDigitalSignatureType("stamp")}
                    className={`px-2 py-0.5 rounded ${digitalSignatureType === "stamp" ? "bg-white text-[#005F73] font-bold shadow-xs" : "text-neutral-500"}`}
                  >
                    Stamp Badge
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDigitalSignatureType("draw");
                      // Delay clearing and centering drawing context
                      setTimeout(() => clearCanvas(), 50);
                    }}
                    className={`px-2 py-0.5 rounded ${digitalSignatureType === "draw" ? "bg-white text-[#005F73] font-bold shadow-xs" : "text-neutral-500"}`}
                  >
                    Draw Signature
                  </button>
                </div>
              </div>

              {digitalSignatureType === "stamp" ? (
                <div className="p-3 bg-neutral-50 border border-dashed border-neutral-200 rounded-lg space-y-2">
                  <input
                    id="vax-stamp-name"
                    type="text"
                    value={stampName}
                    onChange={(e) => setStampName(e.target.value)}
                    className="w-full p-1.5 border border-neutral-200 rounded text-xs bg-white focus:outline-none"
                    placeholder="Enter Vaccinator official name"
                  />
                  <div className="p-2 border border-[#005F73]/20 bg-[#00D4C7]/5 rounded text-center">
                    <span className="text-[9px] font-mono uppercase text-[#005F73] block font-semibold">Authorized Stamp Stamp</span>
                    <p className="text-xs font-bold text-neutral-800 mt-1 uppercase italic font-serif">Verified: {stampName}</p>
                    <p className="text-[8px] font-mono text-neutral-400 uppercase mt-0.5">EPI REGISTRY NO: {currentUser?.employeeId || "VAC-ONLINE"}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 text-center">
                  <div className="border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 relative h-28">
                    <canvas
                      ref={canvasRef}
                      width={380}
                      height={112}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseUp}
                      className="w-full h-full cursor-crosshair block touch-none"
                    />
                    {!hasSigned && (
                      <span className="text-[10px] text-neutral-400 select-none absolute inset-0 flex items-center justify-center pointer-events-none">
                        Use mouse/touchpad to sign here
                      </span>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-[10px] font-mono text-neutral-500 hover:text-red-600 font-semibold cursor-pointer"
                    >
                      Clear Autograph Pads
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Administer Trigger Button */}
            <button
              id="vax-submit-dose"
              type="submit"
              className="w-full py-2.5 rounded bg-[#005F73] text-white hover:bg-[#00D4C7] hover:text-neutral-900 font-semibold transition-all shadow cursor-pointer text-xs"
            >
              Sign & Save Vaccination Ledger Entry
            </button>

          </form>
        </section>

        {/* Right Panel: Patient history and details indicator */}
        <section className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
            <h4 className="font-bold text-neutral-950 text-xs uppercase tracking-wider font-mono flex items-center gap-1 border-b border-neutral-100 pb-2">
              <User className="w-3.5 h-3.5" /> Immunization Timetable Index
            </h4>
            <p className="text-neutral-400 text-xs">Guidelines according to EPI child routines in weeks of age.</p>
            <div className="space-y-2.5 text-xs font-light">
              <div className="flex justify-between items-center p-2 bg-[#00D4C7]/5 border border-[#00D4C7]/20 rounded">
                <span className="font-bold text-neutral-800">Birth Cohort</span>
                <span className="font-semibold text-[#005F73]">BCG, OPV-0</span>
              </div>
              <div className="flex justify-between items-center p-2 border border-neutral-100 hover:bg-neutral-50 rounded">
                <span className="font-medium text-neutral-800">6 Weeks of Age</span>
                <span className="font-mono text-neutral-500">Penta-1, OPV-1, PCV-1, Rota-1</span>
              </div>
              <div className="flex justify-between items-center p-2 border border-neutral-100 hover:bg-neutral-50 rounded">
                <span className="font-medium text-neutral-800">10 Weeks of Age</span>
                <span className="font-mono text-neutral-500">Penta-2, OPV-2, PCV-2, Rota-2</span>
              </div>
              <div className="flex justify-between items-center p-2 border border-neutral-100 hover:bg-neutral-50 rounded">
                <span className="font-medium text-neutral-800">14 Weeks of Age</span>
                <span className="font-mono text-neutral-500">Penta-3, OPV-3, PCV-3, IPV-1</span>
              </div>
              <div className="flex justify-between items-center p-2 border border-neutral-110 hover:bg-neutral-50 rounded">
                <span className="font-medium text-neutral-800">9 Months</span>
                <span className="font-mono text-neutral-500">Measles-1, Typhoid (TCV)</span>
              </div>
              <div className="flex justify-between items-center p-2 border border-neutral-110 hover:bg-neutral-50 rounded">
                <span className="font-medium text-neutral-800">15 Months</span>
                <span className="font-mono text-neutral-500">Measles-2 Booster</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-3 font-sans text-xs">
            <h4 className="font-bold text-neutral-900 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Safe Injection Mandates (WHO)
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-neutral-500 font-light">
              <li>Always check patient vaccine safety allergies history before needle intrusion.</li>
              <li>Always verify physical batch numbers with the digital scanner database.</li>
              <li>A completely fresh auto-disable (AD) syringe MUST be deployed for every single child dose injection.</li>
              <li>Safely discard used syringes in designated lock containers immediately.</li>
            </ul>
          </div>

        </section>

      </div>

    </div>
  );
};
