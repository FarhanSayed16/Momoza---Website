import React from 'react'
import { createClient } from '@/lib/supabase-server'
import { Section } from '@/components/public/Section'
import { CategoryCard } from '@/components/public/CategoryCard'
import { HeroSection } from '@/components/public/HeroSection'
import { USPStrip } from '@/components/public/USPStrip'
import { FeaturedMenu } from '@/components/public/FeaturedMenu'
import { HowItWorks } from '@/components/public/HowItWorks'
import { Carousel } from '@/components/public/Carousel'
import { TestimonialSection } from '@/components/public/TestimonialSection'
import { CTABanner } from '@/components/public/CTABanner'

// Generate metadata dynamically from settings
export async function generateMetadata() {
  let settings = null
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('brand_name, tagline, description')
      .maybeSingle()
    settings = data
  } catch (error) {
    console.error('Failed to fetch metadata settings', error)
  }

  return {
    title: `${settings?.brand_name || 'Momoza'} - ${settings?.tagline || 'Authentic Homemade Momos'}`,
    description: settings?.description || 'Freshly steamed, authentic homemade momos delivered to your door. Order now on WhatsApp!',
  }
}

export default async function HomePage() {
  let heroData = null, categories = [], bestsellers = [], slides = [], reviews = []

  try {
    const supabase = await createClient()

    const [
      { data: hData },
      { data: cData },
      { data: bData },
      { data: sData },
      { data: rData }
    ] = await Promise.all([
      supabase.from('hero_section').select('*').eq('is_active', true).order('sort_order', { ascending: true }).limit(1).maybeSingle(),
      supabase.from('menu_categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      supabase.from('menu_items').select('*').eq('is_bestseller', true).eq('is_available', true).order('sort_order', { ascending: true }).limit(4),
      supabase.from('slides').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      supabase.from('reviews').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(3)
    ])

    heroData = hData
    categories = cData || []
    bestsellers = bData || []
    slides = sData || []
    reviews = rData || []
  } catch (error) {
    console.error('Failed to fetch homepage data from Supabase', error)
  }

  return (
    <>
      <HeroSection data={heroData} />
      <USPStrip />
      
      {slides && slides.length > 0 && <Carousel slides={slides} />}

      <HowItWorks />

      <Section 
        title="Explore Our Menu" 
        subtitle="Discover our range of delicious momos, carefully prepared to satisfy your cravings."
        className="bg-brand-bg dark:bg-zinc-900"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories && categories.length > 0 ? (
            categories.map((category, index) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                imageUrl={
                  category.image_url || 
                  (index === 0 ? 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=800' : 
                   index === 1 ? 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800' : 
                   'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?q=80&w=800')
                }
              />
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-8">
              <p>Our menu is currently being updated. Please check back soon!</p>
            </div>
          )}
        </div>
      </Section>

      {bestsellers && bestsellers.length > 0 && (
        <FeaturedMenu bestsellers={bestsellers} />
      )}

      {reviews && reviews.length > 0 && (
        <TestimonialSection reviews={reviews} />
      )}

      <CTABanner />
    </>
  )
}
