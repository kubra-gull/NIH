/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useHub } from "../context/HubContext";
import {
  Users,
  ShieldCheck,
  UserCheck,
  Building,
  AlertCircle,
  Clock,
  Briefcase,
  Sliders,
  Sparkles
} from "lucide-react";

export const UserManagementView: React.FC = () => {
  const { users, approveUser, currentUser } = useHub();
  const [success, setSuccess] = useState("");

  const handleApprove = (userId: string, name: string) => {
    approveUser(userId);
    setSuccess(`Officially authorized and approved account of field worker ${name}.`);
    
    setTimeout(() => {
      setSuccess("");
    }, 4000);
  };

  // Roles Capabilities matrix for visual display
  const capabilities = [
    { role: "Administrator", read: "Yes", write: "Yes", approve: "Yes", sync: "Yes" },
    { role: "Medical Officer", read: "Yes", write: "Yes", approve: "Yes", sync: "No" },
    { role: "Vaccinator", read: "Yes", write: "Yes", approve: "No", sync: "No" },
    { role: "Lady Health Visitor", read: "Yes", write: "Yes", approve: "No", sync: "No" },
    { role: "Inventory Manager", read: "Yes", write: "Yes", approve: "No", sync: "No" },
    { role: "Data Entry Operator", read: "Yes", write: "Yes", approve: "No", sync: "No" }
  ];

  return (
    <div id="user-management-panel" className="space-y-6">
      
      {/* Header and Toast */}
      <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
            <Users className="w-4.5 h-4.5 text-[#005F73]" /> Immunization Hub Global Roster & User Management
          </h3>
          <p className="text-neutral-400 text-xs font-light">
            District Medical Workers authorizations directory and role approval gates.
          </p>
        </div>
        <span className="text-[10px] uppercase font-mono bg-[#00D4C7]/15 px-3 py-1 text-[#005F73] font-bold rounded-full">
          Superuser: Dr. Ayesha Alvi (Main Administrator)
        </span>
      </section>

      {success && (
        <p className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded text-xs font-semibold animate-pulse select-none">
          {success}
        </p>
      )}

      {/* Roster splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Worker Roster Grid */}
        <section className="bg-white p-5 rounded-xl border border-[#005F73]/15 lg:col-span-2 space-y-4">
          <h4 className="font-bold text-neutral-950 text-xs uppercase tracking-wider font-mono flex items-center gap-1 border-b border-neutral-100 pb-2">
            <Briefcase className="w-4 h-4 text-neutral-500" /> Active Health Workers Directory ({users.length} Workers)
          </h4>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {users.map((u) => (
              <div
                key={u.id}
                className={`p-4 rounded-xl border transition-all flex justify-between items-center ${
                  u.isApproved
                    ? "bg-neutral-50/50 border-neutral-200"
                    : "bg-amber-50/40 border-amber-200 animate-pulse"
                }`}
              >
                <div className="space-y-1.5 pr-2 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-800">{u.fullName}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-[#005F73]/10 text-[#005F73] font-mono whitespace-nowrap">
                      {u.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-mono">Employee ID: {u.employeeId} • User Code: {u.id}</p>
                  <p className="text-xs text-neutral-600 block"><strong className="text-neutral-700">Health Facility:</strong> {u.healthFacility}, {u.district}</p>
                  <p className="text-[10px] text-neutral-400 font-mono leading-none flex items-center gap-1 mt-1">
                    Contact: {u.phoneNumber} • {u.email}
                  </p>
                </div>

                {/* Approve Button action */}
                <div className="shrink-0 flex items-center">
                  {u.isApproved ? (
                    <span className="text-[10px] font-mono text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-150 flex items-center gap-0.5 whitespace-nowrap">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Verified Approved
                    </span>
                  ) : (
                    <button
                      id={`approve-user-btn-${u.id}`}
                      onClick={() => handleApprove(u.id, u.fullName)}
                      className="px-3 py-1.5 rounded bg-[#005F73] text-white font-bold hover:bg-[#00D4C7] hover:text-neutral-900 transition-all text-[10px] shadow-xs cursor-pointer inline-flex items-center gap-0.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Approve Account
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Roles capability matrix card */}
        <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <Sliders className="w-4 h-4 text-neutral-500" /> Operational Capabilities Matrix
          </h4>
          <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
            Role definitions and authorized medical access matching Expanded Programme routines and clinical safeguards.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="bg-neutral-50 text-neutral-400 font-mono text-[9px] uppercase border-b border-neutral-100 font-semibold">
                  <th className="p-1.5 col-span-2">Clinical Role</th>
                  <th className="p-1.5 text-center">Injections</th>
                  <th className="p-1.5 text-center">Inventory</th>
                  <th className="p-1.5 text-center">Sync DB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-150 text-neutral-600">
                {capabilities.map((c, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50">
                    <td className="p-1.5 font-bold text-[#005F73] truncate max-w-[100px]">{c.role}</td>
                    <td className="p-1.5 text-center font-mono">{c.write === "Yes" ? "🟢 Authorized" : "🔴 Blocked"}</td>
                    <td className="p-1.5 text-center font-mono">{c.approve === "Yes" ? "🟢 Authorized" : "🔴 Blocked"}</td>
                    <td className="p-1.5 text-center font-mono">{c.sync === "Yes" ? "🟢 Authorized" : "🔴 Blocked"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-neutral-50 rounded border border-neutral-100 text-[10px] text-neutral-400 font-mono leading-relaxed uppercase">
            *Only accounts verified as approved by an Administrator are certified to write clinical injections to the National Digital ledger schemas.
          </div>
        </section>

      </div>

    </div>
  );
};
