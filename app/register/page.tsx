'use client'

import { signup } from '@/app/actions/auth'
import Link from 'next/link'
import { useState } from 'react'
import { 
  Loader2, Mail, Lock, Eye, EyeOff, User, Key,
  ArrowRight, Sparkles, Target, Gamepad2, 
  FolderOpen, LineChart, Gift, Rocket
} from 'lucide-react'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row font-sans bg-white overflow-y-auto lg:overflow-hidden">
      
      {/* KIRI: Form Register (50% layar) */}
      <div className="w-full lg:w-1/2 min-h-[100dvh] lg:min-h-0 lg:h-full flex justify-center items-center lg:items-start py-10 lg:py-0 lg:pt-[8vh] px-6 lg:px-10 relative">
        
        {/* Dekorasi halus di sisi putih */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-rose-50/50 rounded-full blur-3xl -z-10"></div>

        <div className="w-full max-w-sm lg:max-w-md relative z-10 w-full">
          <div className="mb-4 lg:mb-6">
            <Link href="/" className="inline-flex items-center gap-1 font-extrabold text-xl lg:text-2xl text-blue-700 mb-2 lg:mb-4 hover:opacity-80 transition-opacity">
              KarirKu<Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" />
            </Link>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-1 lg:mb-2 tracking-tight flex items-center gap-2">
              Daftar KarirKu <Rocket className="text-blue-600" size={28} />
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Buat akun untuk menyimpan hasil tesmu.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs lg:text-sm rounded-xl border border-red-100 flex items-start gap-2">
              <span className="font-semibold text-red-500">!</span> {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-3 lg:space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs lg:text-sm font-bold text-slate-700">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input 
                  name="full_name" 
                  type="text" 
                  required
                  className="w-full bg-white border border-slate-200 px-4 py-2.5 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-sm transition-all font-medium text-slate-700 shadow-sm" 
                  placeholder="Budi Santoso"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs lg:text-sm font-bold text-slate-700">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input 
                  name="email" 
                  type="email" 
                  required
                  className="w-full bg-white border border-slate-200 px-4 py-2.5 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-sm transition-all font-medium text-slate-700 shadow-sm" 
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs lg:text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-white border border-slate-200 px-4 py-2.5 pl-10 pr-10 rounded-xl outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-sm transition-all font-medium text-slate-700 shadow-sm" 
                  placeholder="Minimal 6 karakter"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs lg:text-sm font-bold text-blue-800">Kode Undangan Sekolah</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-500">
                  <Key size={16} />
                </div>
                <input 
                  name="invite_code" 
                  type="text" 
                  required
                  className="w-full bg-blue-50/50 border border-blue-200 px-4 py-2.5 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-sm transition-all font-medium text-slate-700 shadow-sm placeholder:text-blue-400" 
                  placeholder="Minta kode ke guru BK"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0f4a8a] text-white py-2.5 lg:py-3 rounded-xl font-bold hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-70 flex justify-center items-center gap-2 mt-4 text-sm lg:text-base"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Mendaftar...' : 'Daftar Akun'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="mt-4 lg:mt-6 text-center text-xs lg:text-sm font-semibold text-slate-500">
            Sudah punya akun? <Link href="/login" className="text-blue-700 hover:text-blue-800 ml-1">Masuk di sini <ArrowRight size={12} className="inline mb-0.5"/></Link>
          </p>
        </div>
      </div>

      {/* KANAN: Fitur KarirKu (50% layar) */}
      <div className="w-full lg:w-1/2 min-h-[80dvh] lg:h-full bg-blue-50/30 text-slate-800 relative flex justify-center items-center lg:items-start py-16 lg:py-0 lg:pt-[8vh] px-6 lg:px-10 overflow-hidden">
        
        {/* Dekorasi Panel Kanan */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-[30rem] h-[30rem] bg-rose-100/60 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="w-full max-w-sm lg:max-w-md relative z-10 w-full lg:pl-10">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-8 leading-tight flex items-center gap-2">
            Dengan akun KarirKu,<br className="hidden lg:block"/> kamu bisa: <Sparkles className="text-yellow-500" size={28} />
          </h2>
          
          <div className="space-y-6">
            {[
              { icon: <Target className="text-emerald-500" size={24} />, title: 'Rekomendasi Jurusan AI', text: 'Temukan jurusan kuliah yang paling akurat sesuai dengan kepribadianmu.', color: 'border-emerald-200 bg-emerald-50/50' },
              { icon: <Gamepad2 className="text-blue-700" size={24} />, title: 'Tes Minat Bakat', text: 'Ikuti tes psikologi interaktif yang seru khusus untuk siswa SMA.', color: 'border-blue-200 bg-blue-50/50' },
              { icon: <FolderOpen className="text-amber-500" size={24} />, title: 'Simpan Portofolio', text: 'Rangkum semua sertifikat, nilai, dan hasil tes di satu tempat aman.', color: 'border-amber-200 bg-amber-50/50' },
              { icon: <Gift className="text-rose-500" size={24} />, title: '100% Gratis', text: 'Nikmati seluruh fitur premium kami tanpa dipungut biaya sepeserpun.', color: 'border-rose-200 bg-rose-50/50' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 cursor-default group">
                <div className={`w-12 h-12 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${item.color} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-snug">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-tight mt-1">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>

    </div>
  )
}
