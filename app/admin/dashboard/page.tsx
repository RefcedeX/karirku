import { createClient } from '@/lib/supabase/server'
import { Users, FileText, Settings, BarChart } from 'lucide-react'
import { redirect } from 'next/navigation'
import { HollandDistributionChart } from '@/components/charts/HollandDistributionChart'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verifikasi role: hanya teacher/admin yang boleh akses
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'teacher' && profile.role !== 'admin')) {
    redirect('/dashboard') // Siswa diarahkan ke dashboard mereka
  }

  const [{ count: totalStudents }, { data: attempts }, { count: totalCVs }, { data: studentsData }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('quiz_attempts').select('user_id'),
    supabase.from('cv_data').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select(`
      id,
      full_name,
      class_name,
      recommendation_results (
        id,
        riasec_scores,
        created_at
      )
    `).eq('role', 'siswa').order('created_at', { ascending: false }).limit(100)
  ])

  // Calculate Holland Code distribution
  const hollandDistribution = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  
  studentsData?.forEach(student => {
    const results = student.recommendation_results || [];
    if (results.length > 0) {
      const latestResult = results.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      if (latestResult?.riasec_scores) {
        const scores = latestResult.riasec_scores;
        // Find dominant dimension
        const sorted = Object.entries(scores).sort((a: any, b: any) => b[1] - a[1]);
        if (sorted.length > 0) {
          const dominant = sorted[0][0] as keyof typeof hollandDistribution;
          if (hollandDistribution[dominant] !== undefined) {
            hollandDistribution[dominant]++;
          }
        }
      }
    }
  })

  // Calculate unique students who have completed the test
  const uniqueStudentsWithTest = new Set((attempts || []).map(a => a.user_id)).size;

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-6 pt-12 animate-in fade-in">
      <h1 className="text-3xl font-bold mb-8">Dashboard Guru BK</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { title: 'Total Siswa', value: totalStudents || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Kuis Selesai', value: uniqueStudentsWithTest, icon: FileText, color: 'text-green-500', bg: 'bg-green-500/10' },
          { title: 'CV Dibuat', value: totalCVs || 0, icon: BarChart, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { title: 'Mode Kurikulum', value: 'Mapel Pilihan', icon: Settings, color: 'text-blue-700', bg: 'bg-blue-700/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-3xl p-6 flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-1 bg-card border border-border rounded-3xl p-8">
          <h2 className="text-xl font-semibold mb-6">Distribusi Tipe Kepribadian</h2>
          <HollandDistributionChart data={hollandDistribution} />
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-8">
          <h2 className="text-xl font-semibold mb-6">Daftar Siswa & Hasil Tes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Nama Siswa</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Kelas</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Holland Code</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Tanggal Tes</th>
                <th className="px-4 py-3 font-semibold text-slate-700 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {studentsData?.map((student) => {
                // Find latest result
                const results = student.recommendation_results || [];
                const latestResult = results.length > 0 
                  ? results.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
                  : null;
                
                let hollandCode = "Belum Tes";
                let dateTes = "-";
                
                if (latestResult && latestResult.riasec_scores) {
                  // Calculate top 3 holland code
                  const scores = latestResult.riasec_scores;
                  const sorted = Object.entries(scores).sort((a: any, b: any) => b[1] - a[1]);
                  hollandCode = sorted.slice(0, 3).map(i => i[0]).join('');
                  dateTes = new Date(latestResult.created_at).toLocaleDateString('id-ID');
                }

                return (
                  <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-4 font-medium text-slate-800">{student.full_name}</td>
                    <td className="px-4 py-4">{student.class_name || '-'}</td>
                    <td className="px-4 py-4">
                      {hollandCode !== "Belum Tes" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                          {hollandCode}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Belum Tes</span>
                      )}
                    </td>
                    <td className="px-4 py-4">{dateTes}</td>
                    <td className="px-4 py-4 text-right">
                      {latestResult ? (
                        <a href={`/hasil/${latestResult.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Lihat Detail</a>
                      ) : (
                        <span className="text-slate-300 text-sm">Tidak Tersedia</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              
              {(!studentsData || studentsData.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">Belum ada data siswa.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  )
}
