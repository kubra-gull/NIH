/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useHub } from "../context/HubContext";
import {
  Bell,
  Send,
  Sparkles,
  PhoneCall,
  Mail,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  History
} from "lucide-react";

export const NotificationsView: React.FC = () => {
  const { notifications, triggerNotification } = useHub();

  const [recipient, setRecipient] = useState("");
  const [notiType, setNotiType] = useState<"sms" | "system" | "email">("sms");
  const [notiCategory, setNotiCategory] = useState<"reminder" | "warning" | "alert">("reminder");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !title || !message) {
      alert("Please fill in recipient, title, and alert body message.");
      return;
    }

    triggerNotification(notiType, notiCategory, recipient, title, message);
    setSuccess(`Notification dispatched successfully as ${notiType.toUpperCase()} message.`);
    
    // Clear forms
    setRecipient("");
    setTitle("");
    setMessage("");

    setTimeout(() => setSuccess(""), 4000);
  };

  const getAlertIcon = (cat: string) => {
    switch (cat) {
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div id="notifications-panel-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Dispatch Gateways */}
      <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm lg:col-span-1 space-y-4">
        <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5 border-b border-neutral-100 pb-2">
          <Bell className="w-4 h-4 text-[#005F73]" /> SMS & Alert Dispatcher
        </h3>
        <p className="text-neutral-400 text-xs font-light leading-relaxed">
          Simulate broadcasting routine vaccination reminders or urgent inventory notices to health districts.
        </p>

        {success && (
          <p className="p-2 bg-emerald-50 text-emerald-850 border border-emerald-100 rounded text-[11px] font-medium leading-relaxed">
            {success}
          </p>
        )}

        <form onSubmit={handleSendNotification} className="space-y-3 text-xs font-sans">
          
          <div className="space-y-1">
            <label className="font-bold text-neutral-700">Dispatch Media Type *</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: "sms", icon: <Smartphone className="w-3.5 h-3.5" />, label: "SMS" },
                { type: "email", icon: <Mail className="w-3.5 h-3.5" />, label: "Email" },
                { type: "system", icon: <Bell className="w-3.5 h-3.5" />, label: "System" }
              ].map(m => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setNotiType(m.type as any)}
                  className={`p-2 rounded border font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    notiType === m.type
                      ? "bg-[#00D4C7]/20 border-[#005F73] text-[#005F73]"
                      : "bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-500"
                  }`}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-neutral-700">Recipient ID or Contact *</label>
            <input
              type="text"
              required
              placeholder={notiType === "sms" ? "e.g. +92 300 1234567" : notiType === "email" ? "e.g. supervisor@gov.pk" : "Clinic Node ID"}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2 border border-neutral-200 rounded text-xs focus:ring-[#00D4C7] bg-neutral-50"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-neutral-700">Notification Category *</label>
            <select
              value={notiCategory}
              onChange={(e) => setNotiCategory(e.target.value as any)}
              className="w-full p-2 border border-neutral-200 rounded text-xs"
            >
              <option value="reminder">Routine Appointment Reminder</option>
              <option value="warning">System Security Warning</option>
              <option value="alert">Critical Urgent Alert</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-neutral-700">Message Title Header *</label>
            <input
              type="text"
              required
              placeholder="e.g. Routine Polio Schedule"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-[#00D4C7]/20 rounded text-xs bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-neutral-700">Message Box Body *</label>
            <textarea
              required
              rows={4}
              placeholder="Enter text contents..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-neutral-200 rounded text-xs bg-neutral-50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#005F73] hover:bg-[#00D4C7] hover:text-neutral-900 text-white font-bold rounded shadow transition-all cursor-pointer flex items-center justify-center gap-1 text-xs"
          >
            <Send className="w-3.5 h-3.5" /> Broadcast Gateway Alert
          </button>

        </form>
      </section>

      {/* Right Column: Broadcast logs */}
      <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm lg:col-span-2 space-y-4">
        <h3 className="font-bold text-neutral-950 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-neutral-100 pb-2">
          <History className="w-4 h-4" /> Gateway Transmission Ledger ({notifications.length} Logs)
        </h3>

        <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1 select-none">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-3 bg-neutral-50 border border-neutral-150 rounded-lg flex items-start gap-3 transition-all"
            >
              <div className="pt-0.5">
                {getAlertIcon(n.category)}
              </div>
              <div className="space-y-1 truncate flex-1">
                <div className="flex justify-between items-start">
                  <h5 className="font-bold text-xs text-neutral-800 truncate pr-2">{n.title}</h5>
                  <span className="text-[8px] font-mono uppercase bg-[#005F73]/10 text-[#005F73] px-1.5 py-0.5 rounded shrink-0">
                    {n.type}
                  </span>
                </div>
                <p className="text-neutral-400 text-[9px] font-mono leading-none">To: {n.recipient}</p>
                <p className="text-neutral-600 text-[11px] leading-relaxed font-sans pt-1.5 whitespace-normal">
                  {n.message}
                </p>
                <div className="flex justify-between text-[8px] text-neutral-400 font-mono pt-2 border-t border-neutral-100 mt-2">
                  <span>DISPATCH: DELIVERED SUCCESFULLY</span>
                  <span>{new Date(n.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
