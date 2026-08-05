'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { upsertCV } from './actions'
import { Loader2, Save } from 'lucide-react'

// Dynamically import PDFViewer to avoid SSR issues
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-muted/30 animate-pulse text-muted-foreground rounded-2xl">Memuat Preview PDF...</div> }
)

import { CVDocument } from '@/components/cv/CVDocument'
import { MobileHeader } from '@/components/layout/MobileHeader'

export default function CVBuilderClient({ initialData, userId }: { initialData: any, userId: string }) {
  const [cvData, setCvData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCvData({ ...cvData, [e.target.name]: e.target.value })
    setMsg('') // clear message on edit
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMsg('')
    const res = await upsertCV(userId, cvData)
    setIsSaving(false)
    if (res.error) setMsg(res.error)
    else setMsg('Tersimpan!')
  }

  return (
    <div className="flex-1 flex flex-col w-full h-[calc(100vh)] lg:h-[calc(100vh-80px)] overflow-hidden animate-in fade-in">
      <MobileHeader title="CV Builder" />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Form */}
      <div className="w-full md:w-1/2 h-full overflow-y-auto p-6 md:p-10 border-r border-border flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">CV Builder</h1>
            <p className="text-muted-foreground">Buat resume profesional pertamamu.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
          </button>
        </div>
        
        {msg && <p className={`mb-4 text-sm font-medium ${msg === 'Tersimpan!' ? 'text-green-500' : 'text-red-500'}`}>{msg}</p>}

        <div className="space-y-5 pb-20">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <input name="name" value={cvData.name} onChange={handleChange} className="w-full bg-muted px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">No. HP</label>
              <input name="phone" value={cvData.phone} onChange={handleChange} className="w-full bg-muted px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input name="email" value={cvData.email} onChange={handleChange} className="w-full bg-muted px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Alamat</label>
            <input name="address" value={cvData.address} onChange={handleChange} className="w-full bg-muted px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
          </div>
          
          <div className="pt-4 border-t border-border">
            <div className="space-y-1 mb-4">
              <label className="text-sm font-medium">Profil Singkat</label>
              <textarea name="summary" value={cvData.summary} onChange={handleChange} rows={3} className="w-full bg-muted px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" />
            </div>
            <div className="space-y-1 mb-4">
              <label className="text-sm font-medium">Pendidikan (Mapel/Jurusan)</label>
              <textarea name="education" value={cvData.education} onChange={handleChange} rows={2} className="w-full bg-muted px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" />
            </div>
            <div className="space-y-1 mb-4">
              <label className="text-sm font-medium">Pengalaman / Organisasi</label>
              <textarea name="experience" value={cvData.experience} onChange={handleChange} rows={4} className="w-full bg-muted px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Keahlian (Skills)</label>
              <textarea name="skills" value={cvData.skills} onChange={handleChange} rows={3} className="w-full bg-muted px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Right: PDF Preview */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-full bg-zinc-100 dark:bg-zinc-900 p-6 md:p-10 flex flex-col">
        <h2 className="font-semibold text-zinc-500 dark:text-zinc-400 mb-4 flex items-center justify-between">
          <span>Live Preview</span>
        </h2>
        <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
          <PDFViewer width="100%" height="100%" showToolbar={false} className="border-none">
            <CVDocument data={cvData} />
          </PDFViewer>
        </div>
      </div>
      </div>
    </div>
  )
}
