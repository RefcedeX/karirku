'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertCV(userId: string, cvData: any) {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== userId) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('cv_data')
    .upsert({
      user_id: user.id,
      full_name: cvData.name,
      email: cvData.email,
      phone: cvData.phone,
      address: cvData.address,
      website: cvData.website,
      summary: cvData.summary,
      skills: cvData.skills,
      education: JSON.stringify(cvData.education),
      experience: JSON.stringify(cvData.experience)
    }, { onConflict: 'user_id' })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/cv-builder')
  revalidatePath('/admin/dashboard')
  return { success: true }
}
