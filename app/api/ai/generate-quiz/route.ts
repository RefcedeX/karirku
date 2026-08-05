import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fixedQuestions } from '@/lib/data/quiz-questions'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Shuffle the fixed questions
    const shuffled = [...fixedQuestions].sort(() => Math.random() - 0.5)

    return NextResponse.json({ success: true, questions: shuffled })

  } catch (error: any) {
    console.error('Quiz Generation API Error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menghasilkan kuis' },
      { status: 500 }
    )
  }
}
