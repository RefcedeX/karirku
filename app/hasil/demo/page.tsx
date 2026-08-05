'use client'

import { RiasecRadarChart } from '@/components/charts/RadarChart'
import { ArrowLeft, Briefcase, GraduationCap, BookOpen, Download } from 'lucide-react'
import Link from 'next/link'

const demoData = [
  { subject: 'Realistic', A: 45, fullMark: 100 },
  { subject: 'Investigative', A: 85, fullMark: 100 },
  { subject: 'Artistic', A: 60, fullMark: 100 },
  { subject: 'Social', A: 75, fullMark: 100 },
  { subject: 'Enterprising', A: 50, fullMark: 100 },
  { subject: 'Conventional', A: 65, fullMark: 100 },
]

export default function HasilDemoPage() {
  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6 pt-12 md:pt-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors w-fit">
        <ArrowLeft size={20} />
        <span>Kembali ke Dashboard</span>
      </Link>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Hasil Rekomendasi</h1>
          <p className="text-muted-foreground">Berdasarkan tes minat bakat tanggal {new Date().toLocaleDateString('id-ID')}</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl font-medium hover:bg-secondary/80 transition-colors">
          <Download size={18} />
          <span>Unduh PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Chart & Summary */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Profil RIASEC</h2>
            <RiasecRadarChart data={demoData} />
            <div className="mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground leading-relaxed">
              Kamu memiliki minat yang sangat tinggi pada bidang <strong>Investigative</strong> dan <strong>Social</strong>. Kamu suka memecahkan masalah analitis sekaligus membantu orang lain.
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
              <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg">Ilmu Komputer / Teknik Informatika</h3>
                  <p className="text-sm text-muted-foreground mt-1">Cocok dengan minat analitismu yang tinggi.</p>
                </div>
                <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-lg text-sm shrink-0 text-center">
                  92% Match
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg">Psikologi</h3>
                  <p className="text-sm text-muted-foreground mt-1">Menggabungkan analisis riset dan sosial.</p>
                </div>
                <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-lg text-sm shrink-0 text-center">
                  85% Match
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Briefcase size={22} className="text-muted-foreground" />
                Prospek Karier
              </h2>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-muted-foreground">Data Scientist</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-muted-foreground">Software Engineer</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-muted-foreground">Psikolog Industri</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen size={22} className="text-muted-foreground" />
                Mapel Pilihan
              </h2>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                  <span className="text-muted-foreground">Matematika Tingkat Lanjut</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                  <span className="text-muted-foreground">Informatika</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                  <span className="text-muted-foreground">Sosiologi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
