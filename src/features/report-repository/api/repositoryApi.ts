import type {
  HistoricalReportDossier,
  NewHistoricalReportInput,
  RepositoryFilterState,
  RepositoryStats,
} from '../types/repository.types'

const STORAGE_KEY = 'cbe_report_repository_v1'

const SEED_DOSSIERS: HistoricalReportDossier[] = [
  {
    id: 'rep-01',
    docketNumber: 'CBE-ETH-892144',
    title: 'Suspense Account Embezzlement & Commission Siphoning',
    incidentYear: 2026,
    reportDate: '2026-09-22',
    category: 'Financial Misconduct / Accounting Fraud',
    sourceType: 'system-finalized',
    victimName: 'CBE General Ledger Clearing & Public Settlement Reserve',
    accountNumbers: ['1000849201923', '1000849201999'],
    branch: 'Addis Ababa Central Branch',
    district: 'Central Addis Ababa District',
    amountETB: 4850000,
    leadInvestigator: 'Senior Investigator Dawit Tadesse',
    investigatingTeam: 'CBE Ethics, Forensic Audit & FinTech Fraud Squad',
    subjectNames: 'Senior Accounts Officer & Assistant Reconciliation Clerk',
    disposition: 'Substantiated - Criminal Prosecution',
    allegationSummary:
      'Branch finance officer manipulated suspense accounts to siphon transaction commission funds into personal dummy accounts via fake teller override authorizations.',
    factualFindings: [
      'Substantiated debit entries totaling ETB 4,850,000 routed through internal suspense account 992-019-11 without secondary approvals.',
      'Audit logs confirmed transactions executed outside normal branch operating hours (20:14–22:30 EAT).',
      'ATM and POS logs linked withdrawals to personal debit cards issued to immediate relatives of the accused officer.',
    ],
    modusOperandi:
      'Exploited dual-control authorization delay during end-of-day clearing reconciliation window to post manual debit memos directly into dormant suspense codes.',
    correctiveMeasures: [
      'Immediate referral to Federal Ethics and Anti-Corruption Commission (FEACC) and Federal Police.',
      'Revocation of all system administrative privileges and bank credential freezes.',
      'Enforced automated algorithmic alert threshold for any internal account movement exceeding ETB 100,000.',
    ],
    legalViolations:
      'Criminal Code of Ethiopia Art. 675 (Aggravated Breach of Trust) & NBE Banking Directive SBB/43/2018 (Internal Controls Standards).',
    attachedDossierFile: {
      fileName: 'Final_Investigation_Report_CBE-ETH-892144_Certified.pdf',
      fileSize: '3.4 MB',
      fileType: 'application/pdf',
      uploadedAt: '2026-09-22T16:45:00Z',
      fileHash: 'SHA256: 8f9a4e21b8c3d9021e847c1a2f9011de3b92',
    },
    createdAt: '2026-09-22T16:45:00Z',
    isRestitutionSecured: true,
    restitutionAmountETB: 3200000,
  },
  {
    id: 'rep-02',
    docketNumber: 'CBE-HIST-2025-440',
    title: 'Suspense Account Manipulation & Branch Manager Collusion',
    incidentYear: 2025,
    reportDate: '2025-11-18',
    category: 'Embezzlement & Procurement Kickbacks',
    sourceType: 'historical-archive',
    victimName: 'Municipal Infrastructure Development Fund (Dire Dawa)',
    accountNumbers: ['1000781928310', '1000781928315'],
    branch: 'Kebele 02 Branch',
    district: 'Dire Dawa District',
    amountETB: 19500000,
    leadInvestigator: 'Principal Inspector Amina Mohammed',
    investigatingTeam: 'Eastern Region Audit Directorate',
    subjectNames: 'Ex-Branch Manager (Kebede Girma) & Third-Party Contractor',
    disposition: 'Substantiated - Criminal Prosecution',
    allegationSummary:
      'Branch manager approved fraudulent municipal advance payment guarantees and channeled funds into an unverified contractor account without counter-guarantees.',
    factualFindings: [
      'Payment guarantee letter CBE/DD/2025/119 issued without required collateral registration in the National Collateral Registry.',
      'Kickback transfer of ETB 3,500,000 traced to a real estate property acquired in the manager spouse name in Adama.',
      'Physical branch files found deliberately cleansed; digital backups retrieved from core banking disaster recovery logs.',
    ],
    modusOperandi:
      'Fabricated credit committee review minutes and signed unauthorized advance payment bonds using expired delegation thresholds.',
    correctiveMeasures: [
      'Criminal indictment filed at Federal High Court Dire Dawa Bench.',
      'Collateralized commercial property seized for court-ordered asset forfeiture.',
      'Centralized all guarantee issuance above ETB 5M directly to Corporate Head Office.',
    ],
    legalViolations:
      'Banking Business Proclamation No. 592/2008 & Anti-Money Laundering Proclamation No. 780/2013.',
    attachedDossierFile: {
      fileName: 'Historical_Audit_Report_CBE-HIST-2025-440.pdf',
      fileSize: '5.8 MB',
      fileType: 'application/pdf',
      uploadedAt: '2025-11-18T14:20:00Z',
      fileHash: 'SHA256: 4e9102cba879109021fe3a110294bc1230de',
    },
    createdAt: '2025-11-18T14:20:00Z',
    isRestitutionSecured: true,
    restitutionAmountETB: 19500000,
  },
  {
    id: 'rep-03',
    docketNumber: 'CBE-HIST-2025-112',
    title: 'ATM Cash Vault Reconciliation Shortage & Cassette Skimming',
    incidentYear: 2025,
    reportDate: '2025-05-10',
    category: 'Cash Operations Fraud',
    sourceType: 'historical-archive',
    victimName: 'CBE Cash Management Directorate & ATM Custodian Pool',
    accountNumbers: ['1000628193821'],
    branch: 'Alula Branch',
    district: 'Mekelle District',
    amountETB: 3800000,
    leadInvestigator: 'Inspector Berhane Gebremariam',
    investigatingTeam: 'Northern Forensic Inspection Division',
    subjectNames: 'Senior Custodian & Armored Courier Lead',
    disposition: 'Closed - Full Restitution Paid',
    allegationSummary:
      'Systematic short-loading of 5 off-site ATM cash cassettes over an eight-month window masked through falsified replenishment logsheets.',
    factualFindings: [
      'Cassette counter registers showed discrepancies between Host Computer system dispenses and physical chamber meters.',
      'CCTV audit at replenishment vault revealed manual tampering with cassette seal stickers.',
      'Accused confessed upon presentation of forensic ledger timeline analysis.',
    ],
    modusOperandi:
      'Substituted bundle denominations by inserting dummy spacer notes in high-denomination cassettes right before scheduled ATM runs.',
    correctiveMeasures: [
      'Full restitution of ETB 3,800,000 deposited by subject into CBE indemnity recovery account.',
      'Employment contract terminated under disciplinary code article 14.',
      'Transitioned to tamper-evident barcoded RFID cassette security seals across all regions.',
    ],
    legalViolations:
      'CBE Employee Code of Conduct Art. 22 & Ethiopian Penal Code Art. 676.',
    attachedDossierFile: {
      fileName: 'ATM_Reconciliation_Dossier_2025-112.pdf',
      fileSize: '2.1 MB',
      fileType: 'application/pdf',
      uploadedAt: '2025-05-10T11:00:00Z',
      fileHash: 'SHA256: 77a1bc294829103eef01192837bcda124801',
    },
    createdAt: '2025-05-10T11:00:00Z',
    isRestitutionSecured: true,
    restitutionAmountETB: 3800000,
  },
  {
    id: 'rep-04',
    docketNumber: 'CBE-HIST-2024-304',
    title: 'Commercial Loan Collateral Forgery & Land Registry Alteration',
    incidentYear: 2024,
    reportDate: '2024-10-04',
    category: 'Credit & Loan Fraud',
    sourceType: 'historical-archive',
    victimName: 'Commercial Landholding Trust & Lake Tana Real Estate JV',
    accountNumbers: ['1000571928341', '1000571928399'],
    branch: 'Tana Branch',
    district: 'Bahir Dar District',
    amountETB: 52000000,
    leadInvestigator: 'Chief Investigator Solomon Demisse',
    investigatingTeam: 'Head Office Credit Inspection & Special Investigations',
    subjectNames: 'Senior Credit Analyst, Property Valuator & Real Estate Developer',
    disposition: 'Substantiated - Criminal Prosecution',
    allegationSummary:
      'Fraudulent acquisition of industrial loan facility through falsified title deeds and artificially inflated property valuation appraisals.',
    factualFindings: [
      'Zonal Land Administration confirmed property title deed BahirDar/092/14 was completely counterfeit.',
      'Real estate collateral assessed at ETB 78,000,000 had an actual municipal land value not exceeding ETB 6,200,000.',
      'Senior credit analyst received ETB 4,000,000 wire through intermediary business account.',
    ],
    modusOperandi:
      'Colluded with unlicensed private valuation agent and corrupt land registry clerk to produce stamped duplicate registry cards.',
    correctiveMeasures: [
      'Comprehensive foreclosure initiated on developer personal and commercial assets.',
      'Direct prosecution initiated by Federal Attorney General.',
      'Established direct API integration with Regional Land Holding Information Systems for instant title verification.',
    ],
    legalViolations:
      'Proclamation No. 1110/2019 (Prevention of Forgery and Counterfeiting) & Criminal Code Art. 385.',
    attachedDossierFile: {
      fileName: 'BahirDar_LoanFraud_Dossier_2024_304.pdf',
      fileSize: '8.4 MB',
      fileType: 'application/pdf',
      uploadedAt: '2024-10-04T09:15:00Z',
      fileHash: 'SHA256: 12de9401bf89230491023feecda8940129bc',
    },
    createdAt: '2024-10-04T09:15:00Z',
    isRestitutionSecured: true,
    restitutionAmountETB: 38500000,
  },
  {
    id: 'rep-05',
    docketNumber: 'CBE-HIST-2024-073',
    title: 'Payroll Account Padding & Fictitious Ghost Beneficiary Transfers',
    incidentYear: 2024,
    reportDate: '2024-03-29',
    category: 'Corporate Payroll & Settlement Fraud',
    sourceType: 'historical-archive',
    victimName: 'Eastern Cement Factory & Regional Industrial Processing Union',
    accountNumbers: ['1000481920394'],
    branch: 'Adama Branch',
    district: 'East Oromia District',
    amountETB: 6150000,
    leadInvestigator: 'Senior Auditor Tigist Hailu',
    investigatingTeam: 'Corporate Payroll Audit Taskforce',
    subjectNames: 'Institutional Payroll Officer & Branch Processing Specialist',
    disposition: 'Substantiated - Internal Recovery / Restitution',
    allegationSummary:
      'Insertion of 48 fictitious national ID records into monthly corporate salary upload files, diverting balances to dormant account holder accounts.',
    factualFindings: [
      '48 salary payment files contained valid account numbers matching dormant accounts hijacked without account-holder notice.',
      'Automated batch payroll processor logs indicated manual modification of account ID fields post-approval.',
      'Funds pooled into two primary merchant accounts and immediately cashed through informal money dealers.',
    ],
    modusOperandi:
      'Injected unauthorized lines into Excel bulk payroll upload batches during the final pre-processing clearing stage.',
    correctiveMeasures: [
      'Corporate client corporate payroll files now require cryptographic SHA-256 hash matching before ingestion.',
      'ETB 5,100,000 recovered through immediate freezing of recipient merchant accounts.',
      'Employee dismissed with prejudice and barred from all financial sector employment.',
    ],
    legalViolations:
      'Computer Crime Proclamation No. 958/2016 & Criminal Code Art. 707.',
    attachedDossierFile: {
      fileName: 'Adama_Payroll_Fraud_Final_2024.pdf',
      fileSize: '4.2 MB',
      fileType: 'application/pdf',
      uploadedAt: '2024-03-29T15:30:00Z',
      fileHash: 'SHA256: ffa0192837bc91023feecda8940129bc3482',
    },
    createdAt: '2024-03-29T15:30:00Z',
    isRestitutionSecured: true,
    restitutionAmountETB: 5100000,
  },
  {
    id: 'rep-06',
    docketNumber: 'CBE-HIST-2023-289',
    title: 'Unauthorized Foreign Exchange Allocation & Parallel Arbitrage',
    incidentYear: 2023,
    reportDate: '2023-08-14',
    category: 'Foreign Exchange / Treasury Fraud',
    sourceType: 'historical-archive',
    victimName: 'CBE Foreign Currency Reserve & Essential Goods Importers Queue',
    accountNumbers: ['1000392019482', '1000392019499'],
    branch: 'Head Office - Trade Service Directorate',
    district: 'Central Addis Ababa District',
    amountETB: 8900000,
    amountUSD: 160000,
    leadInvestigator: 'Chief Compliance Officer Getachew Bekele',
    investigatingTeam: 'NBE & CBE Joint Financial Intelligence Unit',
    subjectNames: 'Senior Forex Allocation Officer & Importer Agent',
    disposition: 'Substantiated - Criminal Prosecution',
    allegationSummary:
      'Unlawful leapfrogging of foreign exchange priority queues in exchange for offshore dollar commissions transferred to UAE correspondent accounts.',
    factualFindings: [
      'Applicant import request for non-essential cosmetics prioritized ahead of medical pharmaceutical import requests waiting 9 months.',
      'Auditors verified counterfeit Letter of Credit confirmation notices created inside core trade portal.',
      'Substantial offshore deposit matching $160,000 identified via international banking intelligence cooperation.',
    ],
    modusOperandi:
      'Manipulated priority FIFO (First-In, First-Out) queuing database records by backdating system entry timestamps.',
    correctiveMeasures: [
      'Forex allocation queue fully automated with blockchain-anchored chronological timestamping.',
      'Perpetrator remanded into custody under National Bank of Ethiopia foreign exchange anti-corruption directive.',
    ],
    legalViolations:
      'National Bank of Ethiopia Directive No. FXD/70/2021 & Criminal Code Art. 407.',
    attachedDossierFile: {
      fileName: 'Forex_Allocation_Audit_CBE-HIST-2023-289.pdf',
      fileSize: '6.1 MB',
      fileType: 'application/pdf',
      uploadedAt: '2023-08-14T10:00:00Z',
      fileHash: 'SHA256: 39a0129bcffa0192837bc91023feecda8940',
    },
    createdAt: '2023-08-14T10:00:00Z',
    isRestitutionSecured: false,
    restitutionAmountETB: 0,
  },
  {
    id: 'rep-07',
    docketNumber: 'CBE-HIST-2023-118',
    title: 'Core Banking Ledger Collusion & Unauthorized Overdraft Creation',
    incidentYear: 2023,
    reportDate: '2023-04-20',
    category: 'Core Banking / Overdraft Fraud',
    sourceType: 'historical-archive',
    victimName: 'Ethiopian Import-Export Corporation & Retail Depositor Trust',
    accountNumbers: ['1000249182341'],
    branch: 'Bole Medhanialem Branch',
    district: 'Finfine District',
    amountETB: 34200000,
    leadInvestigator: 'Inspector Hiwot Assefa',
    investigatingTeam: 'Special Inspection & Core Ledger Forensics',
    subjectNames: 'Branch Senior Customer Service Manager',
    disposition: 'Substantiated - Criminal Prosecution',
    allegationSummary:
      'Branch supervisor granted illegal temporary overdraft limits on a shell company account, transferring proceeds via RTGS to multiple private commercial banks.',
    factualFindings: [
      'Temporary Overdraft (TOD) parameter raised to ETB 35,000,000 without District VP approval authorization.',
      'Proceeds routed across 14 commercial bank accounts within 45 minutes of disbursement.',
      'Subject attempted to leave the country via Bole International Airport; intercepted by Federal Police.',
    ],
    modusOperandi:
      'Compromised supervisor login token during lunch break and approved manual override flags in core banking system.',
    correctiveMeasures: [
      'Implemented biometric hardware MFA requirement for all credit limit overrides.',
      'ETB 29,800,000 frozen and recovered across correspondent banks through inter-bank fraud network.',
    ],
    legalViolations:
      'Cybercrime Proclamation & Banking Business Proclamation Art. 49.',
    attachedDossierFile: {
      fileName: 'Bole_Overdraft_Fraud_Historical_Dossier.pdf',
      fileSize: '7.5 MB',
      fileType: 'application/pdf',
      uploadedAt: '2023-04-20T17:00:00Z',
      fileHash: 'SHA256: bcffa0192837bc91023feecda8940129bc39a0',
    },
    createdAt: '2023-04-20T17:00:00Z',
    isRestitutionSecured: true,
    restitutionAmountETB: 29800000,
  },
  {
    id: 'rep-08',
    docketNumber: 'CBE-HIST-2022-041',
    title: 'Inter-Branch Telegraphic Wire Diversion & Account Impersonation',
    incidentYear: 2022,
    reportDate: '2022-11-14',
    category: 'Wire Transfer / Account Takeover',
    sourceType: 'historical-archive',
    victimName: 'CBE Hawassa District Operations Reserve & Coffee Exporters Cooperative',
    accountNumbers: ['1000189422312', '1000189422399'],
    branch: 'Hawassa Main Branch',
    district: 'Hawassa District',
    amountETB: 12400000,
    leadInvestigator: 'Senior Inspector Yohannes Kassa',
    investigatingTeam: 'Southern Regional Internal Audit',
    subjectNames: 'Telegraphic Wire Operator & Outside Fraud Syndicate',
    disposition: 'Substantiated - Internal Recovery / Restitution',
    allegationSummary:
      'Diversion of high-value regional inter-branch telegraphic transfer requests through spoofed branch routing codes into syndicate-controlled savings accounts.',
    factualFindings: [
      'Three telegraphic transfers totaling ETB 12.4M intercepted and re-routed using forged test-key authentication codes.',
      'Syndicate accomplice impersonated authorized corporate representative with forged kebele identification.',
      'Quick action by recipient branch teller halted final withdrawal of remaining ETB 4.2M.',
    ],
    modusOperandi:
      'Shared confidential internal test-key book codes with external collaborators via encrypted messaging.',
    correctiveMeasures: [
      'Full replacement of manual test-key telegraphic system with end-to-end encrypted Swift & ATS messaging.',
      'ETB 11,200,000 successfully recovered from frozen syndicate assets.',
    ],
    legalViolations:
      'Criminal Code of Ethiopia Art. 675 & NBE Payment Systems Directive.',
    attachedDossierFile: {
      fileName: 'Hawassa_Wire_Transfer_Dossier_2022_Certified.pdf',
      fileSize: '4.9 MB',
      fileType: 'application/pdf',
      uploadedAt: '2022-11-14T12:00:00Z',
      fileHash: 'SHA256: feecda8940129bc39a0129bcffa0192837bc9102',
    },
    createdAt: '2022-11-14T12:00:00Z',
    isRestitutionSecured: true,
    restitutionAmountETB: 11200000,
  },
]

function getStoredDossiers(): HistoricalReportDossier[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DOSSIERS))
      return SEED_DOSSIERS
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
    return SEED_DOSSIERS
  } catch (err) {
    console.error('Error reading report repository from storage:', err)
    return SEED_DOSSIERS
  }
}

function saveStoredDossiers(dossiers: HistoricalReportDossier[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dossiers))
  } catch (err) {
    console.error('Error saving report repository to storage:', err)
  }
}

/**
 * Fetch all report dossiers with optional search and filter criteria
 */
export async function fetchRepositoryDossiers(
  filters?: Partial<RepositoryFilterState>
): Promise<HistoricalReportDossier[]> {
  // Simulate rapid API response
  await new Promise((res) => setTimeout(res, 80))
  let results = [...getStoredDossiers()]

  if (!filters) {
    return results.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
  }

  // 1. Free-Text Search across ALL fields (FR 3.9.3: partial or full matches across all captured fields)
  if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
    const q = filters.searchQuery.toLowerCase().trim()
    results = results.filter((dossier) => {
      const matchDocket = dossier.docketNumber.toLowerCase().includes(q)
      const matchTitle = dossier.title.toLowerCase().includes(q)
      const matchVictim = dossier.victimName.toLowerCase().includes(q)
      const matchSubjects = dossier.subjectNames.toLowerCase().includes(q)
      const matchBranch = dossier.branch.toLowerCase().includes(q)
      const matchDistrict = dossier.district.toLowerCase().includes(q)
      const matchCategory = dossier.category.toLowerCase().includes(q)
      const matchInvestigator = dossier.leadInvestigator.toLowerCase().includes(q)
      const matchAccounts = dossier.accountNumbers.some((acc) => acc.toLowerCase().includes(q))
      const matchSummary = dossier.allegationSummary.toLowerCase().includes(q)
      const matchModus = dossier.modusOperandi.toLowerCase().includes(q)
      const matchViolations = dossier.legalViolations.toLowerCase().includes(q)
      const matchYear = dossier.incidentYear.toString().includes(q)
      const matchAmount = dossier.amountETB.toString().includes(q)

      return (
        matchDocket ||
        matchTitle ||
        matchVictim ||
        matchSubjects ||
        matchBranch ||
        matchDistrict ||
        matchCategory ||
        matchInvestigator ||
        matchAccounts ||
        matchSummary ||
        matchModus ||
        matchViolations ||
        matchYear ||
        matchAmount
      )
    })
  }

  // 2. Year filter
  if (filters.incidentYear && filters.incidentYear !== 'all') {
    const targetYear = parseInt(filters.incidentYear, 10)
    if (!isNaN(targetYear)) {
      results = results.filter((d) => d.incidentYear === targetYear)
    }
  }

  // 3. Source type filter
  if (filters.sourceType && filters.sourceType !== 'all') {
    results = results.filter((d) => d.sourceType === filters.sourceType)
  }

  // 4. Category filter
  if (filters.category && filters.category !== 'all') {
    results = results.filter((d) => d.category.toLowerCase().includes(filters.category!.toLowerCase()))
  }

  // 5. District filter
  if (filters.district && filters.district !== 'all') {
    results = results.filter((d) => d.district.toLowerCase().includes(filters.district!.toLowerCase()))
  }

  // 6. Disposition filter
  if (filters.disposition && filters.disposition !== 'all') {
    results = results.filter((d) => d.disposition === filters.disposition)
  }

  // 7. Amount range
  if (filters.minAmount !== undefined && filters.minAmount > 0) {
    results = results.filter((d) => d.amountETB >= filters.minAmount!)
  }
  if (filters.maxAmount !== undefined && filters.maxAmount > 0) {
    results = results.filter((d) => d.amountETB <= filters.maxAmount!)
  }

  // 8. Sorting
  const sortBy = filters.sortBy || 'date-desc'
  results.sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime()
      case 'amount-desc':
        return b.amountETB - a.amountETB
      case 'amount-asc':
        return a.amountETB - b.amountETB
      case 'docket-asc':
        return a.docketNumber.localeCompare(b.docketNumber)
      case 'date-desc':
      default:
        return new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
    }
  })

  return results
}

/**
 * Retrieve single full finalized report document
 */
export async function fetchDossierById(id: string): Promise<HistoricalReportDossier | null> {
  await new Promise((res) => setTimeout(res, 50))
  const all = getStoredDossiers()
  return all.find((d) => d.id === id || d.docketNumber.toLowerCase() === id.toLowerCase()) || null
}

/**
 * Register and manually upload historical report (from 2022 onwards)
 */
export async function registerHistoricalReport(
  input: NewHistoricalReportInput
): Promise<HistoricalReportDossier> {
  await new Promise((res) => setTimeout(res, 200))
  const all = getStoredDossiers()

  // Parse account numbers (split by comma, space or newline)
  const accounts = input.accountNumbers
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)

  const parsedAmountETB = parseFloat(input.amountETB.replace(/[^0-9.]/g, '')) || 0
  const parsedAmountUSD = input.amountUSD
    ? parseFloat(input.amountUSD.replace(/[^0-9.]/g, ''))
    : undefined

  // Split findings
  const findingsList = input.factualFindings
    .split('\n')
    .map((f) => f.trim())
    .filter((f) => f.length > 0)

  // Split corrective measures
  const correctiveList = input.correctiveMeasures
    .split('\n')
    .map((m) => m.trim())
    .filter((m) => m.length > 0)

  const newDossier: HistoricalReportDossier = {
    id: `rep-${Date.now()}`,
    docketNumber: input.docketNumber.trim().toUpperCase(),
    title: input.title.trim(),
    incidentYear: Number(input.incidentYear),
    reportDate: input.reportDate || new Date().toISOString().split('T')[0],
    category: input.category.trim(),
    sourceType: 'historical-archive',
    victimName: input.victimName.trim(),
    accountNumbers: accounts.length > 0 ? accounts : ['N/A'],
    branch: input.branch.trim(),
    district: input.district.trim(),
    amountETB: parsedAmountETB,
    amountUSD: parsedAmountUSD,
    leadInvestigator: input.leadInvestigator.trim(),
    investigatingTeam: input.investigatingTeam?.trim() || 'CBE Historical Archive Taskforce',
    subjectNames: input.subjectNames.trim(),
    disposition: input.disposition,
    allegationSummary: input.allegationSummary.trim(),
    factualFindings:
      findingsList.length > 0
        ? findingsList
        : ['Documented facts verified through archived paper audit and ledger trails.'],
    modusOperandi: input.modusOperandi.trim() || 'Archived modus operandi documented in attached physical dossier.',
    correctiveMeasures:
      correctiveList.length > 0
        ? correctiveList
        : ['Internal controls revised as per audit recommendation.'],
    legalViolations: input.legalViolations.trim() || 'Internal Ethics & Banking Compliance Regulations.',
    attachedDossierFile: input.fileName
      ? {
          fileName: input.fileName,
          fileSize: input.fileSize || '3.2 MB',
          fileType: input.fileType || 'application/pdf',
          uploadedAt: new Date().toISOString(),
          fileHash: `SHA256: ${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        }
      : {
          fileName: `${input.docketNumber.trim().toUpperCase()}_Dossier_Certified.pdf`,
          fileSize: '2.8 MB',
          fileType: 'application/pdf',
          uploadedAt: new Date().toISOString(),
          fileHash: `SHA256: ${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        },
    createdAt: new Date().toISOString(),
    isRestitutionSecured:
      input.disposition.includes('Restitution') || input.disposition.includes('Closed'),
    restitutionAmountETB:
      input.disposition.includes('Restitution') || input.disposition.includes('Closed')
        ? parsedAmountETB
        : 0,
  }

  const updated = [newDossier, ...all]
  saveStoredDossiers(updated)
  return newDossier
}

/**
 * Calculate aggregate statistics across the database
 */
export function calculateRepositoryStats(dossiers: HistoricalReportDossier[]): RepositoryStats {
  const totalReports = dossiers.length
  let totalAmountETB = 0
  let restitutionRecoveredETB = 0
  let historicalCount = 0
  let finalizedCount = 0
  let oldestYear = 2026
  let newestYear = 2022

  for (const d of dossiers) {
    totalAmountETB += d.amountETB
    if (d.restitutionAmountETB) {
      restitutionRecoveredETB += d.restitutionAmountETB
    }
    if (d.sourceType === 'historical-archive') {
      historicalCount++
    } else {
      finalizedCount++
    }
    if (d.incidentYear < oldestYear) oldestYear = d.incidentYear
    if (d.incidentYear > newestYear) newestYear = d.incidentYear
  }

  return {
    totalReports,
    totalAmountETB,
    historicalCount,
    finalizedCount,
    restitutionRecoveredETB,
    oldestYear,
    newestYear,
  }
}
