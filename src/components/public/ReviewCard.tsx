'use client'

import React from 'react'
import { Star } from 'lucide-react'
import { Review } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { formatDistanceToNow } from 'date-fns'

interface ReviewCardProps {
  review: Review
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-border transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex text-brand-secondary">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-zinc-700'}`} 
            />
          ))}
        </div>
        {review.is_featured && (
          <Badge variant="warning" className="text-[10px] py-0.5 px-2">Featured</Badge>
        )}
      </div>
      
      <p className="text-foreground/80 leading-relaxed italic mb-6 flex-1">
        "{review.review_text}"
      </p>
      
      <div className="flex items-center gap-4 mt-auto border-t border-border pt-4">
        <div className="h-10 w-10 shrink-0 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-lg border border-brand-primary/20">
          {review.customer_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="font-bold text-sm text-foreground">{review.customer_name}</h4>
          <p className="text-xs text-foreground/50">
            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  )
}
