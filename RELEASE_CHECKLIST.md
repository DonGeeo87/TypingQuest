# TypingQuest v1.0 - Release Checklist

## Definition of Done (DoD)

### Scope Freeze
- ✅ Sistema de juego core (timers, WPM, accuracy, combos)
- ✅ Rankings por duración (30s, 60s, 90s, 120s)
- ✅ Dificultad progresiva (7 niveles)
- ✅ Sistema de audio (5 sonidos + música de fondo)
- ✅ Animaciones y efectos visuales (confetti, shake, partículas)
- ✅ Registro de usuarios y autenticación
- ✅ Modo offline (fallback localStorage)
- ✅ Modo Maestro (clases, asignaciones, CSV)
- ✅ Multijugador (salas, rondas)
- ✅ Modo TapTap
- ✅ Sistema de Campañas (MVP)
- ✅ 9 categorías de aprendizaje
- ✅ i18n ES/EN completo

### Excluido de v1.0
- ⏸️ Guilds y clanes
- ⏸️ Torneos con brackets
- ⏸️ Sistema de amigos
- ⏸️ Tutorial interactivo
- ⏸️ Sistema de logros expandido
- ⏸️ Temporadas y ligas mensuales
- ⏸️ Modo PWA offline
- ⏸️ Más idiomas (FR, DE, IT)
- ⏸️ Temas personalizables
- ⏸️ Modo práctica sin tiempo
- ⏸️ Analíticas avanzadas
- ⏸️ Battle Pass

---

## Platform Targets

| Platform | Browser | Min Version |
|----------|---------|-------------|
| Desktop | Chrome | 90+ |
| Desktop | Edge | 90+ |
| Mobile | Chrome (Android) | 90+ |
| Mobile | Safari (iOS) | 14+ |

---

## Bug Thresholds

| Priority | Max Open |
|----------|----------|
| P0 (Critical) | 0 |
| P1 (High) | ≤ 3 |
| P2 (Medium) | ≤ 10 |
| P3 (Low) | Sin límite |

---

## Performance Budgets

| Metric | Target |
|--------|--------|
| Bundle Size (gzipped) | < 600 KB |
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.0s |
| Lighthouse Score | ≥ 80 |

---

## Security Requirements

- [x] RLS policies en todas las tablas
- [x] Validación server-side de resultados
- [x] Rate limiting (implementado en Supabase)
- [x] No exposición de claves en frontend

---

## Accessibility

- [ ] Contraste mínimo WCAG AA
- [ ] Soporte para teclado
- [ ] screen reader labels
- [ ] No depende de color únicamente

---

## Pre-Release Checklist

### Build & Deploy
- [ ] `npm run build` exitoso sin errores
- [ ] `npm run lint` sin errores
- [ ] `npm run type-check` sin errores
- [ ] Tests pasan (`npm run test`)
- [ ] Build desplegado en Vercel

### Database
- [ ] Migraciones aplicadas en producción
- [ ] RLS policies activas
- [ ] Datos de seed cargados (palabras, categorías)

### Features
- [ ] Registro/Login funciona
- [ ] Juego completo (30s, 60s, 90s, 120s)
- [ ] Rankings muestran datos
- [ ] Modo offline funciona
- [ ] Modo Maestro accesible
- [ ] Multijugador funcional
- [ ] TapTap funcional
- [ ] Campaign carga stages

### QA Manual

#### Happy Paths
- [ ] Usuario puede registrarse
- [ ] Usuario puede jugar 30s/60s/90s/120s
- [ ] Usuario ve su posición en rankings
- [ ] Sonidos reproducen correctamente
- [ ] Tema claro/oscuro funciona

#### Edge Cases
- [ ] Usuario sin conexión puede jugar offline
- [ ] Supabase fuera de línea muestra datos locales
- [ ] Texto muy largo no rompe UI
- [ ] Teclado virtual funciona en móvil

---

## Release Steps

1. **Tag release:**
   ```bash
   git tag -a v1.2.0 -m "Release v1.2.0"
   git push origin v1.2.0
   ```

2. **Deploy (Vercel):**
   - Trigger automatic deploy from tag
   - Verify production URL works

3. **Smoke Test:**
   - [ ] Home screen loads
   - [ ] Can start a game
   - [ ] Rankings load
   - [ ] Profile accessible

4. **Post-Release:**
   - Monitor error logs (24h)
   - Monitor performance metrics
   - Announce on social media
   - Update changelog

---

## Rollback Plan

Si hay errores críticos en producción:
1. Revertir commit/tag
2. Vercel hace redeploy automático
3. Si es base de datos: restaurar backup

---

## Contacts

| Role | Name |
|------|------|
| Lead Dev | DonGeeo87 |
| Backend | Supabase |
| Deploy | Vercel |

---

*Last updated: 2026-03-27*
