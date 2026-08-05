'use client'

import { useSidebarStore } from '@/lib/store/sidebar-store'
import { Menu, ArrowRight, Info, ChevronDown, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const faqs = [
  {
    question: "Apa itu KarirKu?",
    answer: "KarirKu adalah platform cerdas berbasis AI yang dirancang khusus untuk siswa SMAN 1 BAROS guna membantu menemukan arah karier, merekomendasikan jurusan kuliah, dan memetakan minat bakat secara presisi sesuai dengan Kurikulum Merdeka."
  },
  {
    question: "Apakah aplikasi ini berbayar?",
    answer: "Tidak! Seluruh fitur utama KarirKu, mulai dari tes minat bakat hingga rekomendasi jurusan AI, 100% gratis untuk seluruh siswa/i SMAN 1 BAROS yang telah terdaftar."
  },
  {
    question: "Bagaimana cara kerja rekomendasi AI?",
    answer: "Sistem AI kami menganalisis pola jawaban dari tes psikologi dan minat bakat yang kamu kerjakan, membandingkannya dengan database ratusan profesi dan program studi, lalu memberikan rekomendasi yang paling selaras dengan kepribadian unikmu."
  },
  {
    question: "Apakah hasil tes saya bisa dilihat oleh guru?",
    answer: "Ya. Untuk keperluan bimbingan konseling, Guru BK memiliki akses dasbor khusus untuk melihat rekapitulasi potensi siswa agar dapat memberikan arahan studi lanjut yang lebih terarah."
  },
  {
    question: "Bagaimana jika saya lupa password akun saya?",
    answer: "Kamu bisa menghubungi Guru BK di sekolah untuk meminta reset password, karena saat ini pendaftaran dan pengelolaan akun terintegrasi penuh dengan pihak sekolah."
  }
]

export default function FAQPage() {
  const openSidebar = useSidebarStore((state) => state.open)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fffcf5] text-slate-800 overflow-hidden font-sans">
      
      {/* Header */}
      <header className="flex items-center justify-between p-6 w-full max-w-7xl mx-auto z-10 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={openSidebar}
            className="p-2 hover:bg-orange-100 rounded-full transition-colors text-orange-600 md:hidden"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="font-bold text-2xl tracking-tight text-orange-600 flex items-center gap-1 hover:opacity-80 transition-opacity">
            KarirKu<span className="text-yellow-400">✧</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-orange-500 transition-colors pb-1">Beranda</Link>
          <Link href="/statistik" className="hover:text-orange-500 transition-colors pb-1">Statistik</Link>
          <Link href="/faq" className="text-orange-500 font-semibold border-b-2 border-orange-500 pb-1">Tentang & FAQ</Link>
        </nav>

        <Link 
          href="/login"
          className="hidden md:flex items-center gap-2 text-sm font-semibold bg-orange-100 text-orange-700 hover:bg-orange-200 px-5 py-2.5 rounded-full transition-colors"
        >
          Masuk <ArrowRight size={16} />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 lg:py-20 relative">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl -z-10"></div>

        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm mb-6">
            <Info size={16} /> INFORMASI
          </motion.div>
          <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Tentang & <span className="text-orange-500">FAQ</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="text-lg text-slate-600">
            Segala hal yang perlu kamu ketahui tentang platform KarirKu. Jika ada pertanyaan lain, jangan ragu untuk berdiskusi dengan Guru BK di sekolahmu.
          </motion.p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div 
          className="max-w-3xl mx-auto space-y-4 relative z-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              variants={fadeIn}
              className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 border ${openIndex === index ? 'border-orange-500 ring-4 ring-orange-500/10 shadow-lg shadow-orange-500/10' : 'border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md'}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
              >
                <span className={`font-bold text-lg ${openIndex === index ? 'text-orange-600' : 'text-slate-800'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  size={24} 
                  className={`shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-orange-500' : 'text-slate-400'}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200 mt-auto">
        &copy; {new Date().getFullYear()} KarirKu SMAN 1 BAROS. All rights reserved.
      </footer>
    </div>
  )
}
