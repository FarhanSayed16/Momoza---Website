'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageUploaderProps {
  value: string | null
  onChange: (url: string) => void
  oldImageUrl?: string | null
  aspectRatio?: 'square' | 'video' | 'auto'
}

export const ImageUploader = ({ value, onChange, oldImageUrl, aspectRatio = 'auto' }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Pre-validate client side
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be smaller than 5MB')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    if (oldImageUrl) {
      formData.append('oldImageUrl', oldImageUrl)
    }

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Upload failed')

      toast.success('Image uploaded successfully')
      onChange(json.data.url)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    // We don't delete from storage here, we just remove the visual link.
    // The actual deletion happens when they upload a replacement or delete the parent entity.
    onChange('')
  }

  const ratioClass = 
    aspectRatio === 'square' ? 'aspect-square' :
    aspectRatio === 'video' ? 'aspect-video' :
    'aspect-[4/3]'

  return (
    <div className="w-full">
      {value ? (
        <div className={`relative w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 ${ratioClass}`}>
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors cursor-pointer ${ratioClass}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-zinc-500">
              <Loader2 className="h-8 w-8 animate-spin mb-2 text-brand-primary" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-zinc-500">
              <Upload className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Click to upload image</span>
              <span className="text-xs text-zinc-600 mt-1">JPEG, PNG, WebP (Max 5MB)</span>
            </div>
          )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />
    </div>
  )
}
