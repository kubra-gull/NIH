/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Shield, Sparkles, Building, Eye, UserPlus, LogIn, ClipboardList, ThermometerSnowflake, Users } from "lucide-react";
import { MOCK_DISEASES } from "../mockData";

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onEnterDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onEnterDemo }) => {
  return (
    <div id="landing-page-root" className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-[#00D4C7] selection:text-neutral-900">
      {/* Hero Banner */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#005F73] via-[#0A3D4D] to-neutral-900 text-white py-16 px-6 md:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,199,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#00D4C7]/20 text-[#00D4C7] border border-[#00D4C7]/30">
              <Sparkles className="w-3.5 h-3.5" /> Ministry of Public Health • Live Regional Deployment
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              National <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4C7] to-white">
                Immunization Hub
              </span>
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Enterprise-grade digital vaccine ledger, patient POS registration, vaccine inventory tracking, and solar cold-chain sensor monitoring. Protecting future generations against 12 vaccine-preventable diseases.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <button
                id="btn-landing-login"
                onClick={() => onNavigate("login")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#00D4C7] text-neutral-900 font-semibold hover:bg-white hover:shadow-lg transition-all text-sm cursor-pointer shadow-md"
              >
                <LogIn className="w-4 h-4" /> Sign In to Portal
              </button>
              <button
                id="btn-landing-signup"
                onClick={() => onNavigate("signup")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-white font-medium border border-neutral-700 hover:border-neutral-500 transition-all text-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4" /> Request Officer Credentials
              </button>
              <button
                id="btn-landing-demo"
                onClick={onEnterDemo}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-transparent hover:bg-white/10 text-[#00D4C7] hover:text-white font-medium border border-[#00D4C7]/40 transition-all text-sm cursor-pointer"
              >
                <Shield className="w-4 h-4" /> Instant Demo Access
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl relative">
            <div className="absolute -top-3 -right-3 px-3 py-1 bg-[#00D4C7] text-neutral-900 text-xs font-bold rounded-md uppercase tracking-wider animate-pulse">
              Active Network
            </div>
            <h3 className="text-lg font-bold text-[#00D4C7] mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
              <Building className="w-4 h-4" /> National Telemetry Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-900/60 rounded-xl border border-white/5">
                <p className="text-xs text-neutral-400 uppercase tracking-widest font-mono">Doses In Stock</p>
                <p className="text-2xl font-semibold tracking-tight text-white mt-1">20,290</p>
                <p className="text-xs text-[#00D4C7] flex items-center gap-0.5 mt-1">Active Batches</p>
              </div>
              <div className="p-4 bg-neutral-900/60 rounded-xl border border-white/5">
                <p className="text-xs text-neutral-400 uppercase tracking-widest font-mono">Cold-Chain Units</p>
                <p className="text-2xl font-semibold tracking-tight text-white mt-1">4 Stations</p>
                <p className="text-xs text-green-400 flex items-center gap-0.5 mt-1">98.2% Safe Temp</p>
              </div>
              <div className="p-4 bg-neutral-900/60 rounded-xl border border-white/5">
                <p className="text-xs text-neutral-400 uppercase tracking-widest font-mono">Children Protected</p>
                <p className="text-2xl font-semibold tracking-tight text-white mt-1">3,450+</p>
                <p className="text-xs text-cyan-400 mt-1">Routine Coverage</p>
              </div>
              <div className="p-4 bg-neutral-900/60 rounded-xl border border-white/5">
                <p className="text-xs text-neutral-400 uppercase tracking-widest font-mono">Immunization Rate</p>
                <p className="text-2xl font-semibold tracking-tight text-white mt-1">91.4%</p>
                <p className="text-xs text-[#00D4C7] mt-1">WHO Milestone</p>
              </div>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono text-center mt-4">
              SYSTEM REFERENCE: NIH-PK-SECURE-ID-2026 • SSL ENCRYPTED
            </p>
          </div>

        </div>
      </header>

      {/* Partners Section */}
      <section className="bg-white border-y border-neutral-200 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-16 text-neutral-400 text-xs font-mono uppercase tracking-widest">
          <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-[#005F73]" /> WHO Immunization Standards</span>
          <span className="flex items-center gap-1"><Building className="w-4 h-4 text-[#005F73]" /> UNICEF Cold Chain Ready</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4 text-[#005F73]" /> Ministry of National Health Services</span>
        </div>
      </section>

      {/* Main Core: 12 Deadly Diseases */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
            Target Vaccine-Preventable Coverage
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto text-sm">
            EPI (Expanded Programme on Immunization) mandates routine protection for every child in Pakistan against these 12 critical diseases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_DISEASES.map((dis) => (
            <div
              key={dis.id}
              className="p-6 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              id={`disease-card-${dis.id}`}
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#00D4C7] to-[#005F73]" />
              <div className="flex items-center justify-between mb-3 pl-2">
                <span className="text-xs font-mono text-neutral-400 uppercase">Disease Ref #{dis.id}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                  {dis.name === "Polio" || dis.name === "Tuberculosis (BCG)" || dis.name === "Measles" ? "High Alert Threat" : "EPI Routine"}
                </span>
              </div>
              <h4 className="text-lg font-bold text-[#005F73] pl-2 mb-2">{dis.name}</h4>
              <div className="space-y-1.5 text-xs pl-2">
                <p className="text-neutral-600"><strong className="text-neutral-800">Pathogen:</strong> {dis.pathogen}</p>
                <p className="text-neutral-600"><strong className="text-neutral-800">Preventative:</strong> {dis.preventative}</p>
                <p className="text-neutral-700 italic mt-2 bg-neutral-50 p-2 rounded border border-neutral-100">{dis.mortalityRate}</p>
                <p className="text-[#005F73] font-medium pt-1">Target Age: {dis.targetAge}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Workflow Pillars */}
      <section className="bg-[#0A3D4D]/5 py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-[#005F73]">Platform Pillars & Infrastructure</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto text-sm">
              Integrated real-time clinical ledger, point-of-service registers, and stock managers with complete transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#00D4C7]/10 flex items-center justify-center text-[#005F73]">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-neutral-900">Patient Registry</h5>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Fast POS intakes, unique digital vaccine ID allocation, printable identity cards, and QR lookup matrix.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#00D4C7]/10 flex items-center justify-center text-[#005F73]">
                <Shield className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-neutral-900">Secure Injections</h5>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Dual vaccinator signoff audits, next dose calculators, dose administration histories, and adverse event warnings.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#00D4C7]/10 flex items-center justify-center text-[#005F73]">
                <ThermometerSnowflake className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-neutral-900">Cold Chain Tracker</h5>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Smart solar freezer sensor telemetry records, walk-in coolers status log, and critical temperature alarms.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#00D4C7]/10 flex items-center justify-center text-[#005F73]">
                <Users className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-neutral-900">Reporting Engine</h5>
              <p className="text-xs text-neutral-500 leading-relaxed">
                District performance matrices, vaccine utilization charts, missed milestone lists, and CSV audit output.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-b border-neutral-800 pb-8">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg font-bold text-white flex items-center gap-2 justify-center md:justify-start">
              <span className="w-3 h-3 rounded-full bg-[#00D4C7] block" />
              National Immunization Hub
            </h4>
            <p className="text-xs text-neutral-400 font-light">
              Autonomous healthcare automation software platform, standardized for WHO regional deployment programs.
            </p>
          </div>
          <div className="flex gap-4">
            <button id="ft-btn-login" onClick={() => onNavigate("login")} className="text-xs text-neutral-300 hover:text-[#00D4C7]">Portal Sign In</button>
            <span className="text-neutral-700">|</span>
            <button id="ft-btn-signup" onClick={() => onNavigate("signup")} className="text-xs text-neutral-300 hover:text-[#00D4C7]">Request Registration</button>
            <span className="text-neutral-700">|</span>
            <button id="ft-btn-feedback" onClick={() => onNavigate("feedback")} className="text-xs text-neutral-300 hover:text-[#00D4C7]">Feedback Hub</button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between text-neutral-500 text-[10px] font-mono gap-4">
          <p>© 2026 Ministry of Public Health. All Server Ledgers Encrypted via TLS 1.3.</p>
          <p>PROD-BUILD VER: v4.1.14RC • DATABASE REPLICA: LOCALSTORAGE (OFFLINE ENABLED)</p>
        </div>
      </footer>
    </div>
  );
};
