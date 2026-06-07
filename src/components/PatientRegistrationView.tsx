/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useHub } from "../context/HubContext";
import {
  Search,
  UserPlus,
  UserCheck,
  Phone,
  Printer,
  Calendar,
  Shield,
  FileCode,
  MapPin,
  ClipboardList,
  Eye,
  Activity,
  ArrowRight
} from "lucide-react";

export const PatientRegistrationView: React.FC = () => {
  const { patients, addPatient, currentUser } = useHub();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || "");
  
  // New Patient Fields
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianNationalId, setGuardianNationalId] = useState("");
  const [province, setProvince] = useState("Punjab");
  const [district, setDistrict] = useState("Rawalpindi");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [lastRegisteredId, setLastRegisteredId] = useState("");

  const provincesAndDistricts: Record<string, string[]> = {
    "Punjab": ["Rawalpindi", "Lahore", "Gujranwala", "Faisalabad", "Multan"],
    "Khyber Pakhtunkhwa (KPK)": ["Peshawar", "Mardan", "Swat", "Abbottabad", "Kohat"],
    "Sindh": ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Mirpur Khas"],
    "Balochistan": ["Quetta", "Gwadar", "Sibi", "Loralai", "Khuzdar"],
    "ICT Islamabad": ["Islamabad Capital Territory"],
    "Gilgit-Baltistan": ["Gilgit", "Skardu", "Hunza"],
    "Azad Jammu & Kashmir (AJK)": ["Muzaffarabad", "Mirpur"]
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProv = e.target.value;
    setProvince(selectedProv);
    setDistrict(provincesAndDistricts[selectedProv]?.[0] || "");
  };

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Instant filtering
  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.guardianName.toLowerCase().includes(q) ||
      p.guardianPhone.includes(q) ||
      p.guardianNationalId.includes(q)
    );
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !dateOfBirth || !guardianName || !guardianPhone || !guardianNationalId) {
      alert("Please fill in all required health record fields.");
      return;
    }

    const regPatient = addPatient({
      fullName,
      dateOfBirth,
      gender,
      guardianName,
      guardianPhone,
      guardianNationalId,
      province,
      district,
      healthFacility: currentUser?.healthFacility || "National Institute of Health",
      address,
      notes: notes || "Registered under routine EPI intake plan."
    });

    setLastRegisteredId(regPatient.id);
    setSelectedPatientId(regPatient.id);
    setShowSuccessToast(true);

    // Reset Intake Screen State
    setFullName("");
    setDateOfBirth("");
    setGuardianName("");
    setGuardianPhone("");
    setGuardianNationalId("");
    setAddress("");
    setNotes("");

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 5000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div id="registration-panel-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Sidebar: Search Results Tracker */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col h-[650px]">
        <div className="border-b border-neutral-100 pb-3 mb-4 space-y-2">
          <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
            <Search className="w-4 h-4 text-[#005F73]" /> POS Database Lookup
          </h3>
          <p className="text-neutral-400 text-xs font-light">
            Search instantaneously by Child Name, Unique Patient ID, or Guardian Phone.
          </p>
        </div>

        {/* Global Search Formulation */}
        <form onSubmit={handleSearchSubmit} className="relative mb-3">
          <input
            id="patient-search-input"
            type="text"
            placeholder="Type search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-xs placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#00D4C7] bg-neutral-50"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
        </form>

        {/* Instant Search List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1" id="patient-search-list">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              No patient matches found in active store.
            </div>
          ) : (
            filteredPatients.map((p) => {
              const isActive = p.id === selectedPatientId;
              return (
                <button
                  key={p.id}
                  id={`patient-btn-${p.id}`}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center cursor-pointer ${
                    isActive
                      ? "bg-[#005F73]/5 border-[#005F73] shadow-sm text-neutral-900"
                      : "border-neutral-100 hover:bg-neutral-50 text-neutral-600"
                  }`}
                >
                  <div className="space-y-1 pr-1 truncate">
                    <p className="font-bold text-xs text-neutral-800">{p.fullName}</p>
                    <p className="text-[10px] font-mono text-neutral-400">{p.id}</p>
                    <p className="text-[10px] text-neutral-500 font-mono">Guardian: {p.guardianName}</p>
                  </div>
                  <ChevronRightSmall />
                </button>
              );
            })
          )}
        </div>
        <p className="text-[10px] text-neutral-400 text-center font-mono pt-3 border-t border-neutral-100 mt-2">
          Sync status: Offline Cache Active
        </p>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Success Alert Toast */}
        {showSuccessToast && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between shadow-sm animate-fade-in animate-pulse">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-green-700" />
              <div>
                <p className="font-bold text-green-900 text-xs">Patient File Created Successfully</p>
                <p className="text-[10px] text-green-700">Unique ID: <strong className="font-mono">{lastRegisteredId}</strong> - Guardian notified via simulated SMS alerts gateway.</p>
              </div>
            </div>
            <button onClick={() => setShowSuccessToast(false)} className="text-green-800 text-xs hover:underline cursor-pointer">Dismiss</button>
          </div>
        )}

        {/* View Profile Card / Printable Passport */}
        {activePatient && (
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden" id="patient-card-print">
            
            {/* Passport Banner */}
            <div className="bg-gradient-to-r from-[#005F73] to-[#0A3D4D] text-white p-6 flex justify-between items-start md:items-center">
              <div className="space-y-1">
                <span className="inline-block bg-[#00D4C7]/20 border border-[#00D4C7]/30 text-[#00D4C7] text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full">
                  District Immunization Register Code
                </span>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#00D4C7]" /> Digital Vaccination Passport
                </h3>
              </div>
              <button
                id="btn-print-passport"
                onClick={handlePrintCard}
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all flex items-center gap-1 border border-white/15 cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print Card
              </button>
            </div>

            {/* Passport Core Data GRID */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-neutral-100">
              
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold font-mono">Patient Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-mono text-neutral-400">Child Name</p>
                    <p className="text-sm font-bold text-neutral-800">{activePatient.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono text-neutral-400">Vaccine ID (EPI)</p>
                    <p className="text-sm font-mono font-bold text-[#005F73] select-all">{activePatient.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono text-neutral-400">Date of Birth</p>
                    <p className="text-xs text-neutral-700 font-medium">{activePatient.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono text-neutral-400">Gender</p>
                    <p className="text-xs text-neutral-700 font-medium">{activePatient.gender}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono text-neutral-400">Guardian Name</p>
                    <p className="text-xs text-neutral-700 font-bold">{activePatient.guardianName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono text-neutral-400">Guardian Contact</p>
                    <p className="text-xs text-neutral-700 font-mono flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#00D4C7]" /> {activePatient.guardianPhone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase font-mono text-neutral-400">Primary Residence Address</p>
                    <p className="text-xs text-neutral-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-neutral-400" /> {activePatient.address}, {activePatient.district}, {activePatient.province}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR and Barcode Identification block */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 flex flex-col items-center justify-center text-center space-y-3">
                <span className="text-[9px] uppercase tracking-wider font-mono text-neutral-400">Verify Identity Code</span>
                {/* Visual simulator for dynamic QR */}
                <div className="w-28 h-28 bg-white border border-neutral-200 rounded p-1.5 flex items-center justify-center relative shadow-sm select-none">
                  {/* Visual QR Code Generator */}
                  <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-neutral-100 rounded">
                    <div className="bg-neutral-800 rounded"></div>
                    <div className="bg-neutral-800 rounded"></div>
                    <div className="bg-neutral-100"></div>
                    <div className="bg-neutral-800 rounded"></div>
                    <div className="bg-neutral-800 rounded"></div>
                    <div className="bg-neutral-100"></div>
                    <div className="bg-neutral-800 rounded"></div>
                    <div className="bg-neutral-100"></div>
                    <div className="bg-neutral-100"></div>
                    <div className="bg-neutral-800 rounded"></div>
                    <div className="bg-neutral-800 rounded"></div>
                    <div className="bg-neutral-800 rounded"></div>
                    <div className="bg-neutral-800 rounded"></div>
                    <div className="bg-neutral-100"></div>
                    <div className="bg-neutral-100"></div>
                    <div className="bg-neutral-800 rounded"></div>
                  </div>
                  <span className="absolute bottom-0 right-0 bg-[#00D4C7] text-[8px] font-bold text-neutral-900 px-1 py-0.5 rounded font-mono">EPI-QR</span>
                </div>
                <div>
                  <code className="text-[9px] font-mono font-semibold bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded">
                    {activePatient.guardianNationalId}
                  </code>
                  <p className="text-[9px] text-neutral-400 mt-1 font-mono">CNIC NATIONAL DIRECTORY MATCH</p>
                </div>
              </div>

            </div>

            {/* Inoculation ledger history list */}
            <div className="p-6 space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold font-mono flex items-center gap-1">
                <ClipboardList className="w-4 h-4 text-[#005F73]" /> Immunization Ledger ({activePatient.vaccinations.length} Doses Logged)
              </h4>
              
              {activePatient.vaccinations.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-neutral-200 rounded-lg text-neutral-400 text-xs">
                  This infant has not registered any vaccinations. Use the Vaccination administration card to log a clinic dose.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-500 font-mono text-[10px] uppercase border-b border-neutral-100">
                        <th className="p-2.5">Vaccine (Dose)</th>
                        <th className="p-2.5">Date Injected</th>
                        <th className="p-2.5">Batch Reference</th>
                        <th className="p-2.5">Clinic Node</th>
                        <th className="p-2.5">Administered By</th>
                        <th className="p-[#005F73] p-2.5">Next Dose Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 font-light text-neutral-600">
                      {activePatient.vaccinations.map((v) => (
                        <tr key={v.id} className="hover:bg-neutral-50/50">
                          <td className="p-2.5 font-bold text-neutral-800">{v.vaccineName} (#{v.doseNumber})</td>
                          <td className="p-2.5 font-mono text-neutral-500">{new Date(v.administeredAt).toLocaleDateString()}</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] text-neutral-500 font-mono">{v.batchNumber}</span></td>
                          <td className="p-2.5 font-sans">{v.facilityName}</td>
                          <td className="p-2.5">{v.administeredBy} ({v.administeredByRole})</td>
                          <td className="p-2.5 text-deep-blue text-[#005F73] font-bold font-mono">{v.nextDoseAt || "Routine Complete"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Register New Patient Intake Form */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <UserPlus className="w-4 h-4 text-[#00D4C7] bg-[#005F73]/10 p-0.5 rounded" /> Infant POS Intake Registration
          </h4>
          <form id="child-registration-form" onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            
            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Child's Full Name *</label>
              <input
                id="reg-fullname"
                type="text"
                required
                placeholder="e.g. Zainab Bibi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00D4C7]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Date of Birth *</label>
              <input
                id="reg-dob"
                type="date"
                required
                max={new Date().toISOString().split("T")[0]}
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full p-2 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00D4C7]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Gender *</label>
              <select
                id="reg-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as "Male" | "Female" | "Other")}
                className="w-full p-2 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00D4C7]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Guardian's Full Name *</label>
              <input
                id="reg-guardian-name"
                type="text"
                required
                placeholder="e.g. Muhammad Nadeem"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full p-2 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00D4C7]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Guardian's Contact Mobile *</label>
              <input
                id="reg-guardian-phone"
                type="tel"
                required
                placeholder="e.g. +92 300 1234567"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                className="w-full p-2 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00D4C7]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Guardian's National CNIC *</label>
              <input
                id="reg-cnic"
                type="text"
                required
                placeholder="xxxxx-xxxxxxx-x"
                value={guardianNationalId}
                onChange={(e) => setGuardianNationalId(e.target.value)}
                className="w-full p-2 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00D4C7]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Province *</label>
              <select
                id="reg-province"
                value={province}
                onChange={handleProvinceChange}
                className="w-full p-2 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00D4C7]"
              >
                {Object.keys(provincesAndDistricts).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">District *</label>
              <select
                id="reg-district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00D4C7]"
              >
                {(provincesAndDistricts[province] || []).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-1">
              <label className="font-bold text-neutral-700">Address Location details</label>
              <textarea
                id="reg-address"
                placeholder="Street address, block, village name..."
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00D4C7]"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="font-bold text-neutral-700">Clinical Intake Notes (allergies, health status etc.)</label>
              <input
                id="reg-notes"
                type="text"
                placeholder="Remarks about the child's health status..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00D4C7]"
              />
            </div>

            <div className="col-span-2 pt-2">
              <button
                id="btn-submit-registration"
                type="submit"
                className="w-full py-2.5 rounded bg-[#005F73] text-white hover:bg-[#00D4C7] hover:text-neutral-900 font-semibold cursor-pointer transition-all shadow"
              >
                Register Child & Generate Digital Passport Code
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
};

const ChevronRightSmall = () => (
  <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
