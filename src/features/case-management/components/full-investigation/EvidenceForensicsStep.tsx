import React from 'react'
import { Scale, Lock, Search, Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import type { EvidenceAndForensics, SeizedRecordItem, ExternalInquiryItem } from '../../types/investigation.types'

interface Props {
  evidence: EvidenceAndForensics
  onChangeEvidence: (updater: (prev: EvidenceAndForensics) => EvidenceAndForensics) => void
  onAddSeizedRecord: () => void
  onRemoveSeizedRecord: (id: string) => void
  onAddExternalInquiry: () => void
  onRemoveExternalInquiry: (id: string) => void
  isEditable?: boolean
  onBack: () => void
  onNext: () => void
}

export const EvidenceForensicsStep: React.FC<Props> = ({
  evidence,
  onChangeEvidence,
  onAddSeizedRecord,
  onRemoveSeizedRecord,
  onAddExternalInquiry,
  onRemoveExternalInquiry,
  isEditable = true,
  onBack,
  onNext,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xs">
        {/* Unified Step Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cbe-purple/10 flex items-center justify-center text-cbe-purple shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Evidence Collection &amp; Forensic Analysis
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-purple-50 text-purple-900 border-purple-200">
              {evidence.seizedRecords.length} Seized {evidence.seizedRecords.length === 1 ? 'Record' : 'Records'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-slate-50 text-slate-700 border-slate-200">
              {evidence.covertExternalInquiries.length} {evidence.covertExternalInquiries.length === 1 ? 'Inquiry' : 'Inquiries'}
            </span>
          </div>
        </div>

        {/* Sub-Section 1: Document & Digital Data Seizure */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Lock className="w-3.5 h-3.5 text-cbe-purple" />
              <span>Document &amp; Digital Data Seizure</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onAddSeizedRecord}
              disabled={!isEditable}
              className="text-xs flex items-center gap-1.5 h-8 px-3 border-slate-200 hover:bg-purple-50 hover:text-cbe-purple hover:border-cbe-purple/30 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Seized Record</span>
            </Button>
          </div>

          {evidence.seizedRecords.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50">
              <p className="text-xs text-slate-500 font-medium">
                No seized physical or digital records logged yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {evidence.seizedRecords.map((rec: SeizedRecordItem, i: number) => (
                <div
                  key={rec.id}
                  className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/80 flex items-start justify-between gap-3 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cbe-purple text-white shadow-2xs">
                        {rec.category}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded">
                        {rec.custodyRef}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={rec.title}
                      disabled={!isEditable}
                      onChange={(e) => {
                        const next = [...evidence.seizedRecords]
                        next[i] = { ...next[i], title: e.target.value }
                        onChangeEvidence((prev) => ({ ...prev, seizedRecords: next }))
                      }}
                      className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 w-full focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span className="font-medium">Seized: {rec.dateSeized}</span>
                      <select
                        value={rec.category}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...evidence.seizedRecords]
                          next[i] = { ...next[i], category: e.target.value as any }
                          onChangeEvidence((prev) => ({ ...prev, seizedRecords: next }))
                        }}
                        className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[11px] font-medium text-slate-700 cursor-pointer focus:outline-hidden focus:border-cbe-purple"
                      >
                        <option value="Financial">Financial (Ledgers/Transfers)</option>
                        <option value="Digital">Digital (Emails/Logs)</option>
                        <option value="Procurement">Procurement (Tenders/Bids)</option>
                        <option value="Personnel">Personnel &amp; Org</option>
                      </select>
                    </div>
                  </div>
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => onRemoveSeizedRecord(rec.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Remove Seized Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Divider */}
        <div className="border-t border-slate-100" />

        {/* Sub-Section 2: Forensic Financial Audit & Loss Quantification */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Scale className="w-3.5 h-3.5 text-cbe-purple" />
            <span>Forensic Financial Audit &amp; Loss Quantification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Funds Traced (ETB)
              </label>
              <input
                type="text"
                value={evidence.fundsTracedETB}
                disabled={!isEditable}
                onChange={(e) =>
                  onChangeEvidence((prev) => ({ ...prev, fundsTracedETB: e.target.value }))
                }
                className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Quantified Institutional Loss (ETB)
              </label>
              <input
                type="text"
                value={evidence.quantifiedLossesETB}
                disabled={!isEditable}
                onChange={(e) =>
                  onChangeEvidence((prev) => ({ ...prev, quantifiedLossesETB: e.target.value }))
                }
                className="w-full text-xs font-bold text-rose-600 border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white focus:outline-hidden focus:border-rose-400 focus:ring-1 focus:ring-rose-400 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Forensic Audit Agency / Partner
              </label>
              <input
                type="text"
                value={evidence.forensicAgency}
                disabled={!isEditable}
                onChange={(e) =>
                  onChangeEvidence((prev) => ({ ...prev, forensicAgency: e.target.value }))
                }
                className="w-full text-xs font-medium text-slate-900 border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple disabled:bg-slate-50"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Patterns of Illicit Payments &amp; Forensic Findings
            </label>
            <RichTextEditor
              content={evidence.illicitPatternsIdentified}
              onChange={(val) =>
                onChangeEvidence((prev) => ({ ...prev, illicitPatternsIdentified: val }))
              }
              placeholder=""
              minHeight="110px"
              title="Forensic Findings Editor"
              readOnly={!isEditable}
            />
          </div>
        </div>

        {/* Section Divider */}
        <div className="border-t border-slate-100" />

        {/* Sub-Section 3: Covert & External Inquiries (FEACC / Registries) */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Search className="w-3.5 h-3.5 text-cbe-purple" />
              <span>Covert &amp; External Inquiries (FEACC / Registries)</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onAddExternalInquiry}
              disabled={!isEditable}
              className="text-xs flex items-center gap-1.5 h-8 px-3 border-slate-200 hover:bg-purple-50 hover:text-cbe-purple hover:border-cbe-purple/30 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Inquiry</span>
            </Button>
          </div>

          {evidence.covertExternalInquiries.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50">
              <p className="text-xs text-slate-500 font-medium">
                No external or inter-agency inquiries logged yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {evidence.covertExternalInquiries.map((inq: ExternalInquiryItem, i: number) => (
                <div
                  key={inq.id}
                  className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/80 space-y-2.5 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-cbe-purple" />
                      <span>{inq.inquiryType}</span>
                    </span>
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => onRemoveExternalInquiry(inq.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Remove Inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Inquiry Scope / Target Entity Checked
                      </label>
                      <input
                        type="text"
                        value={inq.details}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...evidence.covertExternalInquiries]
                          next[i] = { ...next[i], details: e.target.value }
                          onChangeEvidence((prev) => ({ ...prev, covertExternalInquiries: next }))
                        }}
                        className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Corroborated Findings &amp; Response Summary
                      </label>
                      <input
                        type="text"
                        value={inq.findings}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...evidence.covertExternalInquiries]
                          next[i] = { ...next[i], findings: e.target.value }
                          onChangeEvidence((prev) => ({ ...prev, covertExternalInquiries: next }))
                        }}
                        className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step 2 Footer Nav */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="text-xs font-semibold flex items-center gap-1.5 h-9 px-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Step 1: Planning &amp; Authorization</span>
        </Button>
        <Button
          size="sm"
          onClick={onNext}
          className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5 h-9 px-4 cursor-pointer"
        >
          <span>Proceed to Step 3: Witness &amp; Subject Interviews</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}
