export const INCIDENT_CATEGORIES = [
  { id: 'ethics', label: 'Ethics & Code of Conduct Violation' },
  { id: 'financial_fraud', label: 'Financial Misconduct / Accounting Fraud' },
  { id: 'bribery_corruption', label: 'Bribery, Kickbacks & Corruption' },
  { id: 'harassment_discrimination', label: 'Harassment or Workplace Discrimination' },
  { id: 'hse', label: 'Health, Safety & Environmental Violations' },
  { id: 'cybersecurity_ip', label: 'Data Leakage & Intellectual Property Theft' },
  { id: 'other', label: 'Other Serious Violation' },
] as const

export type IncidentCategoryId = typeof INCIDENT_CATEGORIES[number]['id']
