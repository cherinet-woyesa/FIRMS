import React, { useState } from 'react';
import { useGetUsers } from '../api/getUsers';
import { UserFilters } from '../components/UserFilters';
import { UserTable } from '../components/UserTable';
import { UserRegistrationModal } from '../modals/UserRegistrationModal';
import { AssignRoleModal } from '../modals/AssignRoleModal';
import { Users, Plus, UserCheck, Briefcase, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { UserData } from '../types';

export const UserManagementPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<{ isActive?: string; userType?: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignRoleModalOpen, setAssignRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const { data, isLoading, isError, error } = useGetUsers({
    page,
    pageSize,
    search,
    isActive: filters.isActive,
    userType: filters.userType,
  });

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1); // Reset to first page on new search
  };

  const handleFilterChange = (newFilters: { isActive?: string; userType?: string }) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on new filter
  };

  const handleAssignRole = (user: UserData) => {
    setSelectedUser(user);
    setAssignRoleModalOpen(true);
  };

  const items = data?.data?.items || [];
  const totalCount = data?.data?.totalCount || items.length;
  const activeCount = items.filter((u) => u.isActive).length;
  const employeeCount = items.filter((u) => u.userType === 'Employee').length;
  const externalCount = items.filter((u) => u.userType === 'External').length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage system users, access credentials, organizational units, and role permissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-cbe-purple hover:bg-cbe-purple-700 text-white font-medium text-xs flex items-center justify-center gap-2 px-4 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New User</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-cbe-purple flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Accounts</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bank Employees</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{employeeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">External Users</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{externalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
        </div>
      </div>

      {isError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between">
          <span>Error loading users: {error instanceof Error ? error.message : 'Unknown error occurred'}</span>
        </div>
      )}

      {/* Filters and Search */}
      <UserFilters 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange} 
      />

      {/* Data Table */}
      <UserTable 
        data={data?.data} 
        isLoading={isLoading} 
        page={page} 
        onPageChange={setPage} 
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onAssignRole={handleAssignRole}
      />

      {/* Registration Modal */}
      <UserRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Assign Role Modal */}
      <AssignRoleModal
        isOpen={assignRoleModalOpen}
        onClose={() => setAssignRoleModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UserManagementPage;
