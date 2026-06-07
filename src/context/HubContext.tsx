/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserRole,
  Patient,
  Vaccine,
  AdministeredVaccine,
  ColdChainFridge,
  FridgeTemperatureLog,
  NotificationRecord,
  FieldFeedback,
  AuditTrailLog,
  EodReconciliationLog,
  SyncConfiguration
} from "../types";
import {
  INITIAL_USERS,
  INITIAL_VACCINES,
  INITIAL_PATIENTS,
  INITIAL_COLD_CHAIN,
  INITIAL_TEMP_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_FEEDBACK,
  INITIAL_AUDIT_LOGS,
  INITIAL_EOD_RECONCILIATION,
  DEFAULT_SYNC_CONFIG
} from "../mockData";

interface HubContextType {
  currentUser: User | null;
  users: User[];
  patients: Patient[];
  vaccines: Vaccine[];
  coldChainFridges: ColdChainFridge[];
  tempLogs: FridgeTemperatureLog[];
  notifications: NotificationRecord[];
  feedback: FieldFeedback[];
  auditLogs: AuditTrailLog[];
  eodLogs: EodReconciliationLog[];
  syncConfig: SyncConfiguration;
  darkMode: boolean;
  language: "en" | "ur" | "sd"; // English, Urdu, Sindhi
  offlineMode: boolean;
  
  // Actions
  login: (emailOrEmployeeId: string, role: UserRole) => { success: boolean; error?: string };
  logout: () => void;
  registerUser: (userData: Omit<User, "id" | "isApproved" | "registeredAt">) => void;
  approveUser: (userId: string) => void;
  addPatient: (patient: Omit<Patient, "id" | "registeredAt" | "registeredBy" | "qrCodeData" | "vaccinations">) => Patient;
  administerVaccine: (record: Omit<AdministeredVaccine, "id" | "administeredAt" | "administeredBy" | "administeredByRole">) => void;
  addVaccineStock: (vaccineId: string, additionalDoses: number, batchNo?: string, expiryDate?: string) => void;
  reportWastedDoses: (vaccineId: string, dosesQty: number, reason: string) => void;
  logTemperature: (fridgeId: string, tempCelsius: number, loggedBy: string) => void;
  submitEodReconciliation: (log: Omit<EodReconciliationLog, "id" | "supervisorApproval">) => void;
  approveEodReconciliation: (eodId: string, supervisorName: string) => void;
  triggerNotification: (type: "sms" | "system" | "email", category: "reminder" | "warning" | "alert", recipient: string, title: string, message: string) => void;
  submitFeedback: (fdb: Omit<FieldFeedback, "id" | "date">) => void;
  addAuditLog: (category: AuditTrailLog["category"], action: string, details: string) => void;
  updateSyncConfig: (config: SyncConfiguration) => void;
  setLanguage: (lang: "en" | "ur" | "sd") => void;
  setDarkMode: (val: boolean) => void;
  setOfflineMode: (val: boolean) => void;
  backupData: () => string;
  restoreData: (jsonStr: string) => boolean;
  clearAllData: () => void;
}

const HubContext = createContext<HubContextType | undefined>(undefined);

export const HubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [coldChainFridges, setColdChainFridges] = useState<ColdChainFridge[]>([]);
  const [tempLogs, setTempLogs] = useState<FridgeTemperatureLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [feedback, setFeedback] = useState<FieldFeedback[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditTrailLog[]>([]);
  const [eodLogs, setEodLogs] = useState<EodReconciliationLog[]>([]);
  const [syncConfig, setSyncConfig] = useState<SyncConfiguration>(DEFAULT_SYNC_CONFIG);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<"en" | "ur" | "sd">("en");
  const [offlineMode, setOfflineMode] = useState<boolean>(false);

  // Initialize from LocalStorage or Load Mocks
  useEffect(() => {
    const storedUsers = localStorage.getItem("nih_users");
    const storedPatients = localStorage.getItem("nih_patients");
    const storedVaccines = localStorage.getItem("nih_vaccines");
    const storedColdChain = localStorage.getItem("nih_cold_chain");
    const storedTempLogs = localStorage.getItem("nih_temp_logs");
    const storedNotifications = localStorage.getItem("nih_notifications");
    const storedFeedback = localStorage.getItem("nih_feedback");
    const storedAudit = localStorage.getItem("nih_audit_logs");
    const storedEod = localStorage.getItem("nih_eod_logs");
    const storedSync = localStorage.getItem("nih_sync_config");
    const storedLang = localStorage.getItem("nih_language");
    const storedDark = localStorage.getItem("nih_dark_mode");

    setUsers(storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS);
    setPatients(storedPatients ? JSON.parse(storedPatients) : INITIAL_PATIENTS);
    setVaccines(storedVaccines ? JSON.parse(storedVaccines) : INITIAL_VACCINES);
    setColdChainFridges(storedColdChain ? JSON.parse(storedColdChain) : INITIAL_COLD_CHAIN);
    setTempLogs(storedTempLogs ? JSON.parse(storedTempLogs) : INITIAL_TEMP_LOGS);
    setNotifications(storedNotifications ? JSON.parse(storedNotifications) : INITIAL_NOTIFICATIONS);
    setFeedback(storedFeedback ? JSON.parse(storedFeedback) : INITIAL_FEEDBACK);
    setAuditLogs(storedAudit ? JSON.parse(storedAudit) : INITIAL_AUDIT_LOGS);
    setEodLogs(storedEod ? JSON.parse(storedEod) : INITIAL_EOD_RECONCILIATION);
    setSyncConfig(storedSync ? JSON.parse(storedSync) : DEFAULT_SYNC_CONFIG);
    setLanguage((storedLang as "en" | "ur" | "sd") || "en");
    setDarkMode(storedDark === "true");

    // Automatically set a default logged in administrator if not found
    const activeUser = localStorage.getItem("nih_current_user");
    if (activeUser) {
      setCurrentUser(JSON.parse(activeUser));
    } else {
      // Default to Dr. Ayesha Alvi (Admin) for demo ease
      setCurrentUser(INITIAL_USERS[0]);
    }
  }, []);

  // Save to LocalStorage helpers
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addAuditLog = (category: AuditTrailLog["category"], action: string, details: string) => {
    const newLog: AuditTrailLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      category,
      action,
      details,
      performedBy: currentUser ? currentUser.fullName : "Anonymous/System",
      employeeId: currentUser ? currentUser.employeeId : "SYS"
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      saveState("nih_audit_logs", updated);
      return updated;
    });
  };

  const login = (emailOrEmployeeId: string, role: UserRole) => {
    const trimmed = emailOrEmployeeId.trim().toLowerCase();
    const foundUser = users.find(
      (u) =>
        (u.email.toLowerCase() === trimmed || u.employeeId.toLowerCase() === trimmed) &&
        u.role === role
    );

    if (foundUser) {
      if (!foundUser.isApproved) {
        return { success: false, error: "Account is pending administrator approval." };
      }
      setCurrentUser(foundUser);
      saveState("nih_current_user", foundUser);
      
      const sessionLogMsg = `Logged in successfully as ${foundUser.fullName} (Employee ID: ${foundUser.employeeId})`;
      addAuditLog("AUTH", "User Login", sessionLogMsg);
      return { success: true };
    }

    // Demo Auto-gen User: If we are in demo, create a user on the fly so login always succeeds for demo purposes!
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const demoUser: User = {
      id: `EMP-${Date.now()}`,
      fullName: `Officer ${randomNum}`,
      employeeId: emailOrEmployeeId.includes("-") ? emailOrEmployeeId.toUpperCase() : `NIH-${randomNum}`,
      email: emailOrEmployeeId.includes("@") ? emailOrEmployeeId : `user${randomNum}@nih.gov.pk`,
      phoneNumber: "+92 300 0000000",
      role,
      healthFacility: "National Institute of Health Main Campus",
      district: "Islamabad Capital Territory",
      province: "ICT Islamabad",
      isApproved: true,
      registeredAt: new Date().toISOString()
    };

    setUsers((prev) => {
      const updated = [...prev, demoUser];
      saveState("nih_users", updated);
      return updated;
    });
    setCurrentUser(demoUser);
    saveState("nih_current_user", demoUser);
    addAuditLog("AUTH", "Demoware User Created & Logged In", `Automatically created workspace account for demo user ${demoUser.fullName}`);
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog("AUTH", "User Logout", `User ${currentUser.fullName} logged out.`);
    }
    setCurrentUser(null);
    localStorage.removeItem("nih_current_user");
  };

  const registerUser = (userData: Omit<User, "id" | "isApproved" | "registeredAt">) => {
    const newUser: User = {
      ...userData,
      id: `EMP-${Date.now()}`,
      // First 2 roles approved instantly for streamlined prototype showcase, admins can approve other roles
      isApproved: userData.role === UserRole.ADMINISTRATOR || userData.role === UserRole.MEDICAL_OFFICER,
      registeredAt: new Date().toISOString()
    };

    setUsers((prev) => {
      const updated = [...prev, newUser];
      saveState("nih_users", updated);
      return updated;
    });

    addAuditLog(
      "AUTH",
      "User Accounts Registration",
      `New user request submitted: ${newUser.fullName} (${newUser.role}) at ${newUser.healthFacility}.`
    );
  };

  const approveUser = (userId: string) => {
    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === userId ? { ...u, isApproved: true } : u));
      saveState("nih_users", updated);
      const approved = prev.find((u) => u.id === userId);
      if (approved) {
        addAuditLog(
          "USER_MGMT",
          "Account Status Modification",
          `Admin approved health worker account for ${approved.fullName} (${approved.role}).`
        );
      }
      return updated;
    });
  };

  const addPatient = (patientData: Omit<Patient, "id" | "registeredAt" | "registeredBy" | "qrCodeData" | "vaccinations">) => {
    const randomSerial = Math.floor(1000 + Math.random() * 9000);
    const uniqueId = `NIH-2026-${randomSerial}`;
    const formattedDate = new Date().toISOString();
    const qrString = `${uniqueId}|${patientData.fullName}|Guardian:${patientData.guardianName}|Phone:${patientData.guardianPhone}`;

    const newPatient: Patient = {
      ...patientData,
      id: uniqueId,
      registeredAt: formattedDate,
      registeredBy: currentUser ? `${currentUser.fullName} (${currentUser.employeeId})` : "System Registrar",
      qrCodeData: qrString,
      vaccinations: []
    };

    setPatients((prev) => {
      const updated = [newPatient, ...prev];
      saveState("nih_patients", updated);
      return updated;
    });

    addAuditLog(
      "REGISTRATION",
      "Patient POS Registration",
      `Registered child ${newPatient.fullName} (ID: ${newPatient.id}) under Guardian: ${newPatient.guardianName} in ${newPatient.district}.`
    );

    // Auto trigger notification
    triggerNotification(
      "sms",
      "reminder",
      patientData.guardianPhone,
      "Child Registration Complete",
      `Welcome to National Immunization Hub. ${patientData.fullName} registered successfully on ${formattedDate.split("T")[0]}. Patient Digital ID: ${uniqueId}.`
    );

    return newPatient;
  };

  const administerVaccine = (record: Omit<AdministeredVaccine, "id" | "administeredAt" | "administeredBy" | "administeredByRole">) => {
    const newAdminRecord: AdministeredVaccine = {
      ...record,
      id: `REC-${Date.now()}`,
      administeredAt: new Date().toISOString(),
      administeredBy: currentUser ? currentUser.fullName : "System Clinician",
      administeredByRole: currentUser ? currentUser.role : "Vaccinator"
    };

    // Update patient record
    setPatients((prev) => {
      const updated = prev.map((p) => {
        if (p.id === record.patientId) {
          return {
            ...p,
            vaccinations: [...p.vaccinations, newAdminRecord]
          };
        }
        return p;
      });
      saveState("nih_patients", updated);
      return updated;
    });

    // Deduct stock quantity
    setVaccines((prev) => {
      const updated = prev.map((v) => {
        if (v.id === record.vaccineId) {
          const count = Math.max(0, v.dosesInStock - 1);
          const currentStatus = count === 0 ? "Out of Stock" : count <= v.lowStockThreshold ? "Low Stock" : "In Stock";
          
          if (count <= v.lowStockThreshold) {
            triggerNotification(
              "system",
              "warning",
              "Warehouse Manager",
              `Low Stock: ${v.name} depletion alert`,
              `Vaccine stock alert: ${v.name} (Batch: ${v.batchNumber}) is running low. Remaining doses: ${count}`
            );
          }
          return {
            ...v,
            dosesInStock: count,
            status: currentStatus as Vaccine["status"]
          };
        }
        return v;
      });
      saveState("nih_vaccines", updated);
      return updated;
    });

    // Create Audit Log
    addAuditLog(
      "VACCINATION",
      "Vaccine Dose Administration",
      `Administered ${newAdminRecord.vaccineName} (Dose #${newAdminRecord.doseNumber}) to Patient ID: ${newAdminRecord.patientId}. Next dose scheduled: ${newAdminRecord.nextDoseAt || "N/A"}`
    );

    // Trigger SMS
    const smsMsg = `Dear Guardian, ${newAdminRecord.patientName} was administered ${newAdminRecord.vaccineName} Dose ${newAdminRecord.doseNumber} today. Next dose is scheduled for ${newAdminRecord.nextDoseAt || "Completed Routine Plan"}.`;
    
    // Attempt lookup phone
    const childObj = patients.find(p => p.id === record.patientId);
    triggerNotification(
      "sms",
      "reminder",
      childObj?.guardianPhone || "+92 300 1234567",
      "Dose Administered Alert",
      smsMsg
    );
  };

  const addVaccineStock = (vaccineId: string, additionalDoses: number, batchNo?: string, expiryDate?: string) => {
    setVaccines((prev) => {
      const updated = prev.map((v) => {
        if (v.id === vaccineId) {
          const totalCount = v.dosesInStock + additionalDoses;
          const status = totalCount > v.lowStockThreshold ? "In Stock" : totalCount > 0 ? "Low Stock" : "Out of Stock";
          return {
            ...v,
            dosesInStock: totalCount,
            status: status as Vaccine["status"],
            batchNumber: batchNo || v.batchNumber,
            expiryDate: expiryDate || v.expiryDate
          };
        }
        return v;
      });
      saveState("nih_vaccines", updated);
      return updated;
    });

    const targetVaccine = vaccines.find((v) => v.id === vaccineId);
    addAuditLog(
      "INVENTORY",
      "Warehouse Stock Intake",
      `Added ${additionalDoses} doses to ${targetVaccine?.name || vaccineId} stockpile. Batch Ref: ${batchNo || "Same"}`
    );
  };

  const reportWastedDoses = (vaccineId: string, dosesQty: number, reason: string) => {
    setVaccines((prev) => {
      const updated = prev.map((v) => {
        if (v.id === vaccineId) {
          const count = Math.max(0, v.dosesInStock - dosesQty);
          const status = count > v.lowStockThreshold ? "In Stock" : count > 0 ? "Low Stock" : "Out of Stock";
          return {
            ...v,
            dosesInStock: count,
            status: status as Vaccine["status"]
          };
        }
        return v;
      });
      saveState("nih_vaccines", updated);
      return updated;
    });

    const vName = vaccines.find(v => v.id === vaccineId)?.name || vaccineId;
    addAuditLog(
      "INVENTORY",
      "Stock Wastage Deductions",
      `Deducted ${dosesQty} wasted doses of ${vName}. Reason specified: ${reason}`
    );
  };

  const logTemperature = (fridgeId: string, tempCelsius: number, loggedBy: string) => {
    const fridge = coldChainFridges.find((f) => f.id === fridgeId);
    if (!fridge) return;

    let fridgeStatus: "Normal" | "Warning" | "Critical" = "Normal";
    if (tempCelsius < fridge.targetTempMinCelsius || tempCelsius > fridge.targetTempMaxCelsius) {
      // Over bounds
      fridgeStatus = Math.abs(tempCelsius - fridge.targetTempMaxCelsius) > 3 ? "Critical" : "Warning";
    }

    // Append Temp Log
    const newLog: FridgeTemperatureLog = {
      id: `TL-${Date.now()}`,
      fridgeId,
      fridgeName: fridge.fridgeName,
      recordedTemperatureCelsius: tempCelsius,
      timestamp: new Date().toISOString(),
      status: fridgeStatus,
      loggedBy
    };

    setTempLogs((prev) => {
      const updated = [newLog, ...prev];
      saveState("nih_temp_logs", updated);
      return updated;
    });

    // Update Fridge Status
    setColdChainFridges((prev) => {
      const updated = prev.map((f) => {
        if (f.id === fridgeId) {
          return {
            ...f,
            currentTemperatureCelsius: tempCelsius,
            status: fridgeStatus,
            lastVerifiedAt: new Date().toISOString()
          };
        }
        return f;
      });
      saveState("nih_cold_chain", updated);
      return updated;
    });

    if (fridgeStatus !== "Normal") {
      addAuditLog(
        "COLDCHAIN",
        `Cold Chain Fridge Alert (${fridgeStatus.toUpperCase()})`,
        `Fridge "${fridge.fridgeName}" at ${fridge.facilityName} registered anomalous temperature ${tempCelsius}°C. Required range: ${fridge.targetTempMinCelsius}°C to ${fridge.targetTempMaxCelsius}°C.`
      );

      triggerNotification(
        "system",
        "alert",
        "Facility Superintendent",
        `CRITICAL Temperature Alarm: ${fridge.fridgeName}`,
        `Fridge alert at ${fridge.facilityName}: Temperature reading is ${tempCelsius}°C, breaching safety thresholds!`
      );
    } else {
      addAuditLog(
        "COLDCHAIN",
        "Fridge Temperature Logged",
        `Fridge "${fridge.fridgeName}" logging temperature confirmed safe at ${tempCelsius}°C.`
      );
    }
  };

  const submitEodReconciliation = (log: Omit<EodReconciliationLog, "id" | "supervisorApproval">) => {
    const newLog: EodReconciliationLog = {
      ...log,
      id: `EOD-${Date.now()}`,
      supervisorApproval: "Pending"
    };

    setEodLogs((prev) => {
      const updated = [newLog, ...prev];
      saveState("nih_eod_logs", updated);
      return updated;
    });

    addAuditLog(
      "INVENTORY",
      "EOD Reconciliation Submission",
      `Worker ${log.vaccinatorName} registered End-of-Day report for ${log.date}. Physical vials count: ${log.physicalDosesVialsCount}, Variance count: ${log.varianceCount}`
    );
  };

  const approveEodReconciliation = (eodId: string, supervisorName: string) => {
    setEodLogs((prev) => {
      const updated = prev.map((l) =>
        l.id === eodId
          ? {
              ...l,
              supervisorApproval: "Approved",
              approvedBy: supervisorName,
              approvedAt: new Date().toISOString()
            }
          : l
      );
      saveState("nih_eod_logs", updated);
      return updated;
    });

    addAuditLog(
      "INVENTORY",
      "EOD Reconciliation Approved",
      `Supervisor ${supervisorName} approved End-of-Day report ID: ${eodId}.`
    );
  };

  const triggerNotification = (
    type: "sms" | "system" | "email",
    category: "reminder" | "warning" | "alert",
    recipient: string,
    title: string,
    message: string
  ) => {
    const record: NotificationRecord = {
      id: `NTF-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      type,
      category,
      recipient,
      title,
      message,
      status: "sent",
      timestamp: new Date().toISOString()
    };

    setNotifications((prev) => {
      const updated = [record, ...prev];
      saveState("nih_notifications", updated);
      return updated;
    });
  };

  const submitFeedback = (fdb: Omit<FieldFeedback, "id" | "date">) => {
    const feedbackRecord: FieldFeedback = {
      ...fdb,
      id: `FDB-${Date.now()}`,
      date: new Date().toISOString().split("T")[0]
    };

    setFeedback((prev) => {
      const updated = [feedbackRecord, ...prev];
      saveState("nih_feedback", updated);
      return updated;
    });

    addAuditLog(
      "REPORTS",
      "User Survey Feedback Received",
      `Submitted satisfaction feedback from LHVs/Vaccinator: ${fdb.name} (Rating: ${fdb.rating}/5)`
    );
  };

  const updateSyncConfig = (config: SyncConfiguration) => {
    const updated = {
      ...config,
      lastSyncedAt: config.isSyncingEnabled ? new Date().toISOString() : config.lastSyncedAt
    };
    setSyncConfig(updated);
    saveState("nih_sync_config", updated);
    addAuditLog(
      "SETTINGS",
      "Sync Settings Modified",
      `Backup/Sync configurations updated to use ${config.provider} active provider.`
    );
  };

  const setLanguageAndSave = (lang: "en" | "ur" | "sd") => {
    setLanguage(lang);
    localStorage.setItem("nih_language", lang);
    addAuditLog("SETTINGS", "Language Changed", `Changed application view language to [${lang.toUpperCase()}]`);
  };

  const setDarkModeAndSave = (val: boolean) => {
    setDarkMode(val);
    localStorage.setItem("nih_dark_mode", val ? "true" : "false");
  };

  const setOfflineModeAndSave = (val: boolean) => {
    setOfflineMode(val);
    addAuditLog("SETTINGS", "Offline Status Changed", `Switched application network to [${val ? "Offline Mode" : "Online Mode"}]`);
  };

  const backupData = () => {
    const fullBackup = {
      users,
      patients,
      vaccines,
      coldChainFridges,
      tempLogs,
      notifications,
      feedback,
      auditLogs,
      eodLogs,
      syncConfig,
      language,
      darkMode
    };
    addAuditLog("SETTINGS", "Database Export", "Triggered binary client database backup export JSON.");
    return JSON.stringify(fullBackup, null, 2);
  };

  const restoreData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.users) { setUsers(parsed.users); saveState("nih_users", parsed.users); }
      if (parsed.patients) { setPatients(parsed.patients); saveState("nih_patients", parsed.patients); }
      if (parsed.vaccines) { setVaccines(parsed.vaccines); saveState("nih_vaccines", parsed.vaccines); }
      if (parsed.coldChainFridges) { setColdChainFridges(parsed.coldChainFridges); saveState("nih_cold_chain", parsed.coldChainFridges); }
      if (parsed.tempLogs) { setTempLogs(parsed.tempLogs); saveState("nih_temp_logs", parsed.tempLogs); }
      if (parsed.notifications) { setNotifications(parsed.notifications); saveState("nih_notifications", parsed.notifications); }
      if (parsed.feedback) { setFeedback(parsed.feedback); saveState("nih_feedback", parsed.feedback); }
      if (parsed.auditLogs) { setAuditLogs(parsed.auditLogs); saveState("nih_audit_logs", parsed.auditLogs); }
      if (parsed.eodLogs) { setEodLogs(parsed.eodLogs); saveState("nih_eod_logs", parsed.eodLogs); }
      if (parsed.syncConfig) { setSyncConfig(parsed.syncConfig); saveState("nih_sync_config", parsed.syncConfig); }
      if (parsed.language) { setLanguage(parsed.language); localStorage.setItem("nih_language", parsed.language); }
      if (parsed.darkMode !== undefined) { setDarkMode(parsed.darkMode); localStorage.setItem("nih_dark_mode", parsed.darkMode ? "true" : "false"); }

      addAuditLog("SETTINGS", "Database Restored", "Client database backup successfully synchronized and restored.");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const clearAllData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setPatients(INITIAL_PATIENTS);
    setVaccines(INITIAL_VACCINES);
    setColdChainFridges(INITIAL_COLD_CHAIN);
    setTempLogs(INITIAL_TEMP_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setFeedback(INITIAL_FEEDBACK);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setEodLogs(INITIAL_EOD_RECONCILIATION);
    setSyncConfig(DEFAULT_SYNC_CONFIG);
    setLanguage("en");
    setDarkMode(false);
    setCurrentUser(INITIAL_USERS[0]);
    addAuditLog("SETTINGS", "Database Hard Reset", "Successfully executed deep wipe database hard reset. Default schemas restored.");
  };

  return (
    <HubContext.Provider
      value={{
        currentUser,
        users,
        patients,
        vaccines,
        coldChainFridges,
        tempLogs,
        notifications,
        feedback,
        auditLogs,
        eodLogs,
        syncConfig,
        darkMode,
        language,
        offlineMode,
        login,
        logout,
        registerUser,
        approveUser,
        addPatient,
        administerVaccine,
        addVaccineStock,
        reportWastedDoses,
        logTemperature,
        submitEodReconciliation,
        approveEodReconciliation,
        triggerNotification,
        submitFeedback,
        addAuditLog,
        updateSyncConfig,
        setLanguage: setLanguageAndSave,
        setDarkMode: setDarkModeAndSave,
        setOfflineMode: setOfflineModeAndSave,
        backupData,
        restoreData,
        clearAllData
      }}
    >
      {children}
    </HubContext.Provider>
  );
};

export const useHub = () => {
  const context = useContext(HubContext);
  if (context === undefined) {
    throw new Error("useHub must be used within a HubProvider");
  }
  return context;
};
