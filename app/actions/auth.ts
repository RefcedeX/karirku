'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const inviteCode = formData.get('invite_code') as string
  const validCode = process.env.SCHOOL_INVITE_CODE || 'BAROS-2026'
  
  if (inviteCode !== validCode) {
    return { error: 'Kode undangan sekolah tidak valid! Silakan minta kode yang benar ke Guru BK.' }
  }

  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
        role: 'siswa',
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  // Supabase by default requires email confirmation, unless disabled in settings.
  // We'll redirect to a success page or login.
  redirect('/login?message=Cek email kamu untuk konfirmasi, atau langsung login jika konfirmasi email dimatikan di Supabase.')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/')
}
