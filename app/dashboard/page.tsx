import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Download, Calendar, Clock, FileText, Hexagon, Briefcase, HeartPulse, Palette, GraduationCap, Users, Target, CheckCircle2, Lightbulb } from 'lucide-react'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { DownloadPdfButton } from '@/components/ui/DownloadPdfButton'
import { MobileHeader } from '@/components/layout/MobileHeader'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Ambil profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, class_name')
    .eq('id', user.id)
    .single()

  // Ambil hasil rekomendasi terakhir
  const { data: latestResult } = await supabase
    .from('recommendation_results')
    .select('id, created_at, ai_recommendation, riasec_scores')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const userName = profile?.full_name || user.user_metadata?.full_name || 'Siswa'
  const userDob = user.user_metadata?.tanggal_lahir || ''
  const userEmail = user.email || ''
  const userClass = profile?.class_name || user.user_metadata?.class_name || 'Siswa SMA'
  
  const testDate = latestResult 
    ? new Date(latestResult.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-'

  const durationSecs = latestResult?.ai_recommendation?.test_duration || 0
  const testDurationStr = durationSecs > 0 
    ? durationSecs < 60 ? '< 1 menit' : `${Math.floor(durationSecs / 60)} menit`
    : '-'

  return (
    <>
      <MobileHeader title="Profil Siswa" />
      <div className="flex-1 flex flex-col w-full p-4 lg:p-8 bg-[#fdfaf6] min-h-screen">
        
        {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Hasil Tes Minat & Bakat
          </h1>
          <p className="text-slate-500 mt-1">Berikut adalah hasil analisis minat dan bakat berdasarkan jawabanmu.</p>
        </div>
        
        {latestResult && (
          <DownloadPdfButton targetId="dashboard-pdf-content" filename={`Hasil-KarirKu-${userName.replace(/\s+/g, '-')}.pdf`} />
        )}
      </div>

      {!latestResult ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm">
          <div className="bg-blue-50 p-6 rounded-full text-blue-700 mb-6">
            <Target size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Belum Ada Hasil Tes</h2>
          <p className="text-slate-500 max-w-md mb-8 mx-auto">
            Kamu belum mengikuti tes minat dan bakat. Mulai tes sekarang untuk mengetahui rekomendasi jurusan kuliah dan prospek karier yang cocok untukmu!
          </p>
          <Link 
            href="/kuis"
            className="flex items-center justify-center gap-2 bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition-all hover:scale-105 shadow-xl shadow-blue-700/20 w-fit mx-auto"
          >
            Mulai Tes Sekarang <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <div id="dashboard-pdf-content" className="grid grid-cols-1 xl:grid-cols-12 gap-6 print:grid-cols-12 print:gap-4 print:text-sm">
          
          {/* Kolom Kiri: Profil Siswa (Span 3) */}
          <ProfileCard 
            userId={user.id}
            initialName={userName}
            initialEmail={userEmail}
            initialDob={userDob}
            initialClass={userClass}
            testDate={testDate}
            testDuration={testDurationStr}
            summary={latestResult?.ai_recommendation?.summary}
            hollandCode={latestResult?.ai_recommendation?.holland_code}
            hollandDesc={latestResult?.ai_recommendation?.holland_code_description}
            riasecScores={latestResult?.riasec_scores}
          />

          {/* Kolom Tengah & Kanan (Span 9) */}
          <div id="hasil-riasec" className="xl:col-span-9 flex flex-col gap-6 scroll-mt-24 print:col-span-9 print:gap-4">
            
            {/* Baris Atas: Skor Minat & Rekomendasi Jurusan */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 print:grid-cols-5 print:gap-4">
              
              {/* Skor Minat (Span 3) */}
              <div className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm print:col-span-3 print:p-4 print:break-inside-avoid animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Target size={20} /></div>
                  <h3 className="font-bold text-slate-800">Skor Minat Kamu</h3>
                </div>

                <div className="space-y-5">
                  {[
                    { label: 'Teknologi', icon: <Hexagon size={16}/>, color: 'bg-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-600', score: latestResult.ai_recommendation?.industry_scores?.teknologi || 0 },
                    { label: 'Bisnis & Manajemen', icon: <Briefcase size={16}/>, color: 'bg-blue-700', bg: 'bg-blue-100', text: 'text-blue-800', score: latestResult.ai_recommendation?.industry_scores?.bisnis || 0 },
                    { label: 'Kesehatan', icon: <HeartPulse size={16}/>, color: 'bg-green-500', bg: 'bg-green-100', text: 'text-green-600', score: latestResult.ai_recommendation?.industry_scores?.kesehatan || 0 },
                    { label: 'Seni & Kreativitas', icon: <Palette size={16}/>, color: 'bg-pink-400', bg: 'bg-pink-100', text: 'text-pink-600', score: latestResult.ai_recommendation?.industry_scores?.seni || 0 },
                    { label: 'Pendidikan', icon: <GraduationCap size={16}/>, color: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-600', score: latestResult.ai_recommendation?.industry_scores?.pendidikan || 0 },
                    { label: 'Sosial & Humaniora', icon: <Users size={16}/>, color: 'bg-amber-400', bg: 'bg-amber-100', text: 'text-amber-600', score: latestResult.ai_recommendation?.industry_scores?.sosial || 0 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 fill-mode-both" style={{ animationDelay: `${idx * 150 + 600}ms` }}>
                      <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center shrink-0 ${item.text}`}>
                        {item.icon}
                      </div>
                      <div className="w-36 text-sm font-medium text-slate-700 leading-tight">{item.label}</div>
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full animate-expand-width`} 
                          style={{ '--target-width': `${item.score}%`, animationDelay: `${idx * 150 + 600}ms` } as any}
                        ></div>
                      </div>
                      <div className="w-10 text-right font-bold text-slate-700 text-sm">{item.score}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rekomendasi Jurusan (Span 2) */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col print:col-span-2 print:p-4 print:break-inside-avoid animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><GraduationCap size={20} /></div>
                  <h3 className="font-bold text-slate-800">Rekomendasi Jurusan</h3>
                </div>
                <p className="text-sm text-slate-500 mb-6">Jurusan yang paling sesuai dengan minat dan potensimu</p>

                <div className="space-y-3 flex-1">
                  {(latestResult.ai_recommendation?.recommended_majors || []).map((major: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 bg-purple-50/50 p-3 rounded-xl border border-purple-100/50 animate-in fade-in slide-in-from-right-4 fill-mode-both" style={{ animationDelay: `${idx * 150 + 600}ms` }}>
                      <div className="w-7 h-7 bg-purple-100 text-purple-600 font-bold rounded-lg flex items-center justify-center shrink-0 text-sm">
                        {idx + 1}
                      </div>
                      <div className="font-semibold text-slate-700 text-sm leading-tight">{major.name}</div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full text-center text-purple-600 font-semibold text-sm hover:text-purple-700 pt-2 transition-colors">
                  Lihat Semua Jurusan
                </button>
              </div>
            </div>

            {/* Baris Tengah: Profesi, Mapel, Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 print:grid-cols-9 print:gap-4">
              
              {/* Rekomendasi Profesi (Span 3) */}
              <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col print:col-span-3 print:p-4 print:break-inside-avoid animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Briefcase size={20} /></div>
                  <h3 className="font-bold text-slate-800">Prospek Karier</h3>
                </div>
                <p className="text-sm text-slate-500 mb-6">Pekerjaan impianmu</p>

                <div className="flex flex-col gap-3 flex-1 content-start">
                  {(latestResult.ai_recommendation?.recommended_careers || []).map((career: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 fill-mode-both" style={{ animationDelay: `${idx * 150 + 700}ms` }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-700 shrink-0"></div>
                      <div className="text-sm font-medium text-slate-700">{career.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mapel Pilihan (Span 3) */}
              <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col print:col-span-3 print:p-4 print:break-inside-avoid animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 fill-mode-both">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-rose-50 text-rose-500 rounded-xl"><Target size={20} /></div>
                  <h3 className="font-bold text-slate-800">Mapel Pilihan</h3>
                </div>
                <p className="text-sm text-slate-500 mb-6">Lintas minat di SMA</p>

                <div className="flex flex-col gap-3 flex-1 content-start">
                  {(latestResult.ai_recommendation?.recommended_subjects || []).map((subject: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 fill-mode-both" style={{ animationDelay: `${idx * 150 + 800}ms` }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></div>
                      <div className="text-sm font-medium text-slate-700">{subject}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips Pengembangan (Span 3) */}
              <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col print:col-span-3 print:p-4 print:break-inside-avoid animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><Lightbulb size={20} /></div>
                  <h3 className="font-bold text-slate-800 text-base">Pengembangan Diri</h3>
                </div>
                <p className="text-xs text-slate-500 mb-6">Tingkatkan potensimu</p>

                <div className="space-y-4 flex-1">
                  {(latestResult.ai_recommendation?.development_tips || []).map((tip: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 animate-in fade-in slide-in-from-right-4 fill-mode-both" style={{ animationDelay: `${idx * 150 + 900}ms` }}>
                      <div className="mt-0.5 text-green-500 shrink-0">
                        <CheckCircle2 size={16} />
                      </div>
                      <p className="text-sm text-slate-600 leading-snug">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Banner Bawah: Interpretasi Guru BK */}
            <div className="bg-gradient-to-r from-[#f0ebf8] to-[#f8f5fc] rounded-3xl p-6 md:p-8 border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative shadow-sm print:p-4 print:break-inside-avoid animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700 fill-mode-both">
              <div className="relative z-10 flex-1 max-w-2xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">Interpretasi untuk Guru BK</h3>
                <p className="text-slate-700 text-sm leading-relaxed mb-6">
                  {latestResult.ai_recommendation?.summary || "Data interpretasi belum tersedia."}
                </p>
              </div>
              
              {/* Illustration Dummy Content since image not available */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl z-0 pointer-events-none"></div>
            </div>

          </div>
        </div>
      )}
      </div>
    </>
  )
}
