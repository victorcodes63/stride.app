'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const InteractiveStatsMatrix = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const stats = [
    {
      number: "7+",
      label: "Years of Excellence",
      description: "Delivering HR solutions since 2017",
      background: "/images/clients/meeting_team.jpeg"
    },
    {
      number: "100+",
      label: "Companies Served",
      description: "Across diverse industries",
      background: "/images/clients/meeting_2.jpeg"
    },
    {
      number: "2000+",
      label: "Successful Placements",
      description: "Right talent, right fit",
      background: "/images/clients/meeting_team.jpeg"
    },
    {
      number: "98%",
      label: "Client Satisfaction",
      description: "Proven track record",
      background: "/images/clients/meeting_2.jpeg"
    }
  ]

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Auto-rotate every 3 seconds when not hovered
  useEffect(() => {
    if (!isHovered && isMounted) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % stats.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isHovered, stats.length, isMounted])

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  const currentStat = stats[currentIndex]

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="relative">
        <div className="relative h-48 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary-800 to-primary-900">
          <div className="text-center relative z-10">
            <div className="text-6xl md:text-7xl font-bold text-white mb-4">
              {stats[0].number}
            </div>
            <div className="text-xl font-semibold text-white mb-2">
              {stats[0].label}
            </div>
            <div className="text-sm text-white/80">
              {stats[0].description}
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-3 mt-6">
          {stats.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === 0 ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Display Area */}
      <div className="relative h-48 flex items-center justify-center overflow-hidden rounded-xl">
        {/* Background Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentIndex}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${currentStat.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </AnimatePresence>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-6xl md:text-7xl font-bold text-white mb-4"
            >
              {currentStat.number}
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl font-semibold text-white mb-2"
            >
              {currentStat.label}
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-sm text-white/80"
            >
              {currentStat.description}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-3 mt-6">
        {stats.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Grid Preview */}
      <div className="grid grid-cols-2 gap-4 mt-8 opacity-60">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
              index === currentIndex
                ? 'border-white bg-white/20'
                : 'border-white/30 hover:border-white/50'
            }`}
            onClick={() => handleDotClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Background Image for Preview */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url(${stat.background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
            
            <div className="relative z-10">
              <div className="text-2xl font-bold text-white mb-1">
                {stat.number}
              </div>
              <div className="text-xs text-white/80">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-white/20 rounded-full h-1">
          <motion.div
            className="bg-white h-1 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentIndex + 1) / stats.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}

export default InteractiveStatsMatrix
