/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useHub } from "../context/HubContext";
import {
  FileCode,
  ShieldCheck,
  Search,
  CheckCircle,
  Activity,
  User,
  Clock,
  ExternalLink
} from "lucide-react";

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useHub();

  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["ALL", "AUTH", "REGISTRATION", "VACCINATION", "INVENTORY", "COLDCHAIN", "REPORTS", "USER_MGMT", "SETTINGS"];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesCat = activeCategory === "ALL" || log.category === activeCategory;
    const matchesQuery = searchQuery === "" ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div id="audit-trail-panel" className="bg-white p-6 rounded-xl border border-neutral-250 shadow-sm space-y-5">
      
      {/* Header telemetry and search */}
      <section className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-100 pb-4">
        <div className="space-y-1">
          <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-[#005F73]" /> Immunization Hub Immutable Security Audit Trails
          </h3>
          <p className="text-neutral-400 text-xs font-light">
            Immutable chronological logging matching compliance audits for ministries of national health programs.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search action logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-4 py-1.5 border border-neutral-200 rounded text-xs focus:ring-[#00D4C7] bg-neutral-50"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
        </div>
      </section>

      {/* Category selector capsules */}
      <div className="flex flex-wrap gap-1.5 pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3 py-1 rounded text-[10px] uppercase font-mono border font-bold cursor-pointer hover:border-[#00D4C7] transition-all ${
              activeCategory === c
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-500 border-neutral-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Audit ledger table */}
      <div className="overflow-x-auto max-h-[480px]">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-150 text-neutral-400 font-mono text-[9px] uppercase">
              <th className="p-3">Logged Date</th>
              <th className="p-3">Ref ID</th>
              <th className="p-3">Scope Sector</th>
              <th className="p-3">Security Action</th>
              <th className="p-3">Clinical Action Details</th>
              <th className="p-3">Verifying Officer (ID)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-150 text-neutral-600 font-sans">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-neutral-400 text-xs">
                  No matching audit entries recorded.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const isCriticalCat = log.category === "COLDCHAIN" || log.category === "SETTINGS";
                return (
                  <tr key={log.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-mono text-neutral-400">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-mono text-[10px] text-neutral-400">{log.id}</td>
                    <td className="p-3 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-widest font-mono ${
                        isCriticalCat ? "bg-amber-50 text-amber-700 animate-pulse border border-amber-200" :
                        log.category === "VACCINATION" ? "bg-emerald-50 text-emerald-700 border border-emerald-150" :
                        "bg-neutral-100 text-neutral-600"
                      }`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-neutral-800">{log.action}</td>
                    <td className="p-3 font-light text-neutral-500 truncate max-w-sm whitespace-normal leading-relaxed">{log.details}</td>
                    <td className="p-3 font-sans">
                      <p className="font-bold text-neutral-700 leading-none">{log.performedBy}</p>
                      <span className="text-[9px] font-mono text-neutral-400 font-light">{log.employeeId}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 border border-neutral-100 bg-neutral-50 text-neutral-400 rounded text-[9px] font-mono flex items-center justify-between">
        <span>ISO 27001 CLOUD SECURITY LOG - IMMUTABLE COMPLIANCE</span>
        <button className="text-[#005F73] hover:underline flex items-center gap-0.5 font-bold cursor-pointer">
          Verify Blockchain Hash Registry <ExternalLink className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
