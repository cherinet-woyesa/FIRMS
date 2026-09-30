import React from 'react'

export const PublicFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
        <p>© {new Date().getFullYear()} Commercial Bank of Ethiopia • Ethics &amp; Internal Audit Division</p>
        <p className="text-[11px] text-slate-400">Secure, encrypted and tamper-resistant whistleblower channel</p>
      </div>
    </footer>
  )
}
