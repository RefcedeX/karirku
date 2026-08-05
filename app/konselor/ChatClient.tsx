'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Bot, Loader2, Sparkles, ArrowUpRight, GraduationCap, Briefcase, TrendingUp, Brain, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState, useMemo } from 'react'
import { MobileHeader } from '@/components/layout/MobileHeader'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then(mod => mod.Player), { ssr: false })

const TypewriterText = ({ text, streaming }: { text: string, streaming: boolean }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // If text was reset or changed drastically, reset
    if (text.length < displayedText.length) {
      setDisplayedText('')
      setCurrentIndex(0)
    }
  }, [text, displayedText])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        // Output 4 characters per tick to make it fast but smooth
        const nextIndex = Math.min(currentIndex + 4, text.length)
        setDisplayedText(prev => prev + text.slice(currentIndex, nextIndex))
        setCurrentIndex(nextIndex)
      }, 5) // Minimal timeout
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])

  return (
    <>
      {displayedText}
      {(streaming || currentIndex < text.length) && (
        <span className="inline-block w-1.5 h-[14px] bg-orange-400 ml-1 mb-[2px] animate-pulse align-middle rounded-sm" />
      )}
    </>
  )
}

export default function ChatClient({ initialContextData }: { initialContextData: any }) {
  const [inputValue, setInputValue] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  
  const transport = useMemo(() => new DefaultChatTransport({
    api: '/api/ai/chat',
    body: { contextData: initialContextData },
  }), [initialContextData])

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { messages, sendMessage, status, error } = useChat({
    transport,
    messages: [
      {
        id: '1',
        role: 'assistant',
        parts: [{ type: 'text', text: `Halo! Aku Kak Karir, asisten AI pribadimu. ✨\n\n${initialContextData ? 'Aku sudah menganalisis hasil tes minat bakatmu secara mendalam.' : 'Sepertinya kamu belum menyelesaikan kuis.'} Ada yang ingin kamu diskusikan tentang pilihan jurusan, karier, atau kebingunganmu saat ini?` }],
      }
    ],
    onError: (err) => {
      setErrorMsg('Maaf, sistem AI sedang sibuk atau kuota habis. Coba lagi beberapa saat ya! 🙏')
    }
  })

  const isLoading = status === 'streaming' || status === 'submitted'
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hindari 'smooth' saat streaming karena akan menyebabkan antrean animasi dan layar loncat/glitch di HP
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages])

  function getMessageText(m: any): string {
    if (m.content) return m.content
    if (m.parts) {
      return m.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('')
    }
    return ''
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendUserMessage(inputValue)
  }

  function sendUserMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    setErrorMsg(null)
    sendMessage({ text: trimmed })
    setInputValue('')
  }

  const suggestions = [
    { text: "Jurusan apa yang cocok untukku?", icon: <GraduationCap size={16} className="text-blue-500" /> },
    { text: "Apa prospek kerja dari hasilku?", icon: <Briefcase size={16} className="text-orange-500" /> },
    { text: "Saran pengembangan diri?", icon: <TrendingUp size={16} className="text-green-500" /> },
    { text: "Jelaskan tipe kepribadianku!", icon: <Brain size={16} className="text-purple-500" /> }
  ]

  return (
    <div className="flex flex-col w-full h-[100dvh] font-sans bg-white/40 lg:bg-transparent">
      <MobileHeader title="Konselor AI" />
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-6xl mx-auto p-0 lg:p-6 min-h-0 lg:gap-6">
        
        {/* Left Side: Introduction Sidebar (Desktop only) */}
        <div className="hidden lg:flex w-[320px] shrink-0 flex-col justify-center relative h-full pr-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
            className="relative shrink-0 z-10 self-center mb-2 mt-[-2rem]"
          >
            <Player
              autoplay
              loop
              src="/chatbot.json"
              className="w-56 h-56 drop-shadow-2xl"
            />
          </motion.div>

          <div className="flex flex-col z-10 w-full">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl font-extrabold text-slate-800 flex items-center justify-center gap-2 mb-6 tracking-tight"
            >
              KarirKu Bot <Sparkles className="text-yellow-500" size={24} />
            </motion.h1>

            <div className="flex flex-col gap-3 w-full">
              {/* FAQ 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="bg-white/60 border border-slate-200/60 rounded-[1.25rem] overflow-hidden shadow-sm transition-all hover:shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                  className="w-full text-left p-4 flex justify-between items-center bg-transparent hover:bg-white/40 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-700 pr-4">Apa itu KarirKu Bot?</span>
                  <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === 1 ? 'rotate-180 text-blue-500' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === 1 ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="p-4 pt-0 text-xs text-slate-600 leading-relaxed font-medium">
                    KarirKu Bot adalah asisten virtual cerdas yang siap memandumu menelusuri minat, bakat, dan peluang karier secara interaktif.
                  </p>
                </div>
              </motion.div>

              {/* FAQ 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="bg-white/60 border border-slate-200/60 rounded-[1.25rem] overflow-hidden shadow-sm transition-all hover:shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                  className="w-full text-left p-4 flex justify-between items-center bg-transparent hover:bg-white/40 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-700 pr-4">Bagaimana bot ini membantu?</span>
                  <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === 2 ? 'rotate-180 text-blue-500' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === 2 ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="p-4 pt-0 text-xs text-slate-600 leading-relaxed font-medium">
                    Bot akan menganalisis hasil tes RIASEC-mu dan memberikan rekomendasi jurusan, profesi, serta tips pengembangan diri yang paling sesuai.
                  </p>
                </div>
              </motion.div>

              {/* FAQ 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="bg-white/60 border border-slate-200/60 rounded-[1.25rem] overflow-hidden shadow-sm transition-all hover:shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                  className="w-full text-left p-4 flex justify-between items-center bg-transparent hover:bg-white/40 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-700 pr-4">Apakah dataku aman?</span>
                  <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === 3 ? 'rotate-180 text-blue-500' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === 3 ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="p-4 pt-0 text-xs text-slate-600 leading-relaxed font-medium">
                    Tentu saja! Semua percakapan dan hasil tesmu dijaga kerahasiaannya dan hanya digunakan untuk membantumu menemukan masa depan impian.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Side: Chat Window Container */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Chat Header Info (Outside Chatbox) */}
          <div className="flex flex-col gap-1.5 pb-4 px-2 lg:px-4 hidden lg:flex">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-extrabold text-[#172136] tracking-tight">Konsultasi AI</h2>
              <Sparkles className="text-orange-500 w-7 h-7" strokeWidth={2.5} />
            </div>
            <p className="text-[15px] text-slate-500 font-medium">Tanyakan apa saja seputar masa depanmu, AI kami siap membantu 24/7.</p>
          </div>

          <div className="bg-white lg:bg-white/60 lg:backdrop-blur-xl border-t border-slate-100 lg:border-white flex-1 rounded-none lg:rounded-[2rem] overflow-hidden flex flex-col lg:shadow-xl lg:shadow-slate-200/50 relative">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8 pb-8">
          {messages.map((m, idx) => {
            const role = m.role as string
            const isUser = role === 'user'
            
            return (
              <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                <div className={`flex gap-3 max-w-[85%] lg:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  {!isUser && (
                    <div className="relative shrink-0 w-12 h-12">
                      <div className="w-full h-full rounded-full flex items-center justify-center bg-orange-50 shadow-md overflow-hidden border border-orange-100">
                        <Image src="/karirkubot.webp" alt="Bot" width={48} height={48} className="object-cover w-full h-full scale-110" />
                      </div>
                      <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm z-10"></span>
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`p-5 shadow-sm ${
                    isUser 
                      ? 'bg-slate-800 text-white rounded-3xl rounded-br-sm' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-3xl rounded-tl-sm'
                  }`}>
                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                      {isUser ? (
                        getMessageText(m)
                      ) : (
                        <TypewriterText 
                          text={getMessageText(m)} 
                          streaming={isLoading && idx === messages.length - 1} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Loading Indicator */}
          {isLoading && (
             <div className="flex justify-start animate-in fade-in duration-300">
               <div className="flex gap-3 max-w-[85%] flex-row">
                 <div className="relative shrink-0 w-12 h-12">
                   <div className="w-full h-full rounded-full flex items-center justify-center bg-orange-50 shadow-md overflow-hidden border border-orange-100">
                     <Image src="/karirkubot.webp" alt="Bot" width={48} height={48} className="object-cover w-full h-full scale-110" />
                   </div>
                   <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm z-10"></span>
                 </div>
                 <div className="p-5 rounded-3xl bg-white border border-slate-100 text-slate-700 rounded-tl-sm flex items-center gap-3 shadow-sm">
                   <div className="flex gap-1.5">
                     <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                     <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                     <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                   </div>
                 </div>
               </div>
             </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="flex justify-start animate-in fade-in">
              <div className="flex gap-3 max-w-[85%] flex-row">
                <div className="relative shrink-0 w-12 h-12">
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-red-50 text-red-500 overflow-hidden border border-red-100">
                    <Image src="/karirkubot.webp" alt="Bot" width={48} height={48} className="object-cover w-full h-full grayscale opacity-75 scale-110" />
                  </div>
                </div>
                <div className="p-5 rounded-3xl bg-red-50 text-red-600 rounded-tl-sm border border-red-100">
                  <p className="text-[15px] leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} className="h-4" />
        </div>

        {/* Bottom Input Area */}
        <div className="shrink-0 relative p-3 lg:p-6 pt-2 z-20">
          <div className="max-w-3xl mx-auto flex flex-col gap-2 lg:gap-3">
            
            {/* Suggestion Chips (Lovable AI style) */}
            {messages.length === 1 && (
              <div className="flex overflow-x-auto gap-2 pb-2 mb-1 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300 fill-mode-both w-full snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {suggestions.map((saran, i) => (
                  <button
                    key={i}
                    onClick={() => sendUserMessage(saran.text)}
                    disabled={isLoading}
                    className="whitespace-nowrap flex-shrink-0 snap-start text-xs lg:text-sm px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {saran.icon} <span className="font-medium">{saran.text}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} className="relative flex items-end gap-2 bg-white border border-slate-200 rounded-[1.75rem] shadow-lg shadow-slate-200/50 focus-within:ring-4 focus-within:ring-orange-500/10 focus-within:border-orange-300 transition-all p-2.5 pr-2.5 pl-5">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendUserMessage(inputValue);
                  }
                }}
                placeholder="Tanya soal jurusan, prospek kerja, atau minatmu..."
                className="flex-1 max-h-32 min-h-[52px] bg-transparent py-3.5 text-[15px] text-slate-700 outline-none resize-none placeholder:text-slate-400"
                rows={1}
              />
              <button 
                type="submit" 
                disabled={isLoading || !inputValue.trim()}
                className="bg-slate-900 text-white w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 disabled:opacity-30 disabled:bg-slate-200 disabled:text-slate-500 hover:bg-orange-500 hover:scale-105 transition-all shadow-sm"
              >
                <ArrowUpRight size={22} strokeWidth={2.5} />
              </button>
            </form>
            <div className="text-center text-[11px] font-medium text-slate-400">
              AI dapat membuat kesalahan. Harap pertimbangkan saran dengan bijak.
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  )
}
