import React from 'react';
import { Shield } from 'lucide-react';
import type { Role } from '../types';

interface RoleListItemProps {
    role: Role;
    selected: boolean;
    onClick: () => void;
}

export const RoleListItem: React.FC<RoleListItemProps> = ({
    role,
    selected,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors',
                selected
                    ? 'bg-[#95298E]/10 text-[#95298E]'
                    : 'text-gray-700 hover:bg-gray-50',
            ].join(' ')}
        >
            <Shield
                className={[
                    'h-4 w-4 shrink-0',
                    selected ? 'text-[#95298E]' : 'text-gray-400',
                ].join(' ')}
            />

            <span className="truncate text-sm font-medium">
                {role.name}
            </span>
        </button>
    );
};