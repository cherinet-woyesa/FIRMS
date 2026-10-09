import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface UserFiltersProps {
  onSearch: (search: string) => void;
  onFilterChange: (filters: { isActive?: string; userType?: string }) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({ onSearch, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isActive, setIsActive] = useState<string>('');
  const [userType, setUserType] = useState<string>('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleFilterChange = (active: string, type: string) => {
    setIsActive(active);
    setUserType(type);
    onFilterChange({ 
      isActive: active === '' ? undefined : active, 
      userType: type === '' ? undefined : type 
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setIsActive('');
    setUserType('');
    onFilterChange({ isActive: undefined, userType: undefined });
    onSearch('');
  };

  const hasActiveFilters = searchTerm !== '' || isActive !== '' || userType !== '';

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search users by name, email, employee ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white placeholder-slate-400 transition"
        />
      </div>

      <div className="flex w-full sm:w-auto items-center gap-2.5 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        <select
          value={isActive}
          onChange={(e) => handleFilterChange(e.target.value, userType)}
          className="py-1.5 px-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs text-slate-700 cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>

        <select
          value={userType}
          onChange={(e) => handleFilterChange(isActive, e.target.value)}
          className="py-1.5 px-2.5 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs text-slate-700 cursor-pointer"
        >
          <option value="">All Types</option>
          <option value="Employee">Bank Employee</option>
          <option value="External">External User</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer ml-1"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};
