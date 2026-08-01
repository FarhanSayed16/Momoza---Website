import React from 'react'
import { FolderSearch } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30">
      <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 mb-6">
        {icon || <FolderSearch className="h-8 w-8" />}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {description && <p className="text-zinc-400 max-w-sm mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
