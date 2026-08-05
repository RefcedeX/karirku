'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Bot, Loader2, Sparkles, ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState, useMemo } from 'react'
import { MobileHeader } from '@/components/layout/MobileHeader'

export default function ChatClient({ initialContextData }: { initialContextData: any }) {
  const [inputValue, setInputValue] = useState('')
  
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
    "🎓 Jurusan apa yang cocok untukku?",
    "💼 Apa prospek kerja dari hasilku?",
    "💪 Saran pengembangan diri?",
    "🧠 Jelaskan tipe kepribadianku!"
  ]

  return (
    <div className="flex flex-col w-full h-[calc(100dvh)] lg:h-[calc(100vh-80px)] font-sans">
      <MobileHeader title="Konselor AI" />
      <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-3 lg:p-8 min-h-0">
        
        {/* Header Elegan */}
      <div className="mb-4 lg:mb-6 px-2 lg:px-4">
        <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          Konsultasi AI <Sparkles className="text-orange-500" size={24} />
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Tanyakan apa saja seputar masa depanmu, AI kami siap membantu 24/7.
        </p>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white flex-1 rounded-3xl lg:rounded-[2rem] overflow-hidden flex flex-col shadow-xl shadow-slate-200/50 relative">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8 scroll-smooth pb-32">
          {messages.map((m, idx) => {
            const role = m.role as string
            const isUser = role === 'user'
            
            return (
              <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                <div className={`flex gap-3 max-w-[85%] lg:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  {!isUser && (
                    <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-md">
                      <Sparkles size={18} />
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`p-5 shadow-sm ${
                    isUser 
                      ? 'bg-slate-800 text-white rounded-3xl rounded-br-sm' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-3xl rounded-tl-sm'
                  }`}>
                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                      {getMessageText(m)}
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
                 <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-md">
                   <Sparkles size={18} />
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
                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-red-100 text-red-500">
                  <Bot size={18} />
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
        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-6 bg-gradient-to-t from-white via-white/95 to-transparent pt-12">
          <div className="max-w-3xl mx-auto flex flex-col gap-2 lg:gap-3">
            
            {/* Suggestion Chips (Lovable AI style) */}
            {messages.length === 1 && (
              <div className="flex overflow-x-auto gap-2 pb-2 mb-1 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300 fill-mode-both w-full snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {suggestions.map((saran, i) => (
                  <button
                    key={i}
                    onClick={() => sendUserMessage(saran)}
                    disabled={isLoading}
                    className="whitespace-nowrap flex-shrink-0 snap-start text-xs lg:text-sm px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {saran} <ArrowUpRight size={14} className="opacity-50" />
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} className="relative flex items-end gap-2 bg-white border border-slate-200 rounded-[1.5rem] shadow-lg shadow-slate-200/50 focus-within:ring-4 focus-within:ring-orange-500/10 focus-within:border-orange-300 transition-all p-2 pr-2 pl-4">
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
                className="flex-1 max-h-32 min-h-[44px] bg-transparent py-3 text-[15px] text-slate-700 outline-none resize-none placeholder:text-slate-400"
                rows={1}
              />
              <button 
                type="submit" 
                disabled={isLoading || !inputValue.trim()}
                className="bg-slate-900 text-white w-11 h-11 rounded-[1rem] flex items-center justify-center shrink-0 disabled:opacity-30 disabled:bg-slate-200 disabled:text-slate-500 hover:bg-orange-500 hover:scale-105 transition-all shadow-sm mb-0.5"
              >
                <ArrowUpRight size={20} strokeWidth={2.5} />
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
  )
}
