-- TypingQuest Database Schema
-- Created: 2026-03-06

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Table of user profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  total_games INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  best_wpm INTEGER DEFAULT 0,
  best_accuracy DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table of game results
CREATE TABLE game_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  language TEXT CHECK (language IN ('en', 'es')) NOT NULL,
  level INTEGER CHECK (level BETWEEN 1 AND 5) NOT NULL,
  wpm INTEGER NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  errors INTEGER DEFAULT 0,
  combo_max INTEGER DEFAULT 0,
  duration INTEGER NOT NULL, -- seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for PvP matches (real-time)
CREATE TABLE pvp_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  player2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  winner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  player1_wpm INTEGER,
  player2_wpm INTEGER,
  player1_accuracy DECIMAL(5,2),
  player2_accuracy DECIMAL(5,2),
  status TEXT CHECK (status IN ('waiting', 'playing', 'finished')) DEFAULT 'waiting',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE
);

-- Table of missions/quests
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- 'wpm_goal', 'accuracy_goal', 'games_played', 'words_typed', 'combo_reached'
  target_value INTEGER NOT NULL,
  reward INTEGER NOT NULL, -- experience points
  is_daily BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table of user mission progress
CREATE TABLE user_missions (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  claimed BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, mission_id)
);

-- Table for achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  category TEXT NOT NULL, -- 'speed', 'accuracy', 'streak', 'games', 'language'
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table of user achievements
CREATE TABLE user_achievements (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Indexes for rankings
CREATE INDEX idx_game_results_wpm ON game_results(wpm DESC);
CREATE INDEX idx_game_results_language_level ON game_results(language, level);
CREATE INDEX idx_game_results_user ON game_results(user_id);
CREATE INDEX idx_game_results_created_at ON game_results(created_at DESC);

-- Indexes for PvP
CREATE INDEX idx_pvp_matches_status ON pvp_matches(status);
CREATE INDEX idx_pvp_matches_player1 ON pvp_matches(player1_id);
CREATE INDEX idx_pvp_matches_player2 ON pvp_matches(player2_id);

-- Indexes for profiles
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_total_wins ON profiles(total_wins DESC);
CREATE INDEX idx_profiles_best_wpm ON profiles(best_wpm DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE pvp_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Game results policies
CREATE POLICY "Anyone can view game results"
  ON game_results FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can insert their own game results"
  ON game_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- PvP matches policies
CREATE POLICY "Players can view their matches"
  ON pvp_matches FOR SELECT
  USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE POLICY "Players can update their matches"
  ON pvp_matches FOR UPDATE
  USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE POLICY "Users can create matches"
  ON pvp_matches FOR INSERT
  WITH CHECK (auth.uid() = player1_id);

-- User missions policies
CREATE POLICY "Users can view their missions"
  ON user_missions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their missions"
  ON user_missions FOR UPDATE
  USING (auth.uid() = user_id);

-- User achievements policies
CREATE POLICY "Users can view their achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update profile timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', LEFT(NEW.id::text, 8))),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_on_signup();

-- ============================================
-- VIEWS FOR RANKINGS
-- ============================================

-- Global WPM ranking
CREATE VIEW global_wpm_ranking AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  MAX(gr.wpm) as best_wpm,
  COUNT(gr.id) as total_games,
  ROUND(AVG(gr.wpm), 2) as avg_wpm
FROM profiles p
LEFT JOIN game_results gr ON p.id = gr.user_id
GROUP BY p.id, p.username, p.avatar_url
ORDER BY best_wpm DESC;

-- Ranking by language and level
CREATE VIEW language_level_ranking AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  gr.language,
  gr.level,
  MAX(gr.wpm) as best_wpm,
  ROUND(AVG(gr.accuracy), 2) as avg_accuracy,
  COUNT(gr.id) as games_played
FROM profiles p
JOIN game_results gr ON p.id = gr.user_id
GROUP BY p.id, p.username, p.avatar_url, gr.language, gr.level
ORDER BY gr.language, gr.level, best_wpm DESC;

-- ============================================
-- SEED DATA - MISSIONS
-- ============================================

INSERT INTO missions (title, description, type, target_value, reward, is_daily) VALUES
  ('Primeros Pasos', 'Completa tu primera partida', 'games_played', 1, 50, false),
  ('Velocidad Inicial', 'Alcanza 30 WPM en cualquier nivel', 'wpm_goal', 30, 75, false),
  ('Precisión Perfecta', 'Consigue 95% de precisión en una partida', 'accuracy_goal', 95, 100, false),
  ('Racha de 10', 'Consigue un combo máximo de 10', 'combo_reached', 10, 60, false),
  ('Palabras Rápidas', 'Escribe 100 palabras en total', 'words_typed', 100, 80, false),
  ('Maestro del Inglés', 'Completa 10 partidas en inglés', 'games_played_language', 10, 150, false),
  ('Maestro del Español', 'Completa 10 partidas en español', 'games_played_language', 10, 150, false),
  ('Velocidad Media', 'Alcanza 50 WPM en nivel 3', 'wpm_goal_level', 50, 200, false),
  ('Velocidad Alta', 'Alcanza 70 WPM en nivel 5', 'wpm_goal_level', 70, 300, false),
  ('Precisión Máxima', 'Consigue 100% de precisión', 'accuracy_goal', 100, 250, false);

-- ============================================
-- SEED DATA - ACHIEVEMENTS
-- ============================================

INSERT INTO achievements (title, description, icon_url, category, requirement_type, requirement_value) VALUES
  ('Principiante', 'Completa tu primera partida', NULL, 'games', 'games_played', 1),
  ('Velocista', 'Alcanza 40 WPM', NULL, 'speed', 'wpm_reached', 40),
  ('Rayo', 'Alcanza 60 WPM', NULL, 'speed', 'wpm_reached', 60),
  ('Supersónico', 'Alcanza 80 WPM', NULL, 'speed', 'wpm_reached', 80),
  ('Preciso', 'Consigue 90% de precisión', NULL, 'accuracy', 'accuracy_reached', 90),
  ('Perfecto', 'Consigue 100% de precisión', NULL, 'accuracy', 'accuracy_reached', 100),
  ('Racha de Fuego', 'Consigue un combo de 25', NULL, 'streak', 'combo_reached', 25),
  ('Racha Imparable', 'Consigue un combo de 50', NULL, 'streak', 'combo_reached', 50),
  ('Bilingüe', 'Completa partidas en ambos idiomas', NULL, 'language', 'languages_completed', 2),
  ('Veterano', 'Juega 100 partidas', NULL, 'games', 'games_played', 100);
