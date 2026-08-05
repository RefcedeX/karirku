'use client'

import { useEffect, useState } from 'react'
import { useQuizStore } from '@/lib/store/quiz-store'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function QuizFlow() {
  const router = useRouter()
  const { 
    questions, answers, currentIndex, isFinished, 
    setQuestions, answerQuestion, nextQuestion, prevQuestion, finishQuiz, resetQuiz 
  } = useQuizStore()
  
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch('/api/ai/generate-quiz')
        const data = await res.json()
        if (data.success && data.questions) {
          setQuestions(data.questions)
        } else {
          setErrorMsg(data.error || 'Gagal memuat kuis.')
        }
      } catch (err) {
        setErrorMsg('Terjadi kesalahan koneksi.')
      } finally {
        setIsLoading(false)
        setMounted(true)
      }
    }
    
    if (questions.length === 0) {
      fetchQuestions()
    } else {
      setIsLoading(false)
      setMounted(true)
    }
  }, [questions.length, setQuestions])

  useEffect(() => {
    async function submitResults() {
      if (!isFinished || isSubmitting) return
      setIsSubmitting(true)
      try {
        const scores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
        Object.entries(answers).forEach(([qIdStr, score]) => {
          const q = questions.find(x => x.id === parseInt(qIdStr))
          if (q && q.dimension in scores) {
            scores[q.dimension] += score
          }
        })

        // Normalisasi skor mentah (range 7-35) ke persentase (0-100)
        // Min possible = 7 (semua jawab 1), Max possible = 35 (semua jawab 5)
        const normalizedScores: Record<string, number> = {}
        Object.entries(scores).forEach(([dim, rawScore]) => {
          normalizedScores[dim] = Math.round(((rawScore - 7) / (35 - 7)) * 100)
        })
        
        const res = await fetch('/api/ai/recommendation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scores: normalizedScores, rawAnswers: answers })
        })
        
        const data = await res.json()
        if (data.success && data.result_id) {
          resetQuiz()
          router.push(`/dashboard`)
        } else {
          setErrorMsg(data.error || 'Terjadi kesalahan')
        }
      } catch (err) {
        setErrorMsg('Gagal memproses hasil.')
      }
    }
    submitResults()
  }, [isFinished, router])

  if (!mounted || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-6" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">AI Sedang Meracik Soal...</h3>
        <p className="text-slate-500 text-sm text-center max-w-sm">
          Menyiapkan 42 pertanyaan minat bakat yang paling relevan khusus untukmu.
        </p>
      </div>
    )
  }

  if (errorMsg && questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500 font-medium">{errorMsg}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg">Coba Lagi</button>
      </div>
    )
  }

  if (isFinished) {
    return (
      <div className="text-center py-20 animate-in fade-in zoom-in duration-500 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={48} className="animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-4">Kuis Selesai!</h2>
        {errorMsg ? (
          <p className="text-red-500 mb-8">{errorMsg}</p>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-slate-500 mb-6 max-w-md">Menyimpan jawaban dan menganalisis profil psikologismu menggunakan AI... Mohon tunggu.</p>
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        )}
      </div>
    )
  }

  const currentQ = questions[currentIndex]
  const progress = ((currentIndex) / questions.length) * 100

  const handleSelect = (score: number) => {
    answerQuestion(currentQ.id, score)
    setTimeout(() => {
      if (currentIndex === questions.length - 1) {
        if (window.confirm("Apakah kamu yakin ingin mengakhiri kuis dan melihat hasilnya?")) {
          finishQuiz()
        }
      } else {
        nextQuestion()
      }
    }, 200)
  }

  return (
    <div className="w-full flex flex-col max-w-2xl mx-auto pb-12">
      {/* Header & Progress */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={prevQuestion} 
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
          />
        </div>
        <span className="text-sm font-bold text-slate-500 w-12 text-right">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Main Content Area (No fixed heights, natural flow) */}
      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col"
          >
            {/* Pertanyaan */}
            <div className="mb-10 text-center">
              <span className="inline-block text-indigo-500 font-bold mb-4 tracking-widest text-sm uppercase bg-indigo-50 px-4 py-1.5 rounded-full">
                Pernyataan
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                "{currentQ.text}"
              </h3>
            </div>

            {/* Pilihan Jawaban 5 Opsi */}
            <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
              {[
                { score: 5, label: 'Sangat Suka' },
                { score: 4, label: 'Suka' },
                { score: 3, label: 'Biasa Saja' },
                { score: 2, label: 'Kurang Suka' },
                { score: 1, label: 'Tidak Suka' },
              ].map((option) => (
                <button
                  key={option.score}
                  onClick={() => handleSelect(option.score)}
                  className={`p-4 text-left rounded-2xl border-2 transition-all ${
                    answers[currentQ.id] === option.score 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 scale-[0.98]' 
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-600 hover:text-slate-800 hover:-translate-y-0.5'
                  }`}
                >
                  <span className="font-semibold text-lg">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
