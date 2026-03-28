# 📋 TypingQuest v2.0-v3.0: Proyecto de Issues

**Status**: 🟢 LISTO PARA IMPLEMENTAR  
**Total Issues**: 35  
**Total Story Points**: ~140 puntos  
**Tiempo Estimado**: 14 semanas

---

## 📌 Issues por Crear (Copiar-Paste a GitHub)

### 🎮 GAMEPLAY CRÍTICO (7 issues)

#### 1. [EPIC] Campaign: Story + 30 Levels
```
Implementar sistema de campaña con:
- 5-act story structure 
- 30 niveles progresivos
- 3 boss battles especiales
- Difficulty scaling automático (+5% cada 5 palabras)
- Campaign selection UI

Estimación: 14 story points / 1.5 semanas
Prioridad: CRÍTICA ✅
Epic: True
```

#### 2. [Game Mode] Sprint Challenge (30-60s acelerado)
```
Game mode alternativo de corta duración:
- 30s o 60s con velocidad +50%
- Leaderboard separado
- Perfect para warmups

Estimación: 3 story points
Prioridad: CRÍTICA ✅
Epic: False
Depends on: Campaign
```

#### 3. [Game Mode] Survival Mode (+5% velocidad progresiva)
```
Modo indefinido donde velocidad sube cada 10 palabras:
- Comienza en velocidad normal
- +5% speed cada 10 palabras completadas
- Encuentra tu máximo

Estimación: 3 story points
Prioridad: CRÍTICA ✅
```

#### 4. [Game Mode] Time Attack (2 min ilimitado)
```
Desafío de precisión en tiempo limitado:
- 2 minutos fijos
- Palabras ilimitadas
- Focus en WPM máximo

Estimación: 2 story points
Prioridad: ALTA
```

#### 5. [Game Mode] Pattern Matching Mini-Game
```
Minijuego visual nuevo:
- Emparejar visual patterns
- Velocidad-based rewards
- 10% de variedad al juego

Estimación: 3 story points
Prioridad: ALTA
```

#### 6. [Feature] Integrar TapTap al flujo principal
```
Conectar TapTap game existing:
- Accessible desde main menu
- Linked to achievements
- Cross-mode progression

Estimación: 2 story points
Prioridad: MEDIA
```

---

### 🏆 REWARDS & PROGRESSION (5 issues - CRÍTICO)

#### 7. [EPIC] Achievement/Badge System (20+ badges)
```
Sistema completo de achievements:

Badges a crear:
✓ First 100 Points
✓ Combo 10 Streak
✓ 1000 WPM First Time
✓ Category Master (Each)
✓ Weekly Champion
✓ Friend Surpassed
✓ Perfect Game (100% accuracy)
✓ Speed Demon (200+ WPM)
✓ Consistency King (10 games 95%+ acc)
✓ Daily Warrior (7 days straight)
+ 10 más temáticos

Technical:
- Unlock triggers en game core
- Unlock animations + sounds
- Badge storage en Supabase
- Display en profile

Estimación: 5 story points / 1 semana
Prioridad: CRÍTICA ✅
Epic: True
```

#### 8. [Feature] Daily Challenges (3 rotativas/día)
```
Sistema de desafíos diarios:
- 3 desafíos que rotan cada día
- Ejemplos: "1000 palavras", "10 combo streak", "95% accuracy"
- Rewards: coins, XP, cosmetics
- Tracked in profile

Estimación: 3 story points
Prioridad: CRÍTICA ✅
```

#### 9. [Feature] Weekly Quests (5 misiones progresivas)
```
Misiones semanales con progresión:
- Quest 1: Play 5 games
- Quest 2: 1000 total words
- Quest 3: 10 achievements
- Quest 4: 5000 points
- Quest 5: Beat personal best

Reward: Unlock weekly cosmetic/badge

Estimación: 3 story points
Prioridad: ALTA
```

#### 10. [Feature] Loot System (Cosmetics + Resources)
```
Random loot después de cada game:
- 80% coins
- 15% cosmetics
- 5% rare items/effects

Rarity tiers: Common, Uncommon, Rare, Epic, Legendary

Estimación: 3 story points
Prioridad: ALTA
```

#### 11. [Feature] Battle Pass System
```
Seasonal progression system:

Features:
- 50 tiers (take 4-6 weeks to complete)
- Free track (20 cosmetics/rewards)
- Premium track (30 additional rewards)
- Monthly reset
- Cost: 9.99 USD or 1000 coins equivalent

Estimación: 5 story points / 1.5 semanas
Prioridad: ALTA
```

---

### 👥 SOCIAL & COMPETITION (7 issues - MUY IMPORTANTE)

#### 12. [EPIC] Guild/Clan System
```
Sistema de equipos competitivos:

Features:
- Create guild (50 coins)
- Join guild (invite code)
- Guild roles (Leader, Officer, Member)
- Guild leaderboard (team points)
- Guild chat (basic text messages)
- Guild perks (1% XP boost, daily gift box)
- Guild badges/trophies

UI:
- Guild management panel
- Guild info page
- Guild activity feed

Estimación: 11 story points / 1.5 semanas
Prioridad: ALTA
Epic: True
```

#### 13. [Feature] Skill-based Matchmaking (Glicko-2 Rating)
```
Fair player pairing para multiplayer:
- Implement Glicko-2 rating system
- Track rating changes per match
- Match players ±200 rating points
- Uncertainty decay over time

Database: rating, RD (rating deviation), volatility

Estimación: 5 story points
Prioridad: ALTA
```

#### 14. [Feature] Tournament System with Brackets
```
Crear y participar en torneos:
- Single/Double elimination brackets
- 8/16/32 player tournaments
- Weekly auto-scheduled tournaments
- Leaderboard temporal
- Prize pool distribution

Estimación: 5 story points
Prioridad: ALTA
```

#### 15. [Feature] Friend System (Add/Block/Feed)
```
Gestión de amigos:
- Add friend
- Block player
- Activity feed (friends' sessions, achievements)
- Friend challenges (1v1 multiplayer)
- Unblock option

UI:
- Friends list + stats
- Recent players
- Friend activity timeline

Estimación: 7 story points / 1 semana
Prioridad: ALTA
```

#### 16. [Feature] Regional Leaderboards
```
Leaderboards segmentados:
- Worldwide (existing)
- By Country
- By Region
- Language-specific (EN, ES, etc)

Storage: Efficient geo-tagging en Supabase

Estimación: 2 story points
Prioridad: MEDIA
```

#### 17. [Feature] Friend Leaderboards & Comparisons
```
Ver y comparer con amigos:
- Friends-only rankings
- Head-to-head stats (vs specific friend)
- "I'm winning by X points" badges
- Weekly friend rivalry tracking

Estimación: 2 story points
Prioridad: MEDIA
```

#### 18. [Feature] Seasonal Leaderboards
```
Rotating time-based rankings:
- Weekly reset board
- Monthly board
- All-time preserved

Archive old seasons for viewing

Estimación: 2 story points
Prioridad: MEDIA
```

---

### 📊 ANALYTICS & ANALYTICS (4 issues)

#### 19. [Feature] Progress Charts (WPM Over Time)
```
Visualizar progreso personal:
- Line chart: WPM over last 30 days
- Accuracy trend
- Combo streak records
- Category breakdown

Chart library: recharts o Chart.js

Estimación: 2 story points
Prioridad: MEDIA
```

#### 20. [Feature] Error Heatmap Analysis
```
Identificar debilidades:
- Heatmap: qué caracteres fallan más
- Frecuencia de errores por palabra
- Sugerencias: "Practice 'ñ' more"
- Statistics: errores totales, tasa de error

Estimación: 3 story points
Prioridad: MEDIA
```

#### 21. [EPIC] Replay System (Record & Share)
```
Ver y compartir partidas:

Features:
- Record keystrokes + timing
- Playback video-like con scrubbing
- Speed control (0.5x, 1x, 2x)
- Share link: public or private
- Community replay feed

Technical:
- Store replay binary en Supabase Storage
- Compress replay data
- Playback reconstruction

Estimación: 10 story points / 1.5 semanas
Prioridad: MEDIA
Epic: True
```

#### 22. [Feature] Comparison Stats (vs Friends)
```
Estadísticas comparativas:
- Best WPM vs friend best WPM
- Accuracy comparison
- Streak comparison
- "You're 50 WPM ahead"
- Historical trends comparison

Estimación: 2 story points
Prioridad: MEDIA
```

---

### 🎨 PRESENTACIÓN & POLISH (7 issues)

#### 23. [EPIC] Interactive Tutorial & Onboarding
```
Mejorar experiencia de nuevos usuarios:

Tutorial flow:
1. Welcome cutscene
2. First typing (guided)
3. Combo mechanic
4. Category selection
5. First match

Features:
- Tooltips contextuales
- Hand-holding UI
- Skip option (para vets)
- Reward: 100 coins + badge

Estimación: 10 story points / 1.5 semanas
Prioridad: ALTA
Epic: True
```

#### 24. [Feature] Achievement Unlock Animations
```
Celebrar achievements visualmente:
- Screen glow effect
- Particle explosion
- Sound effect
- Badge animation
- Confetti (existing, reuse)

Estimación: 2 story points
Prioridad: MEDIA
```

#### 25. [Feature] Screen Transition Cinematics
```
Animaciones entre pantallas principales:
- Main menu ↔ Game
- Game ↔ Results
- Menu ↔ Profile
- Smooth fade/slide transitions

Use Framer Motion existing motion library

Estimación: 2 story points
Prioridad: MEDIA
```

#### 26. [Feature] 10+ Avatar Skins
```
Personajes diferentes para jugar:
- Basic avatars (10)
- Possible additions: professions, animals, emojis
- Display en game, leaderboards, profile

Estimación: 2 story points
Prioridad: MEDIA
```

#### 27. [Feature] Theme Variations (5+ UI Themes)
```
Cambiar visual del juego:
Themes:
- Dark (default)
- Light
- Neon Purple
- Retro 80s
- Cyberpunk
- Nature Green

Implementar via CSS variables

Estimación: 2 story points
Prioridad: MEDIA
```

#### 28. [Feature] Particle Effects Pack
```
Nuevos efectos visuales:
- Achievement unlock particles
- Combo milestone explosions
- Record break sparkles
- Trail effects
- Better death/error particles

Estimación: 3 story points
Prioridad: MEDIA
```

#### 29. [Feature] Cinematographic Main Menu
```
Mejorar landing experience:
- Animated background (matrix-like, but better)
- Hero video or looping animation
- Better CTA placement
- Stats showcase (live leaderboard updates)
- Music/ambience

Estimación: 4 story points
Prioridad: MEDIA
```

---

### 🔧 INFRAESTRUCTURA TÉCNICA (5 issues)

#### 30. [Backend] Analytics Event Tracking System
```
Rastrear comportamiento de usuarios:

Events to track:
- user_login
- game_start
- game_complete
- achievement_unlock
- purchase_cosmetic
- join_guild
- etc. (25+ event types)

Schema:
- event_type
- user_id
- timestamp
- metadata (JSON)

Features:
- Funnel analysis
- Churn detection
- Retention cohorts
- Power user identification

Estimación: 7 story points / 1 semana
Prioridad: MEDIA
```

#### 31. [Feature] Push Notifications
```
En-game y browser notifications:
- Achievement unlocked
- Friend came online
- Event starting soon
- Daily challenge ready
- Guild message received

Using: Firebase Cloud Messaging or similar

Estimación: 3 story points
Prioridad: MEDIA
```

#### 32. [Feature] Service Worker & Offline Mode
```
Jugar sin conexión internet:
- Service Worker caches game assets
- Offline gameplay (limited)
- Automatic sync cuando vuelve conexión
- Conflict resolution (si jugó offline y online)

Estimación: 5 story points
Prioridad: MEDIA
```

#### 33. [Auth] Discord OAuth Login
```
Social login con Discord:
- Implement OAuth flow
- Link Discord account to TypingQuest profile
- Auto-import Discord username + avatar option
- Disconnect option

Estimación: 2 story points
Prioridad: BAJA
```

#### 34. [Auth] Google OAuth Login
```
Social login con Google:
- Implement OAuth flow
- Link Google account
- Auto-import Google profile info

Estimación: 1 pt
Prioridad: BAJA
```

---

### 💰 MONETIZACIÓN (Fase 2)

#### 35. [Feature] Cosmetics Shop
```
Tienda en-game para comprar skins/cosmetics:
- Shop UI (grid, filters, search)
- Featured section
- Payment integration (Stripe)
- Inventory management
- Currency: real money + coins

Estimación: 8 story points / 1 semana
Prioridad: BAJA (Fase 2)
```

#### 36. [Feature] Reward Ads (Watch & Earn)
```
Opcional ad-watching para rewards:
- Watch 30s ad → +100 coins
- 3 max per day
- Optional feature (não force)
- Revenue sharing opportunity

Estimación: 2 story points
Prioridad: BAJA (Fase 2)
```

---

## 🎯 Sumario Ejecutivo

| Categoría | Issues | Story Points | Estim. Tiempo | Prioridad |
|-----------|--------|--------------|----------------|-----------|
| 🎮 Gameplay | 7 | 26 | 2.5 sem | **CRÍTICA** |
| 🏆 Rewards | 5 | 19 | 2 sem | **CRÍTICA** |
| 👥 Social | 7 | 37 | 3 sem | **ALTA** |
| 📊 Analytics | 4 | 17 | 2 sem | **MEDIA** |
| 🎨 Polish | 7 | 29 | 2.5 sem | **MEDIA** |
| 🔧 Infraestructura | 5 | 23 | 2 sem | **MEDIA** |
| 💰 Monetización | 3 | 11 | 1.5 sem | **BAJA** |
| **TOTAL** | **38** | **162** | **~15 sem** | - |

---

## 🚀 Sprint Planning Recomendado

### Fase 1: MVP (Semanas 1-8) - Target: 85/100
```
Sprint 1-2: Campaign + Game Modes (Gameplay)
Sprint 3-4: Achievements + Daily Challenges (Rewards)
Sprint 5-6: Social + Friend System (Social)
Sprint 7-8: Stats + Replay (Analytics)
```

### Fase 2: Polish (Semanas 9-12) - Target: 90/100
```
Sprint 9: Tutorial + Cinematics
Sprint 10: Themes + Skins
Sprint 11: Infrastructure + Analytics Backend
Sprint 12: Guilds + Tournaments
```

### Fase 3: Monetización (Semanas 13-15) - Target: 95/100
```
Sprint 13: Shop + OAuth
Sprint 14-15: Optimization + QA
```

---

## 📝 Próximos Pasos

1. ✅ Copiar este documento en `/ROADMAP_v2.md`
2. 📋 Crear issues en GitHub (manualmente o vía CSV import)
3. 🎯 Assign issues a developers
4. 📊 Track progress en GitHub Projects
5. 🚀 Comienza Sprint 1 Week 1

---

**Last Updated**: 2026-03-27  
**Status**: 🟢 READY FOR DEVELOPMENT  
**Next Meeting**: Sprint Planning (when ready)
