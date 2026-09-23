export const CORRUPTION_TYPES = [
  { id: 'bribery', label: 'Bribery & Kickbacks (Solicitation or Acceptance of Money/Gifts)' },
  { id: 'embezzlement', label: 'Embezzlement & Misappropriation of Funds/Assets' },
  { id: 'fraud', label: 'Financial Fraud & Document Falsification' },
  { id: 'abuse_of_power', label: 'Abuse of Power / Authority for Personal Gain' },
  { id: 'nepotism_favoritism', label: 'Nepotism, Cronyism & Unfair Favoritism in Hiring/Promotion' },
  { id: 'extortion', label: 'Extortion & Coercion of Clients or Staff' },
  { id: 'conflict_of_interest', label: 'Undisclosed Conflict of Interest' },
  { id: 'procurement_irregularity', label: 'Procurement, Tender, or Vendor Selection Tampering' },
  { id: 'loan_fraud', label: 'Loan Processing Irregularity & Collateral Manipulation' },
  { id: 'other', label: 'Other Misconduct / Corruption' },
] as const

export const REPORTER_RELATIONSHIPS = [
  { id: 'current_employee', label: 'Current Employee / Staff Member' },
  { id: 'former_employee', label: 'Former Employee' },
  { id: 'victim', label: 'Victim of the Corrupt Act' },
  { id: 'direct_witness', label: 'Direct Eyewitness' },
  { id: 'client_customer', label: 'Bank Client / Account Holder' },
  { id: 'vendor_supplier', label: 'Contractor / Vendor / Supplier' },
  { id: 'concerned_citizen', label: 'Concerned Citizen / Public Observer' },
  { id: 'other', label: 'Other Relationship' },
] as const

export const RESOLUTIONS_SOUGHT = [
  { id: 'formal_investigation', label: 'Full Independent Investigation by Ethics & Compliance' },
  { id: 'criminal_prosecution', label: 'Referral for Criminal Prosecution & Law Enforcement' },
  { id: 'dismissal', label: 'Disciplinary Action & Dismissal of Corrupt Staff' },
  { id: 'asset_recovery', label: 'Recovery & Restitution of Stolen/Misappropriated Funds' },
  { id: 'policy_reform', label: 'Process Audit, System Hardening & Policy Reform' },
  { id: 'protection_remedy', label: 'Whistleblower/Victim Protection & Redress' },
  { id: 'other', label: 'Other Remedy' },
] as const

// Retain legacy export for backward compatibility with existing code
export const INCIDENT_CATEGORIES = CORRUPTION_TYPES

export type CorruptionTypeId = typeof CORRUPTION_TYPES[number]['id']
export type ReporterRelationshipId = typeof REPORTER_RELATIONSHIPS[number]['id']
export type ResolutionSoughtId = typeof RESOLUTIONS_SOUGHT[number]['id']
export type IncidentCategoryId = CorruptionTypeId
