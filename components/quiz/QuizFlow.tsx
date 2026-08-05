'use client'

import { useEffect, useState } from 'react'
import { useQuizStore } from '@/lib/store/quiz-store'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Check, Loader2, Clock } from 'lucide-react'
import dynamic from 'next/dynamic'

const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then(mod => mod.Player), { ssr: false })
import { useRouter } from 'next/navigation'

export function QuizFlow() {
  const router = useRouter()
  const { 
    questions, answers, currentIndex, isFinished, isStarted, startTime,
    setQuestions, answerQuestion, nextQuestion, prevQuestion, finishQuiz, resetQuiz, startQuiz 
  } = useQuizStore()
  
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [timer, setTimer] = useState(0) // seconds elapsed
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStarted && !isFinished && startTime) {
      interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isStarted, isFinished, startTime])

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
        
        // Calculate total duration in seconds
        const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0

        const res = await fetch('/api/ai/recommendation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scores: normalizedScores, rawAnswers: answers, duration })
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
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

  if (!isStarted) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center mt-[-2rem] md:mt-0"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mb-2 flex items-center justify-center shrink-0">
          <Player
            autoplay
            loop
            src="/happy_student.json"
            style={{ height: '100%', width: '100%' }}
            background="transparent"
          />
        </div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight"
        >
          Siap Memulai Kuis?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-slate-600 mb-8 leading-relaxed text-base md:text-lg px-2"
        >
          Kuis ini berisi <strong>42 pernyataan</strong>. Tidak ada jawaban yang benar atau salah. 
          Pilihlah jawaban yang paling jujur dan sesuai dengan kata hatimu.
        </motion.p>
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          onClick={startQuiz}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:shadow-blue-700/30 text-white font-bold text-lg py-4 px-8 rounded-full hover:-translate-y-1 transition-all"
        >
          Lanjutkan & Mulai Kuis
        </motion.button>
      </motion.div>
    )
  }

  if (isFinished) {
    return (
      <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col items-center justify-center min-h-[60vh]">
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
        setShowConfirm(true)
      } else {
        nextQuestion()
      }
    }, 50)
  }

  return (
    <div className="w-full flex flex-col max-w-2xl mx-auto pb-12">
      {/* Header & Progress */}
      <div className="flex items-center gap-4 mb-6">
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

      {/* Timer */}
      <div className="flex items-center justify-center gap-2 mb-10 bg-slate-100 text-slate-600 py-1.5 px-4 rounded-full w-fit mx-auto font-medium text-sm border border-slate-200 shadow-inner">
        <Clock size={16} />
        <span>{Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}</span>
      </div>

      {/* Main Content Area (No fixed heights, natural flow) */}
      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          {showConfirm ? (
            <motion.div
              key="confirm"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center text-center pt-8"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
                <Check size={40} />
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Semua Soal Terjawab!</h3>
              <p className="text-slate-500 mb-10 text-lg">
                Apakah kamu sudah yakin dengan semua pilihan jawabanmu?
              </p>
              <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                <button 
                  onClick={() => {
                    setShowConfirm(false)
                    finishQuiz()
                  }}
                  className="w-full py-4 px-8 rounded-full font-bold text-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 hover:scale-105"
                >
                  Analisis Profil Sekarang
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-4 px-8 rounded-full font-bold text-lg text-slate-500 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:text-slate-700 transition-all"
                >
                  Cek Kembali Jawaban
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentQ.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
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
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
