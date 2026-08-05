import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Users, CheckCircle2, TrendingUp, Award, Sparkles, Menu } from 'lucide-react'
import { MobileNav } from '@/components/ui/MobileNav'

export default async function StatistikPage() {
  const supabase = await createClient()

  // Query data real dari database
  const [{ count: totalStudents }, { count: totalAttempts }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'siswa'),
    supabase.from('quiz_attempts').select('*', { count: 'exact', head: true }),
  ])

  // Hitung persentase penyelesaian
  const completionRate = totalStudents && totalStudents > 0 
    ? Math.round(((totalAttempts || 0) / totalStudents) * 100) 
    : 0

  return (
    <div className="flex flex-col min-h-screen bg-[#fffcf5] text-slate-800 overflow-hidden font-sans">
      
      {/* Header */}
      <header className="flex items-center justify-between p-6 w-full max-w-7xl mx-auto z-10 relative">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-2xl tracking-tight text-orange-600 flex items-center gap-1 hover:opacity-80 transition-opacity">
            KarirKu<span className="text-yellow-400">✧</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-orange-500 transition-colors pb-1">Beranda</Link>
          <Link href="/statistik" className="text-orange-500 font-semibold border-b-2 border-orange-500 pb-1">Statistik</Link>
          <Link href="/faq" className="hover:text-orange-500 transition-colors pb-1">Tentang & FAQ</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/login"
            className="hidden md:flex items-center gap-2 text-sm font-semibold bg-orange-100 text-orange-700 hover:bg-orange-200 px-5 py-2.5 rounded-full transition-colors"
          >
            Masuk <ArrowRight size={16} />
          </Link>
          
          <MobileNav />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 lg:py-20 relative">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl -z-10"></div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm mb-6">
            DATA REAL-TIME
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Statistik Penggunaan KarirKu
          </h1>
          <p className="text-lg text-slate-600">
            Data berikut diambil langsung dari database sistem. Lihat bagaimana siswa SMAN 1 BAROS memanfaatkan platform ini.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {/* Card 1 */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-6">
              <Users className="text-orange-500" size={32} />
            </div>
            <h3 className="text-4xl font-black text-slate-800 mb-2">{totalStudents || 0}</h3>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Siswa Terdaftar</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-6">
              <CheckCircle2 className="text-green-500" size={32} />
            </div>
            <h3 className="text-4xl font-black text-slate-800 mb-2">{totalAttempts || 0}</h3>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tes Diselesaikan</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
              <TrendingUp className="text-indigo-500" size={32} />
            </div>
            <h3 className="text-4xl font-black text-slate-800 mb-2">{completionRate}%</h3>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tingkat Penyelesaian</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-orange-400 to-rose-400 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-orange-500/20 max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-white opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 text-white">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center justify-center gap-2">
                Jadilah Bagian dari Data Ini! <Sparkles className="text-yellow-300" />
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
                Siswa yang sudah menemukan jalan mereka terus bertambah. Kini giliranmu untuk mengeksplorasi potensi terbaik dalam dirimu.
              </p>
              <Link 
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                Daftar Sekarang <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200 mt-auto">
        &copy; {new Date().getFullYear()} KarirKu SMAN 1 BAROS. All rights reserved.
      </footer>
    </div>
  )
}
