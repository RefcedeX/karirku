'use client'

import { useSidebarStore } from '@/lib/store/sidebar-store'
import { motion, AnimatePresence } from 'framer-motion'
import { X, LayoutDashboard, Brain, MessageSquare, FileText, Home, PieChart, HelpCircle, Target, LogOut, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function Sidebar() {
  const { isOpen, close } = useSidebarStore()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    close()
    router.push('/')
    router.refresh()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (invisible but captures clicks to close) */}
          <div 
            className="fixed inset-0 z-40 bg-transparent cursor-pointer" 
            onClick={close} 
          />
          
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 z-50 h-full w-[280px] bg-zinc-950 text-white p-6 shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ willChange: "transform" }}
          >
            <div className="flex items-center justify-between mb-10">
              <span className="text-2xl font-bold tracking-tight text-white/90">KarirKu</span>
              <button onClick={close} className="p-2 text-white/50 hover:text-white rounded-full transition-colors bg-white/5 hover:bg-white/10">
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2">
              {/* Public Links */}
              <Link href="/" onClick={close} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
                <Home size={20} />
                <span>Beranda</span>
              </Link>
              <Link href="/statistik" onClick={close} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
                <PieChart size={20} />
                <span>Statistik</span>
              </Link>
              <Link href="/faq" onClick={close} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
                <HelpCircle size={20} />
                <span>Tentang & FAQ</span>
              </Link>

              <div className="h-px w-full bg-white/10 my-2"></div>

              {/* App Links */}
              <Link href="/dashboard" onClick={close} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
                <LayoutDashboard size={20} />
                <span>Profil Siswa</span>
              </Link>
              <Link href="/kuis" onClick={close} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
                <Brain size={20} />
                <span>Mulai Kuis</span>
              </Link>
              <Link href="/konselor" onClick={close} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
                <MessageSquare size={20} />
                <span>Chat Konselor</span>
              </Link>
              <Link href="/cv-builder" onClick={close} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
                <FileText size={20} />
                <span>Buat CV</span>
              </Link>
              <Link href="/direktori" onClick={close} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
                <GraduationCap size={20} />
                <span>Direktori Kampus</span>
              </Link>
            </nav>
            
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors w-full text-left"
              >
                <LogOut size={20} />
                <span className="font-medium">Keluar (Logout)</span>
              </button>
              
              <div className="p-4 rounded-xl bg-white/5 text-sm text-white/60">
                <p>SMAN 1 BAROS</p>
                <p className="mt-1">Sistem Rekomendasi Karier</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
