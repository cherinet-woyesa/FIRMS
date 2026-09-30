import type { CaseSummary } from '@/types/common.types'
import type { PreliminaryAssessmentReport, TriageWorkflowState } from '../types/triage.types'
import type { FullInvestigationState } from '../types/investigation.types'

export interface CaseDetailedInvestigation extends CaseSummary {
  reportingMode: 'anonymous' | 'confidential'
  relationship: string
  fullName?: string
  contactEmail?: string
  phoneNumber?: string
  physicalAddress?: string
  summary: string
  detailedNarrative: string
  incidentDate: string
  incidentLocation: string
  howAware: string
  whyCorrupt: string
  divisionDepartmentBranch: string
  departmentOffice?: string
  organizationAddress?: string
  corruptedPersonNames: string
  jobPositions: string
  otherIdentifyingInfo?: string
  evidenceInPossession: string
  evidenceNotInPossession?: string
  witnesses?: string
  attachedFiles?: string[]
  priorReports: string
  resolutionSought: string
  reportRecipient: string
  triageWorkflow: TriageWorkflowState
  preliminaryAssessmentReport: PreliminaryAssessmentReport
  fullInvestigation?: FullInvestigationState
}

const MOCK_DETAILED_CASES: Record<string, CaseDetailedInvestigation> = {
  'case-01': {
    id: 'case-01',
    referenceKey: 'CBE-ETH-892144',
    category: 'Financial Misconduct / Accounting Fraud',
    targetDepartment: 'Finance & Accounts',
    priority: 'CRITICAL',
    status: 'INVESTIGATION_ACTIVE',
    submittedAt: '2026-09-20T08:30:00Z',
    updatedAt: '2026-09-21T15:10:00Z',
    isAnonymous: true,
    reportingMode: 'anonymous',
    relationship: 'Current Employee / Staff Member',
    summary: 'Branch finance officer manipulated suspense accounts to siphon transaction commission funds into personal accounts.',
    detailedNarrative: 'Starting August 2026, the senior accountant regularly diverted unexplained reconciliation differences from the main clearing account into a dummy savings account. Multiple daily withdrawals occurred under fake teller authorizations.',
    incidentDate: 'August 10 to September 15, 2026',
    incidentLocation: 'Addis Ababa Central Branch, Finance Division 3rd Floor',
    howAware: 'Direct review of general ledger month-end reconciliation discrepancy logs',
    whyCorrupt: 'Direct theft of institutional capital and deliberate manipulation of core accounting ledgers for personal enrichment.',
    divisionDepartmentBranch: 'Central Region / Head Office / Finance Directorate',
    departmentOffice: 'Reconciliation & General Ledger Unit',
    organizationAddress: 'Ras Desta Damtew St, Addis Ababa',
    corruptedPersonNames: 'Senior Finance Officer & Assistant Accountant',
    jobPositions: 'Senior Accounts Officer / Clearing Specialist',
    otherIdentifyingInfo: 'Employee IDs: CBE-04912, CBE-08831',
    evidenceInPossession: 'Monthly reconciliation variance spreadsheets, flagged ledger export in Excel, 5 suspicious debit memo vouchers.',
    evidenceNotInPossession: 'Core banking transaction journal database logs, system login timestamp records.',
    witnesses: 'Clearing clerk (Desk 4), willing to confirm ledger discrepancies were flagged.',
    attachedFiles: ['suspense_reconciliation_variance_aug2026.xlsx', 'debit_memo_scans.pdf'],
    priorReports: 'Reported verbally to Unit supervisor with no escalation.',
    resolutionSought: 'Full Independent Investigation by Ethics & Compliance',
    reportRecipient: 'Risk Management & Compliance Division',
    assignedTo: 'Lead Investigator Sarah V.',
    triageWorkflow: {
      isAcknowledged: true,
      acknowledgedAt: '2026-09-20T09:15:00Z',
      legalHoldInitiated: true,
      legalHoldNoticeRef: 'LH-2026-089',
      legalHoldAt: '2026-09-20T10:00:00Z',
      investigatorAssigned: 'Lead Investigator Sarah V.',
      investigatorDepartment: 'Internal Audit & Ethics Unit',
      noConflictSigned: true,
      isWithinJurisdiction: true,
      jurisdictionNotes: 'Falls squarely under ECV & Internal Audit instant financial fraud mandate.',
      specificityRating: 'High',
      corroborationRating: 'High',
      severityRating: 'High',
      orgChartReviewed: true,
      orgChartFindings: 'Subject has tier-3 approval access to clearing adjustment suspense accounts.',
      osintReviewed: true,
      osintFindings: 'No conflicting external company registrations found.',
      internalRecordsReviewed: true,
      internalRecordsFindings: 'General Ledger confirms 840,000 ETB variance in clearing account #10004.',
      predicationDetermination: 'Sufficient',
      recommendedAction: 'Full Investigation',
      recommendedActionJustification: 'Detailed allegation with corroborated general ledger variances exceeding threshold.',
      nextStepsInterimMeasures: 'Revoke system approval tokens on clearing adjustment accounts; initiate formal forensic audit.',
    },
    preliminaryAssessmentReport: {
      caseId: 'CBE-ETH-892144',
      dateReportReceipt: '20/09/2026',
      investigatorTeamAssigned: 'Sarah V. (Lead), Internal Audit Division',
      dateAssessmentCompletion: '21/09/2026',
      sourceReportingChannel: 'FIRMS Whistleblower Portal (Anonymous)',
      allegedSubjects: 'Senior Finance Officer & Assistant Accountant, Reconciliation Unit',
      allegedOrganizationUnit: 'Central Region / Head Office / Finance Directorate',
      typeOfMisconduct: 'Embezzlement & General Ledger Manipulation',
      allegedPeriodOfIncident: 'August 10 – September 15, 2026',
      allegationSummary: 'Clearing account manipulation to siphon 840,000 ETB in institutional funds into dummy accounts.',
      applicableLawPolicy: 'Anti-Corruption Proclamation No. 699/2010; CBE Financial Code Art. 12',
      specificityAndDetail: 'High – General ledger clearing account #10004 specified with exact variance dates.',
      evidenceProvided: '5 suspicious debit memo vouchers and monthly reconciliation logs.',
      initialReviewFindings: 'Initial audit confirmed unaccounted debit balance of 840,000 ETB transferred to unverified account.',
      credibilityAssessment: 'High – Corroborated with internal general ledger reconciliation reports.',
      severityAssessment: 'Critical – Severe financial loss and systemic internal control breach.',
      predicationDetermination: 'Sufficient',
      recommendedAction: 'Full Investigation',
      recommendedActionJustification: 'Specific, verified financial discrepancy with high severity warranting comprehensive forensic examination.',
      nextStepsInterimMeasures: 'Suspend subject access to financial clearing systems; notify Legal & Corporate Governance.',
    },
    fullInvestigation: {
      currentStep: 4,
      planning: {
        isAuthorized: true,
        authorizedBy: 'Vice President, Risk Management & Compliance Division',
        authorizationDate: '22/09/2026',
        approvalScope: [
          'Interviewing Staff & Witnesses',
          'Seizing Physical & Digital Records',
          'Requesting External / FEACC Data',
          'Engaging Police Forensic Support',
          'Suspending Core System Permissions',
          'Examining Bank Ledgers & Transfers',
        ],
        specificAllegations: 'Unauthorized manipulation of clearing suspense accounts to siphon transaction commission funds.',
        investigationTimeframe: 'August 1 to September 15, 2026',
        targetSubjects: 'Senior Finance Officer & Assistant Accountant, Reconciliation Unit',
        requiredResources: 'Senior forensic auditor, IT security database log specialist, Legal counsel',
        workPlanFinalized: true,
        workPlanNotes: 'Forensic extraction completed; witness sequence adhered to due process standards.',
      },
      evidence: {
        seizedRecords: [
          {
            id: 'rec-01',
            category: 'Financial',
            title: 'General Ledger Clearing Discrepancy Logs (#10004)',
            dateSeized: '22/09/2026',
            custodyRef: 'EVD-2026-891',
            notes: 'Forensic mirror of database entries',
          },
          {
            id: 'rec-02',
            category: 'Financial',
            title: '5 Suspicious Debit Memo Vouchers & Teller Withdrawal Slips',
            dateSeized: '22/09/2026',
            custodyRef: 'EVD-2026-892',
          },
          {
            id: 'rec-03',
            category: 'Digital',
            title: 'Core Banking System Audit Trail & Login Timestamps',
            dateSeized: '23/09/2026',
            custodyRef: 'EVD-2026-893',
          },
        ],
        forensicAuditEngaged: true,
        forensicAgency: 'Federal Police Forensic Financial Unit & Internal Forensics',
        fundsTracedETB: '840,000 ETB',
        quantifiedLossesETB: '840,000 ETB',
        illicitPatternsIdentified: 'Daily round-number debits routed to dummy savings account #9012 under fake clearing memos.',
        covertExternalInquiries: [
          {
            id: 'inq-01',
            inquiryType: 'Vendor License (FEACC)',
            details: 'FEACC Registry search on dummy recipient account holders',
            findings: 'Account registered to sibling of Senior Finance Officer.',
          },
        ],
      },
      interviews: {
        neutralWitnesses: [
          {
            id: 'w-01',
            name: 'Alemayehu T.',
            role: 'Clearing Desk Clerk',
            date: '23/09/2026',
            summary: 'Confirmed noticing persistent month-end ledger variances in clearing account #10004.',
            exhibitsCorroborated: 'Exhibit A (General Ledger Export)',
          },
        ],
        keyWitnesses: [
          {
            id: 'w-02',
            name: 'Bethlehem K.',
            role: 'Settlement Supervisor',
            date: '24/09/2026',
            summary: 'Testified that manual override passwords were used exclusively during non-standard evening shifts.',
            exhibitsCorroborated: 'Exhibit C (System Access Logs)',
          },
        ],
        subjects: [
          {
            id: 'sub-01',
            name: 'Senior Finance Officer (Subject X)',
            role: 'Senior Finance Specialist',
            date: '25/09/2026',
            legalCounselPresent: true,
            rightsInformed: true,
            recordedDefense: 'Admitted initiating reconciliation entries but claimed following verbal instructions from former department manager.',
          },
        ],
      },
      report: {
        caseId: 'CBE-ETH-892144',
        dateFinalSubmission: '26/09/2026',
        allegationSummary: 'Clearing account manipulation to siphon 840,000 ETB in institutional funds into dummy accounts.',
        investigativeFinding: 'Substantiated',
        estimatedFinancialImpact: '840,000 ETB',
        recommendation: 'Immediate termination of employment for Gross Misconduct and formal criminal referral to the Federal Police / FEACC under Anti-Corruption Proclamation No. 699/2010.',
        sourceOfReport: 'FIRMS Whistleblower Portal (Anonymous)',
        originalAllegationVerbatim: 'Starting August 2026, the senior accountant regularly diverted unexplained reconciliation differences from the main clearing account into a dummy savings account.',
        dateInvestigationCommenced: '21/09/2026',
        scopeOfInvestigation: 'Audit of clearing suspense accounts, debit memos, and system transaction logs from August 1 to September 15, 2026.',
        investigativeTeam: 'Sarah V. (Lead Investigator), Internal Audit Division & Forensic Auditor Team',
        documentReview: 'Reviewed 1,200 general ledger entries, 5 debit memos, core banking audit trail, and user login activity logs.',
        forensicAnalysis: 'Forensic financial tracing verified 840,000 ETB diverted in 8 distinct tranches to account #9012.',
        interviewsConducted: 'Conducted interviews with Neutral Witness Alemayehu T., Key Witness Bethlehem K., and Subject X.',
        findings: [
          {
            id: 'f-01',
            findingNumber: '4.1',
            title: 'Diversion of Institutional Clearing Funds',
            fact: 'Records show 840,000 ETB was systematically debited from suspense account #10004 without supporting clearing vouchers.',
            evidence: 'General Ledger Export, Exhibit A.',
          },
          {
            id: 'f-02',
            findingNumber: '4.2',
            title: 'Unauthorized System Override & Fake Authorizations',
            fact: 'User credentials of Subject X were logged overriding daily transaction balancing controls during non-working hours.',
            evidence: 'Core Banking System Audit Trail, Exhibit C.',
          },
          {
            id: 'f-03',
            findingNumber: '4.3',
            title: 'Beneficiary Linkage to Subject Relative',
            fact: 'Corporate and bank records verify the recipient dummy account is held by Subject X’s sibling.',
            evidence: 'FEACC Registry Search & KYC Record, Exhibit B.',
          },
        ],
        conclusionText: 'The investigation concludes that the allegation of Embezzlement and Accounting Fraud is Substantiated based on the forensic evidence and corroborating testimony presented in Section 4.',
        findingDetermination: 'Substantiated',
        policyLawViolated: 'Article 15 of Anti-Corruption Proclamation No. 699/2010 (Abuse of Power & Embezzlement); CBE Code of Conduct Art. 12 (Financial Integrity)',
        disciplinaryLegalActions: [
          'Immediate termination of employment for Senior Finance Officer for Gross Misconduct.',
          'Refer complete investigation file and Exhibits A-D to Legal Division for criminal prosecution under Proclamation 699/2010.',
          'Formal reprimand and refresher training for Settlement Supervisor regarding credential security.',
        ],
        systemicPreventativeMeasures: [
          'Implement mandatory dual-authorization on all general ledger suspense account debit adjustments.',
          'Automate end-of-day alert generation for any reconciliation discrepancy exceeding 50,000 ETB.',
        ],
        exhibits: [
          {
            id: 'ex-01',
            exhibitLetter: 'Exhibit A',
            title: 'General Ledger Discrepancy Export File',
            description: 'Core banking transaction logs for account #10004',
          },
          {
            id: 'ex-02',
            exhibitLetter: 'Exhibit B',
            title: 'KYC & Registry Records of Recipient Account',
            description: 'Proof of familial linkage to subject',
          },
          {
            id: 'ex-03',
            exhibitLetter: 'Exhibit C',
            title: 'Core Banking Timestamp Override Report',
            description: 'System login timestamps and terminal IP tracking',
          },
          {
            id: 'ex-04',
            exhibitLetter: 'Exhibit D',
            title: 'Forensic Audit Fund Tracing Flowchart',
            description: 'Summary of traced funds through clearing accounts',
          },
        ],
        investigatorSignature: 'Sarah V., CFE - Lead Investigator',
        signatureDate: '26/09/2026',
        reviewedAndApprovedBy: 'Vice President, Risk Management & Compliance Division',
        approvalDate: '26/09/2026',
        approvalStatus: 'Approved',
      },
      closure: {
        disciplinaryActions: [
          {
            id: 'da-01',
            actionType: 'Termination',
            targetSubject: 'Senior Finance Officer',
            authority: 'Human Resources Directorate',
            status: 'Executed',
          },
          {
            id: 'da-02',
            actionType: 'Criminal Referral',
            targetSubject: 'Senior Finance Officer',
            authority: 'Legal Division / FEACC',
            status: 'Pending',
          },
        ],
        systemicMeasures: [
          {
            id: 'sm-01',
            policyTitle: 'Dual-control authorization on suspense account debit memos',
            responsibleUnit: 'Finance Directorate & IT Core Banking',
            status: 'Implemented',
          },
        ],
        whistleblowerFeedbackProvided: true,
        whistleblowerFeedbackDate: '26/09/2026',
        whistleblowerFeedbackNotes: 'Notified anonymous whistleblower portal with reference key that formal investigation was concluded with substantiated finding and corrective action executed.',
        antiRetaliationActive: true,
        antiRetaliationNotes: 'Anonymous report protected; no workplace retaliation risks identified.',
        caseClosureFormal: false,
        caseClosedAt: undefined,
        programReviewNotes: 'Reconciliation procedures updated across all tier-1 branches.',
      },
    },
  },
  'case-02': {
    id: 'case-02',
    referenceKey: 'CBE-ETH-734120',
    category: 'Bribery, Kickbacks & Corruption',
    targetDepartment: 'Procurement',
    priority: 'HIGH',
    status: 'UNDER_REVIEW',
    submittedAt: '2026-09-19T14:15:00Z',
    updatedAt: '2026-09-19T14:15:00Z',
    isAnonymous: true,
    reportingMode: 'anonymous',
    relationship: 'Vendor / Supplier',
    summary: 'Procurement committee member solicited a 10% kickback to award office IT hardware tender.',
    detailedNarrative: 'Vendor was directly contacted outside official channels prior to tender evaluation with explicit request for payment.',
    incidentDate: 'September 12, 2026',
    incidentLocation: 'Procurement Directorate, CBE Headquarters',
    howAware: 'Direct solicitation via personal phone and meeting request',
    whyCorrupt: 'Demand for personal financial kickbacks in exchange for favorable public enterprise tender evaluation.',
    divisionDepartmentBranch: 'Head Office / Facility & Procurement Division',
    departmentOffice: 'IT Hardware & Consumables Procurement Desk',
    corruptedPersonNames: 'Procurement Committee Evaluator',
    jobPositions: 'Senior Procurement Officer',
    evidenceInPossession: 'WhatsApp voice note audio export and call timestamp log.',
    priorReports: 'None',
    resolutionSought: 'Disciplinary Action & Dismissal of Corrupt Staff',
    reportRecipient: 'Risk Management & Compliance Division',
    assignedTo: 'Lead Investigator Sarah V.',
    triageWorkflow: {
      isAcknowledged: true,
      acknowledgedAt: '2026-09-20T11:00:00Z',
      legalHoldInitiated: true,
      legalHoldNoticeRef: 'LH-2026-092',
      legalHoldAt: '2026-09-20T11:30:00Z',
      investigatorAssigned: 'Sarah V.',
      investigatorDepartment: 'Internal Audit & Ethics Unit',
      noConflictSigned: true,
      isWithinJurisdiction: true,
      jurisdictionNotes: 'Falls under ECV anti-bribery mandate.',
      specificityRating: 'High',
      corroborationRating: 'High',
      severityRating: 'High',
      orgChartReviewed: true,
      orgChartFindings: 'Accused is lead evaluator on IT hardware tender panel.',
      osintReviewed: true,
      osintFindings: 'Confirmed evaluator has personal links to competing vendor.',
      internalRecordsReviewed: true,
      internalRecordsFindings: 'Tender evaluation scores showed anomalous disqualification of lowest compliant bid.',
      predicationDetermination: 'Sufficient',
      recommendedAction: 'Full Investigation',
      recommendedActionJustification: 'Tangible audio proof provided; ongoing tender needs immediate review.',
      nextStepsInterimMeasures: 'Halt award notification on IT tender #2026-44 pending verification.',
    },
    preliminaryAssessmentReport: {
      caseId: 'CBE-ETH-734120',
      dateReportReceipt: '19/09/2026',
      investigatorTeamAssigned: 'Sarah V., Lead Investigator',
      dateAssessmentCompletion: '20/09/2026',
      sourceReportingChannel: 'FIRMS Whistleblower Portal',
      allegedSubjects: 'Senior Procurement Officer, Procurement Directorate',
      allegedOrganizationUnit: 'Head Office / Facility & Procurement Division',
      typeOfMisconduct: 'Bribery & Kickbacks (Tender Extortion)',
      allegedPeriodOfIncident: '12/09/2026',
      allegationSummary: 'Solicitation of 10% commission on office hardware tender.',
      applicableLawPolicy: 'Anti-Corruption Proclamation No. 699/2010; Public Procurement Directive',
      specificityAndDetail: 'High – Specified tender number, date, and evaluator identity.',
      evidenceProvided: 'Audio recording and WhatsApp phone log.',
      initialReviewFindings: 'Pending covert fact-check verification of tender panel membership.',
      credibilityAssessment: 'High – Corroborated with digital audio evidence.',
      severityAssessment: 'High Reputational Risk and Procurement Integrity breach.',
      predicationDetermination: 'Sufficient',
      recommendedAction: 'Full Investigation',
      recommendedActionJustification: 'Evidence requires expedited audit before contract execution.',
      nextStepsInterimMeasures: 'Pause contract signing for IT hardware tender #2026-44.',
    },
    fullInvestigation: {
      currentStep: 1,
      planning: {
        isAuthorized: true,
        authorizedBy: 'Vice President, Risk Management & Compliance Division',
        authorizationDate: '21/09/2026',
        approvalScope: [
          'Interviewing Staff & Witnesses',
          'Seizing Physical & Digital Records',
          'Requesting External / FEACC Data',
          'Engaging Police Forensic Support',
        ],
        specificAllegations: 'Solicitation of 10% cash kickback from vendor in exchange for awarding IT hardware tender #2026-44.',
        investigationTimeframe: 'September 1 to September 20, 2026',
        targetSubjects: 'Senior Procurement Officer (Evaluator)',
        requiredResources: 'Digital forensics analyst for mobile logs, Procurement audit specialist, Legal officer',
        workPlanFinalized: true,
        workPlanNotes: 'Digital audio verified; proceeding to tender file seizure.',
      },
      evidence: {
        seizedRecords: [
          {
            id: 'rec-101',
            category: 'Procurement',
            title: 'Tender Dossier & Bid Evaluation Sheets (#2026-44)',
            dateSeized: '21/09/2026',
            custodyRef: 'EVD-2026-921',
          },
          {
            id: 'rec-102',
            category: 'Digital',
            title: 'WhatsApp Audio Export & Telecom Call Records',
            dateSeized: '21/09/2026',
            custodyRef: 'EVD-2026-922',
          },
        ],
        forensicAuditEngaged: true,
        forensicAgency: 'Internal Forensic IT & Compliance Audit',
        fundsTracedETB: '250,000 ETB (Solicited)',
        quantifiedLossesETB: 'Pending tender re-award',
        illicitPatternsIdentified: 'Anomalous technical score deductions targeting complainant vendor.',
        covertExternalInquiries: [
          {
            id: 'inq-101',
            inquiryType: 'Vendor License (FEACC)',
            details: 'Cross-checking winning bidder corporate registry against evaluator relatives',
            findings: 'Evaluator co-owns shares in competing bidder.',
          },
        ],
      },
      interviews: {
        neutralWitnesses: [
          {
            id: 'w-101',
            name: 'Yonas M.',
            role: 'Procurement Committee Secretary',
            date: '22/09/2026',
            summary: 'Stated that evaluation meeting was held privately with no minutes taken.',
            exhibitsCorroborated: 'Exhibit A (Tender Minute Books)',
          },
        ],
        keyWitnesses: [
          {
            id: 'w-102',
            name: 'Complainant Vendor Lead',
            role: 'Bidding Supplier Director',
            date: '22/09/2026',
            summary: 'Confirmed voice recording authenticity and verified receipt of direct call from subject.',
            exhibitsCorroborated: 'Exhibit B (Audio Recording)',
          },
        ],
        subjects: [
          {
            id: 'sub-101',
            name: 'Senior Procurement Officer',
            role: 'Senior Procurement Specialist',
            date: '23/09/2026',
            legalCounselPresent: true,
            rightsInformed: true,
            recordedDefense: 'Claimed call was routine supplier inquiry clarification; denied financial demand.',
          },
        ],
      },
      report: {
        caseId: 'CBE-ETH-734120',
        dateFinalSubmission: '24/09/2026',
        allegationSummary: 'Procurement evaluator solicited 10% kickback (250,000 ETB) to rig hardware tender #2026-44.',
        investigativeFinding: 'Substantiated',
        estimatedFinancialImpact: '250,000 ETB',
        recommendation: 'Immediate termination of employment, disqualification of tainted tender, and referral to Legal Division / FEACC for criminal prosecution.',
        sourceOfReport: 'FIRMS Whistleblower Portal (Vendor Report)',
        originalAllegationVerbatim: 'Vendor was directly contacted outside official channels prior to tender evaluation with explicit request for 10% cash kickback.',
        dateInvestigationCommenced: '20/09/2026',
        scopeOfInvestigation: 'Comprehensive review of IT hardware tender #2026-44, evaluator phone logs, and bidder registries.',
        investigativeTeam: 'Sarah V. (Lead), Procurement Audit Team & Legal Counsel',
        documentReview: 'Reviewed tender bid files, scoring matrices, 4 vendor submissions, and telecommunication timestamp logs.',
        forensicAnalysis: 'Audio forensic analysis authenticated Subject’s voice on WhatsApp voice note demanding 10% fee.',
        interviewsConducted: 'Secretary Yonas M., Bidding Vendor Director, and Subject Officer.',
        findings: [
          {
            id: 'f-101',
            findingNumber: '4.1',
            title: 'Direct Solicitation of Financial Kickback',
            fact: 'Forensically verified voice recordings prove Subject contacted complainant vendor demanding 10% payment prior to tender award.',
            evidence: 'Audio Recording & Telecom Call Log, Exhibit B.',
          },
          {
            id: 'f-102',
            findingNumber: '4.2',
            title: 'Undisclosed Conflict of Interest & Score Rigging',
            fact: 'Subject holds undisclosed beneficial interest in competing bidder and arbitrarily lowered complainant scores.',
            evidence: 'Corporate Registry Certificate (Exhibit C), Tender Scoring Matrix (Exhibit A).',
          },
        ],
        conclusionText: 'The investigation concludes that the allegation of Bribery, Kickbacks & Tender Extortion is Substantiated based on the authenticated audio evidence and corporate conflict of interest records.',
        findingDetermination: 'Substantiated',
        policyLawViolated: 'Article 15 & 18 of Anti-Corruption Proclamation No. 699/2010 (Bribery & Solicitation); Public Procurement Directive Art. 34',
        disciplinaryLegalActions: [
          'Immediate termination of employment for Senior Procurement Officer for Gross Misconduct.',
          'Refer file and Exhibits A-D to Federal Ethics & Anti-Corruption Commission (FEACC) for criminal charges.',
          'Cancel tainted tender award #2026-44 and blacklist fraudulent competing entity.',
        ],
        systemicPreventativeMeasures: [
          'Implement mandatory conflict-of-interest declarations prior to opening any tender evaluation.',
          'Adopt recorded digital bidding portal for all procurement vendor inquiries.',
        ],
        exhibits: [
          {
            id: 'ex-101',
            exhibitLetter: 'Exhibit A',
            title: 'Tender Dossier & Score Matrix (#2026-44)',
            description: 'Original scoring sheets showing anomalous deductions',
          },
          {
            id: 'ex-102',
            exhibitLetter: 'Exhibit B',
            title: 'Forensically Authenticated Audio Recording',
            description: 'WhatsApp voice note audio export and telecom call log',
          },
          {
            id: 'ex-103',
            exhibitLetter: 'Exhibit C',
            title: 'FEACC Commercial Registry Search on Competing Bidder',
            description: 'Proof of beneficial ownership by evaluator',
          },
        ],
        investigatorSignature: 'Sarah V., CFE - Lead Investigator',
        signatureDate: '24/09/2026',
        reviewedAndApprovedBy: 'Vice President, Risk Management & Compliance Division',
        approvalDate: '24/09/2026',
        approvalStatus: 'Approved',
      },
      closure: {
        disciplinaryActions: [
          {
            id: 'da-101',
            actionType: 'Termination',
            targetSubject: 'Senior Procurement Officer',
            authority: 'Human Resources Directorate',
            status: 'Pending',
          },
          {
            id: 'da-102',
            actionType: 'Criminal Referral',
            targetSubject: 'Senior Procurement Officer',
            authority: 'Legal Division / FEACC',
            status: 'Pending',
          },
        ],
        systemicMeasures: [
          {
            id: 'sm-101',
            policyTitle: 'Mandatory pre-tender conflict of interest attestations',
            responsibleUnit: 'Facility & Procurement Division',
            status: 'In Progress',
          },
        ],
        whistleblowerFeedbackProvided: true,
        whistleblowerFeedbackDate: '24/09/2026',
        whistleblowerFeedbackNotes: 'Informed vendor that allegation was substantiated and tainted tender cancelled.',
        antiRetaliationActive: true,
        antiRetaliationNotes: 'Vendor protected from procurement blacklisting or retaliation.',
        caseClosureFormal: false,
        caseClosedAt: undefined,
        programReviewNotes: 'Procurement evaluation oversight tightened.',
      },
    },
  },
}

const SUBMITTED_CASES_KEY = 'cbe_submitted_cases_v1'

function getStoredDetailedCases(): Record<string, CaseDetailedInvestigation> {
  try {
    const raw = localStorage.getItem(SUBMITTED_CASES_KEY)
    if (!raw) {
      localStorage.setItem(SUBMITTED_CASES_KEY, JSON.stringify(MOCK_DETAILED_CASES))
      return MOCK_DETAILED_CASES
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error reading cases from storage:', err)
    return MOCK_DETAILED_CASES
  }
}

function saveStoredDetailedCases(cases: Record<string, CaseDetailedInvestigation>): void {
  try {
    localStorage.setItem(SUBMITTED_CASES_KEY, JSON.stringify(cases))
  } catch (err) {
    console.error('Error saving cases to storage:', err)
  }
}

export function addSubmittedCaseToStorage(newCase: CaseDetailedInvestigation): void {
  const allCases = getStoredDetailedCases()
  allCases[newCase.id] = newCase
  saveStoredDetailedCases(allCases)
}

export const MOCK_REGISTRY_CASES: CaseSummary[] = Object.values(MOCK_DETAILED_CASES).map((c) => ({
  id: c.id,
  referenceKey: c.referenceKey,
  category: c.category,
  targetDepartment: c.targetDepartment,
  priority: c.priority,
  status: c.status,
  submittedAt: c.submittedAt,
  updatedAt: c.updatedAt,
  isAnonymous: c.isAnonymous,
  assignedTo: c.assignedTo,
}))

export async function fetchCaseRegistry(): Promise<CaseSummary[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const cases = getStoredDetailedCases()
  return Object.values(cases).map((c) => ({
    id: c.id,
    referenceKey: c.referenceKey,
    category: c.category,
    targetDepartment: c.targetDepartment,
    priority: c.priority,
    status: c.status,
    submittedAt: c.submittedAt,
    updatedAt: c.updatedAt,
    isAnonymous: c.isAnonymous,
    assignedTo: c.assignedTo,
  }))
}

export async function fetchCaseById(id: string): Promise<CaseDetailedInvestigation | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const cases = getStoredDetailedCases()
  return cases[id] || cases['case-01'] || null
}

export async function updateCaseTriage(
  id: string,
  triageWorkflow: TriageWorkflowState,
  report: PreliminaryAssessmentReport
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const cases = getStoredDetailedCases()
  if (cases[id]) {
    cases[id].triageWorkflow = triageWorkflow
    cases[id].preliminaryAssessmentReport = report
    cases[id].status = 'INVESTIGATION_ACTIVE'
    cases[id].updatedAt = new Date().toISOString()
    saveStoredDetailedCases(cases)
  }
  return true
}

export async function updateCaseFullInvestigation(
  id: string,
  fullInvestigation: FullInvestigationState
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const cases = getStoredDetailedCases()
  if (cases[id]) {
    cases[id].fullInvestigation = fullInvestigation
    cases[id].status = fullInvestigation.closure.caseClosureFormal
      ? 'RESOLVED'
      : 'INVESTIGATION_ACTIVE'
    cases[id].updatedAt = new Date().toISOString()
    saveStoredDetailedCases(cases)
  }
  return true
}
