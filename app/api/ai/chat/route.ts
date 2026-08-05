import { streamText } from 'ai'
import { groq } from '@ai-sdk/groq'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { messages, contextData } = await req.json()

  // Konversi UIMessage (parts) ke CoreMessage (content) untuk streamText
  const coreMessages = messages.map((m: any) => {
    let content = m.content
    if (!content && m.parts) {
      content = m.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('')
    }
    return { role: m.role, content: content || '' }
  })

  const systemPrompt = `Kamu adalah 'Kak Karir', konselor karier AI yang ramah, suportif, dan gaul untuk siswa SMAN 1 BAROS. 
Gunakan bahasa Indonesia yang santai tapi sopan (aku-kamu).
Tugasmu adalah membantu siswa memahami hasil tes minat bakat mereka dan menjawab pertanyaan seputar jurusan atau profesi.
Jangan pernah menjawab pertanyaan di luar konteks karier, sekolah, atau pendidikan.

Konteks Hasil Tes Siswa Saat Ini:
${contextData ? JSON.stringify(contextData) : "Siswa belum pernah mengikuti tes minat bakat KarirKu. Arahkan siswa untuk mengikuti tes terlebih dahulu."}
`

  const result = await streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: systemPrompt,
    messages: coreMessages,
  })

  return result.toUIMessageStreamResponse()
}
