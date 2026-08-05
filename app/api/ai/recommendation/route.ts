import { generateText } from 'ai'
import { groq } from '@ai-sdk/groq'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { scores, rawAnswers, duration } = await req.json()

    // Create Quiz Attempt First
    const { data: attempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert({
        student_id: user.id,
        semester: getSemester(),
      })
      .select()
      .single()

    if (attemptError || !attempt) {
      console.error('Supabase Insert Error:', attemptError)
      throw new Error('Failed to create quiz attempt')
    }

    // Save individual answers
    if (rawAnswers && typeof rawAnswers === 'object') {
      const answerInserts = Object.entries(rawAnswers).map(([qId, score]) => ({
        attempt_id: attempt.id,
        question_id: parseInt(qId),
        score: score
      }))
      
      if (answerInserts.length > 0) {
        const { error: answersError } = await supabase.from('quiz_answers').insert(answerInserts)
        if (answersError) console.error('Failed to save answers:', answersError)
      }
    }

    let aiResultData;
    let isFallback = false;

    if (!process.env.GROQ_API_KEY) {
      console.warn('Missing GROQ_API_KEY, using fallback')
      aiResultData = getFallbackResult(scores)
      isFallback = true
    } else {
      try {
        const { text } = await generateText({
          model: groq('llama-3.3-70b-versatile'),
          prompt: `
            Kamu adalah Konselor Karier & Psikolog Pendidikan Senior yang sangat ahli dalam asesmen RIASEC (Holland Codes).

            Skor asesmen RIASEC siswa adalah:
            Realistic (R): ${scores.R || 0}
            Investigative (I): ${scores.I || 0}
            Artistic (A): ${scores.A || 0}
            Social (S): ${scores.S || 0}
            Enterprising (E): ${scores.E || 0}
            Conventional (C): ${scores.C || 0}

            TUGAS UTAMA:
            1. Analisis dominasi minat berdasarkan skor tertinggi (top 2 atau top 3 huruf).
            2. Tentukan Holland Code 3-huruf (misal: "RIA", "SEC") yang paling mewakili profil tersebut.
            3. Berikan rekomendasi jurusan kuliah yang spesifik dan relevan di Indonesia (maksimal 5).
            4. Berikan rekomendasi prospek karier yang menjanjikan di masa depan (maksimal 5).
            5. Berikan rekomendasi mata pelajaran pilihan lintas minat di SMA (Kurikulum Merdeka).
            6. Berikan Tips Pengembangan Diri yang sangat taktis mengatasi 'titik buta' kepribadiannya.
            7. Hitung tingkat kecocokan (0-100) siswa ini dengan 6 Bidang Industri besar berdasarkan pemetaan RIASEC.

            KEMBALIKAN OUTPUT HARUS DALAM FORMAT JSON BERIKUT (TANPA MARKDOWN, HANYA JSON MURNI):
            {
              "summary": "Ringkasan analisis profil kepribadian vokasional...",
              "holland_code": "RIA",
              "holland_code_description": "Praktis, analitis, dan artistik. Menyukai bekerja dengan benda, ide, dan kreativitas.",
              "recommended_majors": [{ "name": "...", "match_score": 90, "reason": "..." }],
              "recommended_careers": [{ "title": "...", "match_score": 90, "reason": "..." }],
              "recommended_subjects": ["...", "..."],
              "development_tips": ["...", "..."],
              "industry_scores": { "teknologi": 80, "bisnis": 70, "kesehatan": 60, "seni": 50, "pendidikan": 40, "sosial": 30 }
            }
          `,
        })
        
        let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim()
        
        // Coba perbaiki trailing commas yang sering jadi masalah di output Llama
        cleanedText = cleanedText.replace(/,\s*([\]}])/g, '$1')
        
        try {
          aiResultData = JSON.parse(cleanedText)
        } catch (parseError) {
          console.error("JSON Parsing Error! Raw Text:", text)
          throw new Error("Failed to parse JSON")
        }
        
      } catch (aiErr) {
        console.error('OpenAI Gen Error', aiErr)
        aiResultData = getFallbackResult(scores)
        isFallback = true
      }
    }

    // Append test duration
    aiResultData = {
      ...aiResultData,
      test_duration: duration || 0
    }

    // Insert to Recommendation Results
    const { data: result, error: resultError } = await supabase
      .from('recommendation_results')
      .insert({
        attempt_id: attempt.id,
        student_id: user.id,
        riasec_scores: scores,
        ai_recommendation: aiResultData,
        raw_ai_response: isFallback ? 'Fallback triggered' : 'Success',
      })
      .select()
      .single()

    if (resultError || !result) {
      throw new Error('Failed to save recommendation result')
    }

    return NextResponse.json({ success: true, result_id: result.id, data: aiResultData })

  } catch (error: any) {
    console.error('AI Recommendation Route Error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

function getFallbackResult(scores: Record<string, number>) {
  // Sort dimensions by score descending and take top 3
  const sortedDims = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([dim]) => dim)
  
  const highestDimension = sortedDims[0]
  const hollandCode = sortedDims.slice(0, 3).join('')
  
  let fallbackMajor = 'Teknik Informatika'
  let fallbackCareer = 'Software Engineer'
  let fallbackDesc = 'Praktis, logis, dan pemecah masalah.'

  if (highestDimension === 'R') { 
    fallbackMajor = 'Teknik Mesin'; fallbackCareer = 'Insinyur Mesin'; 
    fallbackDesc = 'Menyukai pekerjaan fisik, alat, dan mesin. Cenderung praktis.'
  }
  if (highestDimension === 'A') { 
    fallbackMajor = 'Desain Komunikasi Visual'; fallbackCareer = 'Desainer Grafis';
    fallbackDesc = 'Kreatif, inovatif, dan sangat menghargai kebebasan berekspresi.'
  }
  if (highestDimension === 'S') { 
    fallbackMajor = 'Psikologi'; fallbackCareer = 'Konselor';
    fallbackDesc = 'Suka menolong, membimbing, dan berinteraksi sosial dengan orang lain.'
  }
  if (highestDimension === 'E') { 
    fallbackMajor = 'Manajemen Bisnis'; fallbackCareer = 'Pengusaha';
    fallbackDesc = 'Berjiwa pemimpin, persuasif, dan menyukai tantangan bisnis.'
  }
  if (highestDimension === 'C') { 
    fallbackMajor = 'Akuntansi'; fallbackCareer = 'Akuntan';
    fallbackDesc = 'Sangat terorganisir, detail, dan suka berurusan dengan data terstruktur.'
  }
  if (highestDimension === 'I') { 
    fallbackMajor = 'Matematika Murni'; fallbackCareer = 'Data Scientist';
    fallbackDesc = 'Analitis, intelektual, dan suka memecahkan masalah kompleks.'
  }

  return {
    summary: "Ini adalah hasil rekomendasi darurat. Berdasarkan tesmu, minat tertinggimu mengarah pada bidang ini.",
    recommended_majors: [{ name: fallbackMajor, match_score: 85, reason: "Sesuai dengan skor minat terbesarmu." }],
    recommended_careers: [{ title: fallbackCareer, match_score: 85, reason: "Bidang ini sangat cocok dengan profilmu." }],
    recommended_subjects: ["Matematika", "Sosiologi", "Ekonomi"],
    holland_code: hollandCode,
    holland_code_description: fallbackDesc,
    development_tips: ["Pelajari skill baru", "Ikuti kursus online", "Bangun portofolio", "Tingkatkan komunikasi"],
    industry_scores: {
      teknologi: highestDimension === 'I' || highestDimension === 'R' ? 85 : 40,
      bisnis: highestDimension === 'E' || highestDimension === 'C' ? 85 : 40,
      kesehatan: highestDimension === 'I' || highestDimension === 'S' ? 70 : 30,
      seni: highestDimension === 'A' ? 90 : 30,
      pendidikan: highestDimension === 'S' || highestDimension === 'I' ? 80 : 30,
      sosial: highestDimension === 'S' || highestDimension === 'E' ? 85 : 40
    }
  }
}

function getSemester(): string {
  const now = new Date()
  const month = now.getMonth() + 1 // 1-12
  const year = now.getFullYear()
  // Ganjil: Jul-Des, Genap: Jan-Jun
  if (month >= 7) {
    return `Ganjil ${year}/${year + 1}`
  }
  return `Genap ${year - 1}/${year}`
}
