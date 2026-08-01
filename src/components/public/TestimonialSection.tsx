'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Section } from '@/components/public/Section'
import { Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Review } from '@/types'

interface TestimonialSectionProps {
  reviews: Review[]
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null

  return (
    <Section 
      title="What Our Customers Say" 
      subtitle="Don't just take our word for it. Here is what Momoza lovers have to say!"
      className="bg-brand-bg dark:bg-zinc-900"
    >
      {/* Mobile: horizontal scroll snap; Desktop: grid */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:pb-0 md:pt-0 no-scrollbar">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex-none w-[85%] snap-center md:w-auto h-full flex flex-col bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-border transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex text-brand-secondary mb-6">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-zinc-700'}`} 
                />
              ))}
            </div>
            
            <p className="text-foreground/80 text-lg leading-relaxed italic mb-8 flex-1">
              "{review.review_text}"
            </p>
            
            <div className="flex items-center gap-4 mt-auto">
              <div className="h-12 w-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl border border-brand-primary/20">
                {review.customer_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-foreground">{review.customer_name}</h4>
                <p className="text-sm text-foreground/60">Verified Order</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 md:mt-12 text-center">
        <Link href="/reviews">
          <Button variant="ghost" rightIcon={<ArrowRight className="h-4 w-4" />} className="font-semibold">
            See All Reviews
          </Button>
        </Link>
      </div>
    </Section>
  )
}
