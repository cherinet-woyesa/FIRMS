import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Building2, Globe, Search, UserCircle2, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

import { useSearchAdUser } from '../api/searchAdUser';
import { useRegisterAdUser } from '../api/registerAdUser';
import { useRegisterExternalUser } from '../api/registerExternalUser';
import { RegisterExternalRequest } from '../types';

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const externalSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  userName: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ExternalFormValues = z.infer<typeof externalSchema>;

export const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'internal' | 'external'>('internal');
  
  // Internal User State
  const [employeeIdInput, setEmployeeIdInput] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  
  const { data: adUser, isLoading: isSearching, error: searchError } = useSearchAdUser(employeeIdInput, searchTriggered);
  const { mutate: registerAd, isPending: isRegisteringAd } = useRegisterAdUser();

  // External User Form
  const { register, handleSubmit, formState: { errors, isValid }, reset: resetExternalForm } = useForm<ExternalFormValues>({
    resolver: zodResolver(externalSchema),
    mode: 'onChange',
  });
  
  const { mutate: registerExternal, isPending: isRegisteringExternal } = useRegisterExternalUser();

  const handleClose = () => {
    setEmployeeIdInput('');
    setSearchTriggered(false);
    resetExternalForm();
    onClose();
  };

  const handleSearchAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeIdInput.trim()) return;
    setSearchTriggered(true);
  };

  const onRegisterAd = () => {
    if (!adUser) return;
    registerAd({ employeeId: adUser.empId }, {
      onSuccess: () => {
        toast.success(`Successfully registered ${adUser.firstName} ${adUser.lastName}`);
        handleClose();
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to register internal user');
      }
    });
  };

  const onRegisterExternal = (data: ExternalFormValues) => {
    registerExternal(data, {
      onSuccess: () => {
        toast.success('Successfully registered external user');
        handleClose();
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to register external user');
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={handleClose} />
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100/80 rounded-xl mb-6">
            <button
              onClick={() => { setTab('internal'); setSearchTriggered(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                tab === 'internal' ? 'bg-white text-brand-700 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Internal (AD)
            </button>
            <button
              onClick={() => setTab('external')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                tab === 'external' ? 'bg-white text-brand-700 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Globe className="w-4 h-4" />
              External User
            </button>
          </div>

          {/* Internal Tab Content */}
          {tab === 'internal' && (
            <div className="space-y-6">
              <form onSubmit={handleSearchAd} className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Employee ID</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={employeeIdInput}
                      onChange={(e) => {
                        setEmployeeIdInput(e.target.value);
                        setSearchTriggered(false);
                      }}
                      placeholder="Enter Employee ID (e.g. 070728)"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!employeeIdInput.trim() || isSearching}
                    className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                  </button>
                </div>
              </form>

              {searchError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-3">
                  <X className="w-5 h-5 shrink-0" />
                  <p>Could not find user in Active Directory. Please verify the Employee ID.</p>
                </div>
              )}

              {adUser && searchTriggered && !isSearching && !searchError && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="p-5 bg-brand-50/50 border border-brand-100 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-brand-700/10 text-brand-700 rounded-full flex items-center justify-center font-bold text-lg">
                        {adUser.firstName.charAt(0)}{adUser.lastName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-semibold">{adUser.firstName} {adUser.lastName}</h4>
                        <p className="text-sm text-gray-500">{adUser.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm bg-white p-3 rounded-lg border border-brand-100/50">
                      <div>
                        <span className="text-gray-500 block text-xs">Username</span>
                        <span className="font-medium text-gray-900">{adUser.userName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">Employee ID</span>
                        <span className="font-medium text-gray-900">{adUser.empId}</span>
                      </div>
                    </div>

                    <button
                      onClick={onRegisterAd}
                      disabled={isRegisteringAd}
                      className="w-full mt-5 py-3 bg-[#95298E] hover:bg-[#792072] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      {isRegisteringAd ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Register {adUser.firstName}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* External Tab Content */}
          {tab === 'external' && (
            <form onSubmit={handleSubmit(onRegisterExternal)} className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">First Name</label>
                  <input
                    {...register('firstName')}
                    className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
                  />
                  {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Last Name</label>
                  <input
                    {...register('lastName')}
                    className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
                  />
                  {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
                />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Username</label>
                <input
                  {...register('userName')}
                  className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
                />
                {errors.userName && <span className="text-xs text-red-500">{errors.userName.message}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <input
                    type="password"
                    {...register('password')}
                    className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
                  />
                  {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    {...register('confirmPassword')}
                    className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
                  />
                  {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValid || isRegisteringExternal}
                className="w-full mt-6 py-3 bg-[#95298E] hover:bg-[#792072] disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                {isRegisteringExternal ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register External User'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
