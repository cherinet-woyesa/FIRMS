import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

// Layouts
import { PublicLayout, DashboardLayout, AuthLayout } from '@/layouts'

// Features
import { ReportWizard } from '@/features/report-submission'
import { CaseTracker } from '@/features/case-tracking'
import { LoginForm, ProtectedRoute } from '@/features/auth'
import { CaseManagementPage, InvestigationWorkspace } from '@/features/case-management'
import { TeamCreationPage } from '@/features/team-management'
import { ReportRepositoryPage } from '@/features/report-repository'
import UserManagementPage from '@/features/user-management/pages/UserManagementPage'
import { AccessManagementPage } from '@/features/accessManagement/pages/AccessManagementPage'
import { RolesPage } from '@/features/accessManagement/pages/RolesPage'
import { PermissionsPage } from '@/features/accessManagement/pages/PermissionsPage'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Whistleblower Flow (Reporting & Tracking) */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<ReportWizard />} />
        <Route path={ROUTES.REPORT} element={<ReportWizard />} />
        <Route path={ROUTES.TRACK} element={<CaseTracker />} />
      </Route>

      {/* Compliance Officer Auth */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginForm />} />
      </Route>

      {/* Protected Compliance Officer Workspace */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<CaseManagementPage />} />
          <Route path={ROUTES.CASES} element={<CaseManagementPage />} />
          <Route path="/dashboard/cases/:id" element={<InvestigationWorkspace />} />
          <Route path={ROUTES.TEAM_CREATION} element={<TeamCreationPage />} />
          <Route path={ROUTES.REPORT_REPOSITORY} element={<ReportRepositoryPage />} />
          <Route path={ROUTES.USERS} element={<UserManagementPage />} />
          <Route path={ROUTES.ACCESS_MANAGEMENT} element={<AccessManagementPage />}>
            <Route index element={<Navigate to="roles" replace />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="permissions" element={<PermissionsPage />} />
          </Route>
          <Route
            path={ROUTES.AUDIT_LOGS}
            element={
              <div className="bg-white p-8 rounded-xl border border-slate-200">
                <h3 className="font-bold text-lg text-slate-800">Tamper-Proof Audit Trail</h3>
                <p className="text-xs text-slate-500 mt-1">
                  All officer actions and case status changes are cryptographically signed.
                </p>
              </div>
            }
          />
          <Route
            path={ROUTES.SETTINGS}
            element={
              <div className="bg-white p-8 rounded-xl border border-slate-200">
                <h3 className="font-bold text-lg text-slate-800">Compliance Committee Settings</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Configure notification webhooks, encryption keys, and escalation rules.
                </p>
              </div>
            }
          />
        </Route>
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  )
}
