'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, GraduationCap, MapPin, ExternalLink, BookOpen, HeartHandshake, FileText, ChevronRight, Info, CheckCircle2 } from 'lucide-react'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { KAMPUS_DATA } from '@/lib/data/kampus'
import Link from 'next/link'

export default function DirektoriPage() {
  const [activeTab, setActiveTab] = useState<'kampus' | 'jalur' | 'beasiswa'>('kampus')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredKampus = KAMPUS_DATA.filter(k => 
    k.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    k.short_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.popular_majors.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex flex-col w-full h-full font-sans bg-[#fdfaf6] min-h-screen">
      <MobileHeader title="Direktori Kampus" />
      
      <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto p-4 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Direktori Kampus & Beasiswa
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            Cari informasi perguruan tinggi negeri impianmu, pelajari jalur masuknya, dan temukan informasi beasiswa KIP-Kuliah di satu tempat.
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-6 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
          {[
            { id: 'kampus', label: 'Daftar PTN', icon: <GraduationCap size={16} /> },
            { id: 'jalur', label: 'Jalur Masuk (SNBP/SNBT)', icon: <BookOpen size={16} /> },
            { id: 'beasiswa', label: 'Beasiswa (KIP-K)', icon: <HeartHandshake size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content: Kampus */}
        {activeTab === 'kampus' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Search Bar */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Cari nama kampus atau jurusan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 shadow-sm"
              />
            </div>

            {/* Grid Kampus */}
            {filteredKampus.length === 0 ? (
              <div className="text-center py-12 text-slate-500">Kampus atau jurusan tidak ditemukan.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKampus.map((kampus, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={kampus.id} 
                    className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {kampus.short_name.charAt(0)}
                      </div>
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                        Akreditasi {kampus.accreditation}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{kampus.name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1 mb-4">
                      <MapPin size={14} /> <span>{kampus.location}</span>
                    </div>

                    <div className="space-y-3 mb-6 flex-1">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Jurusan Favorit:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {kampus.popular_majors.slice(0, 3).map((major, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-xs border border-slate-100">
                              {major}
                            </span>
                          ))}
                          {kampus.popular_majors.length > 3 && (
                            <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-xs border border-slate-100">
                              +{kampus.popular_majors.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-slate-400 text-xs block">Rata-rata SNBT</span>
                        <span className="font-bold text-blue-600">{kampus.snbt_average}</span>
                      </div>
                      <Link 
                        href={kampus.website} 
                        target="_blank"
                        className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        Kunjungi Web <ExternalLink size={14} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab Content: Jalur Masuk */}
        {activeTab === 'jalur' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-blue-50/50 pointer-events-none">
                <FileText size={120} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <FileText size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">SNBP</h2>
                <p className="text-blue-600 font-semibold mb-6">Seleksi Nasional Berdasarkan Prestasi</p>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-1 text-green-500"><ChevronRight size={18} /></div>
                    <p className="text-slate-600 text-sm leading-relaxed"><strong>Tanpa Tes:</strong> Seleksi murni menggunakan nilai rapor dari semester 1 hingga semester 5 dan portofolio (untuk jurusan seni & olahraga).</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 text-green-500"><ChevronRight size={18} /></div>
                    <p className="text-slate-600 text-sm leading-relaxed"><strong>Kuota Sekolah:</strong> Akreditasi A (40% terbaik), Akreditasi B (25% terbaik), Akreditasi C (5% terbaik).</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 text-green-500"><ChevronRight size={18} /></div>
                    <p className="text-slate-600 text-sm leading-relaxed"><strong>Tips:</strong> Konsistensi grafik nilai sangat penting. Pilih jurusan yang relevan dengan mata pelajaran unggulanmu.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-indigo-50/50 pointer-events-none">
                <BookOpen size={120} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">SNBT</h2>
                <p className="text-indigo-600 font-semibold mb-6">Seleksi Nasional Berdasarkan Tes</p>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-1 text-green-500"><ChevronRight size={18} /></div>
                    <p className="text-slate-600 text-sm leading-relaxed"><strong>UTBK:</strong> Menggunakan Ujian Tulis Berbasis Komputer. Fokus pada Tes Potensi Skolastik (TPS), Literasi Bahasa, dan Penalaran Matematika.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 text-green-500"><ChevronRight size={18} /></div>
                    <p className="text-slate-600 text-sm leading-relaxed"><strong>Lebih Adil:</strong> Siapa saja bisa ikut (termasuk *gap year*), tidak dibatasi oleh nilai rapor sekolah.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 text-green-500"><ChevronRight size={18} /></div>
                    <p className="text-slate-600 text-sm leading-relaxed"><strong>Tips:</strong> Perbanyak latihan soal literasi dan logika. Banyak kampus kini mengutamakan pemahaman bacaan dibanding hafalan materi.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Content: Beasiswa */}
        {activeTab === 'beasiswa' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 max-w-4xl"
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <HeartHandshake size={200} />
              </div>
              <div className="relative z-10">
                <span className="px-3 py-1 bg-white/20 rounded-lg text-sm font-semibold backdrop-blur-md mb-4 inline-block">Program Pemerintah</span>
                <h2 className="text-3xl font-bold mb-3">KIP Kuliah Merdeka</h2>
                <p className="text-blue-100 max-w-2xl leading-relaxed text-lg">
                  KIP Kuliah adalah bantuan biaya pendidikan dari pemerintah bagi lulusan SMA/sederajat yang memiliki potensi akademik baik tetapi memiliki keterbatasan ekonomi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center"><CheckCircle2 size={16} /></div>
                  Apa yang didapat?
                </h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                    <span className="text-blue-500 mt-1">•</span> 
                    <strong>Bebas Biaya Pendaftaran:</strong> Bebas biaya seleksi UTBK-SNBT dan seleksi mandiri di beberapa PTN.
                  </li>
                  <li className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                    <span className="text-blue-500 mt-1">•</span> 
                    <strong>Bebas Biaya Kuliah:</strong> Biaya pendidikan (UKT) dibayarkan langsung ke Perguruan Tinggi.
                  </li>
                  <li className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                    <span className="text-blue-500 mt-1">•</span> 
                    <strong>Bantuan Biaya Hidup:</strong> Mendapatkan uang saku bulanan yang ditransfer langsung ke rekening mahasiswa (besaran disesuaikan dengan klaster wilayah kampus).
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center"><Info size={16} /></div>
                  Syarat Pendaftaran
                </h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                    <span className="text-blue-500 mt-1">1.</span> 
                    Lulusan SMA/SMK/MA yang lulus pada tahun berjalan atau maksimal lulus 2 tahun sebelumnya.
                  </li>
                  <li className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                    <span className="text-blue-500 mt-1">2.</span> 
                    Lulus seleksi penerimaan mahasiswa baru di PTN atau PTS pada prodi terakreditasi.
                  </li>
                  <li className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                    <span className="text-blue-500 mt-1">3.</span> 
                    Memiliki potensi akademik baik tetapi memiliki keterbatasan ekonomi (didukung bukti dokumen seperti Kartu KIP, masuk DTKS, atau Surat Keterangan Tidak Mampu).
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center">
              <p className="text-slate-600 mb-4">Informasi lebih lanjut dan pendaftaran KIP Kuliah dapat diakses melalui portal resmi Kemdikbudristek.</p>
              <Link 
                href="https://kip-kuliah.kemdikbud.go.id/" 
                target="_blank"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                Kunjungi Web KIP-Kuliah <ExternalLink size={18} />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
