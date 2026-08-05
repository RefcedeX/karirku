'use client'

import { useSidebarStore } from '@/lib/store/sidebar-store'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { AuthButton } from '@/components/ui/AuthButton'

interface PublicHeaderProps {
  activePage?: 'home' | 'statistik' | 'faq'
}

export function PublicHeader({ activePage = 'home' }: PublicHeaderProps) {
  const openSidebar = useSidebarStore((state) => state.open)

  return (
    <header className="flex items-center justify-between p-6 w-full max-w-7xl mx-auto z-10 relative">
      <div className="flex items-center gap-4">
        <button 
          onClick={openSidebar}
          className="p-2 hover:bg-blue-100 rounded-full transition-colors text-blue-800"
        >
          <Menu size={24} />
        </button>
        <Link href="/" className="font-bold text-2xl tracking-tight text-blue-800 flex items-center gap-1 hover:opacity-80 transition-opacity">
          KarirKu<span className="text-yellow-400">✧</span>
        </Link>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <Link 
          href="/" 
          className={activePage === 'home' ? "text-blue-700 font-semibold border-b-2 border-blue-700 pb-1" : "hover:text-blue-700 transition-colors pb-1"}
        >
          Beranda
        </Link>
        <Link 
          href="/statistik" 
          className={activePage === 'statistik' ? "text-blue-700 font-semibold border-b-2 border-blue-700 pb-1" : "hover:text-blue-700 transition-colors pb-1"}
        >
          Statistik
        </Link>
        <Link 
          href="/faq" 
          className={activePage === 'faq' ? "text-blue-700 font-semibold border-b-2 border-blue-700 pb-1" : "hover:text-blue-700 transition-colors pb-1"}
        >
          Tentang & FAQ
        </Link>
      </nav>

      <AuthButton />
    </header>
  )
}
