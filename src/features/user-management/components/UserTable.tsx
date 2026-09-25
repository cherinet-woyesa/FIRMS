import React from 'react';
import { UserData, PaginatedResponse } from '../types';
import { ChevronLeft, ChevronRight, UserCircle2, MoreVertical, BadgeCheck } from 'lucide-react';

interface UserTableProps {
  data: PaginatedResponse<UserData> | undefined;
  isLoading: boolean;
  page: number;
  onPageChange: (newPage: number) => void;
  pageSize: number;
  onPageSizeChange: (newSize: number) => void;
  onAssignRole: (user: UserData) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ data, isLoading, page, onPageChange, pageSize, onPageSizeChange, onAssignRole }) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center gap-3 text-brand-700">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-700"></div>
          <p className="text-sm font-medium animate-pulse">Loading users...</p>
        </div>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 text-center px-4">
        <div className="bg-brand-50 p-4 rounded-full mb-4">
          <UserCircle2 className="h-10 w-10 text-brand-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No users found</h3>
        <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col font-sans">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 tracking-wide">
                User
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 tracking-wide">
                Role & Type
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 tracking-wide">
                Employee ID
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 tracking-wide">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.items.map((user) => {
              const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
              
              // Only Employee and External are returned by the backend currently
              const isEmployee = user.userType === 'Employee';

              return (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap min-w-[250px]">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-medium tracking-wide text-sm bg-brand-700/10 text-brand-700">
                        {initials}
                      </div>
                      <div className="ml-4 flex flex-col justify-center">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-brand-800 transition-colors">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-[13px] text-gray-500">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[13px] font-medium ${
                      isEmployee ? 'bg-brand-50 text-brand-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {user.userType}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-[13px] text-gray-600 font-medium">
                      {user.employeeId || <span className="text-gray-400 italic">N/A</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {user.isActive ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-medium bg-gray-100 text-gray-600 border border-gray-200/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="relative inline-block text-left">
                      <details className="group">
                        <summary className="p-1.5 text-gray-400 hover:text-brand-700 hover:bg-brand-50 rounded-md transition-colors cursor-pointer list-none flex items-center justify-center">
                          <MoreVertical className="h-4 w-4" />
                        </summary>
                        <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                          <button
                            type="button"
                            onClick={() => onAssignRole(user)}
                            className="flex w-full items-center gap-3 px-3 py-2 text-left text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-700 transition-colors"
                          >
                            <BadgeCheck className="h-4 w-4 text-[#95298E]" />
                            Assign Role
                          </button>
                        </div>
                      </details>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-white px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-gray-50 border border-gray-200 text-gray-700 rounded-md px-2 py-1 text-[13px] focus:ring-brand-500 focus:border-brand-500 outline-none cursor-pointer"
            >
              {[10, 20, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block border-l border-gray-200 h-4"></div>
          <div>
            Showing <span className="font-semibold text-gray-900">{((page - 1) * data.pageSize) + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(page * data.pageSize, data.totalCount)}</span> of <span className="font-semibold text-gray-900">{data.totalCount}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center px-1">
            {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (data.totalPages > 5 && page > 3) {
                pageNum = page - 2 + i;
                if (pageNum > data.totalPages) return null;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-7 h-7 mx-0.5 flex items-center justify-center rounded-md text-[13px] font-semibold transition-all ${
                    pageNum === page
                      ? 'bg-brand-700 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= data.totalPages}
            className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

