import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Users, CheckCircle2, TrendingUp, Award, Sparkles } from 'lucide-react'
import { PublicHeader } from '@/components/layout/PublicHeader'

export const dynamic = 'force-dynamic'

export default async function StatistikPage() {
  const supabase = await createClient()

  // Query data real dari database
  const [{ count: totalStudents }, { data: attempts }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('quiz_attempts').select('user_id'),
  ])

  // Dapatkan jumlah unik siswa yang menyelesaikan tes
  const uniqueStudentsWithTest = new Set((attempts || []).map(a => a.user_id)).size;

  // Hitung persentase penyelesaian
  const completionRate = totalStudents && totalStudents > 0 
    ? Math.round((uniqueStudentsWithTest / totalStudents) * 100) 
    : 0

  return (
    <div className="flex flex-col min-h-screen bg-[#fffcf5] text-slate-800 overflow-hidden font-sans">
      
      {/* Header */}
      <PublicHeader activePage="statistik" />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 lg:py-20 relative">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl -z-10"></div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-900 font-semibold text-sm mb-6">
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
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
              <Users className="text-blue-700" size={32} />
            </div>
            <h3 className="text-4xl font-black text-slate-800 mb-2">{totalStudents || 0}</h3>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Siswa Terdaftar</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-6">
              <CheckCircle2 className="text-green-500" size={32} />
            </div>
            <h3 className="text-4xl font-black text-slate-800 mb-2">{uniqueStudentsWithTest}</h3>
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
          <div className="bg-gradient-to-r from-pink-400 to-pink-500 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-pink-500/20 max-w-4xl mx-auto">
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
                className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1"
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
