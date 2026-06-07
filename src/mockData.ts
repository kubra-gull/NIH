/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Patient,
  Vaccine,
  ColdChainFridge,
  FridgeTemperatureLog,
  NotificationRecord,
  FieldFeedback,
  AuditTrailLog,
  EodReconciliationLog,
  User,
  UserRole,
  SyncConfiguration
} from "./types";

export const MOCK_DISEASES = [
  {"id": 1, "name": "Polio", "pathogen": "Poliovirus", "preventative": "OPV (Oral Polio Vaccine) & IPV", "mortalityRate": "High (leads to paralysis)", "targetAge": "Birth, 6, 10, 14 weeks"},
  {"id": 2, "name": "Measles", "pathogen": "Measles virus", "preventative": "Measles-Rubella Vaccine", "mortalityRate": "Significant in malnourished kids", "targetAge": "9 months, 15 months"},
  {"id": 3, "name": "Tuberculosis (BCG)", "pathogen": "Mycobacterium tuberculosis", "preventative": "BCG Vaccine", "mortalityRate": "High in children without vaccine", "targetAge": "At birth"},
  {"id": 4, "name": "Diphtheria", "pathogen": "Corynebacterium diphtheriae", "preventative": "Pentavalent / DTP Vaccine", "mortalityRate": "5% - 10% in children", "targetAge": "6, 10, 14 weeks"},
  {"id": 5, "name": "Tetanus", "pathogen": "Clostridium tetani", "preventative": "Pentavalent / Td Vaccine", "mortalityRate": "Extremely High (neonatal)", "targetAge": "Maternal immunization & child routine"},
  {"id": 6, "name": "Pertussis", "pathogen": "Bordetella pertussis", "preventative": "Pentavalent / DTP Vaccine", "mortalityRate": "High in infants under 6 months", "targetAge": "6, 10, 14 weeks"},
  {"id": 7, "name": "Hepatitis B", "pathogen": "Hepatitis B virus", "preventative": "Pentavalent Vaccine & HepB Birth dose", "mortalityRate": "High chronic liver damage", "targetAge": "At birth, 6, 10, 14 weeks"},
  {"id": 8, "name": "Haemophilus Influenzae Type B (Hib)", "pathogen": "H. influenzae bacterium", "preventative": "Pentavalent Vaccine", "mortalityRate": "2% - 5% (Meningitis/Pneumonia)", "targetAge": "6, 10, 14 weeks"},
  {"id": 9, "name": "Rotavirus Diarrhea", "pathogen": "Rotavirus", "preventative": "Rotavirus Oral Vaccine (Rotarix)", "mortalityRate": "Leading cause of vaccine-preventable diarrhea", "targetAge": "6, 10 weeks"},
  {"id": 10, "name": "Pneumococcal Pneumonia", "pathogen": "Streptococcus pneumoniae", "preventative": "Pneumococcal Conjugate Vaccine (PCV10)", "mortalityRate": "Vicious respiratory infection", "targetAge": "6, 10, 14 weeks"},
  {"id": 11, "name": "Typhoid", "pathogen": "Salmonella typhi", "preventative": "Typhoid Conjugate Vaccine (TCV)", "mortalityRate": "High drug-resistant fever threat", "targetAge": "9 months"},
  {"id": 12, "name": "Rubella", "pathogen": "Rubella virus", "preventative": "Measles-Rubella Vaccine", "mortalityRate": "Severe congenital defects on fetus", "targetAge": "9 months, 15 months"}
];

export const INITIAL_USERS: User[] = [
  {
    id: "EMP-2026-001",
    fullName: "Dr. Ayesha Alvi",
    employeeId: "NIH-9901",
    email: "ayesha.alvi@nih.gov.pk",
    phoneNumber: "+92 300 1234567",
    role: UserRole.ADMINISTRATOR,
    healthFacility: "National Institute of Health Main Campus",
    district: "Islamabad Capital Territory",
    province: "ICT Islamabad",
    isApproved: true,
    registeredAt: "2026-01-15T08:30:00Z"
  },
  {
    id: "EMP-2026-002",
    fullName: "Kamran Shah",
    employeeId: "NIH-4412",
    email: "kamran.shah@health-dept.gov.pk",
    phoneNumber: "+92 312 9876543",
    role: UserRole.MEDICAL_OFFICER,
    healthFacility: "District Headquarters Hospital",
    district: "Rawalpindi",
    province: "Punjab",
    isApproved: true,
    registeredAt: "2026-02-10T09:15:00Z"
  },
  {
    id: "EMP-2026-003",
    fullName: "Safia Bibi",
    employeeId: "LHV-8854",
    email: "safia.lhv@peshawar-health.org",
    phoneNumber: "+92 333 4567890",
    role: UserRole.LADY_HEALTH_VISITOR,
    healthFacility: "Basic Health Unit Hayatabad",
    district: "Peshawar",
    province: "Khyber Pakhtunkhwa (KPK)",
    isApproved: true,
    registeredAt: "2026-02-28T07:45:00Z"
  },
  {
    id: "EMP-2026-004",
    fullName: "Muhammad Rizwan",
    employeeId: "VAC-3091",
    email: "rizwan.vaccinator@punjab.gov.pk",
    phoneNumber: "+92 345 5556677",
    role: UserRole.VACCINATOR,
    healthFacility: "Tehsil Headquarters Hospital",
    district: "Gujranwala",
    province: "Punjab",
    isApproved: true,
    registeredAt: "2026-03-01T11:20:00Z"
  },
  {
    id: "EMP-2026-005",
    fullName: "Zarina Baloch",
    employeeId: "NIH-7711",
    email: "zarina.baloch@balochistan.gov.pk",
    phoneNumber: "+92 321 4443322",
    role: UserRole.INVENTORY_MANAGER,
    healthFacility: "Provincial Vaccine Cold Store",
    district: "Quetta",
    province: "Balochistan",
    isApproved: true,
    registeredAt: "2026-03-12T10:00:00Z"
  }
];

export const INITIAL_VACCINES: Vaccine[] = [
  {
    id: "VAC-BCG",
    name: "BCG (Tuberculosis)",
    diseasesCovered: ["Tuberculosis (BCG)"],
    manufacturer: "Serum Institute of India",
    batchNumber: "BCG-2026-99A",
    expiryDate: "2027-08-15",
    dosageMl: 0.05,
    route: "Intradermal",
    status: "In Stock",
    dosesInStock: 2450,
    lowStockThreshold: 500,
    temperatureMinCelsius: 2,
    temperatureMaxCelsius: 8,
    dosesRequiredCount: 1,
    scheduleWeeks: [0]
  },
  {
    id: "VAC-OPV",
    name: "Oral Polio Vaccine (OPV)",
    diseasesCovered: ["Polio"],
    manufacturer: "Bio-Farma S.A.",
    batchNumber: "OPV-26M01",
    expiryDate: "2026-11-30",
    dosageMl: 0.1, // 2 drops (treated as 0.1 mL in standard pos metrics)
    route: "Oral",
    status: "In Stock",
    dosesInStock: 4800,
    lowStockThreshold: 800,
    temperatureMinCelsius: -20,
    temperatureMaxCelsius: -15, // OPV stored in freezer
    dosesRequiredCount: 4,
    scheduleWeeks: [0, 6, 10, 14]
  },
  {
    id: "VAC-IPV",
    name: "Inactivated Polio Vaccine (IPV)",
    diseasesCovered: ["Polio"],
    manufacturer: "Sanofi Pasteur",
    batchNumber: "IPV-4412B",
    expiryDate: "2027-02-28",
    dosageMl: 0.5,
    route: "Intramuscular",
    status: "In Stock",
    dosesInStock: 1200,
    lowStockThreshold: 300,
    temperatureMinCelsius: 2,
    temperatureMaxCelsius: 8,
    dosesRequiredCount: 2,
    scheduleWeeks: [6, 14]
  },
  {
    id: "VAC-PENTA",
    name: "Pentavalent Vaccine",
    diseasesCovered: ["Diphtheria", "Tetanus", "Pertussis", "Hepatitis B", "Haemophilus Influenzae Type B (Hib)"],
    manufacturer: "GlaxoSmithKline",
    batchNumber: "PEN-99882",
    expiryDate: "2026-09-12",
    dosageMl: 0.5,
    route: "Intramuscular",
    status: "In Stock",
    dosesInStock: 3500,
    lowStockThreshold: 600,
    temperatureMinCelsius: 2,
    temperatureMaxCelsius: 8,
    dosesRequiredCount: 3,
    scheduleWeeks: [6, 10, 14]
  },
  {
    id: "VAC-ROTA",
    name: "Rotavirus Oral Vaccine",
    diseasesCovered: ["Rotavirus Diarrhea"],
    manufacturer: "GlaxoSmithKline (Rotarix)",
    batchNumber: "ROT-311B9",
    expiryDate: "2026-07-20",
    dosageMl: 1.5,
    route: "Oral",
    status: "Low Stock",
    dosesInStock: 380, // Low stock simulation
    lowStockThreshold: 450,
    temperatureMinCelsius: 2,
    temperatureMaxCelsius: 8,
    dosesRequiredCount: 2,
    scheduleWeeks: [6, 10]
  },
  {
    id: "VAC-PCV10",
    name: "Pneumococcal Conjugate Vaccine (PCV-10)",
    diseasesCovered: ["Pneumococcal Pneumonia"],
    manufacturer: "Pfizer Inc.",
    batchNumber: "PCV-10-8812",
    expiryDate: "2027-05-18",
    dosageMl: 0.5,
    route: "Intramuscular",
    status: "In Stock",
    dosesInStock: 1850,
    lowStockThreshold: 400,
    temperatureMinCelsius: 2,
    temperatureMaxCelsius: 8,
    dosesRequiredCount: 3,
    scheduleWeeks: [6, 10, 14]
  },
  {
    id: "VAC-TCV",
    name: "Typhoid Conjugate Vaccine (TCV)",
    diseasesCovered: ["Typhoid"],
    manufacturer: "Bharat Biotech",
    batchNumber: "TCV-77112",
    expiryDate: "2026-06-30", // Near expiry simulation
    status: "In Stock",
    dosageMl: 0.5,
    route: "Intramuscular",
    dosesInStock: 1980,
    lowStockThreshold: 350,
    temperatureMinCelsius: 2,
    temperatureMaxCelsius: 8,
    dosesRequiredCount: 1,
    scheduleWeeks: [39] // ~9 months (39 weeks)
  },
  {
    id: "VAC-MR",
    name: "Measles-Rubella Vaccine (MR)",
    diseasesCovered: ["Measles", "Rubella"],
    manufacturer: "Serum Institute of India",
    batchNumber: "MR-80812",
    expiryDate: "2027-10-22",
    dosageMl: 0.5,
    route: "Subcutaneous",
    status: "In Stock",
    dosesInStock: 4100,
    lowStockThreshold: 700,
    temperatureMinCelsius: 2,
    temperatureMaxCelsius: 8,
    dosesRequiredCount: 2,
    scheduleWeeks: [39, 65] // 9 months, 15 months
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "NIH-2026-0120",
    fullName: "Zainab Fatima",
    dateOfBirth: "2025-11-15", // ~7 months old (29 weeks)
    gender: "Female",
    guardianName: "Muhammad Zubair Alvi",
    guardianPhone: "+92 300 1234567",
    guardianNationalId: "37405-1234567-3",
    province: "Punjab",
    district: "Rawalpindi",
    healthFacility: "District Headquarters Hospital",
    address: "House 12, Street A, Satellite Town",
    registeredAt: "2025-11-20T10:30:00Z",
    registeredBy: "Dr. Ayesha Alvi (NIH-9901)",
    qrCodeData: "NIH-2026-0120|Zainab Fatima|Guardian: Muhammad Zubair Alvi|Phone: +92 300 1234567",
    notes: "Alert child. Guardian highly supportive.",
    vaccinations: [
      {
        id: "REC-001",
        patientId: "NIH-2026-0120",
        patientName: "Zainab Fatima",
        vaccineId: "VAC-BCG",
        vaccineName: "BCG (Tuberculosis)",
        doseNumber: 1,
        administeredAt: "2025-11-20T10:45:00Z",
        administeredBy: "Muhammad Rizwan (VAC-3091)",
        administeredByRole: "Vaccinator",
        batchNumber: "BCG-2026-99A",
        facilityName: "District Headquarters Hospital",
        nextDoseAt: null,
        digitalSignature: "[M.RIZWAN - PRESIGNED SIGNATURE]",
        adverseEventReported: false
      },
      {
        id: "REC-002",
        patientId: "NIH-2026-0120",
        patientName: "Zainab Fatima",
        vaccineId: "VAC-OPV",
        vaccineName: "Oral Polio Vaccine (OPV)",
        doseNumber: 1,
        administeredAt: "2025-11-20T10:45:00Z",
        administeredBy: "Muhammad Rizwan (VAC-3091)",
        administeredByRole: "Vaccinator",
        batchNumber: "OPV-26M01",
        facilityName: "District Headquarters Hospital",
        nextDoseAt: "2025-12-28", // +6 weeks
        digitalSignature: "[M.RIZWAN - SIGNED]",
        adverseEventReported: false
      },
      {
        id: "REC-003",
        patientId: "NIH-2026-0120",
        patientName: "Zainab Fatima",
        vaccineId: "VAC-PENTA",
        vaccineName: "Pentavalent Vaccine",
        doseNumber: 1,
        administeredAt: "2025-12-28T09:30:00Z",
        administeredBy: "Muhammad Rizwan (VAC-3091)",
        administeredByRole: "Vaccinator",
        batchNumber: "PEN-99882",
        facilityName: "District Headquarters Hospital",
        nextDoseAt: "2026-02-05", // +10 weeks
        digitalSignature: "[SIGNED-RIZWAN]",
        adverseEventReported: false
      },
      {
        id: "REC-004",
        patientId: "NIH-2026-0120",
        patientName: "Zainab Fatima",
        vaccineId: "VAC-PENTA",
        vaccineName: "Pentavalent Vaccine",
        doseNumber: 2,
        administeredAt: "2026-02-05T08:15:00Z",
        administeredBy: "Muhammad Rizwan (VAC-3091)",
        administeredByRole: "Vaccinator",
        batchNumber: "PEN-99882",
        facilityName: "District Headquarters Hospital",
        nextDoseAt: "2026-03-20", // +14 weeks
        digitalSignature: "[SIGNED-RIZWAN]",
        adverseEventReported: true,
        adverseEventNotes: "Mild fever (100.5°F) for 12 hours. Resolved with Paracetamol syrup."
      }
    ]
  },
  {
    id: "NIH-2026-0545",
    fullName: "Bilal Ahmad",
    dateOfBirth: "2026-05-10", // Newborn (~4 weeks old)
    gender: "Male",
    guardianName: "Abdur Rasheed",
    guardianPhone: "+92 333 4567890",
    guardianNationalId: "17301-9988776-1",
    province: "Khyber Pakhtunkhwa (KPK)",
    district: "Peshawar",
    healthFacility: "Basic Health Unit Hayatabad",
    address: "Block D3, Street 4, Phase 2 Hayatabad",
    registeredAt: "2026-05-12T11:00:00Z",
    registeredBy: "Safia Bibi (LHV-8854)",
    qrCodeData: "NIH-2026-0545|Bilal Ahmad|Guardian: Abdur Rasheed|Phone: +92 333 4567890",
    notes: "Healthy birthweight (3.2 kg). Delivered at BHU.",
    vaccinations: [
      {
        id: "REC-005",
        patientId: "NIH-2026-0545",
        patientName: "Bilal Ahmad",
        vaccineId: "VAC-BCG",
        vaccineName: "BCG (Tuberculosis)",
        doseNumber: 1,
        administeredAt: "2026-05-12T11:15:00Z",
        administeredBy: "Safia Bibi (LHV-8854)",
        administeredByRole: "Lady Health Visitor",
        batchNumber: "BCG-2026-99A",
        facilityName: "Basic Health Unit Hayatabad",
        nextDoseAt: null,
        digitalSignature: "[SAFIA-LHV-APPROVED]",
        adverseEventReported: false
      },
      {
        id: "REC-006",
        patientId: "NIH-2026-0545",
        patientName: "Bilal Ahmad",
        vaccineId: "VAC-OPV",
        vaccineName: "Oral Polio Vaccine (OPV)",
        doseNumber: 1,
        administeredAt: "2026-05-12T11:20:00Z",
        administeredBy: "Safia Bibi (LHV-8854)",
        administeredByRole: "Lady Health Visitor",
        batchNumber: "OPV-26M01",
        facilityName: "Basic Health Unit Hayatabad",
        nextDoseAt: "2026-06-21", // 6 weeks
        digitalSignature: "[SIGNED-SB]",
        adverseEventReported: false
      }
    ]
  },
  {
    id: "NIH-2026-0008",
    fullName: "Amina Baloch",
    dateOfBirth: "2025-02-12", // Over 1 year old (16 months - ~68 weeks)
    gender: "Female",
    guardianName: "Sher Zaman Baloch",
    guardianPhone: "+92 321 4443322",
    guardianNationalId: "54401-4433221-2",
    province: "Balochistan",
    district: "Quetta",
    healthFacility: "Provincial Vaccine Cold Store",
    address: "Kakar Mohalla, Airport Road",
    registeredAt: "2025-02-15T09:00:00Z",
    registeredBy: "Zarina Baloch (NIH-7711)",
    qrCodeData: "NIH-2026-0008|Amina Baloch|Guardian: Sher Zaman Baloch|Phone: +92 321 4443322",
    notes: "Missed 9-month MMR dose initially due to migration. Registered late but tracked down by LHV team.",
    vaccinations: [
      {
        id: "REC-007",
        patientId: "NIH-2026-0008",
        patientName: "Amina Baloch",
        vaccineId: "VAC-BCG",
        vaccineName: "BCG (Tuberculosis)",
        doseNumber: 1,
        administeredAt: "2025-02-15T09:30:00Z",
        administeredBy: "Zarina Baloch (NIH-7711)",
        administeredByRole: "Medical Staff",
        batchNumber: "BCG-2026-99A",
        facilityName: "Provincial Vaccine Cold Store",
        nextDoseAt: null,
        digitalSignature: "[ZARINA-B]",
        adverseEventReported: false
      },
      {
        id: "REC-008",
        patientId: "NIH-2026-0008",
        patientName: "Amina Baloch",
        vaccineId: "VAC-OPV",
        vaccineName: "Oral Polio Vaccine (OPV)",
        doseNumber: 1,
        administeredAt: "2025-02-15T09:35:00Z",
        administeredBy: "Zarina Baloch (NIH-7711)",
        administeredByRole: "Medical Staff",
        batchNumber: "OPV-26M01",
        facilityName: "Provincial Vaccine Cold Store",
        nextDoseAt: "2025-03-29",
        digitalSignature: "[ZARINA-B]",
        adverseEventReported: false
      },
      {
        id: "REC-009",
        patientId: "NIH-2026-0008",
        patientName: "Amina Baloch",
        vaccineId: "VAC-MR",
        vaccineName: "Measles-Rubella Vaccine (MR)",
        doseNumber: 1,
        administeredAt: "2025-11-20T11:00:00Z", // Late administration at 9 months
        administeredBy: "Zarina Baloch (NIH-7711)",
        administeredByRole: "Medical Staff",
        batchNumber: "MR-80812",
        facilityName: "Provincial Vaccine Cold Store",
        nextDoseAt: "2026-05-20", // 15 months (MR 2) - DUE NOW!
        digitalSignature: "[ZARINA_BALOCH]",
        adverseEventReported: false
      }
    ]
  }
];

export const INITIAL_COLD_CHAIN: ColdChainFridge[] = [
  {
    id: "CC-FRIDGE-01",
    facilityName: "National Institute of Health Main Campus",
    fridgeName: "Ultra-Cold Storage Unit A",
    vaccinesStored: ["Oral Polio Vaccine (OPV)", "Inactivated Polio Vaccine (IPV)"],
    currentTemperatureCelsius: -18.5,
    targetTempMinCelsius: -25.0,
    targetTempMaxCelsius: -15.0,
    powerSource: "Main Grid",
    powerStatus: "Online",
    status: "Normal",
    lastVerifiedAt: "2026-06-07T09:00:00Z"
  },
  {
    id: "CC-FRIDGE-02",
    facilityName: "District Headquarters Hospital Rawalpindi",
    fridgeName: "Main Clinic Refrigerator Bio-2",
    vaccinesStored: ["BCG (Tuberculosis)", "Pentavalent Vaccine", "Rotavirus Oral Vaccine"],
    currentTemperatureCelsius: 4.2,
    targetTempMinCelsius: 2.0,
    targetTempMaxCelsius: 8.0,
    powerSource: "Solar Battery Backup",
    powerStatus: "Online",
    status: "Normal",
    lastVerifiedAt: "2026-06-07T09:12:00Z"
  },
  {
    id: "CC-FRIDGE-03",
    facilityName: "Basic Health Unit Hayatabad",
    fridgeName: "Solar Smart Cooler Plus",
    vaccinesStored: ["BCG (Tuberculosis)", "Pentavalent Vaccine", "Measles-Rubella Vaccine (MR)"],
    currentTemperatureCelsius: 7.9, // Near upper limit of 8C!
    targetTempMinCelsius: 2.0,
    targetTempMaxCelsius: 8.0,
    powerSource: "Solar Battery Backup",
    powerStatus: "Battery Warning",
    status: "Warning",
    lastVerifiedAt: "2026-06-07T09:18:00Z"
  },
  {
    id: "CC-FRIDGE-04",
    facilityName: "Provincial Vaccine Cold Store Quetta",
    fridgeName: "Walk-In Chamber Quetta Main",
    vaccinesStored: ["Pneumococcal Conjugate Vaccine (PCV-10)", "Typhoid Conjugate Vaccine (TCV)"],
    currentTemperatureCelsius: 3.8,
    targetTempMinCelsius: 2.0,
    targetTempMaxCelsius: 8.0,
    powerSource: "Diesel Generator",
    powerStatus: "Offline - Switched to Diesel",
    status: "Normal",
    lastVerifiedAt: "2026-06-07T08:55:00Z"
  }
];

export const INITIAL_TEMP_LOGS: FridgeTemperatureLog[] = [
  {
    id: "TL-001",
    fridgeId: "CC-FRIDGE-03",
    fridgeName: "Solar Smart Cooler Plus",
    recordedTemperatureCelsius: 8.2,
    timestamp: "2026-06-07T08:00:00Z",
    status: "Critical",
    loggedBy: "Safia Bibi (LHV-8854)"
  },
  {
    id: "TL-002",
    fridgeId: "CC-FRIDGE-03",
    fridgeName: "Solar Smart Cooler Plus",
    recordedTemperatureCelsius: 7.9,
    timestamp: "2026-06-07T09:18:00Z",
    status: "Warning",
    loggedBy: "System Sensor Autolog"
  },
  {
    id: "TL-003",
    fridgeId: "CC-FRIDGE-01",
    fridgeName: "Ultra-Cold Storage Unit A",
    recordedTemperatureCelsius: -18.5,
    timestamp: "2026-06-07T09:00:00Z",
    status: "Normal",
    loggedBy: "Zarina Baloch (NIH-7711)"
  },
  {
    id: "TL-004",
    fridgeId: "CC-FRIDGE-02",
    fridgeName: "Main Clinic Refrigerator Bio-2",
    recordedTemperatureCelsius: 4.2,
    timestamp: "2026-06-07T09:12:00Z",
    status: "Normal",
    loggedBy: "Kamran Shah (NIH-4412)"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: "NTF-101",
    type: "sms",
    category: "reminder",
    recipient: "+92 300 1234567 (Zainab Fatima's Guardian)",
    title: "Vaccination Schedule Reminder",
    message: "Reminder: Zainab is due for her Rotavirus Dose 2 & Pentavalent Dose 3 on 2026-03-20. Please visit BHU/DHQ.",
    status: "sent",
    timestamp: "2026-03-18T08:00:00Z"
  },
  {
    id: "NTF-102",
    type: "system",
    category: "warning",
    recipient: "Warehouse Administrator Profile",
    title: "Rotavirus Vaccine Low Stock Alert",
    message: "Alert: Rotavirus vaccine vials (GSM-ROT) have dropped below threshold (380 doses remaining, threshold 450). Reorder recommended.",
    status: "sent",
    timestamp: "2026-06-07T02:30:00Z"
  },
  {
    id: "NTF-103",
    type: "system",
    category: "alert",
    recipient: "Quetta Monitoring Station",
    title: "Cold Chain Off-grid Power Event",
    message: "Quetta walk-in chamber CC-FRIDGE-04 switched to backup Diesel Generator. Temperature stable at 3.8C.",
    status: "sent",
    timestamp: "2026-06-07T08:55:00Z"
  },
  {
    id: "NTF-104",
    type: "email",
    category: "update",
    recipient: "ayesha.alvi@nih.gov.pk",
    title: "Monthly Immunization Summary Report Ready",
    message: "The routine monthly vaccine immunization coverage audit reports for Islamabad Province are compiled and ready.",
    status: "sent",
    timestamp: "2026-06-01T12:00:00Z"
  }
];

export const INITIAL_FEEDBACK: FieldFeedback[] = [
  {
    id: "FDB-001",
    name: "Safia Bibi",
    role: UserRole.LADY_HEALTH_VISITOR,
    facility: "Basic Health Unit Hayatabad",
    rating: 5,
    reviewText: "The digital vaccination card and QR scanner are life savers in Peshawar. We can search and track down missed children in minutes during door-to-door polio campaigns!",
    successStory: true,
    date: "2026-05-20"
  },
  {
    id: "FDB-002",
    name: "Muhammad Rizwan",
    role: UserRole.VACCINATOR,
    facility: "Tehsil Headquarters Hospital Gujranwala",
    rating: 4,
    reviewText: "Super fast POS intake system. Saving parents from carrying old physical paper booklets is a huge relief.",
    successStory: false,
    date: "2026-05-18"
  },
  {
    id: "FDB-003",
    name: "Zarina Baloch",
    role: UserRole.INVENTORY_MANAGER,
    facility: "Provincial Vaccine Cold Store Quetta",
    rating: 5,
    reviewText: "Saves us hours in barcode tracking of vaccine batches. The automatic cold-chain alerts saved our measles buffer stocks last week when power failed.",
    successStory: true,
    date: "2026-05-15"
  }
];

export const INITIAL_AUDIT_LOGS: AuditTrailLog[] = [
  {
    id: "AUD-001",
    timestamp: "2026-06-07T09:18:00Z",
    category: "COLDCHAIN",
    action: "Fridge Temperature Registered",
    details: "Solar Smart Cooler temperature logged at 7.9°C (Warning status trigger status). Verified by system sensor telemetry.",
    performedBy: "System Sensor Autolog",
    employeeId: "SYS-AUTO"
  },
  {
    id: "AUD-002",
    timestamp: "2026-06-07T09:12:00Z",
    category: "SETTINGS",
    action: "Sync Configuration Restored",
    details: "Local storage backup successfully restored. 3 registered patients and 12 inventory vaccine categories imported.",
    performedBy: "Dr. Ayesha Alvi",
    employeeId: "NIH-9901"
  },
  {
    id: "AUD-003",
    timestamp: "2026-06-07T08:30:00Z",
    category: "AUTH",
    action: "User Login",
    details: "Successful login for Role [Lady Health Visitor] at Basic Health Unit Hayatabad.",
    performedBy: "Safia Bibi",
    employeeId: "LHV-8854"
  },
  {
    id: "AUD-004",
    timestamp: "2026-06-07T08:15:00Z",
    category: "VACCINATION",
    action: "Administrative Injection Registered",
    details: "Administered measles dose and Polio booster to Zainab Fatima (Patient ID: NIH-2026-0120). Signature signed digitally.",
    performedBy: "Muhammad Rizwan",
    employeeId: "VAC-3091"
  }
];

export const INITIAL_EOD_RECONCILIATION: EodReconciliationLog[] = [
  {
    id: "EOD-001",
    date: "2026-06-06",
    vaccinatorName: "Muhammad Rizwan",
    employeeId: "VAC-3091",
    facilityName: "Tehsil Headquarters Hospital",
    digitalDosesDispensedCount: 45,
    physicalDosesVialsCount: 45,
    vialsWastedCount: 2,
    varianceCount: 0,
    varianceReason: "None - Perfectly balanced",
    supervisorApproval: "Approved",
    approvedBy: "Dr. Ayesha Alvi (NIH-9901)",
    approvedAt: "2026-06-06T17:30:00Z",
    notes: "Perfect reporting day. All physical counts synchronized with cold store entries."
  },
  {
    id: "EOD-002",
    date: "2026-06-05",
    vaccinatorName: "Safia Bibi",
    employeeId: "LHV-8854",
    facilityName: "Basic Health Unit Hayatabad",
    digitalDosesDispensedCount: 30,
    physicalDosesVialsCount: 28,
    vialsWastedCount: 4,
    varianceCount: -2,
    varianceReason: "Two BCG vials leaked during transit during outer campaign route.",
    supervisorApproval: "Approved",
    approvedBy: "Dr. Ayesha Alvi (NIH-9901)",
    approvedAt: "2026-06-05T18:00:00Z",
    notes: "LHV logged transport leak immediately. Approved for write-off."
  }
];

export const DEFAULT_SYNC_CONFIG: SyncConfiguration = {
  provider: "LocalStorage",
  firebaseConfig: {
    apiKey: "AIzaSyCxX_SAMPLE_FIREBASE_KEY_NIH_2026",
    authDomain: "national-immunization-hub.firebaseapp.com",
    projectId: "national-immunization-hub-2026",
    storageBucket: "national-immunization-hub.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:12345:web:abcdefghij"
  },
  sheetsConfig: {
    spreadsheetId: "1tS_OQ_MOCK_SHEET_ID_990123_VACCINES",
    clientEmail: "nih-sheets-sync@gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASC...\n-----END PRIVATE KEY-----"
  },
  cloudDbConfig: {
    hostUrl: "https://cloudsql.nih.gov.pk/api/v1/sync",
    apiKey: "SEC-NIH-CLOUD-POSTGRESQL-99AA12"
  },
  syncIntervalMinutes: 30,
  isSyncingEnabled: false,
  lastSyncedAt: "2026-06-07T09:00:00Z"
};
