'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GraduationCap, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function AuthButton({ mobile = false }: { mobile?: boolean }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className={`${mobile ? 'flex justify-center' : 'hidden md:flex'} items-center px-5 py-2.5 bg-blue-50 rounded-full animate-pulse w-24 h-10`}>
      </div>
    )
  }

  if (user) {
    const name = user.user_metadata?.full_name?.split(' ')[0] || 'Dashboard'
    
    return (
      <Link 
        href="/dashboard"
        className={`${mobile ? 'flex justify-center' : 'hidden md:flex'} items-center gap-2 text-sm font-semibold bg-blue-700 text-white hover:bg-blue-800 px-5 ${mobile ? 'py-3 rounded-xl' : 'py-2.5 rounded-full'} transition-colors shadow-md shadow-blue-700/20`}
      >
        <LayoutDashboard size={18} /> {name}
      </Link>
    )
  }

  return (
    <Link 
      href="/login"
      className={`${mobile ? 'flex justify-center' : 'hidden md:flex'} items-center gap-2 text-sm font-semibold bg-blue-100 text-blue-900 hover:bg-blue-200 px-5 ${mobile ? 'py-3 rounded-xl' : 'py-2.5 rounded-full'} transition-colors`}
    >
      <GraduationCap size={18} /> Masuk
    </Link>
  )
}
