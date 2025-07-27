-- Add last_active_at field for session tracking
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing users to have a last_active_at timestamp
UPDATE users 
SET last_active_at = updated_at 
WHERE last_active_at IS NULL;

-- Create index for performance on last_active_at queries
CREATE INDEX IF NOT EXISTS idx_users_last_active_at ON users(last_active_at);

-- Create index for phone number lookups (performance optimization)
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
