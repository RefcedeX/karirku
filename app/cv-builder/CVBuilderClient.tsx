'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { upsertCV } from './actions'
import { Loader2, Save, Download, Plus, Trash } from 'lucide-react'

// Dynamically import PDFViewer and PDFDownloadLink to avoid SSR issues
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-muted/30 animate-pulse text-muted-foreground rounded-2xl">Memuat Preview PDF...</div> }
)
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <button disabled className="flex items-center gap-2 bg-slate-200 text-slate-500 px-4 py-2 rounded-xl font-medium"><Loader2 size={18} className="animate-spin" /><span>Menyiapkan...</span></button> }
)

import { CVDocument } from '@/components/cv/CVDocument'
import { MobileHeader } from '@/components/layout/MobileHeader'

export default function CVBuilderClient({ initialData, userId }: { initialData: any, userId: string }) {
  const [cvData, setCvData] = useState(initialData)
  const [template, setTemplate] = useState<'ats' | 'creative'>('ats')
  const [isSaving, setIsSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCvData({ ...cvData, [e.target.name]: e.target.value })
    setMsg('') // clear message on edit
  }

  const handleArrayChange = (field: 'education' | 'experience', index: number, key: string, value: string) => {
    const updatedArray = [...cvData[field]]
    updatedArray[index] = { ...updatedArray[index], [key]: value }
    setCvData({ ...cvData, [field]: updatedArray })
    setMsg('')
  }

  const addArrayItem = (field: 'education' | 'experience') => {
    const newItem = field === 'education' 
      ? { school: '', major: '', startDate: '', endDate: '', activities: '' }
      : { company: '', role: '', startDate: '', endDate: '', description: '' }
    setCvData({ ...cvData, [field]: [...cvData[field], newItem] })
  }

  const removeArrayItem = (field: 'education' | 'experience', index: number) => {
    const updatedArray = [...cvData[field]]
    updatedArray.splice(index, 1)
    setCvData({ ...cvData, [field]: updatedArray })
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
    <div className="flex-1 flex flex-col w-full h-[100dvh] overflow-hidden animate-in fade-in">
      <MobileHeader title="CV Builder" />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Form */}
      <div className="w-full md:w-1/2 h-full overflow-y-auto p-6 md:p-10 border-r border-border flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">CV Builder</h1>
            <p className="text-muted-foreground">Buat resume profesional pertamamu.</p>
          </div>
          <div className="flex items-center gap-2">
            <PDFDownloadLink document={<CVDocument data={cvData} template={template} />} fileName={`CV_${cvData.name || 'KarirKu'}.pdf`}>
              {({ loading }) => (
                <button
                  disabled={loading}
                  className="flex items-center gap-2 bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  <span className="hidden sm:inline">{loading ? 'Memuat...' : 'Unduh PDF'}</span>
                </button>
              )}
            </PDFDownloadLink>
            
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span className="hidden sm:inline">{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
            </button>
          </div>
        </div>
        
        {msg && <p className={`mb-4 text-sm font-medium ${msg === 'Tersimpan!' ? 'text-green-500' : 'text-red-500'}`}>{msg}</p>}

        {/* Template Selector */}
        <div className="mb-6 p-1 bg-slate-100 rounded-xl inline-flex w-full sm:w-auto">
          <button
            onClick={() => setTemplate('ats')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${template === 'ats' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ATS (Korporat)
          </button>
          <button
            onClick={() => setTemplate('creative')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${template === 'creative' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Kreatif (Desain)
          </button>
        </div>

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
          <div className="space-y-1">
            <label className="text-sm font-medium">Website / LinkedIn / Portofolio</label>
            <input name="website" value={cvData.website || ''} onChange={handleChange} className="w-full bg-muted px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm" placeholder="https://linkedin.com/in/..." />
          </div>
          
          <div className="pt-4 border-t border-border">
            <div className="space-y-1 mb-6">
              <label className="text-sm font-medium">Profil Singkat</label>
              <textarea name="summary" value={cvData.summary} onChange={handleChange} rows={3} className="w-full bg-muted px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" />
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold">Pendidikan</label>
                <button onClick={() => addArrayItem('education')} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-lg flex items-center gap-1 font-medium hover:bg-primary/20 transition-colors"><Plus size={14}/> Tambah</button>
              </div>
              {cvData.education.map((edu: any, idx: number) => (
                <div key={idx} className="p-4 bg-muted/50 rounded-xl space-y-3 relative border border-border/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Nama Sekolah/Kampus</label>
                      <input value={edu.school} onChange={(e) => handleArrayChange('education', idx, 'school', e.target.value)} className="w-full bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg text-sm border-none focus:ring-2 outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Jurusan / Fokus</label>
                      <input value={edu.major} onChange={(e) => handleArrayChange('education', idx, 'major', e.target.value)} className="w-full bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg text-sm border-none focus:ring-2 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Tahun Mulai</label>
                        <input value={edu.startDate} onChange={(e) => handleArrayChange('education', idx, 'startDate', e.target.value)} className="w-full bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg text-sm border-none focus:ring-2 outline-none" placeholder="Mis: 2019" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Tahun Selesai</label>
                        <input value={edu.endDate} onChange={(e) => handleArrayChange('education', idx, 'endDate', e.target.value)} className="w-full bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg text-sm border-none focus:ring-2 outline-none" placeholder="Mis: 2022" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Kegiatan / Prestasi (Pisahkan dengan baris baru)</label>
                    <textarea value={edu.activities} onChange={(e) => handleArrayChange('education', idx, 'activities', e.target.value)} rows={3} className="w-full bg-white dark:bg-zinc-900 px-3 py-2 rounded-lg text-sm border-none focus:ring-2 outline-none resize-none" placeholder="- Anggota OSIS&#10;- Juara 1 Lomba Web" />
                  </div>
                  <button onClick={() => removeArrayItem('education', idx)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors"><Trash size={14}/></button>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold">Pengalaman / Organisasi</label>
                <button onClick={() => addArrayItem('experience')} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-lg flex items-center gap-1 font-medium hover:bg-primary/20 transition-colors"><Plus size={14}/> Tambah</button>
              </div>
              {cvData.experience.map((exp: any, idx: number) => (
                <div key={idx} className="p-4 bg-muted/50 rounded-xl space-y-3 relative border border-border/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Nama Perusahaan/Organisasi</label>
                      <input value={exp.company} onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} className="w-full bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg text-sm border-none focus:ring-2 outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Posisi / Jabatan</label>
                      <input value={exp.role} onChange={(e) => handleArrayChange('experience', idx, 'role', e.target.value)} className="w-full bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg text-sm border-none focus:ring-2 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Tanggal Mulai</label>
                        <input value={exp.startDate} onChange={(e) => handleArrayChange('experience', idx, 'startDate', e.target.value)} className="w-full bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg text-sm border-none focus:ring-2 outline-none" placeholder="Mis: Jan 2023" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Tanggal Selesai</label>
                        <input value={exp.endDate} onChange={(e) => handleArrayChange('experience', idx, 'endDate', e.target.value)} className="w-full bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg text-sm border-none focus:ring-2 outline-none" placeholder="Mis: Sekarang" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Deskripsi Tugas (Pisahkan dengan baris baru)</label>
                    <textarea value={exp.description} onChange={(e) => handleArrayChange('experience', idx, 'description', e.target.value)} rows={4} className="w-full bg-white dark:bg-zinc-900 px-3 py-2 rounded-lg text-sm border-none focus:ring-2 outline-none resize-none" placeholder="- Mengatur kas keuangan organisasi&#10;- Merancang jadwal acara tahunan" />
                  </div>
                  <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors"><Trash size={14}/></button>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold">Keahlian (Skills)</label>
              <textarea name="skills" value={cvData.skills} onChange={handleChange} rows={3} className="w-full bg-muted px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" placeholder="Public Speaking, Desain Grafis, Microsoft Office..." />
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
            <CVDocument data={cvData} template={template} />
          </PDFViewer>
        </div>
      </div>
      </div>
    </div>
  )
}
