# 🎮 TypingQuest - Changelog

Todos los cambios notables en este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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
