import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  Printer,
  Calendar,
  MapPin,
  Paperclip,
  CheckCircle2,
  FileText,
  Clock,
  Eye,
  HelpCircle,
} from 'lucide-react'
import { fetchCaseById } from '../api/getCases'
import { CaseWorkflowActionToolbar } from '../components/CaseWorkflowActionToolbar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/feedback/Spinner'
import { CASE_STATUSES, CASE_PRIORITIES } from '@/constants/caseStatus'
import { ROUTES } from '@/config/routes'

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const caseId = id || ''

  const { data: caseData, isLoading, refetch } = useQuery({
    queryKey: ['case-detail', caseId],
    queryFn: () => fetchCaseById(caseId),
    enabled: Boolean(caseId),
  })

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Spinner size="lg" />
        <p className="text-xs font-medium">Loading comprehensive case details...</p>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="p-16 bg-white rounded-2xl border border-slate-200 text-center max-w-lg mx-auto space-y-4 my-10">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Case Not Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Unable to retrieve the case intake file with ID <span className="font-mono">{caseId}</span>.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => navigate(ROUTES.CASES)}
          className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold"
        >
          Return to Cases
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* 1. Header Command Bar */}
      <div className="bg-white px-5 py-4 rounded-2xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.CASES}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition"
            title="Back to Case Registry"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-base text-cbe-purple tracking-tight">
                {caseData.referenceKey}
              </span>
              <Badge
                variant={
                  caseData.priority === 'CRITICAL'
                    ? 'danger'
                    : caseData.priority === 'HIGH'
                    ? 'warning'
                    : 'neutral'
                }
              >
                {CASE_PRIORITIES[caseData.priority]?.label || caseData.priority}
              </Badge>
              <Badge variant="default">
                {CASE_STATUSES[caseData.status]?.label || caseData.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Original Whistleblower Submission &amp; Intake Details
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs h-8.5 px-3 flex items-center gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Intake</span>
          </Button>

          <Button
            size="sm"
            onClick={() => navigate(ROUTES.CASE_DETAIL(caseData.id))}
            className="bg-cbe-purple hover:bg-cbe-purple-700 text-white font-medium text-xs h-8.5 px-3.5 flex items-center gap-1.5 shadow-2xs"
          >
            <span>Preliminary Investigation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Case Workflow Action Engine Toolbar & Stage Transition Controls */}
      <CaseWorkflowActionToolbar
        caseId={caseData.id}
        caseReferenceKey={caseData.referenceKey}
        onTransitionCompleted={() => refetch()}
      />

      {/* 2. Quick Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Submission Date
          </span>
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {new Date(caseData.submittedAt).toLocaleDateString()}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Corruption Type
          </span>
          <span className="text-xs font-bold text-slate-800 truncate block">
            {caseData.category}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Target Unit
          </span>
          <span className="text-xs font-bold text-slate-800 truncate block">
            {caseData.targetDepartment || 'General Central Office'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Assigned Lead
          </span>
          <span className="text-xs font-bold text-slate-800 truncate block">
            {caseData.assignedTo || <span className="text-slate-400 italic font-normal">Unassigned</span>}
          </span>
        </div>
      </div>

      {/* Section 1: Reporter Profile & Relationship */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-cbe-purple flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Reporter Identification &amp; Disclosure Mode
            </h3>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              caseData.reportingMode === 'anonymous'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {caseData.reportingMode ? caseData.reportingMode.toUpperCase() : 'CONFIDENTIAL'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="font-semibold text-slate-400 block mb-1">Relationship to Situation</span>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 font-medium text-slate-800">
              {caseData.relationship || 'Direct CBE Employee'}
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-400 block mb-1">Full Name</span>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 font-medium text-slate-800">
              {caseData.reportingMode === 'anonymous' ? (
                <span className="text-slate-400 italic">Withheld (Anonymous Mode)</span>
              ) : (
                caseData.fullName || 'Confidential Whistleblower'
              )}
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-400 block mb-1">Contact Email / Phone</span>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 font-medium text-slate-800">
              {caseData.reportingMode === 'anonymous' ? (
                <span className="text-slate-400 italic">Protected</span>
              ) : (
                caseData.contactEmail || caseData.phoneNumber || 'Stored securely in vault'
              )}
            </div>
          </div>
        </div>

        {caseData.physicalAddress && caseData.reportingMode !== 'anonymous' && (
          <div className="text-xs">
            <span className="font-semibold text-slate-400 block mb-1">Physical Address</span>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 font-medium text-slate-800">
              {caseData.physicalAddress}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Details of Incident ("The What and Why") */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-cbe-purple flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Details of Incident(s) — The Allegation
          </h3>
        </div>

        {/* Allegation Summary */}
        <div className="space-y-1.5">
          <span className="font-bold text-slate-800 text-xs block">Allegation Summary</span>
          <div className="p-3.5 rounded-xl border border-purple-100 bg-[#FBF4FA] text-slate-900 font-medium text-xs leading-relaxed">
            {caseData.summary}
          </div>
        </div>

        {/* Detailed Narrative */}
        <div className="space-y-1.5">
          <span className="font-bold text-slate-800 text-xs block">
            Detailed Verbatim Statement &amp; Narrative
          </span>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-800 text-xs whitespace-pre-line leading-relaxed font-sans">
            {caseData.detailedNarrative || 'No additional narrative provided.'}
          </div>
        </div>

        {/* Incident Date & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cbe-purple" />
              Incident Date / Period
            </span>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
              {caseData.incidentDate || caseData.incidentStartDate
                ? `${caseData.incidentDate || caseData.incidentStartDate}${
                    caseData.incidentEndDate ? ` to ${caseData.incidentEndDate}` : ''
                  }`
                : 'Date not specified'}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cbe-purple" />
              Incident Location
            </span>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
              {caseData.incidentLocation || 'Not specified'}
            </div>
          </div>
        </div>

        {/* How Aware & Why Corrupt */}
        {(caseData.howAware || caseData.whyCorrupt) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            {caseData.howAware && (
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  How Reporter Became Aware
                </span>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
                  {caseData.howAware}
                </div>
              </div>
            )}

            {caseData.whyCorrupt && (
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  Why Believed to be Corrupt
                </span>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
                  {caseData.whyCorrupt}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 3: Details of Corrupted Person(s) & Organization ("The Who") */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-cbe-purple flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Details of Corrupted Person(s) &amp; Organization — The Accused
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="font-semibold text-slate-400 block mb-1">Subject / Person Name(s)</span>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 font-semibold text-slate-900">
              {caseData.corruptedPersonNames || 'Unknown / General Office'}
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-400 block mb-1">Job Position / Roles</span>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
              {caseData.jobPositions || 'Not specified'}
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-400 block mb-1">Branch / Division / Unit</span>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
              {caseData.divisionDepartmentBranch || caseData.targetDepartment || 'Not specified'}
            </div>
          </div>
        </div>

        {(caseData.departmentOffice || caseData.organizationAddress || caseData.otherIdentifyingInfo) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
            {caseData.departmentOffice && (
              <div>
                <span className="font-semibold text-slate-400 block mb-1">Specific Office</span>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
                  {caseData.departmentOffice}
                </div>
              </div>
            )}
            {caseData.organizationAddress && (
              <div>
                <span className="font-semibold text-slate-400 block mb-1">Branch Location Address</span>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
                  {caseData.organizationAddress}
                </div>
              </div>
            )}
            {caseData.otherIdentifyingInfo && (
              <div>
                <span className="font-semibold text-slate-400 block mb-1">Other Identifying Details</span>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
                  {caseData.otherIdentifyingInfo}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 4: Supporting Evidence & Witnesses ("The Proof") */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-cbe-purple flex items-center justify-center font-bold text-xs">
            4
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Supporting Evidence &amp; Witnesses — The Proof
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-cbe-purple" />
              Evidence in Possession
            </span>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800 leading-relaxed">
              {caseData.evidenceInPossession || 'None explicitly attached at submission.'}
            </div>
          </div>

          {caseData.evidenceNotInPossession && (
            <div>
              <span className="font-bold text-slate-800 block mb-1">
                Evidence Known to Exist (Not in Reporter&apos;s Possession)
              </span>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
                {caseData.evidenceNotInPossession}
              </div>
            </div>
          )}

          {caseData.witnesses && (
            <div>
              <span className="font-bold text-slate-800 block mb-1">
                Potential Witnesses &amp; Key Informants
              </span>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
                {caseData.witnesses}
              </div>
            </div>
          )}

          {caseData.attachedFiles && caseData.attachedFiles.length > 0 && (
            <div>
              <span className="font-bold text-slate-800 block mb-1.5">
                Attached Digital Files &amp; Documentation
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {caseData.attachedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs font-mono"
                  >
                    <span className="truncate text-slate-800">{file}</span>
                    <span className="text-[10px] text-cbe-purple font-semibold bg-purple-50 px-2 py-0.5 rounded">
                      Uploaded
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 5: Previous Actions & Resolution Sought */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-cbe-purple flex items-center justify-center font-bold text-xs">
            5
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Previous Actions &amp; Resolution Sought
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="font-semibold text-slate-400 block mb-1">Prior Reports Filed</span>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
              {caseData.priorReports || 'None prior to this filing'}
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-400 block mb-1">Resolution Sought</span>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
              {caseData.resolutionSought || 'Full Audit & Disciplinary Review'}
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-400 block mb-1">Designated Recipient</span>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800">
              {caseData.reportRecipient || 'Internal Audit & Ethics Directorate'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Next Action Banner */}
      <div className="bg-purple-50/90 border-2 border-cbe-purple rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-bold text-cbe-purple flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Intake Review Complete — Ready to Investigate
          </span>
          <p className="text-xs text-slate-700">
            Transition this case directly into the <strong>Preliminary Assessment &amp; Triage Workspace</strong>.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => navigate(ROUTES.CASE_DETAIL(caseData.id))}
          className="bg-cbe-purple hover:bg-cbe-purple-700 text-white text-xs font-bold flex items-center gap-2 shrink-0 px-4 py-2.5 shadow-sm"
        >
          <span>Open Preliminary Investigation Step</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
export default CaseDetailPage
