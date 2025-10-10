/*
  # Update Actions Schema for Single Value Association

  1. Changes
    - Drop the existing actions table
    - Recreate with nullable company_value and personal_value (only one should be set)
    - Remove personal_values array field
    - Add constraint to ensure only one value type is set

  2. Security
    - Maintain existing RLS policies
*/

DROP TABLE IF EXISTS actions CASCADE;

CREATE TABLE actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  rationale text NOT NULL,
  company_value text,
  personal_value text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT single_value_check CHECK (
    (company_value IS NOT NULL AND personal_value IS NULL) OR
    (company_value IS NULL AND personal_value IS NOT NULL)
  )
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
