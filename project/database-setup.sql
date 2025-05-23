-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create artworks table
CREATE TABLE IF NOT EXISTS public.artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    medium TEXT,
    dimensions TEXT,
    year TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT false,
    quantity INTEGER DEFAULT 1,
    category TEXT,
    type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    siteName TEXT DEFAULT 'Art Gallery',
    siteDescription TEXT DEFAULT 'Online art gallery and marketplace',
    contactEmail TEXT DEFAULT 'contact@example.com',
    featuredArtworksCount INTEGER DEFAULT 6,
    enableSales BOOLEAN DEFAULT true,
    enableUserRegistration BOOLEAN DEFAULT true,
    maintenanceMode BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT site_settings_id_check CHECK (id = 1)
);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert your profile if it doesn't exist
INSERT INTO public.profiles (id, role)
VALUES ('291d1e26-93e7-458b-9d37-6cb245aef567', 'admin')
ON CONFLICT (id) DO UPDATE
SET role = 'admin';
