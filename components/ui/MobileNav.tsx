'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'
import { AuthButton } from './AuthButton'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 text-slate-600 hover:text-orange-500 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-white border-b border-slate-100 shadow-lg z-50 p-6 flex flex-col gap-6 animate-in slide-in-from-top-2">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium hover:text-orange-500">
            Beranda
          </Link>
          <Link href="/statistik" onClick={() => setIsOpen(false)} className="text-orange-500 font-bold border-l-4 border-orange-500 pl-2">
            Statistik
          </Link>
          <Link href="/faq" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium hover:text-orange-500">
            Tentang & FAQ
          </Link>
          <div className="pt-4 border-t border-slate-100" onClick={() => setIsOpen(false)}>
            <AuthButton mobile={true} />
          </div>
        </div>
      )}
    </div>
  )
}
