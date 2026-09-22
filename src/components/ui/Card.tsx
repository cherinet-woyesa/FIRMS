import React from 'react'
import { cn } from '@/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  footer?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ className, header, footer, children, ...props }) => {
  return (
    <div
      className={cn('bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden', className)}
      {...props}
    >
      {header && <div className="px-6 py-4 border-b border-slate-100">{header}</div>}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">{footer}</div>}
    </div>
  )
}
