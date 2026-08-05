import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CVBuilderClient from './CVBuilderClient'

export default async function CVBuilderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch existing CV Data if any
  const { data: cvData } = await supabase
    .from('cv_data')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const defaultData = cvData || {
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    summary: '',
    skills: '',
    education: '',
    experience: ''
  }

  return <CVBuilderClient initialData={defaultData} userId={user.id} />
}
