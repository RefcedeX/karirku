'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

interface DownloadPdfButtonProps {
  targetId: string;
  filename?: string;
}

export function DownloadPdfButton({ targetId, filename = "Hasil-Tes-KarirKu.pdf" }: DownloadPdfButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = () => {
    setLoading(true)
    
    // Memberikan waktu render kecil sebelum dialog print terbuka
    setTimeout(() => {
      window.print()
      setLoading(false)
    }, 500)
  }

  return (
    <button 
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
      <span>{loading ? 'Memproses PDF...' : 'Unduh Hasil (PDF)'}</span>
    </button>
  )
}
