/*
  # Add Public Read Policies for Demo

  1. Security Changes
    - Add public read policies for users, goals, actions, and action_logs tables
    - This allows the demo admin dashboard to work without authentication
    - These policies allow SELECT operations for anonymous users

  Note: In production, these policies should be removed and proper authentication should be implemented.
*/

CREATE POLICY "Public can read users"
  ON users FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can read goals"
  ON goals FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can read actions"
  ON actions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can read action_logs"
  ON action_logs FOR SELECT
  TO anon
  USING (true);
