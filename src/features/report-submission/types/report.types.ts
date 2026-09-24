import { z } from 'zod'

// Section 1: Reporter Information
export const step1Schema = z.object({
  reportingMode: z.enum(['anonymous', 'confidential'], {
    message: 'Please indicate if you wish to remain anonymous or confidential',
  }),
  fullName: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  physicalAddress: z.string().optional(),
  relationship: z.string().min(1, 'Please select your relationship to the situation'),
})

// Section 2: Details of Incident(s) ("The What and Why")
export const step2Schema = z.object({
  corruptionType: z.string().min(1, 'Please select the alleged type of corruption'),
  summary: z.string().min(1, 'Summary of allegation is required'),
  detailedNarrative: z.string().min(1, 'Detailed narrative is required'),
  incidentDate: z.string().min(1, 'Date or timeline is required'),
  howAware: z.string().min(1, 'Please explain how you became aware'),
  incidentLocation: z.string().min(1, 'Location is required'),
  whyCorrupt: z.string().min(1, 'Please clarify why you consider this corrupt'),
})

// Section 3: Details of Corrupted Person(s) & Organization ("The Who")
export const step3Schema = z.object({
  divisionDepartmentBranch: z.string().min(1, 'Branch or Department is required'),
  departmentOffice: z.string().optional(),
  organizationAddress: z.string().optional(),
  corruptedPersonNames: z.string().min(1, 'Corrupted person name(s) required'),
  jobPositions: z.string().min(1, 'Job position(s) required'),
  otherIdentifyingInfo: z.string().optional(),
})

// Section 4: Supporting Evidence & Witnesses ("The Proof")
export const step4Schema = z.object({
  evidenceInPossession: z.string().min(1, 'Evidence in possession is required (or state None)'),
  evidenceNotInPossession: z.string().optional(),
  witnesses: z.string().optional(),
  attachedFiles: z.array(z.string()).optional(),
})

// Section 5: Previous Actions & Resolution
export const step5Schema = z.object({
  priorReports: z.string().min(1, 'Prior reports is required (or state None)'),
  resolutionSought: z.string().min(1, 'Please select or describe resolution sought'),
  customResolutionDetails: z.string().optional(),
  reportRecipient: z.string().min(1, 'Report recipient is required'),
  confirmationAcknowledged: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the disclosure is made in good faith',
  }),
})

// Combined Schema
export const corruptionReportSchema = z.object({
  // Section 1
  reportingMode: z.enum(['anonymous', 'confidential'], {
    message: 'Please indicate if you wish to remain anonymous or confidential',
  }),
  fullName: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  physicalAddress: z.string().optional(),
  relationship: z.string().min(1, 'Please select your relationship to the situation'),

  // Section 2
  corruptionType: z.string().min(1, 'Please select the alleged type of corruption'),
  summary: z.string().min(1, 'Summary of allegation is required'),
  detailedNarrative: z.string().min(1, 'Detailed narrative is required'),
  incidentDate: z.string().min(1, 'Date or timeline is required'),
  howAware: z.string().min(1, 'Please explain how you became aware'),
  incidentLocation: z.string().min(1, 'Location is required'),
  whyCorrupt: z.string().min(1, 'Please clarify why you consider this corrupt'),

  // Section 3
  divisionDepartmentBranch: z.string().min(1, 'Branch or Department is required'),
  departmentOffice: z.string().optional(),
  organizationAddress: z.string().optional(),
  corruptedPersonNames: z.string().min(1, 'Corrupted person name(s) required'),
  jobPositions: z.string().min(1, 'Job position(s) required'),
  otherIdentifyingInfo: z.string().optional(),

  // Section 4
  evidenceInPossession: z.string().min(1, 'Evidence in possession is required (or state None)'),
  evidenceNotInPossession: z.string().optional(),
  witnesses: z.string().optional(),
  attachedFiles: z.array(z.string()).optional(),

  // Section 5
  priorReports: z.string().min(1, 'Prior reports is required (or state None)'),
  resolutionSought: z.string().min(1, 'Please select or describe resolution sought'),
  customResolutionDetails: z.string().optional(),
  reportRecipient: z.string().min(1, 'Report recipient is required'),
  confirmationAcknowledged: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the disclosure is made in good faith',
  }),

  // Backward compatibility alias fields
  category: z.string().optional(),
  targetDepartment: z.string().optional(),
  description: z.string().optional(),
  isAnonymous: z.boolean().optional(),
  contactEmail: z.string().optional(),
})

export type CorruptionReportInput = z.infer<typeof corruptionReportSchema>
export type ReportSubmissionInput = CorruptionReportInput

export interface ReportSubmissionResult {
  caseReferenceKey: string
  submittedAt: string
  category: string
  trackingUrl: string
  reportingMode: 'anonymous' | 'confidential'
  divisionDepartmentBranch?: string
  reportRecipient?: string
}
