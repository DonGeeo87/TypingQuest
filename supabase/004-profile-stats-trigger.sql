-- ============================================
-- PROFILE STATS FROM GAME RESULTS
-- ============================================

-- Allow controlled updates to profile stats from internal triggers
CREATE OR REPLACE FUNCTION protect_profile_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF current_setting('typingquest.allow_profile_stats_update', true) = '1' THEN
    RETURN NEW;
  END IF;

  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF auth.uid() = NEW.id THEN
    IF NEW.total_games IS DISTINCT FROM OLD.total_games
      OR NEW.total_wins IS DISTINCT FROM OLD.total_wins
      OR NEW.best_wpm IS DISTINCT FROM OLD.best_wpm
      OR NEW.best_accuracy IS DISTINCT FROM OLD.best_accuracy
    THEN
      RAISE EXCEPTION 'Cannot update profile stats directly';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_profile_stats_from_game_result()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  PERFORM set_config('typingquest.allow_profile_stats_update', '1', true);

  UPDATE public.profiles
  SET
    total_games = COALESCE(total_games, 0) + 1,
    best_wpm = GREATEST(COALESCE(best_wpm, 0), COALESCE(NEW.wpm, 0)),
    best_accuracy = GREATEST(COALESCE(best_accuracy, 0), COALESCE(NEW.accuracy, 0)),
    updated_at = now()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_profile_stats_from_game_results ON public.game_results;
CREATE TRIGGER update_profile_stats_from_game_results
  AFTER INSERT ON public.game_results
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_stats_from_game_result();
