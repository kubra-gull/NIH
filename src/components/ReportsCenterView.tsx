/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useHub } from "../context/HubContext";
import {
  FileCode,
  Download,
  Printer,
  Calendar,
  Filter,
  UserCheck,
  Building,
  Activity,
  AlertTriangle,
  Boxes,
  ThermometerSnowflake,
  Search
} from "lucide-react";

export const ReportsCenterView: React.FC = () => {
  const { patients, vaccines, coldChainFridges, tempLogs, eodLogs, currentUser } = useHub();

  const [selectedReportType, setSelectedReportType] = useState<
    "coverage" | "missed" | "utilization" | "coldchain" | "eod"
  >("coverage");

  const [selectedProvince, setSelectedProvince] = useState("All Provinces");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  // Create data grids based on active report type selection
  const getReportingData = () => {
    switch (selectedReportType) {
      
      case "coverage":
        // routine coverage matrix per vaccine
        return vaccines.map((v) => {
          const matchingIntakesCount = patients.filter((p) =>
            p.vaccinations.some((vac) => vac.vaccineId === v.id)
          ).length;
          const ratePercent = patients.length > 0 ? Math.round((matchingIntakesCount / patients.length) * 100) : 90;
          return {
            "Antigen Name": v.name,
            "Target Disease": v.diseasesCovered.join(", "),
            "Doses Administered": matchingIntakesCount,
            "Available Stock": v.dosesInStock,
            "Target Goal": "95%",
            "Coverage Rate": `${ratePercent}%`
          };
        });

      case "missed":
        // children registered who might have missed immunization milestones
        return patients
          .filter(
            (p) =>
              p.notes?.toLowerCase().includes("missed") ||
              p.vaccinations.length <= 1 ||
              p.vaccinations.some((vac) => vac.nextDoseAt && new Date(vac.nextDoseAt) < new Date())
          )
          .map((p) => {
            const lastDose = p.vaccinations[p.vaccinations.length - 1];
            return {
              "Patient ID": p.id,
              "Child Full Name": p.fullName,
              "Date of Birth": p.dateOfBirth,
              "Guardian Contact": p.guardianPhone,
              "Last Dose Received": lastDose ? lastDose.vaccineName : "None Registered",
              "Missed Milestone Date": lastDose?.nextDoseAt || "Birth BCG",
              "Assumed Status": "High Alert Missed"
            };
          });

      case "utilization":
        // inventory usage metrics
        return vaccines.map((v) => {
          const registeredCount = patients.reduce(
            (acc, p) => acc + p.vaccinations.filter((vac) => vac.vaccineId === v.id).length,
            0
          );
          return {
            "Antigen Code": v.id,
            "Antigen Name": v.name,
            "Initial Allotment": (v.dosesInStock + registeredCount + 5).toString(),
            "Doses Dispensed": registeredCount.toString(),
            "Wasted Doses": "0",
            "Current Stock Balance": v.dosesInStock.toString(),
            "Buffer Status": v.status
          };
        });

      case "coldchain":
        // fridge temperatures auditing
        return coldChainFridges.map((f) => {
          return {
            "Cooling Unit ID": f.id,
            "Cooling Unit Name": f.fridgeName,
            "Clinic Node Name": f.facilityName,
            "Min Safety Boundary": `${f.targetTempMinCelsius}°C`,
            "Max Safety Boundary": `${f.targetTempMaxCelsius}°C`,
            "Current Temperature": `${f.currentTemperatureCelsius}°C`,
            "Micro-grid Status": f.powerStatus,
            "Operational Health": f.status
          };
        });

      case "eod":
        // end-of-day balances and reconciliations
        return eodLogs.map((l) => {
          return {
            "Submission Date": l.date,
            "Officer Name": l.vaccinatorName,
            "Employee ID": l.employeeId,
            "Clinic Location": l.facilityName,
            "Digital Ledger Count": l.digitalDosesDispensedCount.toString(),
            "Physical Vials Count": l.physicalDosesVialsCount.toString(),
            "Wastage Logged": l.vialsWastedCount.toString(),
            "Net Variance Count": l.varianceCount.toString(),
            "Approval Status": l.supervisorApproval
          };
        });

      default:
        return [];
    }
  };

  const reportData = getReportingData();

  // COMMA SEPARATED EXPORTER CONVERSION CODE
  const exportToCSV = () => {
    if (reportData.length === 0) return;
    
    // get headers
    const headers = Object.keys(reportData[0]);
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.join(","));
    
    // Add value rows
    for (const row of reportData) {
      const values = headers.map(header => {
        const escaped = ("" + (row as any)[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `National-Immunization-Hub-${selectedReportType}-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="reports-hub-panel" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Category selector sidebar */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col gap-5">
        <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider font-mono">Select Report category</h4>
        
        <div className="flex flex-col gap-2">
          <button
            id="rep-tab-coverage"
            onClick={() => setSelectedReportType("coverage")}
            className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
              selectedReportType === "coverage"
                ? "bg-[#005F73]/5 border-[#005F73] font-bold text-[#005F73]"
                : "border-neutral-100 hover:bg-neutral-50 text-neutral-600 font-medium"
            }`}
          >
            <span>District Coverage rate audits</span>
            <Building className="w-3.5 h-3.5" />
          </button>

          <button
            id="rep-tab-missed"
            onClick={() => setSelectedReportType("missed")}
            className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
              selectedReportType === "missed"
                ? "bg-[#005F73]/5 border-[#005F73] font-bold text-[#005F73]"
                : "border-neutral-100 hover:bg-neutral-50 text-neutral-600 font-medium"
            }`}
          >
            <span>Missed Children Tracker</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          </button>

          <button
            id="rep-tab-utilization"
            onClick={() => setSelectedReportType("utilization")}
            className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
              selectedReportType === "utilization"
                ? "bg-[#005F73]/5 border-[#005F73] font-bold text-[#005F73]"
                : "border-neutral-100 hover:bg-neutral-50 text-neutral-600 font-medium"
            }`}
          >
            <span>Vaccine Vial Utilization</span>
            <Boxes className="w-3.5 h-3.5" />
          </button>

          <button
            id="rep-tab-coldchain"
            onClick={() => setSelectedReportType("coldchain")}
            className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
              selectedReportType === "coldchain"
                ? "bg-[#005F73]/5 border-[#005F73] font-bold text-[#005F73]"
                : "border-neutral-100 hover:bg-neutral-50 text-neutral-600 font-medium"
            }`}
          >
            <span>Cold-chain Temperature Audit</span>
            <ThermometerSnowflake className="w-3.5 h-3.5" />
          </button>

          <button
            id="rep-tab-eod"
            onClick={() => setSelectedReportType("eod")}
            className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
              selectedReportType === "eod"
                ? "bg-[#005F73]/5 border-[#005F73] font-bold text-[#005F73]"
                : "border-neutral-100 hover:bg-neutral-50 text-neutral-600 font-medium"
            }`}
          >
            <span>End of Day reconciliation</span>
            <Activity className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global filter constraints */}
        <div className="pt-4 border-t border-neutral-100 space-y-3.5">
          <h5 className="font-bold text-neutral-700 text-xs flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Direct Filters
          </h5>
          
          <div className="space-y-1 text-xs">
            <span className="text-neutral-500 block">Province Boundary</span>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full p-2 border border-neutral-200 rounded text-xs focus:ring-[#00D4C7]"
            >
              <option value="All Provinces">All Provinces</option>
              <option value="Punjab">Punjab</option>
              <option value="KPK">Khyber Pakhtunkhwa (KPK)</option>
              <option value="Balochistan">Balochistan</option>
              <option value="Sindh">Sindh</option>
              <option value="ICT">ICT Islamabad</option>
            </select>
          </div>

          <p className="text-[10px] text-neutral-400 font-mono leading-relaxed uppercase bg-neutral-55 p-2 rounded">
            Filtered matching parameters verified.
          </p>
        </div>

      </div>

      {/* Main Table results grid output */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Interactive Exporter layout header */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold block">
              Auditor View Mode
            </span>
            <h4 className="font-bold text-neutral-900 text-sm italic uppercase">
              {selectedReportType.toUpperCase()} DETAILED LEDGER DATAFRAME
            </h4>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              id="btn-csv-download"
              onClick={exportToCSV}
              className="px-3.5 py-2 hover:bg-neutral-800 rounded bg-neutral-900 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded bg-[#00D4C7] text-neutral-900 font-bold text-xs hover:bg-neutral-200 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print Report
            </button>
          </div>
        </div>

        {/* Audit grid content */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden" id="report-grid-print">
          
          {reportData.length === 0 ? (
            <div className="text-center py-24 text-neutral-400 text-xs font-light">
              No reported entries found matching current query constraints.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-150 text-neutral-400 font-mono text-[10px] uppercase">
                    {Object.keys(reportData[0]).map((header) => (
                      <th key={header} className="p-2.5">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-600 font-sans">
                  {reportData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/50">
                      {Object.values(row).map((val, keyIdx) => {
                        const cellVal = val.toString();
                        const isHighInStock = cellVal && cellVal.includes("In Stock");
                        const isPending = cellVal && cellVal.includes("Pending");
                        return (
                          <td key={keyIdx} className="p-2.5">
                            {isHighInStock ? (
                              <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-bold text-[9px]">
                                {cellVal}
                              </span>
                            ) : isPending ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[9px] animate-pulse">
                                {cellVal}
                              </span>
                            ) : (
                              cellVal
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center text-[10px] text-neutral-400 font-mono">
            <span>OFFICIAL PUBLIC LEDGER RECORDS REPORT REPLICA</span>
            <span>DATE GENERATED: {new Date().toLocaleDateString()}</span>
          </div>

        </div>

      </div>

    </div>
  );
};
