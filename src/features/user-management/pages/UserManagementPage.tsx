import React, { useState } from 'react';
import { useGetUsers } from '../api/getUsers';
import { UserFilters } from '../components/UserFilters';
import { UserTable } from '../components/UserTable';
import { UserRegistrationModal } from '../modals/UserRegistrationModal';
import { AssignRoleModal } from '../modals/AssignRoleModal';
import { Users, Plus } from 'lucide-react';
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

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-brand-100 rounded-lg">
              <Users className="h-6 w-6 text-brand-700" />
            </div>
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-12">
            Manage system users, their access levels, and roles.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#95298E] hover:bg-[#792072] text-white text-sm font-semibold rounded-lg shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add New User
        </button>
      </div>

      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          Error loading users: {error instanceof Error ? error.message : 'Unknown error occurred'}
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
