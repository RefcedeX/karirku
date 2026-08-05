'use client'

import { motion } from 'framer-motion'
import { ThumbsUp, Heart, CheckCircle2 } from 'lucide-react'

export default function SuccessAnimation() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      
      {/* Background Pulse */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-indigo-200/50 rounded-full blur-2xl"
      />

      {/* Main Thumbs Up / Success Symbol */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center border-8 border-white"
      >
        <ThumbsUp size={80} className="text-white drop-shadow-lg" strokeWidth={1.5} />
        
        {/* Sparkles around */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute -top-4 -right-4 bg-yellow-400 p-2 rounded-full shadow-lg"
        >
          <CheckCircle2 className="text-white" size={24} />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-2 -left-4 bg-red-400 p-3 rounded-full shadow-lg"
        >
          <Heart className="text-white fill-white" size={20} />
        </motion.div>
      </motion.div>

      {/* Message Bubble */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5, x: 20 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute top-4 -right-8 md:-right-16 bg-white px-6 py-4 rounded-3xl shadow-xl rounded-bl-none border border-slate-100 z-20 hidden md:block"
      >
        <p className="font-bold text-slate-700 whitespace-nowrap text-lg">Kamu pasti<br/>bisa! 💪</p>
      </motion.div>
    </div>
  )
}
