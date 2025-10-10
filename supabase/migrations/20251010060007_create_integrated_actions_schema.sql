/*
  # Create Schema for Integrated Actions

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text) - 'admin' or 'employee'
      - `created_at` (timestamp)
    
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `expected_role` (text, nullable) - 期待役割
      - `duration_days` (integer)
      - `start_date` (date)
      - `created_at` (timestamp)
    
    - `actions`
      - `id` (uuid, primary key)
      - `goal_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `rationale` (text)
      - `company_value` (text) - 企業理念
      - `personal_value` (text) - 個人の価値観
      - `company_weight` (integer) - 企業理念の重み (%)
      - `personal_weight` (integer) - 個人価値観の重み (%)
      - `created_at` (timestamp)
    
    - `action_logs`
      - `id` (uuid, primary key)
      - `action_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `logged_at` (timestamp)
      - `notes` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and anonymous users (for demo)
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'employee',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Public can read users"
  ON users FOR SELECT
  TO anon
  USING (true);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  expected_role text,
  duration_days integer NOT NULL,
  start_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all goals"
  ON goals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Public can read goals"
  ON goals FOR SELECT
  TO anon
  USING (true);

-- Actions table with integrated values
CREATE TABLE IF NOT EXISTS actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  rationale text NOT NULL,
  company_value text NOT NULL,
  personal_value text NOT NULL,
  company_weight integer NOT NULL DEFAULT 50,
  personal_weight integer NOT NULL DEFAULT 50,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT weight_sum_check CHECK (company_weight + personal_weight = 100)
);

ALTER TABLE actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read actions for their goals"
  ON actions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM goals
      WHERE goals.id = actions.goal_id
      AND goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all actions"
  ON actions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Public can read actions"
  ON actions FOR SELECT
  TO anon
  USING (true);

-- Action logs table
CREATE TABLE IF NOT EXISTS action_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id uuid NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logged_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE action_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own action logs"
  ON action_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all action logs"
  ON action_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Public can read action_logs"
  ON action_logs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can insert own action logs"
  ON action_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
