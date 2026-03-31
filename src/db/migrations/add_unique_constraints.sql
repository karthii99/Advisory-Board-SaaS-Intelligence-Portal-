-- Migration: Add unique constraints to prevent duplicate seeding
-- This ensures idempotent seeding operations

-- Add unique constraint to clients table (name)
-- This prevents duplicate companies from being inserted
ALTER TABLE clients 
ADD CONSTRAINT unique_client_name UNIQUE (name);

-- Add unique constraint to client_details table (client_id)
-- This prevents duplicate details for the same client
ALTER TABLE client_details 
ADD CONSTRAINT unique_client_details UNIQUE (client_id);

-- Note: If constraints already exist, these commands will be ignored
-- This migration is safe to run multiple times
