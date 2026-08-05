import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { RiasecRadarChart } from '@/components/charts/RadarChart'
import { ArrowLeft, Briefcase, GraduationCap, BookOpen, Download } from 'lucide-react'
import Link from 'next/link'
import { DownloadPdfButton } from '@/components/ui/DownloadPdfButton'

export default async function DynamicResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: result, error } = await supabase
    .from('recommendation_results')
    .select('*')
    .eq('id', id)
    .eq('student_id', user.id)
    .single()

  if (error || !result) {
    console.error('Error fetching result:', error, 'Result:', result, 'Params ID:', id, 'User ID:', user.id)
    notFound()
  }

  const scores = result.riasec_scores
  const aiData = result.ai_recommendation

  // Prepare chart data
  const chartData = [
    { subject: 'Realistic', A: scores.R || 0, fullMark: 100 },
    { subject: 'Investigative', A: scores.I || 0, fullMark: 100 },
    { subject: 'Artistic', A: scores.A || 0, fullMark: 100 },
    { subject: 'Social', A: scores.S || 0, fullMark: 100 },
    { subject: 'Enterprising', A: scores.E || 0, fullMark: 100 },
    { subject: 'Conventional', A: scores.C || 0, fullMark: 100 },
  ]

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6 pt-12 md:pt-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors w-fit">
        <ArrowLeft size={20} />
        <span>Kembali ke Dashboard</span>
      </Link>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Hasil Rekomendasi</h1>
          <p className="text-muted-foreground">Berdasarkan tes minat bakat tanggal {new Date(result.created_at).toLocaleDateString('id-ID')}</p>
        </div>
        <DownloadPdfButton targetId="hasil-pdf-content" filename="Hasil-Detail-KarirKu.pdf" />
      </div>

      <div id="hasil-pdf-content" className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-1">
        {/* Kolom Kiri: Chart & Summary */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Profil RIASEC</h2>
            <RiasecRadarChart data={chartData} />
            <div className="mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground leading-relaxed">
              {aiData.summary}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Rekomendasi */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-primary">
              <GraduationCap size={24} />
              Rekomendasi Jurusan
            </h2>
            <div className="flex flex-col gap-4">
              {aiData.recommended_majors?.map((major: any, i: number) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{major.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{major.reason}</p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold px-3 py-1 rounded-lg text-sm shrink-0 text-center">
                    {major.match_score}% Match
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Briefcase size={22} className="text-muted-foreground" />
                Prospek Karier
              </h2>
              <ul className="flex flex-col gap-3">
                {aiData.recommended_careers?.map((career: any, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <span className="text-foreground block">{career.title}</span>
                      <span className="text-xs text-muted-foreground">{career.match_score}% Match</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen size={22} className="text-muted-foreground" />
                Mapel Pilihan
              </h2>
              <ul className="flex flex-col gap-3">
                {aiData.recommended_subjects?.map((subject: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                    <span className="text-muted-foreground">{subject}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
