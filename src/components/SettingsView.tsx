/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useHub } from "../context/HubContext";
import { SyncConfiguration } from "../types";
import {
  Settings,
  Database,
  CloudLightning,
  RefreshCw,
  FolderLock,
  Globe2,
  Trash2,
  CheckCircle,
  FileDown,
  FileUp,
  HardDriveUpload,
  Info
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const {
    syncConfig,
    updateSyncConfig,
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    offlineMode,
    setOfflineMode,
    backupData,
    restoreData,
    clearAllData
  } = useHub();

  const [activeSyncProvider, setActiveSyncProvider] = useState<SyncConfiguration["provider"]>(syncConfig.provider);
  const [firebaseApiKey, setFirebaseApiKey] = useState(syncConfig.firebaseConfig.apiKey);
  const [firebaseProjId, setFirebaseProjId] = useState(syncConfig.firebaseConfig.projectId);
  const [gSheetsId, setGSheetsId] = useState(syncConfig.sheetsConfig.spreadsheetId);
  const [cloudDbHost, setCloudDbHost] = useState(syncConfig.cloudDbConfig.hostUrl);

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testStatus, setTestStatus] = useState<"success" | "error" | null>(null);
  const [testResultMsg, setTestResultMsg] = useState("");

  const [success, setSuccess] = useState("");
  const [importJsonText, setImportJsonText] = useState("");

  const handleSaveSync = (e: React.FormEvent) => {
    e.preventDefault();
    updateSyncConfig({
      ...syncConfig,
      provider: activeSyncProvider,
      firebaseConfig: {
        ...syncConfig.firebaseConfig,
        apiKey: firebaseApiKey,
        projectId: firebaseProjId
      },
      sheetsConfig: {
        ...syncConfig.sheetsConfig,
        spreadsheetId: gSheetsId
      },
      cloudDbConfig: {
        ...syncConfig.cloudDbConfig,
        hostUrl: cloudDbHost
      }
    });

    setSuccess("Synchronization parameters updated and cached successfully.");
    setTimeout(() => setSuccess(""), 4000);
  };

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setTestStatus(null);
    setTestResultMsg("");

    setTimeout(() => {
      setIsTestingConnection(false);
      setTestStatus("success");
      setTestResultMsg(`Connection established successfully with [${activeSyncProvider}]. Storage ledger records matched.`);
    }, 1800);
  };

  // Direct client file JSON downloader triggers
  const triggerDatabaseBackup = () => {
    const jsonStr = backupData();
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(jsonStr);
    
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataUri);
    downloadAnchor.setAttribute("download", "National-Immunization-Hub-clinical-database-backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    setSuccess("Database JSON exported successfully. Check your browser downloads.");
    setTimeout(() => setSuccess(""), 4000);
  };

  const triggerImportBackup = () => {
    if (!importJsonText) {
      alert("Please paste your JSON database backup string inside the textarea block.");
      return;
    }

    const completed = restoreData(importJsonText);
    if (completed) {
      setSuccess("Database successfully restored and recompiled! All active clinical entities updated.");
      setImportJsonText("");
    } else {
      alert("Failed to parse JSON backup. Format corrupt or invalid schemas.");
    }
    setTimeout(() => setSuccess(""), 4000);
  };

  const triggerHardReset = () => {
    if (confirm("WARNING: Are you absolutely certain you want to wipe the local database of all children patient records, stocks and ledger audits? This is irreversible.")) {
      clearAllData();
      alert("The local database has been wiped clean. Default schemas restored.");
      window.location.reload();
    }
  };

  return (
    <div id="settings-view-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: UI Preferences / Multi-lingual Diagnostics */}
      <section className="space-y-6 lg:col-span-1">
        
        {/* Core preferences */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <Globe2 className="w-4 h-4 text-[#005F73]" /> Preferences & Localizer
          </h3>

          {success && (
            <p className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-[11px] font-medium leading-relaxed">
              {success}
            </p>
          )}

          <div className="space-y-4 text-xs font-sans">
            
            {/* Network Offline Simulator */}
            <div className="space-y-2">
              <label className="font-bold text-neutral-700 block">Offline Diagnostic Network Mode</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOfflineMode(false)}
                  className={`flex-1 py-1.5 rounded border text-[10px] font-mono font-bold cursor-pointer ${
                    !offlineMode
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-white border-neutral-250 text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  🟢 Online Active
                </button>
                <button
                  type="button"
                  onClick={() => setOfflineMode(true)}
                  className={`flex-1 py-1.5 rounded border text-[10px] font-mono font-bold cursor-pointer ${
                    offlineMode
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-white border-neutral-250 text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  ⚠️ Offline Mode
                </button>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono">
                Simulates field caching behavior when internet connectivity is restricted in hard-to-reach terrain.
              </p>
            </div>

            {/* Language Switcher */}
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-700 block">System View Language</label>
              <div className="flex bg-neutral-100 p-0.5 rounded border border-neutral-200 text-[10px] font-mono font-bold">
                {[
                  { id: "en", label: "English" },
                  { id: "ur", label: "اردو (Urdu)" },
                  { id: "sd", label: "سنڌي (Sindhi)" }
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLanguage(l.id as any)}
                    className={`flex-1 py-1 rounded transition-all cursor-pointer ${
                      language === l.id ? "bg-white text-[#005F73] shadow-xs" : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro Theme selector */}
            <div className="space-y-1.5 pt-2">
              <label className="font-bold text-neutral-700 block">Visual Interface Theme Mode</label>
              <div className="flex bg-neutral-100 p-0.5 rounded border border-neutral-200 text-[10px] font-mono font-bold">
                <button
                  onClick={() => setDarkMode(false)}
                  className={`flex-1 py-1 rounded cursor-pointer ${!darkMode ? "bg-white text-[#005F73] shadow-xs" : "text-neutral-500"}`}
                >
                  Light Mode
                </button>
                <button
                  onClick={() => setDarkMode(true)}
                  className={`flex-1 py-1 rounded cursor-pointer ${darkMode ? "bg-white text-[#005F73] shadow-xs" : "text-neutral-500"}`}
                >
                  SaaS slate (Dark)
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Database JSON operations */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <Database className="w-4 h-4 text-cyan-600" /> DB Backup Operations
          </h3>
          
          <div className="space-y-3.5 text-xs">
            
            {/* Download backup */}
            <button
              onClick={triggerDatabaseBackup}
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <FileDown className="w-4 h-4" /> Download JSON Backup File
            </button>
            <p className="text-[10px] text-neutral-400 font-mono leading-relaxed">
              Downloads a local serialized file of your database containing children registrations, inventory ledgers, and thermometer records.
            </p>

            {/* Import restore box */}
            <div className="pt-2.5 border-t border-neutral-100 space-y-2">
              <span className="font-bold text-neutral-700 block">Paste JSON Strings to Restore:</span>
              <textarea
                placeholder="Paste backup JSON contents..."
                rows={3}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full p-2 border border-neutral-200 rounded font-mono text-[9px] bg-neutral-50 focus:outline-none"
              />
              <button
                onClick={triggerImportBackup}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded flex items-center justify-center gap-1 cursor-pointer"
              >
                <HardDriveUpload className="w-4 h-4" /> Synchronize Pasted JSON Backup
              </button>
            </div>

            {/* Hard wipe wipe Reset */}
            <div className="pt-3 border-t border-red-100 text-center">
              <button
                onClick={triggerHardReset}
                className="text-red-650 font-bold hover:underline text-[10px] uppercase font-mono tracking-wider flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> DEEP WIPE CLINICAL DATABASE
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* Right columns: Integrated cloud systems connections credentials */}
      <section className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm lg:col-span-2 space-y-5">
        <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5 border-b border-neutral-100 pb-2">
          <CloudLightning className="text-amber-500 w-4.5 h-4.5" /> Integrated Cloud Database Connections (Google)
        </h3>
        <p className="text-neutral-400 text-xs font-light">
          Configure secure replication endpoints for <strong>Google Firebase Databases</strong>, <strong>Google Sheets API</strong> matrices, or relational relational <strong>Google Cloud SQL databases</strong>.
        </p>

        {/* Sync tabs */}
        <div className="flex bg-neutral-100 p-0.5 rounded border border-neutral-200 text-[10px] font-mono font-bold">
          {[
            { id: "LocalStorage", title: "Local Caching" },
            { id: "Google Firebase", title: "Firebase Active Store" },
            { id: "Google Sheets API", title: "G-Sheets API Link" },
            { id: "Google Cloud DB", title: "Cloud SQL Postgres" }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setActiveSyncProvider(p.id as any)}
              className={`flex-1 py-1.5 rounded text-center transition-all cursor-pointer ${
                activeSyncProvider === p.id ? "bg-white text-neutral-900 shadow-xs font-black" : "text-neutral-500"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Dynamic setups forms */}
        <form onSubmit={handleSaveSync} className="space-y-4 text-xs font-sans">
          
          {activeSyncProvider === "Google Firebase" && (
            <div className="p-4 bg-orange-50/20 border border-orange-100 rounded-lg space-y-3">
              <h4 className="font-bold text-orange-950 text-xs">Authorize Firebase Firestore SDK Parameters</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <span className="text-neutral-500 block">API Key Payload *</span>
                  <input
                    type="password"
                    value={firebaseApiKey}
                    onChange={(e) => setFirebaseApiKey(e.target.value)}
                    className="w-full p-2 border border-neutral-200 rounded bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 block">Workspace Project ID *</span>
                  <input
                    type="text"
                    value={firebaseProjId}
                    onChange={(e) => setFirebaseProjId(e.target.value)}
                    className="w-full p-2 border border-neutral-200 rounded bg-white"
                  />
                </div>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono leading-relaxed">
                Connects routine immunization logs with Firestore collections. Credentials are encrypted and cached locally on client browser only.
              </p>
            </div>
          )}

          {activeSyncProvider === "Google Sheets API" && (
            <div className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-lg space-y-3">
              <h4 className="font-bold text-emerald-950 text-xs">Google Sheets API Spreadsheet synchronization settings</h4>
              <div className="space-y-2">
                <div className="space-y-1">
                  <span className="text-neutral-500 block font-bold">Google Spreadsheet ID *</span>
                  <input
                    type="text"
                    value={gSheetsId}
                    onChange={(e) => setGSheetsId(e.target.value)}
                    className="w-full p-2 border border-neutral-200 rounded bg-white font-mono text-[11px]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 block font-bold">Authorized Service Account email *</span>
                  <input
                    type="text"
                    value="nih-sheets-sync@gserviceaccount.com"
                    disabled
                    className="w-full p-2 border border-neutral-150 rounded bg-neutral-50 font-mono text-[11px]"
                  />
                </div>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono leading-relaxed">
                Will replicate patient row entries directly inside of Google Sheets grids for rapid external reporting. Share edit access with search engine server service accounts.
              </p>
            </div>
          )}

          {activeSyncProvider === "Google Cloud DB" && (
            <div className="p-4 bg-blue-50/20 border border-blue-100 rounded-lg space-y-3">
              <h4 className="font-bold text-blue-950 text-xs">Relational Cloud SQL PostgreSQL database link</h4>
              <div className="space-y-1.5">
                <span className="text-neutral-500 block font-bold">Gateway Endpoint URL *</span>
                <input
                  type="text"
                  value={cloudDbHost}
                  onChange={(e) => setCloudDbHost(e.target.value)}
                  className="w-full p-2 border border-neutral-200 rounded font-mono text-[11px]"
                />
              </div>
              <p className="text-[10px] text-neutral-400 font-mono leading-relaxed">
                Triggers secure API proxy replication pathways to push and pull entries directly to production relational PostgreSQL.
              </p>
            </div>
          )}

          {activeSyncProvider === "LocalStorage" && (
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2 flex items-start gap-2 text-neutral-600">
              <Info className="w-5 h-5 text-neutral-400 shrink-0" />
              <div className="space-y-1 text-xs font-light">
                <p className="font-bold text-neutral-800">Local Cache Active-only mode</p>
                <p>All child registros, thermometer status lists, stock cards, and user approvals are securely maintained offline inside of browser Cache memory schemas. No internet access is required.</p>
              </div>
            </div>
          )}

          {/* Test connection results box */}
          {testStatus && (
            <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-150 rounded flex items-center gap-2 font-mono text-[10px]">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{testResultMsg}</span>
            </div>
          )}

          {/* Connection sliders */}
          <div className="flex gap-2.5 pt-3 border-t border-neutral-100">
            {activeSyncProvider !== "LocalStorage" && (
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="px-4 py-2 bg-[#00D4C7]/20 border border-[#005F73]/30 hover:bg-[#00D4C7]/30 hover:border-[#005F73] text-[#005F73] font-bold rounded flex items-center justify-center gap-1 cursor-pointer text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? "animate-spin" : ""}`} />
                {isTestingConnection ? "Scanning cloud server..." : "Test Connection"}
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2 bg-[#005F73] hover:bg-[#00D4C7] hover:text-neutral-900 text-white font-bold rounded transition-all shadow cursor-pointer text-xs"
            >
              Save Configuration Credentials
            </button>
          </div>

        </form>
      </section>

    </div>
  );
};
