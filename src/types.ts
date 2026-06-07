/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  ADMINISTRATOR = "Administrator",
  MEDICAL_OFFICER = "Medical Officer",
  VACCINATOR = "Vaccinator",
  LADY_HEALTH_VISITOR = "Lady Health Visitor",
  INVENTORY_MANAGER = "Inventory Manager",
  DATA_ENTRY_OPERATOR = "Data Entry Operator",
}

export interface User {
  id: string;
  fullName: string;
  employeeId: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  healthFacility: string;
  district: string;
  province: string;
  isApproved: boolean;
  registeredAt: string;
}

export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  guardianName: string;
  guardianPhone: string;
  guardianNationalId: string;
  province: string;
  district: string;
  healthFacility: string;
  address: string;
  registeredAt: string;
  registeredBy: string;
  qrCodeData: string;
  notes?: string;
  vaccinations: AdministeredVaccine[];
}

export interface Vaccine {
  id: string;
  name: string;
  diseasesCovered: string[];
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  dosageMl: number;
  route: "Oral" | "Intramuscular" | "Subcutaneous" | "Intradermal";
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Expired";
  dosesInStock: number;
  lowStockThreshold: number;
  temperatureMinCelsius: number;
  temperatureMaxCelsius: number;
  dosesRequiredCount: number;
  scheduleWeeks: number[]; // e.g. [0, 6, 10, 14] weeks of age
}

export interface AdministeredVaccine {
  id: string;
  patientId: string;
  patientName: string;
  vaccineId: string;
  vaccineName: string;
  doseNumber: number;
  administeredAt: string;
  administeredBy: string;
  administeredByRole: string;
  batchNumber: string;
  facilityName: string;
  nextDoseAt: string | null;
  digitalSignature: string | null; // Base64 signature path or string description
  adverseEventReported: boolean;
  adverseEventNotes?: string;
}

export interface ColdChainFridge {
  id: string;
  facilityName: string;
  fridgeName: string;
  vaccinesStored: string[];
  currentTemperatureCelsius: number;
  targetTempMinCelsius: number;
  targetTempMaxCelsius: number;
  powerSource: "Main Grid" | "Solar Battery Backup" | "Diesel Generator";
  powerStatus: "Online" | "Offline - Switched to Diesel" | "Battery Warning";
  status: "Normal" | "Warning" | "Critical";
  lastVerifiedAt: string;
}

export interface FridgeTemperatureLog {
  id: string;
  fridgeId: string;
  fridgeName: string;
  recordedTemperatureCelsius: number;
  timestamp: string;
  status: "Normal" | "Warning" | "Critical";
  loggedBy: string;
}

export interface NotificationRecord {
  id: string;
  type: "sms" | "system" | "email";
  category: "reminder" | "warning" | "alert" | "update";
  recipient: string;
  title: string;
  message: string;
  status: "sent" | "pending" | "failed";
  timestamp: string;
}

export interface FieldFeedback {
  id: string;
  name: string;
  role: UserRole;
  facility: string;
  rating: number;
  reviewText: string;
  successStory: boolean;
  date: string;
}

export interface AuditTrailLog {
  id: string;
  timestamp: string;
  category: "AUTH" | "REGISTRATION" | "VACCINATION" | "INVENTORY" | "COLDCHAIN" | "REPORTS" | "USER_MGMT" | "SETTINGS";
  action: string;
  details: string;
  performedBy: string;
  employeeId: string;
}

export interface EodReconciliationLog {
  id: string;
  date: string;
  vaccinatorName: string;
  employeeId: string;
  facilityName: string;
  digitalDosesDispensedCount: number;
  physicalDosesVialsCount: number;
  vialsWastedCount: number;
  varianceCount: number;
  varianceReason: string;
  supervisorApproval: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
  approvedAt?: string;
  notes: string;
}

export interface SyncConfiguration {
  provider: "LocalStorage" | "Google Firebase" | "Google Sheets API" | "Google Cloud DB";
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  sheetsConfig: {
    spreadsheetId: string;
    clientEmail: string;
    privateKey: string;
  };
  cloudDbConfig: {
    hostUrl: string;
    apiKey: string;
  };
  syncIntervalMinutes: number;
  isSyncingEnabled: boolean;
  lastSyncedAt: string | null;
}
