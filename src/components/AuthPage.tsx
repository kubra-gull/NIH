/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useHub } from "../context/HubContext";
import { UserRole } from "../types";
import {
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  LogIn,
  Key,
  Database,
  Building,
  Activity,
  ArrowRight
} from "lucide-react";

interface AuthPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
  initialTab: "login" | "signup";
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onNavigateHome, initialTab }) => {
  const { login, registerUser } = useHub();

  const [activeMode, setActiveMode] = useState<"login" | "signup">(initialTab);

  // Login inputs
  const [loginCredential, setLoginCredential] = useState("");
  const [loginRole, setLoginRole] = useState<UserRole>(UserRole.ADMINISTRATOR);
  const [loginPwd, setLoginPwd] = useState("");

  // Signup inputs
  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [healthFacility, setHealthFacility] = useState("District Headquarters Hospital");
  const [district, setDistrict] = useState("Rawalpindi");
  const [province, setProvince] = useState("Punjab");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.VACCINATOR);

  // States
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginCredential) {
      setErrorMsg("Please enter Email Address or Employee ID.");
      return;
    }

    const { success, error } = login(loginCredential, loginRole);
    if (success) {
      onLoginSuccess();
    } else {
      setErrorMsg(error || "Account status disabled or incorrect credential match.");
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (!fullName || !employeeId || !email || !phoneNumber || !password || !confirmPassword) {
      setErrorMsg("Please enter all required clinical ID form fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Confirmation password mismatch. Retype.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must contain at least 6 characters.");
      return;
    }

    registerUser({
      fullName,
      employeeId,
      email,
      phoneNumber,
      role: selectedRole,
      healthFacility,
      district,
      province
    });

    // Auto trigger alert
    setInfoMsg(
      `Registration request submitted. Simulated email verification alert dispatched to ${email}. Administrative approval checklist triggered.`
    );

    // Clear Form fields
    setFullName("");
    setEmployeeId("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center py-12 px-6 md:px-12 relative overflow-hidden text-white font-sans selection:bg-[#00D4C7] selection:text-neutral-900">
      
      {/* Background design elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,212,199,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#00D4C7] to-[#005F73]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 z-10">
        <button
          onClick={onNavigateHome}
          className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 font-mono uppercase tracking-wider"
        >
          ← Return to Public Hub
        </button>
        <h2 className="text-3xl font-black tracking-tight flex items-center justify-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#00D4C7]" /> National Immunization Hub
        </h2>
        <p className="text-xs text-neutral-400">
          Enterprise Security Portal • Expanded Program on Immunization
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-neutral-850 py-8 px-6 sm:px-10 rounded-2xl border border-neutral-800 shadow-2xl space-y-6">
          
          {/* Tabs */}
          <div className="flex bg-neutral-900/60 p-0.5 rounded-lg border border-neutral-800 text-xs font-mono font-bold select-none">
            <button
              onClick={() => {
                setActiveMode("login");
                setErrorMsg("");
                setInfoMsg("");
              }}
              className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
                activeMode === "login" ? "bg-white text-neutral-900" : "text-neutral-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveMode("signup");
                setErrorMsg("");
                setInfoMsg("");
              }}
              className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
                activeMode === "signup" ? "bg-white text-neutral-900" : "text-neutral-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback alerts */}
          {errorMsg && (
            <div className="p-3 bg-red-950 border border-red-900 rounded-lg text-red-400 text-xs flex gap-2 items-start shrink-0">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="p-3 bg-emerald-950 border border-emerald-900 rounded-lg text-emerald-400 text-xs flex gap-2 items-start shrink-0">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* LOGIN VIEW PANEL */}
          {activeMode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
              
              <div className="space-y-1">
                <label className="font-bold text-neutral-400 tracking-wide uppercase">Email / Employee ID *</label>
                <div className="relative">
                  <input
                    id="login-creds-input"
                    type="text"
                    required
                    placeholder="e.g. key.officer@nih.gov.pk or NIH-9901"
                    value={loginCredential}
                    onChange={(e) => setLoginCredential(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded focus:border-[#00D4C7] focus:outline-none"
                  />
                  <User className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-400 tracking-wide uppercase">Security Role Type *</label>
                <select
                  id="login-role-select"
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value as UserRole)}
                  className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-neutral-300 focus:border-[#00D4C7]"
                >
                  <option value={UserRole.ADMINISTRATOR}>Administrator</option>
                  <option value={UserRole.MEDICAL_OFFICER}>Medical Officer</option>
                  <option value={UserRole.VACCINATOR}>Vaccinator</option>
                  <option value={UserRole.LADY_HEALTH_VISITOR}>Lady Health Visitor</option>
                  <option value={UserRole.INVENTORY_MANAGER}>Inventory Manager</option>
                  <option value={UserRole.DATA_ENTRY_OPERATOR}>Data Entry Operator</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-400 tracking-wide uppercase">Password *</label>
                <div className="relative">
                  <input
                    id="login-password-input"
                    type={showPwd ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={loginPwd}
                    onChange={(e) => setLoginPwd(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 bg-neutral-900 border border-neutral-800 rounded focus:border-[#00D4C7] focus:outline-none"
                  />
                  <Key className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-3 text-neutral-500 hover:text-white"
                  >
                    {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="remember-me-chk"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-800 text-[#005F73]"
                  />
                  <label htmlFor="remember-me-chk" className="text-neutral-400 tracking-wide cursor-pointer">Remember Me</label>
                </div>
                <button
                  type="button"
                  onClick={() => setInfoMsg("Simulated password reset alert email has been sent. Check inbox.")}
                  className="text-[#00D4C7] font-semibold hover:underline cursor-pointer"
                >
                  Reset password?
                </button>
              </div>

              <button
                id="btn-perform-login"
                type="submit"
                className="w-full py-2.5 rounded bg-[#00D4C7] text-neutral-900 hover:bg-white hover:shadow-lg font-bold cursor-pointer transition-all flex items-center justify-center gap-1 text-xs"
              >
                <LogIn className="w-4 h-4 text-neutral-900" /> Enter Administrator Workspace
              </button>

            </form>
          ) : (
            /* CREATE ACCOUNT PANEL */
            <form onSubmit={handleCreateAccount} className="space-y-3.5 text-xs font-sans">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-400 block">Full Name *</label>
                  <input
                    id="sign-fullname"
                    type="text"
                    required
                    placeholder="e.g. Dr. Bilal Alvi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded focus:border-[#00D4C7] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-neutral-400 block">Employee ID *</label>
                  <input
                    id="sign-empid"
                    type="text"
                    required
                    placeholder="e.g. NIH-4412"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded focus:border-[#00D4C7] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-400 block">Email Address *</label>
                  <input
                    id="sign-email"
                    type="email"
                    required
                    placeholder="officer@health.gov.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded focus:border-[#00D4C7] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-neutral-400 block">Mobile Phone *</label>
                  <input
                    id="sign-phone"
                    type="text"
                    required
                    placeholder="+92 312 xxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded focus:border-[#00D4C7] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-400 block">Health Facility Node Name *</label>
                <input
                  id="sign-facility"
                  type="text"
                  required
                  placeholder="e.g. Basic Health Unit Hayatabad"
                  value={healthFacility}
                  onChange={(e) => setHealthFacility(e.target.value)}
                  className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded focus:border-[#00D4C7] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-400 block">District *</label>
                  <input
                    id="sign-district"
                    type="text"
                    required
                    placeholder="e.g. Peshawar"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-neutral-400 block">Province *</label>
                  <input
                    id="sign-province"
                    type="text"
                    required
                    placeholder="e.g. KPK"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-400 block">Requested Medical Role *</label>
                <select
                  id="sign-role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-neutral-300"
                >
                  <option value={UserRole.ADMINISTRATOR}>Administrator</option>
                  <option value={UserRole.MEDICAL_OFFICER}>Medical Officer</option>
                  <option value={UserRole.VACCINATOR}>Vaccinator</option>
                  <option value={UserRole.LADY_HEALTH_VISITOR}>Lady Health Visitor</option>
                  <option value={UserRole.INVENTORY_MANAGER}>Inventory Manager</option>
                  <option value={UserRole.DATA_ENTRY_OPERATOR}>Data Entry Operator</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-400 block">Password *</label>
                  <input
                    id="sign-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded focus:border-[#00D4C7] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-neutral-400 block">Confirm Password *</label>
                  <input
                    id="sign-confirm"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded focus:border-[#00D4C7] focus:outline-none"
                  />
                </div>
              </div>

              <button
                id="btn-submit-credentials"
                type="submit"
                className="w-full py-2 bg-[#005F73] hover:bg-[#00D4C7] hover:text-neutral-900 text-white font-bold rounded transition-all cursor-pointer"
              >
                Submit Clinical Access Request
              </button>

            </form>
          )}

          <div className="text-[10px] text-neutral-500 font-mono text-center border-t border-neutral-850 pt-4 flex justify-between items-center select-none">
            <span className="flex items-center gap-0.5"><Database className="w-3 h-3" /> SECURE-SSL</span>
            <span>PROT-VER: EPI-2026</span>
          </div>

        </div>
      </div>

    </div>
  );
};
