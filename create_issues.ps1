# Script para crear todos los issues del Roadmap v2.0

$repo = "DonGeeo87/TypingQuest"

# GAMEPLAY - Crítico
Write-Host "📌 Creating Gameplay Issues..." -ForegroundColor Cyan

gh issue create --repo $repo --title "[EPIC] Campaign: Story + 30 Levels" --body "Implementar sistema de campaña con 30 niveles, story de 5 actos y 3 boss battles.`n`n14 story points / 1.5 semanas`nPrioridad: CRÍTICA"

gh issue create --repo $repo --title "[Game Mode] Sprint Challenge (30s/60s Accelerated)" --body "Alternative game mode con tiempos cortos y velocidad incrementada.`n`n3 story points`nPrioridad: CRÍTICA"

gh issue create --repo $repo --title "[Game Mode] Survival Mode (Indefinite, +5% speed)" --body "Modo survival con velocidad aumentada cada 10 palabras. Encuentra tu límite.`n`n3 story points`nPrioridad: CRÍTICA"

gh issue create --repo $repo --title "[Game Mode] Time Attack (2 min unlimited words)" --body "Modo time attack: 2 minutos, palabras ilimitadas, máximo WPM.`n`n2 story points`nPrioridad: ALTA"

gh issue create --repo $repo --title "[Game Mode] Pattern Matching Mini-Game" --body "Nuevo mini-juego: emparejar patrones visuales de tipeo vs forma.`n`n3 story points`nPrioridad: ALTA"

gh issue create --repo $repo --title "[Feature] Integrate TapTap Game into Main Flow" --body "Conectar TapTap game al flujo principal, hacerlo accesible desde menu.`n`n2 story points`nPrioridad: MEDIA"

# REWARDS - Crítico
Write-Host "🏆 Creating Rewards Issues..." -ForegroundColor Yellow

gh issue create --repo $repo --title "[EPIC] Achievement/Badge System (20+ badges)" --body "Sistema completo de achievements con UI, unlock animations, storage en Supabase.`n`n5 story points / 1 semana`nPrioridad: CRÍTICA`n`nBadges: First 100 points, 10 combo streak, 1000 WPM, categories master, etc."

gh issue create --repo $repo --title "[Feature] Daily Challenges (3 rotating daily)" --body "Sistema de daily challenges: 3 desafíos rotados diariamente con rewards.`n`n3 story points`nPrioridad: CRÍTICA"

gh issue create --repo $repo --title "[Feature] Weekly Quests (5 progressive missions)" --body "Weekly missions con progresión: complete 5 to unlock bonus rewards.`n`n3 story points`nPrioridad: ALTA"

gh issue create --repo $repo --title "[Feature] Loot System (Cosmetics, XP, Coins)" --body "Random loot drops after games: cosmetics, battle pass XP, coins.`n`n3 story points`nPrioridad: ALTA"

gh issue create --repo $repo --title "[Feature] Battle Pass System" --body "Basic + Premium tiers. 50 levels, seasonal cosmetics, XP progression.`n`n5 story points / 1.5 semanas`nPrioridad: ALTA"

# SOCIAL - Muy Importante
Write-Host "👥 Creating Social Issues..." -ForegroundColor Green

gh issue create --repo $repo --title "[EPIC] Guild/Clan System" --body "Crear, managear, competir en ClGuilds: leaderboard, chat, perks, badges.`n`n11 story points / 1.5 semanas`nPrioridad: ALTA"

gh issue create --repo $repo --title "[Feature] Skill-Based Matchmaking (Glicko-2)" --body "Implementar Glicko-2 rating system para fair multiplayer pairing.`n`n5 story points`nPrioridad: ALTA"

gh issue create --repo $repo --title "[Feature] Tournament System with Brackets" --body "Create tournaments: scheduling, bracket management, leaderboards temporales.`n`n5 story points`nPrioridad: ALTA"

gh issue create --repo $repo --title "[Feature] Friend System (Add/Block/Feed)" --body "Add friends, block players, activity feed, friend challenges.`n`n7 story points / 1 semana`nPrioridad: ALTA"

gh issue create --repo $repo --title "[Feature] Regional Leaderboards (By Country)" --body "Leaderboards segmentados por región/país + worldwide.`n`n2 story points`nPrioridad: MEDIA"

gh issue create --repo $repo --title "[Feature] Friend Leaderboards & Comparisons" --body "Ver rankings solo de amigos, comparativas head-to-head vs friends.`n`n2 story points`nPrioridad: MEDIA"

gh issue create --repo $repo --title "[Feature] Seasonal Leaderboards (Weekly/Monthly)" --body "Rotating leaderboards: Weekly, Monthly, All-Time.`n`n2 story points`nPrioridad: MEDIA"

# ANALYTICS - Engagement
Write-Host "📊 Creating Analytics Issues..." -ForegroundColor Magenta

gh issue create --repo $repo --title "[Feature] Progress Charts (WPM Over Time)" --body "Visualizar progreso: gráfica de WPM, accuracy, combo streaks over time.`n`n2 story points`nPrioridad: MEDIA"

gh issue create --repo $repo --title "[Feature] Error Heatmap Analysis" --body "Identificar qué caracteres/palabras tienen más errores. Heatmap visual + stats.`n`n3 story points`nPrioridad: MEDIA"

gh issue create --repo $repo --title "[EPIC] Replay System (Record & Share)" --body "Grabar replays de partidas, reproducir con scrubbing, compartir público/privado.`n`n10 story points / 1.5 semanas`nPrioridad: MEDIA"

gh issue create --repo $repo --title "[Feature] Deep Accuracy Breakdown (By Category)" --body "Estadísticas de accuracy desglosadas por categoría de palabras.`n`n2 story points`nPrioridad: MEDIA"

# POLISH - Presentación
Write-Host "🎨 Creating Polish Issues..." -ForegroundColor Blue

gh issue create --repo $repo --title "[EPIC] Interactive Tutorial & Onboarding" --body "Complete interactive tutorial: 3 steps, drag-and-drop, contextual tooltips.`n`n10 story points / 1.5 semanas`nPrioridad: ALTA"

gh issue create --repo $repo --title "[Feature] Achievement Cinematics" --body "Animaciones visuales cuando se desbloquea un achievement.`n`n2 story points`nPrioridad: MEDIA"

gh issue create --repo $repo --title "[Feature] Menu Transitions & Cinematics" --body "Transiciones cinematográficas entre pantallas principales.`n`n2 story points`nPrioridad: MEDIA"

gh issue create --repo $repo --title "[Feature] 10+ Avatar Skins" --body "Crear 10+ avatars diferentes (profesiones, animales, estilos).`n`n2 story points`nPrioridad: MEDIA"

gh issue create --repo $repo --title "[Feature] Theme Variations (5+ UI Themes)" --body "5+ temas visuales: dark, light, neon, retro, cyberpunk.`n`n2 story points`nPrioridad: MEDIA"

gh issue create --repo $repo --title "[Feature] Particle Effects Pack" --body "Nuevos efectos: explosiones, trails, sparkles para rewards/achievements.`n`n3 story points`nPrioridad: MEDIA"

gh issue create --repo $repo --title "[Feature] Cinematographic Main Menu" --body "Animated main menu intro, better UX, hero video background.`n`n4 story points`nPrioridad: MEDIA"

# INFRASTRUCTURE
Write-Host "🔧 Creating Infrastructure Issues..." -ForegroundColor Red

gh issue create --repo $repo --title "[Backend] Analytics Event Tracking System" --body "Rastrear eventos: login, game_start, achievement_unlocked, etc.`n`nDb schema para análisis de funnel y churn.`n`n7 story points / 1 semana`nPrioridad: MEDIA"

gh issue create --repo $repo --title "[Feature] Push Notifications" --body "Notificaciones push: achievements, friends online, events.`n`n3 story points`nPrioridad: MEDIA"

gh issue create --repo $repo --title "[Feature] Service Worker & Offline Play" --body "Offline gameplay mode, sync cuando vuelva conexión.`n`n5 story points`nPrioridad: MEDIA"

gh issue create --repo $repo --title "[Auth] Discord OAuth Login" --body "Integrar Discord OAuth para login social.`n`n2 story points`nPrioridad: BAJA"

gh issue create --repo $repo --title "[Auth] Google OAuth Login" --body "Integrar Google OAuth para login social.`n`n1 pt`nPrioridad: BAJA"

# MONETIZATION
Write-Host "💰 Creating Monetization Issues..." -ForegroundColor Cyan

gh issue create --repo $repo --title "[Feature] Cosmetics Shop (Stripe Integration)" --body "Shop UI, payment processing, inventory system.`n`n8 story points / 1 semana`nPrioridad: BAJA`nFase 2"

gh issue create --repo $repo --title "[Feature] Reward Ads (Watch & Earn)" --body "Mirar anuncio → +100 coins. Optional, revenue-friendly.`n`n2 story points`nPrioridad: BAJA`nFase 2"

Write-Host "`n✅ ¡Todos los issues creados!" -ForegroundColor Green
Write-Host "Abre: https://github.com/DonGeeo87/TypingQuest/issues" -ForegroundColor Yellow
