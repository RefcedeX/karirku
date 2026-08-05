'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Menu } from 'lucide-react'
import { useSidebarStore } from '@/lib/store/sidebar-store'
import Link from 'next/link'

interface MobileHeaderProps {
  title?: string
  showBack?: boolean
}

export function MobileHeader({ title = 'KarirKu', showBack = true }: MobileHeaderProps) {
  const router = useRouter()
  const { open } = useSidebarStore()

  return (
    <div className="flex items-center justify-between p-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 print:hidden">
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 text-slate-600 hover:text-blue-700 transition-colors rounded-full hover:bg-slate-50"
            aria-label="Kembali"
          >
            <ArrowLeft size={22} />
          </button>
        )}
        <span className="font-bold text-slate-800 text-lg">{title}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <Link href="/" className="font-bold text-xl tracking-tight text-blue-800 flex items-center gap-1 hover:opacity-80 transition-opacity">
          KarirKu<span className="text-yellow-400">✧</span>
        </Link>
        <button 
          onClick={open} 
          className="p-2 -mr-2 text-blue-800 hover:bg-blue-100 transition-colors rounded-full"
          aria-label="Buka Menu"
        >
          <Menu size={24} />
        </button>
      </div>
    </div>
  )
}
