'use client'

import { useState, useEffect, ReactNode } from 'react'
import Image from 'next/image'
import { Calendar, Clock, FileText, Mail, Users, Wrench, Microscope, Palette, Handshake, Rocket, BarChart3 } from 'lucide-react'
import { EditProfileModal } from './EditProfileModal'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

interface ProfileCardProps {
  userId: string
  initialName: string
  initialEmail: string
  initialDob: string
  initialClass: string
  testDate: string
  testDuration?: string
  summary?: string
  hollandCode?: string
  hollandDesc?: string
  riasecScores?: {
    R: number
    I: number
    A: number
    S: number
    E: number
    C: number
  }
}

const riasecMap: Record<string, { title: string, tokoh: string, icon: any, color: string, seed: string }> = {
  R: { title: 'Sang Praktisi (The Doer)', tokoh: 'Elon Musk', icon: Wrench, color: 'text-orange-600 bg-orange-100', seed: 'Jack' },
  I: { title: 'Sang Analis (The Thinker)', tokoh: 'Mark Zuckerberg', icon: Microscope, color: 'text-blue-600 bg-blue-100', seed: 'Felix' },
  A: { title: 'Sang Kreator (The Creator)', tokoh: 'Steve Jobs', icon: Palette, color: 'text-pink-600 bg-pink-100', seed: 'Aneka' },
  S: { title: 'Sang Pendidik (The Helper)', tokoh: 'Najwa Shihab', icon: Handshake, color: 'text-emerald-600 bg-emerald-100', seed: 'Jocelyn' },
  E: { title: 'Sang Pemimpin (The Persuader)', tokoh: 'Nadiem Makarim', icon: Rocket, color: 'text-rose-600 bg-rose-100', seed: 'Leo' },
  C: { title: 'Sang Pengatur (The Organizer)', tokoh: 'Sri Mulyani', icon: BarChart3, color: 'text-teal-600 bg-teal-100', seed: 'Oliver' },
}

export function ProfileCard({ userId, initialName, initialEmail, initialDob, initialClass, testDate, testDuration, summary, hollandCode, hollandDesc, riasecScores }: ProfileCardProps) {
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [dob, setDob] = useState(initialDob)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSave = (newName: string, newEmail: string, newDob: string) => {
    setName(newName)
    setEmail(newEmail)
    setDob(newDob)
  }

  const formattedDob = isMounted && dob ? new Date(dob).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Loading...'
  
  const primaryCode = hollandCode ? hollandCode.charAt(0).toUpperCase() : null
  const archetype = primaryCode && riasecMap[primaryCode] ? riasecMap[primaryCode] : null

  return (
    <div className="xl:col-span-3 flex flex-col gap-6 print:col-span-3 print:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      {/* Kartu 1: Profil & Data Siswa */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col relative print:break-inside-avoid print:p-4">
        <h3 className="font-bold text-slate-800 mb-6">Profil Siswa</h3>
        
        <EditProfileModal 
          userId={userId}
          initialName={name}
          initialEmail={email}
          initialDob={dob}
          onSave={handleSave}
        />
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className={`w-32 h-32 rounded-full mb-4 overflow-hidden border-4 border-white shadow-md relative ${archetype ? archetype.color.split(' ')[1] : 'bg-blue-50'}`}>
            <Image 
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${archetype ? archetype.seed : encodeURIComponent(name)}&backgroundColor=transparent`} 
              alt="Avatar" fill sizes="128px" className="object-cover scale-110" unoptimized priority
            />
          </div>
          <h4 className="font-bold text-xl text-slate-800">{name}</h4>
          
          {archetype && (
            <div className="mt-3 flex flex-col items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-extrabold ${archetype.color}`}>
                <archetype.icon size={16} className="shrink-0" /> Kamu adalah: {archetype.title}
              </span>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Mirip dengan: {archetype.tokoh}
              </span>
            </div>
          )}

          <p className="text-slate-500 text-sm mt-3">{initialClass}</p>
          <p className="text-slate-500 text-sm mb-2">SMA Negeri 1 Baros</p>
          
          {/* Email Badge */}
          <div className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-xs border border-slate-100 mt-2">
            <Mail size={12} /> {email}
          </div>
        </div>

        <hr className="w-full border-slate-100 mb-6" />

        {/* Student Data - Vertical Layout */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Calendar className="text-purple-400 mt-1 shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-slate-500">Tanggal Lahir</p>
              <p className="font-semibold text-slate-800 text-sm">{formattedDob}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Calendar className="text-purple-400 mt-1 shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-slate-500">Tanggal Tes</p>
              <p className="font-semibold text-slate-800 text-sm">{testDate}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="text-purple-400 mt-1 shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-slate-500">Durasi Pengerjaan</p>
              <p className="font-semibold text-slate-800 text-sm">{testDuration || 'Belum tersedia'}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FileText className="text-purple-400 mt-1 shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-slate-500">Tipe Tes</p>
              <p className="font-semibold text-slate-800 text-sm">Tes Minat & Bakat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kartu 2: Kepribadian & Minat (Radar Chart) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col relative overflow-hidden print:break-inside-avoid print:p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-pink-50 text-blue-500 rounded-xl"><Users size={20} /></div>
          <h3 className="font-bold text-slate-800 text-base leading-tight">Kepribadian & Minat</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Profil minat dan tipe kepribadianmu</p>

        {/* Holland Code Card */}
        {hollandCode && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-3 text-white mb-6 shadow-md shadow-purple-500/20">
            <h4 className="font-black text-xl tracking-widest leading-none">{hollandCode}</h4>
            <p className="text-xs text-white/90 leading-tight mt-1">{hollandDesc}</p>
          </div>
        )}

        {/* Radar Chart RIASEC */}
        <div className="h-52 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
              { subject: 'Realistic', A: riasecScores?.R || 60, fullMark: 100 },
              { subject: 'Investigative', A: riasecScores?.I || 72, fullMark: 100 },
              { subject: 'Artistic', A: riasecScores?.A || 48, fullMark: 100 },
              { subject: 'Social', A: riasecScores?.S || 36, fullMark: 100 },
              { subject: 'Enterprising', A: riasecScores?.E || 32, fullMark: 100 },
              { subject: 'Conventional', A: riasecScores?.C || 28, fullMark: 100 },
            ]}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar 
                name="Siswa" 
                dataKey="A" 
                stroke="#f97316" 
                fill="#f97316" 
                fillOpacity={0.15} 
                isAnimationActive={true} 
                animationDuration={1500} 
                animationEasing="ease-out"
                label={{ fill: '#f97316', fontSize: 10, fontWeight: 'bold', position: 'top' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary */}
        {summary && (
          <p className="text-xs text-slate-500 mt-6 leading-relaxed">
            {summary}
          </p>
        )}
      </div>
    </div>
  )
}
