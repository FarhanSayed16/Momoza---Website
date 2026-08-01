import React from 'react'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import { Section } from '@/components/public/Section'
import { ReviewCard } from '@/components/public/ReviewCard'
import { ReviewForm } from '@/components/public/ReviewForm'
import { Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Customer Reviews',
  description: 'See what our customers are saying about Momoza. Read authentic reviews and leave your own feedback.',
}

export default async function ReviewsPage() {
  const supabase = await createClient()

  // Fetch Reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  // Calculate Average Rating
  const totalReviews = reviews?.length || 0
  const averageRating = totalReviews > 0 
    ? (reviews!.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : 0

  return (
    <>
      <Section className="bg-brand-bg dark:bg-zinc-900 pt-24 md:pt-32 pb-12 border-b border-border">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl font-sans mb-6">
            Customer Reviews
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 bg-white dark:bg-zinc-900 inline-flex px-8 py-4 rounded-full shadow-sm border border-border">
            <div className="text-4xl font-bold text-foreground">{averageRating}</div>
            <div className="flex flex-col items-start">
              <div className="flex text-brand-secondary">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.round(Number(averageRating)) ? 'fill-current' : 'text-gray-300 dark:text-zinc-700'}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground/60 mt-1">
                Based on {totalReviews} reviews
              </span>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-12 bg-white dark:bg-zinc-950">
        {totalReviews === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">No reviews yet</h3>
            <p className="text-foreground/60">Be the first to share your Momoza experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {reviews!.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* Review Form Section */}
        <div className="max-w-3xl mx-auto mt-20 pt-16 border-t border-border">
          <ReviewForm />
        </div>
      </Section>
    </>
  )
}
