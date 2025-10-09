-- Create customer_addresses table
CREATE TABLE public.customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  is_primary BOOLEAN DEFAULT false,
  property_type TEXT NOT NULL,
  layout_type TEXT NOT NULL,
  package_code TEXT NOT NULL REFERENCES public.cleaning_packages(package_code),
  
  -- Portugal fields
  rua TEXT,
  codigo_postal TEXT,
  localidade TEXT,
  distrito TEXT,
  porta_andar TEXT,
  
  -- Canada fields
  street TEXT,
  apt_unit TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create cleaning_addons table
CREATE TABLE public.cleaning_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_pt TEXT NOT NULL,
  price NUMERIC NOT NULL,
  type TEXT NOT NULL, -- 'flat' or 'per_room'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create overtime_rules table
CREATE TABLE public.overtime_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  increment_minutes INTEGER NOT NULL DEFAULT 30,
  price_eur NUMERIC NOT NULL DEFAULT 10,
  price_cad NUMERIC NOT NULL DEFAULT 15
);

-- Create provider_availability table
CREATE TABLE public.provider_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider_id, date, start_time)
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.provider_profiles(id),
  address_id UUID NOT NULL REFERENCES public.customer_addresses(id),
  package_id UUID NOT NULL REFERENCES public.cleaning_packages(id),
  addon_ids UUID[],
  requested_date DATE NOT NULL,
  requested_time TEXT NOT NULL,
  total_estimate NUMERIC NOT NULL,
  total_final NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_intent_id TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  overtime_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create provider_reviews table
CREATE TABLE public.provider_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(booking_id)
);

-- Create provider_wallet table
CREATE TABLE public.provider_wallet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  base_amount NUMERIC NOT NULL,
  overtime_amount NUMERIC DEFAULT 0,
  total_earned NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL,
  payout_due NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(booking_id)
);

-- Enable RLS
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaning_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overtime_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_wallet ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_addresses
CREATE POLICY "Users can view own addresses"
  ON public.customer_addresses FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own addresses"
  ON public.customer_addresses FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own addresses"
  ON public.customer_addresses FOR UPDATE
  USING (auth.uid() = customer_id);

CREATE POLICY "Users can delete own addresses"
  ON public.customer_addresses FOR DELETE
  USING (auth.uid() = customer_id);

-- RLS Policies for cleaning_addons
CREATE POLICY "Anyone can view addons"
  ON public.cleaning_addons FOR SELECT
  USING (true);

-- RLS Policies for overtime_rules
CREATE POLICY "Anyone can view overtime rules"
  ON public.overtime_rules FOR SELECT
  USING (true);

-- RLS Policies for provider_availability
CREATE POLICY "Anyone can view availability"
  ON public.provider_availability FOR SELECT
  USING (true);

CREATE POLICY "Providers can manage own availability"
  ON public.provider_availability FOR ALL
  USING (
    provider_id IN (
      SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Customers can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Providers can view assigned bookings"
  ON public.bookings FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = customer_id);

CREATE POLICY "Providers can update assigned bookings"
  ON public.bookings FOR UPDATE
  USING (
    provider_id IN (
      SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for provider_reviews
CREATE POLICY "Anyone can view reviews"
  ON public.provider_reviews FOR SELECT
  USING (true);

CREATE POLICY "Customers can create reviews for own bookings"
  ON public.provider_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = customer_id AND
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id 
      AND customer_id = auth.uid()
      AND status = 'completed'
    )
  );

-- RLS Policies for provider_wallet
CREATE POLICY "Providers can view own wallet"
  ON public.provider_wallet FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_customer_addresses_updated_at
  BEFORE UPDATE ON public.customer_addresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert seed data for cleaning_addons
INSERT INTO public.cleaning_addons (name_en, name_pt, price, type) VALUES
  ('Refrigerator cleaning', 'Limpeza do frigorífico', 15, 'flat'),
  ('Oven cleaning', 'Limpeza do forno', 15, 'flat'),
  ('Glass/mirrors (not windows)', 'Vidros/espelhos (não janelas)', 15, 'flat'),
  ('Inside cupboards/drawers', 'Interior de armários/gavetas', 20, 'per_room'),
  ('Storage Cleaning', 'Limpeza de arrumos', 20, 'flat'),
  ('Balcony Cleaning', 'Limpeza de varanda', 15, 'flat');

-- Insert seed data for overtime_rules
INSERT INTO public.overtime_rules (increment_minutes, price_eur, price_cad) VALUES
  (30, 10, 15);