/*
  # Fix RLS Performance Issues and Remove Unused Index

  1. Security Improvements
    - Replace auth.uid() with (select auth.uid()) in all RLS policies for better performance
    - This prevents re-evaluation of auth functions for each row
    - Maintains the same security guarantees with optimized query execution

  2. Index Cleanup
    - Remove unused idx_generated_content_created_at index
    - Reduces storage and maintenance overhead

  3. Tables Modified
    - `user_profiles` - 3 policies updated
    - `generated_content` - 3 policies updated
*/

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view own content" ON generated_content;
DROP POLICY IF EXISTS "Users can insert own content" ON generated_content;
DROP POLICY IF EXISTS "Users can delete own content" ON generated_content;

CREATE POLICY "Users can view own content"
  ON generated_content FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own content"
  ON generated_content FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own content"
  ON generated_content FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP INDEX IF EXISTS idx_generated_content_created_at;