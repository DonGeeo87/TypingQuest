-- ============================================
-- SECURITY HARDENING
-- ============================================

-- Harden SECURITY DEFINER function by fixing search_path
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', LEFT(NEW.id::text, 8))),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Enable RLS for catalog tables and allow public read only
DO $$
BEGIN
  IF to_regclass('public.missions') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS \"Anyone can view missions\" ON public.missions';
    EXECUTE 'CREATE POLICY \"Anyone can view missions\" ON public.missions FOR SELECT USING (TRUE)';
  END IF;

  IF to_regclass('public.achievements') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS \"Anyone can view achievements\" ON public.achievements';
    EXECUTE 'CREATE POLICY \"Anyone can view achievements\" ON public.achievements FOR SELECT USING (TRUE)';
  END IF;
END;
$$;

-- Prevent clients from directly updating stat fields on profiles
CREATE OR REPLACE FUNCTION protect_profile_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
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

DROP TRIGGER IF EXISTS protect_profile_stats_trigger ON public.profiles;
CREATE TRIGGER protect_profile_stats_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_profile_stats();
