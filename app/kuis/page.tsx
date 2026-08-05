import { QuizFlow } from '@/components/quiz/QuizFlow'
import { MobileHeader } from '@/components/layout/MobileHeader'

export default function KuisPage() {
  return (
    <>
      <MobileHeader title="Kuis Minat Bakat" />
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-6 pt-12 md:pt-24">
        <QuizFlow />
      </div>
    </>
  )
}
