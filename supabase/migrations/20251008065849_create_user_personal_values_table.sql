/*
  # Create User Personal Values Table

  1. New Tables
    - `user_personal_values`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `value` (text, the personal value name)
      - `rank` (integer, 1-5 for top 5 values)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_personal_values` table
    - Add policy for authenticated users to read their own values
    - Add policy for authenticated users to insert/update their own values
    - Add public read policy for demo purposes
*/

CREATE TABLE IF NOT EXISTS user_personal_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  value text NOT NULL,
  rank integer NOT NULL CHECK (rank >= 1 AND rank <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, rank)
);

ALTER TABLE user_personal_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own personal values"
  ON user_personal_values FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personal values"
  ON user_personal_values FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own personal values"
  ON user_personal_values FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own personal values"
  ON user_personal_values FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can read personal values"
  ON user_personal_values FOR SELECT
  TO anon
  USING (true);
