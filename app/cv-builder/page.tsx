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

  let safeEducation = [];
  try {
    safeEducation = typeof cvData?.education === 'string' && cvData.education.startsWith('[') ? JSON.parse(cvData.education) : [];
  } catch (e) {}

  let safeExperience = [];
  try {
    safeExperience = typeof cvData?.experience === 'string' && cvData.experience.startsWith('[') ? JSON.parse(cvData.experience) : [];
  } catch (e) {}

  const defaultData = {
    name: cvData?.full_name || user?.user_metadata?.full_name || '',
    email: cvData?.email || user?.email || '',
    phone: cvData?.phone || '',
    address: cvData?.address || '',
    website: cvData?.website || '',
    summary: cvData?.summary || '',
    skills: cvData?.skills || '',
    education: safeEducation.length > 0 ? safeEducation : [{ school: '', major: '', startDate: '', endDate: '', activities: '' }],
    experience: safeExperience.length > 0 ? safeExperience : [{ company: '', role: '', startDate: '', endDate: '', description: '' }]
  }

  return <CVBuilderClient initialData={defaultData} userId={user.id} />
}
