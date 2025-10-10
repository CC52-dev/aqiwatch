"use client"

import { useEffect, useState } from 'react'
import ElectricBorder from './ElectricBorder'

interface ConditionalElectricBorderProps {
  children: React.ReactNode
  className?: string
  color?: string
  speed?: number
  chaos?: number
  thickness?: number
  style?: React.CSSProperties
}

const ConditionalElectricBorder = ({ 
  children, 
  className = '',
  color = '#7df9ff',
  speed = 1,
  chaos = 0.5,
  thickness = 1,
  style 
}: ConditionalElectricBorderProps) => {
  const [isDesktop, setIsDesktop] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Prevent hydration mismatch by showing simple border until mounted
  if (!mounted) {
    return (
      <div 
        className={`border-2 rounded-2xl ${className}`}
        style={{ borderColor: color, ...style }}
      >
        {children}
      </div>
    )
  }

  // On mobile, use a simple blue border
  if (!isDesktop) {
    return (
      <div 
        className={`border-2 rounded-2xl ${className}`}
        style={{ borderColor: color, ...style }}
      >
        {children}
      </div>
    )
  }

  // On desktop, use the full ElectricBorder effect
  return (
    <ElectricBorder
      className={className}
      color={color}
      speed={speed}
      chaos={chaos}
      thickness={thickness}
      style={style}
    >
      {children}
    </ElectricBorder>
  )
}

export default ConditionalElectricBorder

