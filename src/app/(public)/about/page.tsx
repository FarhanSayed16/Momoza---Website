import React from 'react'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import { Section } from '@/components/public/Section'
import { Leaf, UtensilsCrossed, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Learn about the Momoza journey, our authentic family recipe, and what makes our homemade momos so special.',
}

// Helper to map icon string from DB to Lucide component
const getIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'home':
      return <UtensilsCrossed className="h-6 w-6 text-brand-primary" />
    case 'leaf':
      return <Leaf className="h-6 w-6 text-green-600" />
    case 'heart':
    default:
      return <Heart className="h-6 w-6 text-brand-primary" />
  }
}

export default async function AboutPage() {
  const supabase = await createClient()

  // Fetch About Section Data
  const { data: aboutData } = await supabase
    .from('about_section')
    .select('*')
    .limit(1)
    .single()

  if (!aboutData) {
    return (
      <Section className="min-h-[50vh] flex items-center justify-center">
        <p className="text-xl text-gray-500">About details coming soon.</p>
      </Section>
    )
  }

  const highlights = (aboutData.highlights as { title: string; description: string; icon: string }[]) || []

  return (
    <>
      <Section className="bg-brand-bg dark:bg-zinc-900 pt-24 md:pt-32 pb-16 border-b border-border">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl font-sans mb-6">
            {aboutData.title}
          </h1>
          <div className="w-24 h-1.5 bg-brand-primary mx-auto rounded-full mb-8" />
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Story Text */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-foreground mb-6 font-sans">
              The Momoza Journey
            </h2>
            <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
              {/* Split story by paragraphs if there are newlines, else just render */}
              {aboutData.story.split('\n').map((paragraph: string, idx: number) => (
                paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
              ))}
            </div>
            
            {highlights.length > 0 && (
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {highlights.map((highlight, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-border">
                    <div className="shrink-0 mt-1">
                      {getIcon(highlight.icon)}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{highlight.title}</h4>
                      <p className="text-sm text-foreground/70 mt-1">{highlight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shadow-xl border border-border/50 relative">
              <img 
                src={aboutData.image_url || '/images/placeholder-about.jpg'} 
                alt="Cooking Momos"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-brand-secondary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl -z-10" />

            {/* FSSAI Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-border p-4 flex items-center gap-3 z-10 animate-bounce-slow">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-xl">✓</span>
              </div>
              <div>
                <p className="font-bold text-sm">FSSAI Certified</p>
                <p className="text-xs text-foreground/60">Lic. 12345678901234</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
