-- Create waitlist_signups table for early access signups
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  referral_code TEXT UNIQUE,
  referred_by TEXT REFERENCES waitlist_signups(referral_code),
  referral_count INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'standard' CHECK (tier IN ('standard', 'bronze', 'silver', 'gold')),
  position INTEGER,
  signup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_signups(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON waitlist_signups(referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_position ON waitlist_signups(position);
CREATE INDEX IF NOT EXISTS idx_waitlist_signup_date ON waitlist_signups(signup_date);

-- Create function to update referral counts and tiers
CREATE OR REPLACE FUNCTION update_referrer_stats(referral_code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE waitlist_signups 
  SET referral_count = referral_count + 1,
      tier = CASE 
        WHEN referral_count + 1 >= 10 THEN 'gold'
        WHEN referral_count + 1 >= 5 THEN 'silver'
        WHEN referral_count + 1 >= 3 THEN 'bronze'
        ELSE 'standard'
      END,
      updated_at = NOW()
  WHERE waitlist_signups.referral_code = update_referrer_stats.referral_code;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := 'NITE' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    
    SELECT EXISTS(SELECT 1 FROM waitlist_signups WHERE referral_code = new_code) INTO code_exists;
    
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to auto-generate referral codes
CREATE OR REPLACE FUNCTION trigger_generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code = generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate referral codes
DROP TRIGGER IF EXISTS trigger_generate_referral_code ON waitlist_signups;
CREATE TRIGGER trigger_generate_referral_code
  BEFORE INSERT ON waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_referral_code();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_updated_at ON waitlist_signups;
CREATE TRIGGER trigger_update_updated_at
  BEFORE UPDATE ON waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
