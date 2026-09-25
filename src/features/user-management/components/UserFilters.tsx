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
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
      <div className="relative w-full sm:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-brand-700/50" />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-colors"
        />
      </div>

      <div className="flex w-full sm:w-auto items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <select
          value={isActive}
          onChange={(e) => handleFilterChange(e.target.value, userType)}
          className="block w-full sm:w-32 py-2 px-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <select
          value={userType}
          onChange={(e) => handleFilterChange(isActive, e.target.value)}
          className="block w-full sm:w-36 py-2 px-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
        >
          <option value="">All Types</option>
          <option value="Employee">Employee</option>
          <option value="External">External</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="p-2 text-gray-400 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
            title="Clear filters"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
