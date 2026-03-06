# 🎮 TypingQuest

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-success.svg)](https://vercel.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-3ECF8E.svg)](https://supabase.com/)

**Un juego de mecanografía bilingüe (Inglés/Español) moderno con rankings en tiempo real, dificultad progresiva y efectos visuales impresionantes.**

![TypingQuest Banner](./public/og-image.png)

---

## 🌟 Características Principales

### 🎯 Modo de Juego
- **4 Duraciones**: 30s (Sprint), 60s (Estándar), 90s (Resistencia), 120s (Maratón)
- **5 Niveles de Dificultad**: Desde palabras simples hasta párrafos complejos
- **2 Idiomas**: Inglés 🇬🇧 y Español 🇪🇸
- **Dificultad Progresiva**: Aumenta un 5% cada 5 palabras completadas

### 🏆 Sistema Competitivo
- **Rankings por Duración**: Compite en tu categoría
- **Score Estandarizado**: Fórmula justa que considera velocidad, precisión y errores
- **Actualizaciones en Tiempo Real**: Ve quién supera tu récord al instante
- **Mejores Marcas Personales**: Sigue tu progreso

### 🎨 Experiencia Visual
- **Confetti**: Celebra tus victorias con 150 partículas de colores
- **Animaciones de Error**: Shake y partículas rojas al fallar
- **Efectos de Completado**: Brillo y pop al terminar palabras
- **Partículas de Fondo**: Ambiente dinámico durante el juego

### 🔊 Sistema de Audio
- **Sonidos Dinámicos**: Generados con Audio API (sin archivos externos)
- **Feedback Auditivo**: Cada acción tiene su sonido
- **Controles Completos**: Volumen, mute, toggle
- **Persistencia**: Tu configuración se guarda

### 📊 Estadísticas y Progreso
- **WPM en Tiempo Real**: Palabras por minuto
- **Precisión**: Porcentaje de aciertos
- **Combos**: Construye rachas para bonus
- **Niveles de Dificultad**: 7 niveles desde Normal hasta Legendario

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ ([descargar](https://nodejs.org/))
- npm o yarn
- Cuenta de Supabase (gratuita)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/DonGeeo87/TypingQuest.git
cd TypingQuest
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

4. **Configurar base de datos**

Ejecuta las migraciones en el SQL Editor de Supabase:
- `supabase/001-initial-schema.sql`
- `supabase/002-add-time-based-fields.sql`

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

El juego estará disponible en `http://localhost:5173`

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite |
| **Estilos** | TailwindCSS |
| **Animaciones** | Framer Motion |
| **3D Effects** | Three.js + React Three Fiber |
| **Estado** | Zustand |
| **Backend** | Supabase (Auth, DB, Realtime) |
| **Audio** | Web Audio API |
| **Deploy** | Vercel |

---

## 🎮 Cómo Jugar

### 1. Registro (Primera Vez)
- Ingresa tu nombre de usuario (3-20 caracteres, alfanumérico)
- El sistema verifica disponibilidad automáticamente

### 2. Configuración
- **Selecciona Idioma**: 🇬🇧 Inglés o 🇪🇸 Español
- **Elige Nivel**:
  - Nivel 1: Palabras simples (3-5 letras)
  - Nivel 2: Palabras medias (6-8 letras)
  - Nivel 3: Frases cortas
  - Nivel 4: Frases largas
  - Nivel 5: Párrafos
- **Duración**: 30s, 60s, 90s o 120s

### 3. Juego
- Comienza a escribir para iniciar el temporizador
- Las letras correctas se marcan en **verde**
- Las incorrectas en **rojo** (sin reiniciar)
- Construye combos para aumentar tu score
- La dificultad aumenta cada 5 palabras

### 4. Resultados
- Al finalizar, ve tu WPM, precisión y score
- Compara tu posición en los rankings
- Intenta superar tu récord personal

---

## 📊 Sistema de Puntuación

### Score Estandarizado
```
score = (palabras_completadas × 100) + (WPM × precisión) - (errores × 10)
```

### Score Normalizado por Tiempo
```
normalized = (WPM × precisión/100) / (duración/60)
```

### Niveles de Dificultad
| Nivel | Multiplicador | Palabras Requeridas |
|-------|--------------|---------------------|
| Normal | 1.0x | 0-4 |
| Acelerado | 1.05x | 5-9 |
| Rápido | 1.10x | 10-14 |
| Veloz | 1.15x | 15-19 |
| Extremo | 1.20x | 20-24 |
| Imposible | 1.25x | 25-29 |
| Legendario | 1.30x+ | 30+ |

---

## 🗄️ Estructura de Base de Datos

### Tablas Principales

#### `profiles`
Información del usuario y estadísticas generales.

#### `game_results`
Resultados de cada partida con scores calculados.

#### `duration_rankings` (View)
Rankings separados por duración de juego.

#### `missions` y `user_missions`
Sistema de misiones diarias y permanentes.

#### `achievements` y `user_achievements`
Logros desbloqueables.

### Migraciones

Las migraciones están en la carpeta `supabase/`:
- `001-initial-schema.sql` - Esquema base
- `002-add-time-based-fields.sql` - Campos para sistema de tiempo

---

## 📱 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor en localhost:5173

# Producción
npm run build        # Compila para producción
npm run preview      # Vista previa del build

# Calidad de código
npm run lint         # Ejecuta ESLint
npm run type-check   # Verifica tipos TypeScript
```

---

## 🌐 Deploy en Vercel

### Opción 1: Deploy Automático

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno en Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Vercel detectará automáticamente que es un proyecto Vite

### Opción 2: CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Variables de Entorno en Vercel

Configura en tu dashboard de Vercel:
- `VITE_SUPABASE_URL`: URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY`: Anon key de Supabase

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Aquí hay algunas formas de contribuir:

1. **Reportar bugs**: Abre un issue describiendo el problema
2. **Sugerir características**: Propón nuevas ideas en Discussions
3. **Pull Requests**: 
   - Fork el repositorio
   - Crea una rama (`git checkout -b feature/AmazingFeature`)
   - Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
   - Push a la rama (`git push origin feature/AmazingFeature`)
   - Abre un Pull Request

### Guía de Desarrollo

```bash
# 1. Fork y clona
git clone https://github.com/DonGeeo87/TypingQuest.git
cd TypingQuest

# 2. Instala dependencias
npm install

# 3. Crea rama
git checkout -b feature/tu-feature

# 4. Desarrolla y prueba
npm run dev

# 5. Asegúrate que pasa lint
npm run lint

# 6. Commit y push
git commit -m "feat: descripción clara del cambio"
git push origin feature/tu-feature
```

---

## 📋 Roadmap

### ✅ Completado (v1.0.0)
- [x] Sistema de juego con temporizador
- [x] Rankings por duración
- [x] Dificultad progresiva
- [x] Sistema de sonidos
- [x] Animaciones y efectos
- [x] Registro de usuarios
- [x] Autenticación con Supabase

### 🚧 En Progreso
- [ ] Modo PvP en tiempo real
- [ ] Música de fondo
- [ ] Temas personalizables

### 📅 Planificado
- [ ] Modo offline (PWA)
- [ ] Temporadas y ligas mensuales
- [ ] Estadísticas avanzadas con gráficos
- [ ] Modo personalizado (crear ejercicios)
- [ ] Más idiomas (Francés, Alemán, Italiano)
- [ ] Sistema de logros expandido
- [ ] Modo práctica sin tiempo

---

## 📸 Capturas

### Pantalla Principal
![Home](./public/screenshots/home.png)

### Juego
![Game](./public/screenshots/game.png)

### Rankings
![Rankings](./public/screenshots/rankings.png)

### Perfil
![Profile](./public/screenshots/profile.png)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- [Supabase](https://supabase.com/) por la base de datos en tiempo real
- [Vercel](https://vercel.com/) por el hosting
- [React](https://reactjs.org/) por el framework
- [TailwindCSS](https://tailwindcss.com/) por los estilos
- [Framer Motion](https://www.framer.com/motion/) por las animaciones

---

## 📞 Contacto

- **Repositorio**: [github.com/DonGeeo87/TypingQuest](https://github.com/DonGeeo87/TypingQuest)
- **Demo**: [typing-quest-ochre.vercel.app](https://typing-quest-ochre.vercel.app) 🚀

---

**Hecho con ❤️ por el equipo de TypingQuest**

![TypingQuest](./public/typingquest-logo.png)
