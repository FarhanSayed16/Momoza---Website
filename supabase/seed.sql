-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Tables

CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name TEXT DEFAULT 'Momoza',
  tagline TEXT DEFAULT 'Authentic Homemade Momos',
  description TEXT DEFAULT 'Freshly made momos delivered to your doorstep.',
  phone TEXT DEFAULT '+919876543210',
  whatsapp_number TEXT DEFAULT '+919876543210',
  email TEXT DEFAULT 'hello@momoza.in',
  address TEXT DEFAULT 'Sector 5, Noida',
  delivery_radius TEXT DEFAULT '0-5 km',
  operating_hours TEXT DEFAULT '11 AM - 10 PM',
  instagram_url TEXT DEFAULT 'https://instagram.com/momoza.momos',
  google_maps_url TEXT DEFAULT '',
  min_order_amount INTEGER DEFAULT 100,
  delivery_charge INTEGER DEFAULT 20,
  is_accepting_orders BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.hero_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heading TEXT DEFAULT 'Authentic Homemade Momos',
  subheading TEXT DEFAULT 'Made fresh daily in our kitchen with love and the finest ingredients. Starting at just ₹45.',
  cta_text TEXT DEFAULT 'Order Now',
  background_image TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 1
);

CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  pieces INTEGER DEFAULT 4,
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT true,
  is_bestseller BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  order_type TEXT DEFAULT 'Delivery',
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.about_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT DEFAULT 'Our Story',
  story TEXT DEFAULT 'We started Momoza with a simple dream: to share our family''s authentic momo recipe with the world...',
  image_url TEXT,
  highlights JSONB DEFAULT '[{"title": "Homemade", "description": "Made fresh daily in our home kitchen", "icon": "home"}, {"title": "Fresh Ingredients", "description": "We only use the finest ingredients", "icon": "leaf"}]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_settings_modtime
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_modtime
BEFORE UPDATE ON public.menu_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_section_modtime
BEFORE UPDATE ON public.about_section
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Create order number generation sequence and function
CREATE SEQUENCE IF NOT EXISTS orders_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'MZ-' || lpad(nextval('orders_seq')::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number();

-- 4. Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_section ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Allow public read access (SELECT)
CREATE POLICY "Public profiles are viewable by everyone." ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Hero is viewable by everyone." ON public.hero_section FOR SELECT USING (true);
CREATE POLICY "Categories are viewable by everyone." ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Menu is viewable by everyone." ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Slides are viewable by everyone." ON public.slides FOR SELECT USING (true);
CREATE POLICY "Approved reviews viewable by everyone." ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "About section viewable by everyone." ON public.about_section FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Anyone can submit a review." ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit an order." ON public.orders FOR INSERT WITH CHECK (true);

-- Allow admin ALL access to all tables
CREATE POLICY "Admins can do everything on site_settings" ON public.site_settings TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can do everything on hero_section" ON public.hero_section TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can do everything on menu_categories" ON public.menu_categories TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can do everything on menu_items" ON public.menu_items TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can do everything on slides" ON public.slides TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can do everything on reviews" ON public.reviews TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can do everything on orders" ON public.orders TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can do everything on about_section" ON public.about_section TO authenticated USING (true) WITH CHECK (true);

-- 6. Storage Buckets configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('menu-images', 'menu-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('hero-images', 'hero-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('slide-images', 'slide-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('about-images', 'about-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id IN ('menu-images', 'hero-images', 'slide-images', 'about-images') );
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id IN ('menu-images', 'hero-images', 'slide-images', 'about-images') );
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id IN ('menu-images', 'hero-images', 'slide-images', 'about-images') );
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id IN ('menu-images', 'hero-images', 'slide-images', 'about-images') );

-- 7. Insert Initial Data
INSERT INTO public.site_settings (brand_name) VALUES ('Momoza');
INSERT INTO public.hero_section (heading) VALUES ('Authentic Homemade Momos');
INSERT INTO public.about_section (title) VALUES ('Our Story');

-- Categories
INSERT INTO public.menu_categories (id, name, description, sort_order) VALUES 
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Veg Momos', 'Fresh vegetarian momos', 1),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Non-Veg Momos', 'Delicious chicken momos', 2),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'Combos', 'Value combos for family', 3);

-- Menu Items
INSERT INTO public.menu_items (category_id, name, description, price, pieces, is_vegetarian, is_bestseller) VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Steamed Veg Momos', 'Classic steamed momos with cabbage and carrot filling.', 45, 4, true, true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Paneer Tikka Momos', 'Spicy paneer filling inside our signature momo wrapper.', 60, 4, true, false),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Steamed Chicken Momos', 'Juicy chicken filling with herbs and spices.', 50, 4, false, true),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'Family Veg Combo', '16 pieces of assorted veg momos with extra chutney.', 160, 16, true, false);
