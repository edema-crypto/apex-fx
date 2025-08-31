/*
  # Initial ApexFX Database Schema

  1. New Tables
    - `profiles` - User profile information extending Supabase auth.users
      - `id` (uuid, references auth.users)
      - `first_name` (text)
      - `last_name` (text) 
      - `avatar_url` (text, optional)
      - `balance` (decimal, default 0)
      - `initial_balance` (decimal, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `transactions` - All user transactions
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `amount` (decimal)
      - `description` (text)
      - `status` (enum: pending, success, denied)
      - `type` (enum: credit, debit)
      - `currency` (text, default 'USD')
      - `wallet_address` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `admin_users` - Admin access control
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Admins have full access to manage users and transactions
    - Public signup allowed for profiles

  3. Functions & Triggers
    - Auto-create profile on user signup
    - Update balance when transactions change status
    - Real-time subscriptions for live updates
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE transaction_status AS ENUM ('pending', 'success', 'denied');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  avatar_url text,
  balance decimal(15,2) DEFAULT 0.00,
  initial_balance decimal(15,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount decimal(15,2) NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  status transaction_status DEFAULT 'pending',
  type transaction_type NOT NULL,
  currency text DEFAULT 'USD',
  wallet_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Insert default admin
INSERT INTO admin_users (email) VALUES ('admin@apexfx.com') ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Admin users policies
CREATE POLICY "Only admins can view admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update profile updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user balance when transaction status changes
CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS trigger AS $$
BEGIN
  -- Handle status changes
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    -- If transaction becomes successful, update balance
    IF NEW.status = 'success' AND OLD.status != 'success' THEN
      UPDATE profiles 
      SET balance = balance + CASE 
        WHEN NEW.type = 'credit' THEN NEW.amount 
        ELSE -NEW.amount 
      END
      WHERE id = NEW.user_id;
      
      -- Set initial balance if this is the first successful transaction
      UPDATE profiles 
      SET initial_balance = balance
      WHERE id = NEW.user_id 
        AND initial_balance = 0 
        AND NOT EXISTS (
          SELECT 1 FROM transactions 
          WHERE user_id = NEW.user_id 
            AND status = 'success' 
            AND id != NEW.id
        );
    END IF;
    
    -- If transaction was successful but now isn't, reverse the balance change
    IF OLD.status = 'success' AND NEW.status != 'success' THEN
      UPDATE profiles 
      SET balance = balance - CASE 
        WHEN NEW.type = 'credit' THEN NEW.amount 
        ELSE -NEW.amount 
      END
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  
  -- Handle new successful transactions
  IF TG_OP = 'INSERT' AND NEW.status = 'success' THEN
    UPDATE profiles 
    SET balance = balance + CASE 
      WHEN NEW.type = 'credit' THEN NEW.amount 
      ELSE -NEW.amount 
    END
    WHERE id = NEW.user_id;
    
    -- Set initial balance if this is the first successful transaction
    UPDATE profiles 
    SET initial_balance = balance
    WHERE id = NEW.user_id 
      AND initial_balance = 0 
      AND NOT EXISTS (
        SELECT 1 FROM transactions 
        WHERE user_id = NEW.user_id 
          AND status = 'success' 
          AND id != NEW.id
      );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for balance updates
CREATE TRIGGER update_balance_on_transaction_change
  AFTER INSERT OR UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_user_balance();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(id);