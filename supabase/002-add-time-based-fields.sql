-- TypingQuest Database Schema - Update
-- Created: 2026-03-06
-- Update: Add new fields for time-based gameplay

-- ============================================
-- ALTER TABLES - ADD NEW COLUMNS
-- ============================================

-- Add new columns to game_results for time-based gameplay
ALTER TABLE game_results 
ADD COLUMN IF NOT EXISTS game_duration INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS standardized_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS time_normalized_score DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS words_completed INTEGER DEFAULT 0;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_game_results_duration ON game_results(game_duration);
CREATE INDEX IF NOT EXISTS idx_game_results_standardized_score ON game_results(standardized_score DESC);
CREATE INDEX IF NOT EXISTS idx_game_results_time_normalized ON game_results(time_normalized_score DESC);

-- ============================================
-- UPDATE VIEWS FOR TIME-BASED RANKINGS
-- ============================================

-- Drop and recreate global ranking with standardized score
DROP VIEW IF EXISTS global_wpm_ranking CASCADE;

CREATE VIEW global_wpm_ranking AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  MAX(gr.standardized_score) as best_score,
  MAX(gr.wpm) as best_wpm,
  COUNT(gr.id) as total_games,
  ROUND(AVG(gr.wpm), 2) as avg_wpm,
  ROUND(AVG(gr.accuracy), 2) as avg_accuracy
FROM profiles p
LEFT JOIN game_results gr ON p.id = gr.user_id
GROUP BY p.id, p.username, p.avatar_url
ORDER BY best_score DESC;

-- Create view for duration-based rankings
CREATE OR REPLACE VIEW duration_rankings AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  gr.game_duration,
  MAX(gr.standardized_score) as best_score,
  MAX(gr.time_normalized_score) as best_normalized_score,
  MAX(gr.wpm) as best_wpm,
  ROUND(AVG(gr.accuracy), 2) as avg_accuracy,
  COUNT(gr.id) as games_played
FROM profiles p
JOIN game_results gr ON p.id = gr.user_id
WHERE gr.game_duration IS NOT NULL
GROUP BY p.id, p.username, p.avatar_url, gr.game_duration
ORDER BY gr.game_duration, best_score DESC;

-- ============================================
-- FUNCTION TO UPDATE SCORES
-- ============================================

-- Function to calculate and update standardized score
CREATE OR REPLACE FUNCTION calculate_game_score(
  p_words_completed INTEGER,
  p_wpm INTEGER,
  p_accuracy DECIMAL,
  p_errors INTEGER
) RETURNS INTEGER AS $$
BEGIN
  RETURN (p_words_completed * 100) + (p_wpm * p_accuracy) - (p_errors * 10);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate time-normalized score
CREATE OR REPLACE FUNCTION calculate_time_normalized_score(
  p_wpm INTEGER,
  p_accuracy DECIMAL,
  p_duration_seconds INTEGER
) RETURNS DECIMAL AS $$
BEGIN
  IF p_duration_seconds <= 0 THEN
    RETURN 0;
  END IF;
  RETURN (p_wpm * (p_accuracy / 100.0)) / (p_duration_seconds / 60.0);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-calculate scores on insert
CREATE OR REPLACE FUNCTION auto_calculate_game_scores()
RETURNS TRIGGER AS $$
BEGIN
  NEW.standardized_score := calculate_game_score(
    NEW.words_completed,
    NEW.wpm,
    NEW.accuracy,
    NEW.errors
  );
  NEW.time_normalized_score := calculate_time_normalized_score(
    NEW.wpm,
    NEW.accuracy,
    NEW.game_duration
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calculate_game_scores_trigger ON game_results;
CREATE TRIGGER calculate_game_scores_trigger
  BEFORE INSERT OR UPDATE ON game_results
  FOR EACH ROW
  EXECUTE FUNCTION auto_calculate_game_scores();

-- ============================================
-- UPDATE EXISTING RECORDS
-- ============================================

-- Update existing records with calculated scores
UPDATE game_results
SET 
  standardized_score = calculate_game_score(words_completed, wpm, accuracy, errors),
  time_normalized_score = calculate_time_normalized_score(wpm, accuracy, COALESCE(game_duration, 60)),
  game_duration = COALESCE(game_duration, 60),
  words_completed = COALESCE(words_completed, 0)
WHERE standardized_score IS NULL OR time_normalized_score IS NULL;

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for game_results
ALTER PUBLICATION supabase_realtime ADD TABLE game_results;

-- ============================================
-- SEED DATA - UPDATE MISSIONS
-- ============================================

-- Add new missions for time-based gameplay
INSERT INTO missions (title, description, type, target_value, reward, is_daily) VALUES
  ('Sprinter', 'Completa una partida de 30 segundos', 'game_duration', 30, 50, false),
  ('Maratonista', 'Completa una partida de 120 segundos', 'game_duration', 120, 100, false),
  ('Preciso', 'Consigue 95% de precisión en 60 segundos', 'accuracy_duration', 95, 150, false),
  ('Velocista', 'Alcanza 50 WPM en 30 segundos', 'wpm_duration', 50, 120, false),
  ('Resistente', 'Completa 5 partidas de 90+ segundos', 'games_duration_long', 5, 200, false);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Add policies for new views
CREATE POLICY "Anyone can view duration rankings"
  ON duration_rankings FOR SELECT
  USING (TRUE);
