-- Migration script to update column names to snake_case

-- Rename imageUrl to image_url if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artworks' AND column_name = 'imageUrl') THEN
    ALTER TABLE public.artworks RENAME COLUMN "imageUrl" TO image_url;
  END IF;
END $$;

-- Add category column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artworks' AND column_name = 'category') THEN
    ALTER TABLE public.artworks ADD COLUMN category TEXT;
  END IF;
END $$;

-- This script is safe to run multiple times as it checks if columns exist before making changes
