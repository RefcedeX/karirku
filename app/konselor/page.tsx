import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ChatClient from './ChatClient'

export default async function KonselorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch the latest recommendation result for this user
  const { data: latestResult } = await supabase
    .from('recommendation_results')
    .select('ai_recommendation, riasec_scores')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  let contextData = null

  if (latestResult) {
    contextData = {
      scores: latestResult.riasec_scores,
      summary: latestResult.ai_recommendation.summary,
      recommended_majors: latestResult.ai_recommendation.recommended_majors.map((m: any) => m.name),
      recommended_careers: latestResult.ai_recommendation.recommended_careers.map((c: any) => c.title),
    }
  }

  return <ChatClient initialContextData={contextData} />
}
