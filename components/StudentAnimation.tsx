'use client'

import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, Star, Sparkles } from 'lucide-react'

export default function StudentAnimation() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
      {/* Latar Belakang Lingkaran Bercahaya */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-blue-200 to-yellow-100 rounded-full blur-2xl opacity-60"
      />

      {/* Elemen Melayang: Buku */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [-10, 5, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 md:left-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20"
      >
        <BookOpen className="text-blue-500" size={32} />
      </motion.div>

      {/* Elemen Melayang: Bintang */}
      <motion.div 
        animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-24 right-10 md:right-20 bg-white p-3 rounded-full shadow-lg border border-slate-100 z-20"
      >
        <Star className="text-yellow-400 fill-yellow-400" size={24} />
      </motion.div>

      {/* Karakter Utama (Vektor Murid bertoga) */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Toga & Kepala */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex flex-col items-center"
        >
          {/* Topi Toga */}
          <div className="relative z-20 -mb-4">
            <GraduationCap size={120} className="text-slate-800 drop-shadow-2xl" strokeWidth={1.5} />
            <motion.div 
              animate={{ rotate: [0, 15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 right-4 w-2 h-12 bg-yellow-500 rounded-full origin-top"
            />
          </div>
          
          {/* Wajah */}
          <div className="w-32 h-32 bg-blue-100 rounded-full border-4 border-white shadow-inner flex items-center justify-center relative overflow-hidden">
            {/* Mata */}
            <div className="absolute top-12 left-8 w-3 h-4 bg-slate-800 rounded-full" />
            <div className="absolute top-12 right-8 w-3 h-4 bg-slate-800 rounded-full" />
            {/* Senyum */}
            <div className="absolute bottom-8 w-8 h-4 border-b-4 border-slate-800 rounded-full" />
            {/* Pipi merona */}
            <div className="absolute top-16 left-4 w-4 h-3 bg-red-200 rounded-full blur-[2px]" />
            <div className="absolute top-16 right-4 w-4 h-3 bg-red-200 rounded-full blur-[2px]" />
          </div>

          {/* Badan (Jubah) */}
          <div className="w-48 h-32 bg-slate-800 rounded-t-[3rem] mt-2 border-4 border-white shadow-2xl relative overflow-hidden flex justify-center">
            {/* Kerah */}
            <div className="w-16 h-16 bg-blue-100 rotate-45 -mt-8" />
            <div className="absolute top-8 w-1 h-24 bg-slate-700" />
          </div>
        </motion.div>
      </motion.div>

      {/* Label Pesan */}
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        className="absolute -bottom-4 md:bottom-10 bg-white px-6 py-4 rounded-3xl shadow-xl rounded-bl-none z-30"
      >
        <p className="font-bold text-sm md:text-base text-slate-700 flex items-center gap-2">
          Masa depan cerah dimulai <br/>dari pilihan yang tepat! <Sparkles className="text-yellow-500" size={18}/>
        </p>
      </motion.div>
    </div>
  )
}
