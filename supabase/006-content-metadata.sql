alter table public.game_results
  add column if not exists content_seed bigint,
  add column if not exists content_pool text,
  add column if not exists content_version text,
  add column if not exists content_key text;

create index if not exists game_results_content_key_idx
  on public.game_results (content_key);

alter table public.mp_rounds
  add column if not exists content_seed bigint,
  add column if not exists content_pool text,
  add column if not exists content_version text,
  add column if not exists content_key text;

create index if not exists mp_rounds_content_key_idx
  on public.mp_rounds (content_key);

