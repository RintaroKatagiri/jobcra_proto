/*
  # Create Company Values Table

  1. New Tables
    - `company_values`
      - `id` (uuid, primary key)
      - `name` (text, unique) - 企業理念の名前
      - `description` (text) - 企業理念の説明
      - `display_order` (integer) - 表示順序
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `company_values` table
    - Add policy for public read access (for demo)
    - Add policy for admin write access

  3. Initial Data
    - Insert default company values
*/

CREATE TABLE IF NOT EXISTS company_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE company_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read company values"
  ON company_values FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can read company values"
  ON company_values FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert company values"
  ON company_values FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update company values"
  ON company_values FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete company values"
  ON company_values FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Anon can manage company values for demo"
  ON company_values FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

INSERT INTO company_values (name, description, display_order) VALUES
  ('顧客志向', '顧客の成功を第一に考え、常に顧客視点で行動します', 1),
  ('データ活用', 'データに基づいた意思決定を行い、継続的に改善します', 2),
  ('協働', 'チームワークを大切にし、部署を超えて協力します', 3),
  ('改善', '現状に満足せず、常により良い方法を追求します', 4),
  ('誠実', '正直で透明性のある行動を心がけます', 5)
ON CONFLICT (name) DO NOTHING;
