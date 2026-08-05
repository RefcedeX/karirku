'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useSidebarStore } from '@/lib/store/sidebar-store'

export function PushBackProvider({ children }: { children: React.ReactNode }) {
  const isOpen = useSidebarStore((state) => state.isOpen)

  return (
    <motion.div
      initial={false}
      animate={{
        scale: isOpen ? 0.96 : 1,
        y: isOpen ? 16 : 0,
      }}
      transition={{ type: 'tween', ease: 'circOut', duration: 0.3 }}
      className={`bg-background text-foreground min-h-screen w-full overflow-hidden origin-top ${isOpen ? 'rounded-[24px]' : 'rounded-none'}`}
      style={{ willChange: "transform" }}
    >
      <div className={`relative h-full w-full ${isOpen ? 'overflow-hidden pointer-events-none' : 'overflow-auto'}`}>
        {children}
        {/* Hardware-accelerated overlay is much cheaper than changing opacity of the entire app */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 pointer-events-none z-50 ${isOpen ? 'opacity-40' : 'opacity-0'}`}
          style={{ willChange: "opacity" }}
        />
      </div>
    </motion.div>
  )
}
