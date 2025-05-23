-- Comprehensive migration script to fix all database schema issues

-- First, refresh Supabase's schema cache to ensure it's up-to-date
BEGIN;

-- 1. Handle the imageUrl/image_url column
-- Check if imageUrl exists but image_url doesn't
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artworks' AND column_name = 'imageUrl') AND 
     NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artworks' AND column_name = 'image_url') THEN
    -- Rename imageUrl to image_url
    ALTER TABLE public.artworks RENAME COLUMN "imageUrl" TO image_url;
    RAISE NOTICE 'Renamed imageUrl column to image_url';
  -- Check if neither column exists
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artworks' AND column_name = 'imageUrl') AND 
        NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artworks' AND column_name = 'image_url') THEN
    -- Add image_url column
    ALTER TABLE public.artworks ADD COLUMN image_url TEXT;
    RAISE NOTICE 'Added missing image_url column';
  ELSE
    RAISE NOTICE 'image_url column already exists, no action needed';
  END IF;
END $$;

-- 2. Handle the category column
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artworks' AND column_name = 'category') THEN
    ALTER TABLE public.artworks ADD COLUMN category TEXT;
    RAISE NOTICE 'Added category column';
  ELSE
    RAISE NOTICE 'category column already exists, no action needed';
  END IF;
END $$;

-- 3. Handle the type column (if needed)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artworks' AND column_name = 'type') THEN
    ALTER TABLE public.artworks ADD COLUMN type TEXT;
    RAISE NOTICE 'Added type column';
  ELSE
    RAISE NOTICE 'type column already exists, no action needed';
  END IF;
END $$;

-- 4. Force refresh of Supabase's schema cache
-- This is a trick to force Supabase to reload its schema cache
COMMENT ON TABLE public.artworks IS 'Table containing artwork information - schema refreshed';

COMMIT;

-- This script is safe to run multiple times as it checks if columns exist before making changes
