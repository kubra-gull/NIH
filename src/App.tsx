/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { HubProvider, useHub } from "./context/HubContext";
import { LandingPage } from "./components/LandingPage";
import { DashboardView } from "./components/DashboardView";
import { PatientRegistrationView } from "./components/PatientRegistrationView";
import { VaccinationCenterView } from "./components/VaccinationCenterView";
import { InventoryManagementView } from "./components/InventoryManagementView";
import { ColdChainMonitoringView } from "./components/ColdChainMonitoringView";
import { ScannerSimView } from "./components/ScannerSimView";
import { FeedbackView } from "./components/FeedbackView";
import { ReportsCenterView } from "./components/ReportsCenterView";
import { NotificationsView } from "./components/NotificationsView";
import { AuditLogsView } from "./components/AuditLogsView";
import { UserManagementView } from "./components/UserManagementView";
import { SettingsView } from "./components/SettingsView";
import { AuthPage } from "./components/AuthPage";
import { EodReconciliationView } from "./components/EodReconciliationView";

import {
  LayoutDashboard,
  UserPlus,
  Syringe,
  Boxes,
  ThermometerSnowflake,
  Scan,
  MessageSquare,
  FileCode,
  Bell,
  Activity,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Radio,
  FileCheck,
  Building,
  ShieldCheck,
  LogIn,
  Sparkles
} from "lucide-react";

const AppContent: React.FC = () => {
  const {
    currentUser,
    logout,
    language,
    darkMode,
    offlineMode,
    coldChainFridges
  } = useHub();

  const [activeTab, setActiveTab] = useState<string>("landing");
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic titles depending on translation state
  const getTabLabel = (key: string) => {
    switch (language) {
      case "ur":
        if (key === "dashboard") return "ڈیش بورڈ";
        if (key === "patient-registration") return "مریض کا اندراج";
        if (key === "vaccination-center") return "حفاظتی ٹیکہ جات";
        if (key === "inventory-management") return "اسٹاک لیجر";
        if (key === "cold-chain") return "کولڈ چین مانیٹر";
        if (key === "scanner") return "بارکوڈ سکینر";
        if (key === "eod") return "روزانہ مفاہمت";
        if (key === "reports") return "رپورٹس سینٹر";
        if (key === "notifications") return "نوٹیفکیشن پورٹل";
        if (key === "feedback") return "رائے اور تاثرات";
        if (key === "audit-logs") return "آڈٹ ٹریلز";
        if (key === "user-management") return "اسٹاف لسٹ";
        if (key === "settings") return "سیٹنگز";
        return key;
      case "sd":
        if (key === "dashboard") return "ڊيش بورڊ";
        if (key === "patient-registration") return "مريض جي رجسٽريشن";
        if (key === "vaccination-center") return "ويڪسينيشن سينٽر";
        if (key === "inventory-management") return "اسٽاڪ رڪارڊ";
        if (key === "cold-chain") return "ڪولڊ چين نگراني";
        if (key === "scanner") return "بارڪوڊ اسڪينر";
        if (key === "eod") return "روزاني ميلاپ";
        if (key === "reports") return "رپورٽ سينٽر";
        if (key === "notifications") return "نوٽيفڪيشن پورٽل";
        if (key === "feedback") return "راءِ ۽ تاثرات";
        if (key === "audit-logs") return "آڊٽ رڪارڊ";
        if (key === "user-management") return "اسٽاف لهر";
        if (key === "settings") return "سيٽنگون";
        return key;
      default:
        if (key === "dashboard") return "SaaS Dashboard";
        if (key === "patient-registration") return "Patient Registration";
        if (key === "vaccination-center") return "Vaccination Center";
        if (key === "inventory-management") return "Inventory & Stock";
        if (key === "cold-chain") return "Cold Chain Monitor";
        if (key === "scanner") return "Barcode & QR Scanner";
        if (key === "eod") return "EOD Reconciliation";
        if (key === "reports") return "Reports & Export";
        if (key === "notifications") return "Notification Gateway";
        if (key === "feedback") return "Feedback & Reviews";
        if (key === "audit-logs") return "System Audit Trails";
        if (key === "user-management") return "User Access Matrix";
        if (key === "settings") return "Settings & Sync";
        return key;
    }
  };

  // Nav actions
  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const triggerAuthFlow = (tab: "login" | "signup") => {
    setAuthTab(tab);
    setActiveTab("auth");
  };

  const handleLogout = () => {
    logout();
    setActiveTab("landing");
  };

  // Cold Chain alarms detector
  const criticalColdAlarmsCount = coldChainFridges.filter(f => f.status === "Critical").length;

  // Unauthenticated Public Landing Page Router
  if (activeTab === "landing") {
    return (
      <LandingPage
        onNavigate={triggerAuthFlow}
        onEnterDemo={() => {
          // auto log-in admin to accelerate inspection if desired or go to Login
          triggerAuthFlow("login");
        }}
      />
    );
  }

  // Auth pages logic
  if (activeTab === "auth") {
    return (
      <AuthPage
        initialTab={authTab}
        onLoginSuccess={() => setActiveTab("dashboard")}
        onNavigateHome={() => setActiveTab("landing")}
      />
    );
  }

  // Sidebar Links config helper
  const sidebarLinks = [
    { id: "dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "patient-registration", icon: <UserPlus className="w-4 h-4" /> },
    { id: "vaccination-center", icon: <Syringe className="w-4 h-4" /> },
    { id: "inventory-management", icon: <Boxes className="w-4 h-4" /> },
    { id: "cold-chain", icon: <ThermometerSnowflake className="w-4 h-4" /> },
    { id: "scanner", icon: <Scan className="w-4 h-4" /> },
    { id: "eod", icon: <FileCheck className="w-4 h-4" /> },
    { id: "reports", icon: <FileCode className="w-4 h-4" /> },
    { id: "notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "feedback", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "audit-logs", icon: <Activity className="w-4 h-4" /> },
    { id: "user-management", icon: <Users className="w-4 h-4" /> },
    { id: "settings", icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-neutral-950 text-neutral-100 dark" : "bg-neutral-50 text-neutral-800"} font-sans transition-colors duration-200 selection:bg-[#00D4C7] selection:text-neutral-900`}>
      
      {/* Dynamic top notifications banner for simulated offline mode */}
      {offlineMode && (
        <div className="fixed top-0 left-0 right-0 bg-amber-600 shadow-[0_4px_16px_rgba(217,119,6,0.3)] text-white text-center py-1.5 text-[10px] font-mono tracking-widest font-black uppercase z-50 flex items-center justify-center gap-1.5 animate-pulse">
          <Radio className="w-3.5 h-3.5" /> Simulated Field Offline Mode Active - Storing records locally
        </div>
      )}

      {/* Primary Left Navigation Sidebar - Large screen */}
      <aside className={`hidden lg:flex flex-col w-64 ${darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"} border-r shrink-0 justify-between relative`}>
        
        {/* Top logo block */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-linear-to-br from-[#00D4C7] to-[#005F73]" />
            <h1 className="font-extrabold tracking-tight text-sm uppercase">National Hub</h1>
          </div>

          {/* User badge */}
          {currentUser && (
            <div className={`p-4 rounded-xl border ${darkMode ? "bg-neutral-800/50 border-neutral-700" : "bg-neutral-50 border-neutral-150"} space-y-1.5`}>
              <span className="text-[9px] uppercase font-mono font-bold text-[#005F73] block bg-[#00D4C7]/15 px-1.5 py-0.5 rounded-sm text-center">
                {currentUser.role}
              </span>
              <p className="font-bold text-xs truncate" title={currentUser.fullName}>{currentUser.fullName}</p>
              <p className="text-[10px] text-neutral-400 font-mono truncate">{currentUser.healthFacility}</p>
            </div>
          )}

          {/* Nav links */}
          <nav className="space-y-1.5">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                id={`tab-link-${link.id}`}
                onClick={() => navigateToTab(link.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === link.id
                    ? "bg-[#005F73] text-white shadow-md font-extrabold"
                    : `${darkMode ? "text-neutral-450 hover:text-white" : "text-neutral-500 hover:text-neutral-800"} hover:bg-neutral-100/10`
                }`}
              >
                {link.icon}
                <span className="truncate">{getTabLabel(link.id)}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom logout block */}
        <div className="p-4 border-t border-neutral-200/20">
          <button
            id="btn-sidebar-logout"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold bg-[#00D4C7] hover:bg-[#005F73] hover:text-white text-neutral-900 rounded-lg shadow-sm transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout Section
          </button>
        </div>

      </aside>

      {/* Mobile Drawer Menu Layer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden" id="mobile-menu-overlay">
          <div className={`w-64 h-full ${darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white"} p-5 space-y-6 flex flex-col justify-between`}>
            <div>
              <div className="flex justify-between items-center text-neutral-850">
                <span className="font-extrabold font-mono tracking-tight uppercase">Medical Hub Menu</span>
                <button
                  id="mobile-menu-close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 hover:bg-neutral-100 rounded text-neutral-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic roster items */}
              <nav className="space-y-2 mt-8">
                {sidebarLinks.map((link) => (
                  <button
                    key={link.id}
                    id={`mobile-tab-link-${link.id}`}
                    onClick={() => navigateToTab(link.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeTab === link.id
                        ? "bg-[#005F73] text-white"
                        : `${darkMode ? "text-neutral-400" : "text-neutral-500 hover:text-neutral-800"} hover:bg-neutral-100/10`
                    }`}
                  >
                    {link.icon}
                    <span>{getTabLabel(link.id)}</span>
                  </button>
                ))}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-650 hover:bg-red-700 text-white rounded text-xs font-bold mt-auto"
            >
              Sign out Session
            </button>
          </div>
        </div>
      )}

      {/* Main Dynamic Workspace Area */}
      <div className={`flex-1 flex flex-col ${offlineMode ? "pt-8" : ""}`}>
        
        {/* Interactive Workspace Top Header Bar */}
        <header className={`h-16 ${darkMode ? "bg-neutral-900/80 border-neutral-800/80" : "bg-white/80 border-neutral-250/80"} backdrop-blur-md border-b flex items-center justify-between px-6 sticky top-0 z-30`}>
          
          <div className="flex items-center gap-3">
            {/* Mobile menu triggers */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 hover:bg-neutral-100 rounded text-neutral-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-neutral-400">
              EPI District Hub Section
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Alarm notifications */}
            {criticalColdAlarmsCount > 0 && (
              <span className="text-[10px] font-mono font-bold bg-red-50 text-red-650 px-2.5 py-1 rounded-full animate-bounce shrink-0">
                ⚠️ {criticalColdAlarmsCount} Cold-chain Alerts Active
              </span>
            )}
            
            <div className="p-1 px-2.5 rounded bg-neutral-100/60 font-mono text-[9px] uppercase tracking-wider text-neutral-550 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Server
            </div>
          </div>

        </header>

        {/* Routing View Dispatcher */}
        <main className="p-6 max-w-7xl mx-auto w-full flex-1">
          {activeTab === "dashboard" && <DashboardView onNavigate={navigateToTab} />}
          {activeTab === "patient-registration" && <PatientRegistrationView />}
          {activeTab === "vaccination-center" && <VaccinationCenterView />}
          {activeTab === "inventory-management" && <InventoryManagementView />}
          {activeTab === "cold-chain" && <ColdChainMonitoringView />}
          {activeTab === "scanner" && <ScannerSimView onNavigate={navigateToTab} />}
          {activeTab === "eod" && <EodReconciliationView />}
          {activeTab === "reports" && <ReportsCenterView />}
          {activeTab === "notifications" && <NotificationsView />}
          {activeTab === "feedback" && <FeedbackView />}
          {activeTab === "audit-logs" && <AuditLogsView />}
          {activeTab === "user-management" && <UserManagementView />}
          {activeTab === "settings" && <SettingsView />}
        </main>

      </div>

    </div>
  );
};

export default function App() {
  return (
    <HubProvider>
      <AppContent />
    </HubProvider>
  );
}
