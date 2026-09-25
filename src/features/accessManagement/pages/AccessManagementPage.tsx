import React from "react";
import {
    KeyRound,
    ShieldCheck,
} from "lucide-react";

import {
    NavLink,
    Outlet,
    useLocation,
} from "react-router-dom";

export const AccessManagementPage: React.FC =
    () => {
        const location =
            useLocation();

        const isPermissions =
            location.pathname.endsWith(
                "/permissions"
            );

        return (
            <div className="space-y-6">
                {/* Main header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Access Management
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage roles and permissions that control access
                        to the system.
                    </p>
                </div>

                {/* Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex gap-6">
                        <NavLink
                            to="roles"
                            className={`inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition ${!isPermissions
                                ? "border-[#95298E] text-[#95298E]"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                }`}
                        >
                            <ShieldCheck className="h-4 w-4" />
                            Roles
                        </NavLink>

                        <NavLink
                            to="permissions"
                            className={`inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition ${isPermissions
                                ? "border-[#95298E] text-[#95298E]"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                }`}
                        >
                            <KeyRound className="h-4 w-4" />
                            Permissions
                        </NavLink>
                    </nav>
                </div>

                {/* Child page */}
                <Outlet />
            </div>
        );
    };