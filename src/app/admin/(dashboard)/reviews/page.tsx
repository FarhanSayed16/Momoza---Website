'use client'

import React, { useEffect, useState } from 'react'
import { Search, Loader2, Star, CheckCircle2, XCircle, Trash2, Heart } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { LoadingSpinner } from '@/components/admin/LoadingSpinner'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all, pending, approved, featured

  // Delete Modal
  const [deleteData, setDeleteData] = useState<{ id: string, name: string } | null>(null)

  // Bulk Approve
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])
  const [isBulkApproving, setIsBulkApproving] = useState(false)

  // Read More Modal
  const [readMoreReview, setReadMoreReview] = useState<any | null>(null)

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews')
      const json = await res.json()
      if (json.success) {
        setReviews(json.data)
      }
    } catch (error) {
      toast.error('Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleUpdateReview = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!res.ok) throw new Error()
      
      // Update local state for instant feedback
      setReviews(reviews.map(r => r.id === id ? { ...r, ...updates } : r))
      toast.success('Review updated')
    } catch {
      toast.error('Failed to update review')
      fetchReviews() // revert on fail
    }
  }

  const handleDelete = async () => {
    if (!deleteData) return
    try {
      const res = await fetch(`/api/admin/reviews/${deleteData.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Review deleted')
      fetchReviews()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setDeleteData(null)
    }
  }

  const handleBulkApprove = async () => {
    if (selectedReviews.length === 0) return
    setIsBulkApproving(true)
    try {
      const res = await fetch('/api/admin/reviews/bulk-approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedReviews })
      })
      const json = await res.json()
      if (json.success) {
        toast.success(`Approved ${selectedReviews.length} reviews`)
        setReviews(reviews.map(r => selectedReviews.includes(r.id) ? { ...r, is_approved: true } : r))
        setSelectedReviews([])
      } else {
        throw new Error(json.error)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to bulk approve')
    } finally {
      setIsBulkApproving(false)
    }
  }

  const toggleSelection = (id: string) => {
    setSelectedReviews(prev => 
      prev.includes(id) ? prev.filter(reviewId => reviewId !== id) : [...prev, id]
    )
  }

  const toggleAllSelection = () => {
    const pendingIds = filteredReviews.filter(r => !r.is_approved).map(r => r.id)
    if (selectedReviews.length === pendingIds.length && pendingIds.length > 0) {
      setSelectedReviews([])
    } else {
      setSelectedReviews(pendingIds)
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.review_text.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesStatus = true
    if (statusFilter === 'pending') matchesStatus = !review.is_approved
    if (statusFilter === 'approved') matchesStatus = review.is_approved
    if (statusFilter === 'featured') matchesStatus = review.is_featured

    return matchesSearch && matchesStatus
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6 pb-12 h-[calc(100vh-120px)] flex flex-col">
      <PageHeader 
        title="Reviews Manager" 
        description="Moderate customer reviews and select which ones to feature on the homepage."
        action={
          selectedReviews.length > 0 && (
            <Button 
              onClick={handleBulkApprove} 
              disabled={isBulkApproving}
              className="bg-green-600 hover:bg-green-700 text-white"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Approve Selected ({selectedReviews.length})
            </Button>
          )
        }
      />

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col flex-1 min-h-0 overflow-hidden shadow-sm">
        
        {/* Filters Bar */}
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between bg-zinc-950/50">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {[
              { id: 'all', label: 'All Reviews' }, 
              { id: 'pending', label: 'Pending Approval' }, 
              { id: 'approved', label: 'Approved' }, 
              { id: 'featured', label: 'Featured (Homepage)' }
            ].map(status => (
              <button
                key={status.id}
                onClick={() => setStatusFilter(status.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  statusFilter === status.id 
                    ? 'bg-brand-primary text-white' 
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-zinc-800 rounded-xl bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-800/50 text-xs uppercase text-zinc-500 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-medium w-[5%]">
                  <input 
                    type="checkbox" 
                    onChange={toggleAllSelection}
                    checked={
                      filteredReviews.filter(r => !r.is_approved).length > 0 && 
                      selectedReviews.length === filteredReviews.filter(r => !r.is_approved).length
                    }
                    className="rounded border-zinc-700 bg-zinc-800 text-brand-primary focus:ring-brand-primary/50"
                  />
                </th>
                <th className="px-6 py-4 font-medium w-[20%]">Customer</th>
                <th className="px-6 py-4 font-medium w-[15%]">Rating</th>
                <th className="px-6 py-4 font-medium w-[40%]">Review</th>
                <th className="px-6 py-4 font-medium text-right w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr key={review.id} className={`hover:bg-zinc-800/50 transition-colors ${selectedReviews.includes(review.id) ? 'bg-zinc-800/80' : ''}`}>
                    <td className="px-6 py-4 align-top">
                      {!review.is_approved ? (
                        <input 
                          type="checkbox" 
                          checked={selectedReviews.includes(review.id)}
                          onChange={() => toggleSelection(review.id)}
                          className="rounded border-zinc-700 bg-zinc-800 text-brand-primary focus:ring-brand-primary/50"
                        />
                      ) : (
                        <div className="w-4 h-4" /> // placeholder for alignment
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-zinc-200 font-medium">{review.customer_name}</div>
                      <div className="text-xs text-zinc-500 mb-1">{review.customer_phone || 'No phone'}</div>
                      <div className="text-[10px] text-zinc-600">
                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'fill-zinc-800 text-zinc-800'}`} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="text-zinc-300 line-clamp-2 leading-relaxed">"{review.review_text}"</p>
                      {review.review_text.length > 80 && (
                        <button 
                          onClick={() => setReadMoreReview(review)}
                          className="text-xs text-brand-primary hover:underline mt-1"
                        >
                          Read more
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col items-end gap-2">
                        
                        {/* Approval Toggle */}
                        <button 
                          onClick={() => handleUpdateReview(review.id, { is_approved: !review.is_approved })}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border transition-colors w-28 justify-center ${
                            review.is_approved 
                              ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white'
                          }`}
                        >
                          {review.is_approved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          {review.is_approved ? 'Approved' : 'Pending'}
                        </button>

                        <div className="flex items-center gap-2 mt-1">
                          {/* Feature Toggle */}
                          <button 
                            onClick={() => handleUpdateReview(review.id, { is_featured: !review.is_featured })}
                            disabled={!review.is_approved}
                            title={!review.is_approved ? "Must be approved to feature" : "Toggle Featured"}
                            className={`p-2 rounded-lg transition-colors ${
                              !review.is_approved ? 'opacity-30 cursor-not-allowed text-zinc-500' :
                              review.is_featured 
                                ? 'bg-pink-500/20 text-pink-500 hover:bg-pink-500/30' 
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${review.is_featured ? 'fill-pink-500' : ''}`} />
                          </button>
                          
                          {/* Delete Button */}
                          <button 
                            onClick={() => setDeleteData({ id: review.id, name: review.customer_name })}
                            className="p-2 rounded-lg transition-colors bg-red-500/10 text-red-500 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-8 w-8 mb-2 opacity-50" />
                      <p>No reviews found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={!!deleteData}
        title="Delete Review"
        message={`Are you sure you want to delete this review from ${deleteData?.name}? This cannot be undone.`}
        isDestructive
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteData(null)}
      />

      {/* Read More Modal */}
      {readMoreReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setReadMoreReview(null)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-xl relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setReadMoreReview(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">{readMoreReview.customer_name}'s Review</h3>
            <div className="flex gap-0.5 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${star <= readMoreReview.rating ? 'fill-yellow-500 text-yellow-500' : 'fill-zinc-800 text-zinc-800'}`} 
                />
              ))}
            </div>
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-sm">
                "{readMoreReview.review_text}"
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setReadMoreReview(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
