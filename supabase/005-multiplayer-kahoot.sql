-- ============================================
-- MULTIPLAYER (KAHOOT-LIKE) MVP
-- ============================================

CREATE TABLE IF NOT EXISTS public.mp_rooms (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  pin TEXT UNIQUE NOT NULL,
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'lobby' CHECK (status IN ('lobby', 'running', 'finished')),
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'es')),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 5),
  round_duration INTEGER NOT NULL DEFAULT 60 CHECK (round_duration IN (30, 60, 90, 120)),
  current_round INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_mp_rooms_pin ON public.mp_rooms(pin);
CREATE INDEX IF NOT EXISTS idx_mp_rooms_status ON public.mp_rooms(status);

CREATE TABLE IF NOT EXISTS public.mp_room_players (
  room_id UUID NOT NULL REFERENCES public.mp_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  is_host BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_mp_room_players_room ON public.mp_room_players(room_id);

CREATE TABLE IF NOT EXISTS public.mp_rounds (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.mp_rooms(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 60 CHECK (duration_seconds IN (30, 60, 90, 120)),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'running', 'finished')),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (room_id, round_number)
);

CREATE INDEX IF NOT EXISTS idx_mp_rounds_room ON public.mp_rounds(room_id, round_number);

CREATE TABLE IF NOT EXISTS public.mp_submissions (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.mp_rooms(id) ON DELETE CASCADE,
  round_id UUID NOT NULL REFERENCES public.mp_rounds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  wpm INTEGER NOT NULL,
  accuracy NUMERIC NOT NULL,
  errors INTEGER NOT NULL DEFAULT 0,
  words_completed INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (round_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_mp_submissions_round ON public.mp_submissions(round_id);

ALTER TABLE public.mp_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mp_room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mp_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mp_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view rooms" ON public.mp_rooms;
CREATE POLICY "Anyone can view rooms"
  ON public.mp_rooms FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Host can create rooms" ON public.mp_rooms;
CREATE POLICY "Host can create rooms"
  ON public.mp_rooms FOR INSERT
  WITH CHECK (auth.uid() = host_id);

DROP POLICY IF EXISTS "Host can update rooms" ON public.mp_rooms;
CREATE POLICY "Host can update rooms"
  ON public.mp_rooms FOR UPDATE
  USING (auth.uid() = host_id);

DROP POLICY IF EXISTS "Anyone can view room players" ON public.mp_room_players;
CREATE POLICY "Anyone can view room players"
  ON public.mp_room_players FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Players can join lobby" ON public.mp_room_players;
CREATE POLICY "Players can join lobby"
  ON public.mp_room_players FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.mp_rooms r
      WHERE r.id = room_id AND r.status = 'lobby'
    )
  );

DROP POLICY IF EXISTS "Players can update their presence" ON public.mp_room_players;
CREATE POLICY "Players can update their presence"
  ON public.mp_room_players FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Players can leave room" ON public.mp_room_players;
CREATE POLICY "Players can leave room"
  ON public.mp_room_players FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view rounds" ON public.mp_rounds;
CREATE POLICY "Anyone can view rounds"
  ON public.mp_rounds FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Host can manage rounds" ON public.mp_rounds;
CREATE POLICY "Host can manage rounds"
  ON public.mp_rounds FOR ALL
  USING (EXISTS (SELECT 1 FROM public.mp_rooms r WHERE r.id = room_id AND r.host_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.mp_rooms r WHERE r.id = room_id AND r.host_id = auth.uid()));

DROP POLICY IF EXISTS "Players can view submissions in their rooms" ON public.mp_submissions;
CREATE POLICY "Players can view submissions in their rooms"
  ON public.mp_submissions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.mp_room_players p WHERE p.room_id = room_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "Players can submit results" ON public.mp_submissions;
CREATE POLICY "Players can submit results"
  ON public.mp_submissions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.mp_room_players p WHERE p.room_id = room_id AND p.user_id = user_id)
  );

GRANT SELECT ON public.mp_rooms TO anon, authenticated;
GRANT SELECT ON public.mp_room_players TO anon, authenticated;
GRANT SELECT ON public.mp_rounds TO anon, authenticated;
GRANT SELECT ON public.mp_submissions TO authenticated;
