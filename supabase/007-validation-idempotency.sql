alter table public.game_results
  add column if not exists client_result_id uuid,
  add column if not exists validated boolean not null default true,
  add column if not exists validation_reason text;

create unique index if not exists game_results_user_client_uidx
  on public.game_results (user_id, client_result_id)
  where client_result_id is not null;

alter table public.mp_submissions
  add column if not exists validated boolean not null default true,
  add column if not exists validation_reason text;

create or replace function public.validate_game_result()
returns trigger
language plpgsql
as $$
begin
  if new.wpm < 0 or new.wpm > 320 then
    new.validated := false;
    new.validation_reason := 'wpm_out_of_range';
    return new;
  end if;

  if new.accuracy < 0 or new.accuracy > 100 then
    new.validated := false;
    new.validation_reason := 'accuracy_out_of_range';
    return new;
  end if;

  if new.errors < 0 or new.errors > 2000 then
    new.validated := false;
    new.validation_reason := 'errors_out_of_range';
    return new;
  end if;

  if new.duration < 5 or new.duration > 600 then
    new.validated := false;
    new.validation_reason := 'duration_out_of_range';
    return new;
  end if;

  if new.words_completed is not null and new.words_completed < 0 then
    new.validated := false;
    new.validation_reason := 'words_completed_out_of_range';
    return new;
  end if;

  new.validated := true;
  new.validation_reason := null;
  return new;
end;
$$;

drop trigger if exists trg_validate_game_result on public.game_results;
create trigger trg_validate_game_result
before insert or update on public.game_results
for each row
execute function public.validate_game_result();

create or replace function public.validate_mp_submission()
returns trigger
language plpgsql
as $$
begin
  if new.wpm < 0 or new.wpm > 320 then
    new.validated := false;
    new.validation_reason := 'wpm_out_of_range';
    return new;
  end if;

  if new.accuracy < 0 or new.accuracy > 100 then
    new.validated := false;
    new.validation_reason := 'accuracy_out_of_range';
    return new;
  end if;

  if new.errors < 0 or new.errors > 2000 then
    new.validated := false;
    new.validation_reason := 'errors_out_of_range';
    return new;
  end if;

  if new.words_completed < 0 then
    new.validated := false;
    new.validation_reason := 'words_completed_out_of_range';
    return new;
  end if;

  new.validated := true;
  new.validation_reason := null;
  return new;
end;
$$;

drop trigger if exists trg_validate_mp_submission on public.mp_submissions;
create trigger trg_validate_mp_submission
before insert or update on public.mp_submissions
for each row
execute function public.validate_mp_submission();

