import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: number // positive or negative percentage
  trendLabel?: string
}

export const StatsCard = ({ title, value, icon, trend, trendLabel }: StatsCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-zinc-400 font-medium text-sm">{title}</h3>
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
          {icon}
        </div>
      </div>
      
      <div className="text-3xl font-bold text-zinc-100 mb-2">
        {value}
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-md ${
            trend > 0 ? 'bg-green-500/10 text-green-400' :
            trend < 0 ? 'bg-red-500/10 text-red-400' :
            'bg-zinc-800 text-zinc-400'
          }`}>
            {trend > 0 && <TrendingUp className="h-3 w-3 mr-1" />}
            {trend < 0 && <TrendingDown className="h-3 w-3 mr-1" />}
            {trend === 0 && <Minus className="h-3 w-3 mr-1" />}
            {Math.abs(trend)}%
          </div>
          {trendLabel && <span className="text-xs text-zinc-500">{trendLabel}</span>}
        </div>
      )}
    </motion.div>
  )
}
