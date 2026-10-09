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
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                User
              </th>
              <th scope="col" className="px-6 py-3.5">
                Role & Type
              </th>
              <th scope="col" className="px-6 py-3.5">
                Employee ID
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((user) => {
              const fInitial = (user.firstName?.trim() || user.userName?.trim() || 'U').charAt(0);
              const lInitial = (user.lastName?.trim() || '').charAt(0);
              const initials = `${fInitial}${lInitial}`.toUpperCase() || 'U';
              const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.userName || user.email || 'User';
              
              // Only Employee and External are returned by the backend currently
              const isEmployee = user.userType === 'Employee';

              return (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap min-w-[250px]">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs bg-purple-50 text-cbe-purple border border-purple-100">
                        {initials}
                      </div>
                      <div className="ml-3.5 flex flex-col justify-center">
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-cbe-purple transition-colors">
                          {displayName}
                        </span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isEmployee ? 'bg-purple-50 text-cbe-purple border border-purple-200/60' : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                    }`}>
                      {user.userType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-slate-600 font-medium font-mono">
                      {user.employeeId || <span className="text-slate-400 italic font-sans">N/A</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isActive ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative inline-block text-left">
                      <details className="group">
                        <summary className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer list-none inline-flex items-center justify-center">
                          <MoreVertical className="h-4 w-4" />
                        </summary>
                        <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg py-1">
                          <button
                            type="button"
                            onClick={() => onAssignRole(user)}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-cbe-purple transition-colors cursor-pointer"
                          >
                            <BadgeCheck className="h-4 w-4 text-cbe-purple" />
                            <span>Assign Role</span>
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
      <div className="bg-white px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-white border border-slate-300 text-slate-700 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-slate-900 outline-none cursor-pointer"
            >
              {[10, 20, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block border-l border-slate-200 h-4"></div>
          <div>
            Showing <span className="font-semibold text-slate-900">{((page - 1) * data.pageSize) + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(page * data.pageSize, data.totalCount)}</span> of <span className="font-semibold text-slate-900">{data.totalCount}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
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
                  className={`w-7 h-7 mx-0.5 flex items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    pageNum === page
                      ? 'bg-cbe-purple text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
            className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

