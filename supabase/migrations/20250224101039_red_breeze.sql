/*
  # Initial Schema Setup

  1. New Tables
    - `users`: Store user information and subscription status
    - `analysis_history`: Track user analysis records
    - `subscriptions`: Manage user subscriptions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure users can only access their own data

  3. Indexes
    - Add performance optimization indexes
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for status tracking
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE subscription_status AS ENUM ('free', 'active', 'cancelled', 'expired');
  END IF;
END$$;

-- Users table with improved structure
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text,
  subscription_status subscription_status DEFAULT 'free',
  free_analysis_used boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at'
  ) THEN
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END$$;

-- Analysis History table with improved structure
CREATE TABLE IF NOT EXISTS analysis_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  image_path text NOT NULL,
  result jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_result CHECK (result IS NOT NULL AND result::text != 'null'::text)
);

-- Subscriptions table with improved structure
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id text UNIQUE,
  plan_type text NOT NULL,
  status subscription_status NOT NULL DEFAULT 'free',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (current_period_end > current_period_start)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_subscriptions_updated_at'
  ) THEN
    CREATE TRIGGER update_subscriptions_updated_at
      BEFORE UPDATE ON subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END$$;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can read own data" ON users;
  DROP POLICY IF EXISTS "Users can update own data" ON users;
  DROP POLICY IF EXISTS "Users can read own analysis history" ON analysis_history;
  DROP POLICY IF EXISTS "Users can insert own analysis" ON analysis_history;
  DROP POLICY IF EXISTS "Users can read own subscriptions" ON subscriptions;
EXCEPTION
  WHEN others THEN
    NULL;
END$$;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for analysis_history table
CREATE POLICY "Users can read own analysis history"
  ON analysis_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis"
  ON analysis_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for subscriptions table
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
DROP INDEX IF EXISTS idx_analysis_history_user_id;
DROP INDEX IF EXISTS idx_analysis_history_created_at;
DROP INDEX IF EXISTS idx_subscriptions_user_id;
DROP INDEX IF EXISTS idx_subscriptions_status;
DROP INDEX IF EXISTS idx_subscriptions_current_period_end;

CREATE INDEX idx_analysis_history_user_id 
  ON analysis_history(user_id);

CREATE INDEX idx_analysis_history_created_at 
  ON analysis_history(created_at DESC);

CREATE INDEX idx_subscriptions_user_id 
  ON subscriptions(user_id);

CREATE INDEX idx_subscriptions_status 
  ON subscriptions(status);

CREATE INDEX idx_subscriptions_current_period_end 
  ON subscriptions(current_period_end);

-- Add function to check subscription status
CREATE OR REPLACE FUNCTION check_subscription_status()
RETURNS trigger AS $$
BEGIN
  -- Update user's subscription status when subscription changes
  UPDATE users
  SET subscription_status = NEW.status
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_subscription_status'
  ) THEN
    CREATE TRIGGER update_user_subscription_status
      AFTER INSERT OR UPDATE OF status
      ON subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION check_subscription_status();
  END IF;
END$$;