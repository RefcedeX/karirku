import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Dimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C' | 'Numeric' | 'Verbal' | 'Logic'

export interface Question {
  id: number
  text: string
  dimension: Dimension
}

export interface QuizState {
  questions: Question[]
  answers: Record<number, number> // questionId -> score (1-5)
  currentIndex: number
  isFinished: boolean
  setQuestions: (questions: Question[]) => void
  answerQuestion: (questionId: number, score: number) => void
  nextQuestion: () => void
  prevQuestion: () => void
  finishQuiz: () => void
  resetQuiz: () => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: [],
      answers: {},
      currentIndex: 0,
      isFinished: false,
      
      setQuestions: (questions) => set({ questions }),
      
      answerQuestion: (questionId, score) => set((state) => ({
        answers: { ...state.answers, [questionId]: score }
      })),
      
      nextQuestion: () => set((state) => {
        if (state.currentIndex < state.questions.length - 1) {
          return { currentIndex: state.currentIndex + 1 }
        }
        return state
      }),
      
      prevQuestion: () => set((state) => {
        if (state.currentIndex > 0) {
          return { currentIndex: state.currentIndex - 1 }
        }
        return state
      }),
      
      finishQuiz: () => set({ isFinished: true }),
      
      resetQuiz: () => set({
        answers: {},
        currentIndex: 0,
        isFinished: false
      })
    }),
    {
      name: 'karirku-quiz-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
