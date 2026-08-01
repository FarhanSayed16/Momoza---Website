import React from 'react'

interface StatusBadgeProps {
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | string
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStyles = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'preparing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'ready':
        return 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700'
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStyles()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
