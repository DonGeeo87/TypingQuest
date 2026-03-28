-- Migration 012: Stage leaderboard RPC function
-- Created: 2026-03-28
-- Purpose: Stub for campaign stage leaderboard RPC called by campaignService.ts

CREATE OR REPLACE FUNCTION get_stage_leaderboard(
  p_stage_id UUID,
  p_limit INT DEFAULT 10
)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  wpm BIGINT,
  accuracy NUMERIC,
  stars BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    csa.user_id,
    COALESCE(p.username, 'Anonymous')::TEXT,
    (csa.wpm)::BIGINT,
    (csa.accuracy)::NUMERIC,
    (csa.stars_earned)::BIGINT
  FROM campaign_stage_attempts csa
  LEFT JOIN profiles p ON p.id = csa.user_id
  WHERE csa.stage_id = p_stage_id
    AND csa.stars_earned > 0
  ORDER BY csa.stars_earned DESC, csa.wpm DESC
  LIMIT p_limit;
END;
$$;
