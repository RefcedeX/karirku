'use client'

import { useSidebarStore } from '@/lib/store/sidebar-store'
import { 
  Menu, ArrowRight, Target, BrainCircuit, 
  FolderOpen, LineChart, ClipboardCheck, 
  Sparkles, GraduationCap, FileText, CheckCircle2 
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { AuthButton } from '@/components/ui/AuthButton'

const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then(mod => mod.Player), { ssr: false })

export default function Home() {
  const openSidebar = useSidebarStore((state) => state.open)

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
            className="p-2 hover:bg-orange-100 rounded-full transition-colors text-orange-600"
          >
            <Menu size={24} />
          </button>
          <div className="font-bold text-2xl tracking-tight text-orange-600 flex items-center gap-1">
            KarirKu<span className="text-yellow-400">✧</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="text-orange-500 font-semibold border-b-2 border-orange-500 pb-1">Beranda</Link>
          <Link href="/statistik" className="hover:text-orange-500 transition-colors pb-1">Statistik</Link>
          <Link href="/faq" className="hover:text-orange-500 transition-colors pb-1">Tentang & FAQ</Link>
        </nav>

        <AuthButton />
      </header>

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-12 pb-24 flex flex-col lg:flex-row items-center gap-12">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl -z-10"></div>

        {/* Left Content */}
        <motion.div 
          className="flex-1 text-center lg:text-left z-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm mb-6">
            SMAN 1 BAROS
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Temukan Arah Karier & Studi Lanjutmu
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0">
            Tes minat bakat interaktif dengan rekomendasi jurusan dan profesi yang didukung oleh AI, dirancang khusus untuk Kurikulum Merdeka.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link 
              href="/dashboard"
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-1 w-full sm:w-auto"
            >
              Mulai Tes Sekarang
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Content / Hero Illustration */}
        <motion.div 
          className="flex-1 relative w-full max-w-lg lg:max-w-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
            <Player
              autoplay
              loop
              src="/happy%20student.json"
              style={{ height: '100%', width: '100%' }}
              background="transparent"
            />
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute -right-4 md:-right-8 top-1/3 bg-white px-6 py-4 rounded-3xl shadow-xl rounded-bl-none z-20 hidden md:block"
            >
              <p className="font-bold text-sm text-slate-700">Masa depan cerah dimulai<br/>dari pilihan yang tepat! ✨</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Row */}
      <section className="max-w-7xl mx-auto w-full px-6 mb-24">
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-8 z-20 relative">
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex items-center gap-4 flex-1">
            <motion.div variants={fadeIn} className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
              <Target className="text-red-500" size={32} />
            </motion.div>
            <motion.div variants={fadeIn}>
              <h3 className="font-bold text-slate-800 mb-1">Tes Interaktif</h3>
              <p className="text-sm text-slate-500 leading-tight">Tes minat bakat yang seru dan mudah dipahami</p>
            </motion.div>
          </motion.div>

          <div className="hidden lg:block w-px h-16 bg-slate-100"></div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex items-center gap-4 flex-1">
            <motion.div variants={fadeIn} className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
              <BrainCircuit className="text-indigo-500" size={32} />
            </motion.div>
            <motion.div variants={fadeIn}>
              <h3 className="font-bold text-slate-800 mb-1">Rekomendasi AI</h3>
              <p className="text-sm text-slate-500 leading-tight">Hasil akurat dengan dukungan kecerdasan buatan</p>
            </motion.div>
          </motion.div>

          <div className="hidden lg:block w-px h-16 bg-slate-100"></div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex items-center gap-4 flex-1">
            <motion.div variants={fadeIn} className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
              <FolderOpen className="text-amber-500" size={32} />
            </motion.div>
            <motion.div variants={fadeIn}>
              <h3 className="font-bold text-slate-800 mb-1">Jurusan & Profesi</h3>
              <p className="text-sm text-slate-500 leading-tight">Temukan jurusan kuliah yang paling cocok</p>
            </motion.div>
          </motion.div>

          <div className="hidden lg:block w-px h-16 bg-slate-100"></div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex items-center gap-4 flex-1">
            <motion.div variants={fadeIn} className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
              <LineChart className="text-green-500" size={32} />
            </motion.div>
            <motion.div variants={fadeIn}>
              <h3 className="font-bold text-slate-800 mb-1">Rapor & Riwayat</h3>
              <p className="text-sm text-slate-500 leading-tight">Simpan hasil tes dan pantau perkembangan</p>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto w-full px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-2 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
            Gimana Cara Kerjanya? <Sparkles className="text-yellow-400" />
          </h2>
          <svg className="w-48 h-4 mx-auto mt-2 text-orange-300" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10C50 -5 150 25 195 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 relative">
          
          {/* Character Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative hidden md:block shrink-0"
          >
            <div className="relative w-[300px] h-[400px] lg:w-[380px] lg:h-[480px]">
              <Image 
                src="/cewek.webp" 
                alt="Karakter Siswa SMA" 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                className="object-contain drop-shadow-2xl"
              />
            </div>
            {/* Floating Speech Bubble */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-16 -left-8 md:-left-12 bg-white px-8 py-5 rounded-[2rem] shadow-xl rounded-br-none border border-slate-100 z-10"
            >
              <p className="font-bold text-slate-700 text-xl text-center leading-tight">Mudah<br/>banget!</p>
            </motion.div>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-6 relative">
          {[
            { id: 1, title: 'Isi Tes Minat', desc: 'Jawab pertanyaan seputar dirimu dengan jujur', icon: <FileText size={32} className="text-red-500" />, color: 'bg-red-50' },
            { id: 2, title: 'Proses AI', desc: 'AI menganalisis hasil tes dan minat bakatmu', icon: <BrainCircuit size={32} className="text-amber-500" />, color: 'bg-amber-50' },
            { id: 3, title: 'Lihat Hasil', desc: 'Dapatkan rekomendasi jurusan kuliah terbaik', icon: <ClipboardCheck size={32} className="text-green-500" />, color: 'bg-green-50' },
            { id: 4, title: 'Raih Masa Depan', desc: 'Gunakan hasilnya untuk rencanakan masa depanmu!', icon: <Target size={32} className="text-purple-500" />, color: 'bg-purple-50' },
          ].map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center max-w-[220px] relative z-10"
            >
              <div className={`w-24 h-24 rounded-full ${step.color} border-4 border-white shadow-lg flex items-center justify-center mb-6 relative`}>
                {step.icon}
                <div className="absolute -bottom-3 bg-white border-2 border-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-700 shadow-sm">
                  {step.id}
                </div>
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500">{step.desc}</p>

              {/* Arrow connector for desktop */}
              {index < 3 && (
                <div className="hidden md:block absolute top-12 -right-8 w-12 text-slate-300">
                  <ArrowRight size={24} />
                </div>
              )}
            </motion.div>
          ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto w-full px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#ebe7ff] to-[#f3f0ff] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden"
        >
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -z-0"></div>
          
          <div className="relative z-10 flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
              Masa Depanmu, <br/>Pilihanmu! <span className="text-red-400">♥</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto md:mx-0">
              Jangan bingung lagi menentukan arah karier dan studi lanjut, KarirKu siap membantumu menemukan yang paling cocok!
            </p>
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-1"
            >
              Yuk, Mulai Sekarang! ✨ <ArrowRight size={20} />
            </Link>
          </div>

          <div className="relative z-10 flex-1 flex justify-center md:justify-end">
            <div className="relative">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <Player
                  autoplay
                  loop
                  src="/01_Finishig%20Studies.json"
                  style={{ height: '100%', width: '100%' }}
                  background="transparent"
                />
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, x: 20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-4 -right-8 md:-right-16 bg-white px-6 py-3 rounded-2xl shadow-xl rounded-bl-none border border-slate-100 hidden md:block z-20"
                >
                  <p className="font-bold text-slate-700 whitespace-nowrap">Kamu pasti<br/>bisa! 💪</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200">
        &copy; {new Date().getFullYear()} KarirKu SMAN 1 BAROS. All rights reserved.
      </footer>
    </div>
  )
}
