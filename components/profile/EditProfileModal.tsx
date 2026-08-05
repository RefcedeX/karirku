'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Edit3, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface EditProfileModalProps {
  userId: string
  initialName: string
  initialEmail: string
  initialDob: string
  onSave: (name: string, email: string, dob: string) => void
}

export function EditProfileModal({ userId, initialName, initialEmail, initialDob, onSave }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [dob, setDob] = useState(initialDob)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccessMsg('')

    const supabase = createClient()

    try {
      // 1. Update Profile (Name)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', userId)

      if (profileError) throw profileError

      // 2. Update User Metadata (DOB) and Email
      const updates: any = {
        data: { tanggal_lahir: dob }
      }
      if (email !== initialEmail) {
        updates.email = email
      }

      const { error: authError } = await supabase.auth.updateUser(updates)

      if (authError) throw authError

      setSuccessMsg('Profil berhasil diperbarui!')
      onSave(name, email, dob)

      setTimeout(() => {
        setIsOpen(false)
        setSuccessMsg('')
      }, 1500)

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#0f4a8a] hover:bg-blue-50 rounded-full transition-colors"
        title="Edit Profil"
      >
        <Edit3 size={18} />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998]"
                onClick={() => !isLoading && setIsOpen(false)}
              />
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto pointer-events-auto"
                >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Edit Profil</h3>
                  <button 
                    onClick={() => !isLoading && setIsOpen(false)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl">
                    {error}
                  </div>
                )}
                {successMsg && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl">
                    {successMsg}
                    {email !== initialEmail && " (Cek inbox untuk verifikasi email baru)"}
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0f4a8a] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0f4a8a] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                    <input 
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0f4a8a] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-[#0f4a8a] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </form>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
