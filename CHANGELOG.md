# 🎮 TypingQuest - Changelog

Todos los cambios notables en este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.1.0] - 2026-03-07 - Sistema de Usuarios Locales y Optimización de Rendimiento

### 🚀 Características Agregadas

#### Sistema de Usuarios Locales (Fallback)
- 🔄 **Fallback automático** cuando Supabase Auth falla (error 500)
- 💾 **Almacenamiento en localStorage** para perfiles de usuarios locales
- 🎮 **IDs locales** con formato `local_xxxxxxxx` usando crypto.randomUUID()
- 📦 **Persistencia de juegos** en localStorage para usuarios locales
- 🏆 **Rankings híbridos** que combinan juegos locales y de Supabase

#### Cerrar Sesión Mejorado
- 🚪 **Modal de confirmación personalizado** con UI arcade
- 🧹 **Limpieza completa** de localStorage y sessionStorage
- 🔄 **Redirección automática** a pantalla de registro después de cerrar sesión
- 🎨 **Animaciones suaves** con Framer Motion

### 🐛 Correcciones de Bugs

#### Rendimiento del Juego
- ⚡ **Optimización de DynamicBackground**:
  - Reducido de 40 a 25 partículas
  - Matrix rain se actualiza cada 2 frames (antes cada frame)
  - Uso de refs para evitar re-renders innecesarios
  - Efectos de brillo con cap máximo para reducir carga GPU
- 🎯 **Optimización de GameScreen**:
  - WPM/accuracy se actualiza cada 1000ms (antes 500ms)
  - Combo Indicator solo muestra en múltiplos de 5
  - Eliminadas dependencias innecesarias en useEffects
- 📉 **Reducción significativa de latencia** en rachas altas (combo 50+)

#### Cálculo de WPM
- 🔧 **Corregido WPM = 0** al finalizar el juego
- 📊 **Cálculo en tiempo real** usando totalCorrectChars
- ⏱️ **Mantiene WPM final** después de que el juego termina

#### Ranking
- 🏆 **Ranking funciona con usuarios locales**
- 📈 **getDurationRanking()** combina juegos locales y de Supabase
- 🎯 **getPersonalBests()** calcula desde localStorage
- 📊 **getUserDurationRank()** calcula ranking comparando juegos locales
- ✅ **checkNewPersonalRecord()** verifica récords en localStorage

### 🔧 Cambios Técnicos

#### Nuevas Funciones en supabaseService.ts
- `saveGameResult()` - Soporte para usuarios locales
- `getUserGameResults()` - Obtiene juegos de localStorage
- `getPersonalBests()` - Soporte para usuarios locales + helper function
- `getUserDurationRank()` - Soporte para usuarios locales
- `getDurationRanking()` - Combina datos locales y Supabase
- `checkNewPersonalRecord()` - Soporte para usuarios locales
- `checkUsernameAvailable()` - Verifica usernames en localStorage
- `hasUsername()` - Verifica usernames en localStorage
- `getProfile()` - Soporte para usuarios locales
- `updateProfile()` - Guarda en localStorage para usuarios locales
- `signOut()` - Limpia sessionStorage

#### Actualización de Componentes
- `GameScreen.tsx` - Usa getCurrentUser(), optimizaciones de rendimiento
- `ProfileScreen.tsx` - Modal de confirmación personalizado, signOut mejorado
- `RankingScreen.tsx` - Usa getCurrentUser() en lugar de supabase.auth.getUser()
- `DynamicBackground.tsx` - Optimizado para mejor rendimiento
- `App.tsx` - Limpieza de logs de debug

#### Actualización de Librerías
- `supabase.ts` - signInAnonymously() con fallback local, getCurrentUser() con sessionStorage
- `authStore.ts` - signOut() limpia localStorage y sessionStorage

### 📊 Mejoras de Rendimiento

#### DynamicBackground
- 📉 **37.5% menos partículas** (40 → 25)
- ⚡ **50% menos actualizaciones** de Matrix rain (cada 2 frames)
- 🎯 **Uso de refs** para evitar re-renders del canvas
- 🔒 **Cap en efectos** de brillo para reducir carga GPU

#### GameScreen
- 📊 **WPM calculation**: 1000ms en lugar de 500ms
- 🎯 **Combo display**: Solo en múltiplos de 5 (5, 10, 15...)
- 🧹 **Limpieza de dependencias** en useEffects

### 🔄 Flujo de Usuario Mejorado

#### Primer Uso
1. ✅ Usuario se crea automáticamente (Supabase o local)
2. 📝 Pantalla de registro de apodo y avatar
3. 🎮 Puede jugar inmediatamente

#### Cerrar Sesión
1. 🚪 Click en "END SESSION"
2. ✅ Confirmación con modal personalizado
3. 🧹 Limpieza de localStorage + sessionStorage
4. 🔄 Recarga de página
5. 📝 Redirección a pantalla de registro

#### Rankings
1. 🏆 Muestra juegos locales cuando Supabase falla
2. 📊 Combina juegos locales y de Supabase cuando ambos están disponibles
3. 🎯 Cálculo de récords personales funciona offline

### 📝 Notas Técnicas

#### Usuarios Locales
- Los usuarios locales usan el prefijo `local_` en sus IDs
- Los datos se guardan en localStorage con las claves:
  - `typingquest-local-userid` - ID del usuario actual
  - `typingquest-local-profile-{userId}` - Perfil del usuario
  - `typingquest-local-games-{userId}` - Juegos del usuario

#### Supabase Auth Error 500
- El sistema detecta automáticamente cuando Supabase Auth falla
- Genera un ID local y continúa la ejecución
- Los juegos se guardan en localStorage
- Cuando Supabase funciona, los datos se sincronizan

### 🎨 UI/UX

#### Modal de Cerrar Sesión
- 🎮 Diseño arcade con estilo cyberpunk
- 🎨 Animaciones de entrada/salida suaves
- 📱 Responsive y centrado en pantalla
- 🔴 Botón "YES, RESET" con estilo de peligro

---

## [1.0.1] - 2026-03-07

### 🐛 Correcciones de Bugs

#### Interfaz y Experiencia de Usuario (UI/UX)
- 🛠️ **ErrorShake Fix**: Corregido bug donde la frase de escritura no era visible al inicio del juego. El componente ahora renderiza correctamente a sus hijos incluso cuando no hay errores activos.
- ⌨️ **Visibilidad del Texto**: Se aseguró que el usuario pueda ver la frase objetivo desde el primer momento en `GameScreen`.

---

## [1.0.0] - 2026-03-06

### ✨ Características Agregadas

#### Sistema de Juego
- 🎯 **Selector de tiempo de juego**: 30s (Sprint), 60s (Estándar), 90s (Resistencia), 120s (Maratón)
- ⏱️ **Cuenta regresiva en tiempo real** con display visual
- 🔴 **Advertencia de tiempo**: El tiempo parpadea en rojo cuando quedan menos de 10 segundos
- 🎮 **Game Over automático** cuando el tiempo llega a 0
- 📊 **Progreso de palabras**: Muestra palabras completadas (X / Y)
- ❌ **Removido reinicio por error**: Los errores ya no reinician el juego, solo resetean el combo

#### Registro de Usuario
- 📝 **Pantalla de registro de nombre de usuario** con validación en tiempo real
- ✅ **Verificación de disponibilidad** consultando a Supabase
- 🔒 **Reglas de validación**: 3-20 caracteres, alfanumérico con guiones bajos
- 🎨 **Indicadores visuales** de estado (válido, disponible, error)

#### Animaciones y Efectos Visuales
- 🎊 **Confetti**: 150 partículas de colores al completar el juego exitosamente
- 📳 **Error Shake**: Vibración del área de typing al cometer error
- 💥 **Error Particles**: Explosión de 20 partículas rojas al fallar
- ✨ **Text Complete**: Efecto de brillo/pop al completar una palabra
- 🌟 **Partículas de fondo** animadas durante el juego

#### Sistema de Sonidos
- 🔊 **Sonidos generados con Audio API** (sin archivos externos)
- ⌨️ **Key Sound**: Click suave al presionar tecla correcta
- ❌ **Error Sound**: Buzz grave al cometer error
- ✅ **Complete Sound**: Ding brillante al completar palabra
- 🏆 **Victory Sound**: Fanfarria al terminar el juego
- ⏰ **Time Warning**: Beep de advertencia cuando queda poco tiempo
- 🎛️ **Controles de audio**: Toggle, volumen, mute con persistencia en localStorage

#### Rankings y Competencia
- 🏆 **Rankings separados por duración** para comparación justa
- 📈 **Score estandarizado**: `(words × 100) + (WPM × accuracy) - (errors × 10)`
- 🎯 **Score normalizado por tiempo** para rankings justos
- 👑 **Mejor tiempo personal** destacado con corona
- ⚡ **Actualizaciones en tiempo real** con Supabase Realtime
- 🔔 **Notificaciones** cuando alguien supera tu récord

#### Dificultad Progresiva
- 📊 **7 niveles de dificultad**: Normal → Acelerado → Rápido → Veloz → Extremo → Imposible → Legendario
- 📈 **Aumento del 5%** en velocidad requerida cada 5 palabras
- 🎯 **Indicador visual** de nivel de dificultad actual
- 📊 **Barra de progreso** hacia el siguiente nivel
- 🎉 **Notificación de "Level Up"** al alcanzar nuevo nivel

### 🗄️ Base de Datos (Supabase)

#### Nuevas Tablas
- `duration_rankings` - Vista para rankings por categoría de duración
- Funciones SQL para cálculo automático de scores

#### Nuevas Columnas en `game_results`
- `game_duration` - Duración seleccionada del juego (30, 60, 90, 120 segundos)
- `standardized_score` - Score estandarizado calculado
- `time_normalized_score` - Score normalizado por tiempo
- `words_completed` - Cantidad de palabras completadas

#### Nuevas Funciones SQL
- `calculate_game_score()` - Calcula score estandarizado
- `calculate_time_normalized_score()` - Calcula score normalizado por tiempo
- `auto_calculate_game_scores()` - Trigger para cálculo automático

#### Nuevas Misiones
- Sprinter: Completa una partida de 30 segundos
- Maratonista: Completa una partida de 120 segundos
- Preciso: Consigue 95% de precisión en 60 segundos
- Velocista: Alcanza 50 WPM en 30 segundos
- Resistente: Completa 5 partidas de 90+ segundos

### 🔧 Cambios Técnicos

#### Nuevos Componentes
- `RegistrationScreen.tsx` - Pantalla de registro de usuario
- `TimeSelector.tsx` - Selector de duración del juego
- `Confetti.tsx` - Efecto de confetti
- `ErrorShake.tsx` - Animación de shake
- `ErrorParticles.tsx` - Partículas de error
- `TextComplete.tsx` - Efecto de texto completado
- `AudioToggle.tsx` - Control de audio
- `RecordNotification.tsx` - Notificaciones de récords

#### Nuevos Hooks
- `useSound.ts` - Hook para reproducción de sonidos

#### Nuevos Stores
- `authStore.ts` - Store de autenticación con persistencia
- `audioStore.ts` - Store de configuración de audio

#### Nuevas Utilidades
- `difficultyScaler.ts` - Sistema de dificultad progresiva

#### Servicios Actualizados
- `supabaseService.ts` - Funciones para rankings por duración, récords personales, suscripciones realtime

### 📦 Dependencias Agregadas
- Todas las dependencias principales ya estaban instaladas en v1.0.0

### 🐛 Correcciones de Bugs
- Corregido problema de reinicio automático al cometer errores
- Corregido problema de finalización de juego cuando se completaba el texto
- Mejorada la precisión del cálculo de WPM en tiempo real

### 📝 Documentación
- README.md actualizado con nuevas características
- CHANGELOG.md inicial
- Migraciones de base de datos documentadas
- Comentarios en código para funciones complejas

---

## [0.1.0] - 2026-03-05

### ✨ Características Iniciales

#### Sistema de Juego Base
- 🎮 Juego de mecanografía bilingüe (Inglés/Español)
- 🌐 Selector de idioma
- 🎯 5 niveles de dificultad (palabras simples → párrafos)
- ⚡ Cálculo de WPM y precisión en tiempo real
- 🔥 Sistema de combos
- 📊 Estadísticas del juego

#### Base de Datos
- 👤 Perfiles de usuario
- 📊 Resultados de partidas
- 🏆 Rankings globales
- ⚔️ Tablas para PvP (futuro)
- 📋 Sistema de misiones
- 🏅 Sistema de logros

#### Interfaz
- 🎨 Diseño moderno con TailwindCSS
- ✨ Animaciones con Framer Motion
- 🌊 Efectos con Three.js
- 📱 Diseño responsive

#### Autenticación
- 🔐 Autenticación anónima con Supabase
- 💾 Persistencia de sesión

### 🗄️ Esquema de Base de Datos Inicial
- `profiles` - Perfiles de usuario
- `game_results` - Resultados de partidas
- `pvp_matches` - Partidas PvP
- `missions` - Misiones disponibles
- `user_missions` - Progreso de misiones
- `achievements` - Logros
- `user_achievements` - Logros desbloqueados

### 🛠️ Stack Tecnológico
- React 19 + TypeScript + Vite
- TailwindCSS para estilos
- Framer Motion para animaciones
- Three.js + React Three Fiber para efectos 3D
- Zustand para manejo de estado
- Supabase para backend

---

## Futuro (Próximas Versiones)

### Planificado
- ⚔️ **Modo PvP en tiempo real** - Desafiar a otros jugadores
- 🎵 **Música de fondo** - Opcional
- 🎨 **Temas personalizables** - Cambiar colores de la UI
- 📱 **Modo offline** - Jugar sin conexión
- 🏅 **Temporadas y ligas** - Competencia mensual
- 📊 **Estadísticas avanzadas** - Gráficos y análisis
- 🎯 **Modo personalizado** - Crear tus propios ejercicios
- 🌍 **Más idiomas** - Francés, Alemán, Italiano, etc.
- 🎮 **Logros Steam-like** - Sistema de achievements expandido
- 📱 **PWA** - Instalar como app nativa

---

## [1.0.0] - Initial Release - 2026-03-06

**Desarrollado con ❤️ por el equipo de TypingQuest**

[1.0.0]: https://github.com/DonGeeo87/TypingQuest/releases/tag/v1.0.0
[0.1.0]: https://github.com/DonGeeo87/TypingQuest/releases/tag/v0.1.0
