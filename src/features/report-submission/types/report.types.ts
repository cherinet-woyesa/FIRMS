import { z } from 'zod'

export const reportSubmissionSchema = z.object({
  category: z.string().min(1, 'Incident category is required'),
  targetDepartment: z.string().optional(),
  incidentDate: z.string().min(1, 'Date of incident is required'),
  description: z
    .string()
    .min(25, 'Please provide sufficient detail (at least 25 characters)')
    .max(8000, 'Narrative cannot exceed 8,000 characters'),
  isAnonymous: z.boolean(),
  contactEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
})

export type ReportSubmissionInput = z.infer<typeof reportSubmissionSchema>

export interface ReportSubmissionResult {
  caseReferenceKey: string
  submittedAt: string
  category: string
  trackingUrl: string
}
