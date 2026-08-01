'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import toast from 'react-hot-toast'

export const ReviewForm = () => {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    review: ''
  })

  // Honeypot field for basic spam prevention
  const [honeypot, setHoneypot] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '')
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: numericValue }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Spam check
    if (honeypot) return

    if (!formData.name.trim() || !formData.review.trim()) {
      toast.error('Name and review text are required')
      return
    }

    if (formData.phone && formData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone || null,
          rating,
          review_text: formData.review
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      setIsSuccess(true)
      toast.success('Review submitted successfully!')
    } catch (error) {
      console.error('Review submit error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-3xl p-8 text-center"
      >
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">Thank You!</h3>
        <p className="text-green-700 dark:text-green-500/80">
          Your review has been submitted successfully and will appear on our website after verification.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm border border-border">
      <h3 className="text-2xl font-bold font-sans mb-6">Leave a Review</h3>
      
      {/* Star Rating Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground/80 mb-2">
          Your Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'fill-brand-secondary text-brand-secondary'
                    : 'text-gray-300 dark:text-zinc-700'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Input
          label="Your Name *"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="John Doe"
        />
        <Input
          label="Phone Number (Optional)"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="For verification only"
          type="tel"
          maxLength={10}
        />
      </div>

      <div className="mb-6 relative">
        <Textarea
          label="Your Review *"
          name="review"
          value={formData.review}
          onChange={handleInputChange}
          required
          placeholder="Tell us what you loved about our momos!"
          rows={4}
          maxLength={500}
        />
        <span className="absolute bottom-3 right-3 text-xs text-foreground/40">
          {formData.review.length}/500
        </span>
      </div>

      {/* Honeypot field (hidden) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="opacity-0 absolute -left-[9999px]"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
      />

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting || !formData.name || !formData.review}
        className="w-full md:w-auto px-8"
        leftIcon={isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}
