# Teacher Mode (Modo Profesor) — Guía de uso

## Requisitos previos

- Proyecto desplegado con Supabase configurado:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY` o `VITE_SUPABASE_PUBLISHABLE_KEY`
- Usuario con sesión online (no modo local/offline).
- Migraciones aplicadas en Supabase: `008-teacher-mode.sql` y `010-teacher-mode-fixes.sql`.

## ¿Qué es Teacher Mode?

Teacher Mode permite a profes crear clases y desafíos cortos para que los estudiantes practiquen mecanografía. Los estudiantes se unen con un código y los intentos quedan registrados para revisión y exportación.

## Flujo recomendado (5 pasos)

1. **Crear clase**
   - Ve a “Profesor” y crea una clase.
   - Se genera un **código** para compartir.
2. **Unir estudiantes**
   - Los estudiantes ingresan el código en “Unirse a clase”.
3. **Crear asignación (lección personalizada)**
   - Define **título**, **idioma**, **nivel** y **duración**.
4. **Ejecutar**
   - Los estudiantes juegan la asignación (sesiones de 30–120s funcionan muy bien).
5. **Revisar y exportar**
   - En “Ver” puedes revisar intentos y **exportar CSV**.

## Funcionalidades disponibles

- **Clases con código**: crea clases y comparte el código de ingreso.
- **Miembros**: lista de estudiantes en la clase.
- **Asignaciones**:
  - idioma (EN / ES latam)
  - nivel (1–5)
  - duración (segundos)
  - título/descripción (para contextualizar la lección)
- **Reportes**:
  - listado de intentos por asignación
  - exportación CSV

## Resolución de problemas comunes

- **“Necesitas iniciar sesión para crear/unirte a una clase”**
  - Estás en modo local/offline o sin variables de Supabase. Configura Supabase y vuelve a iniciar sesión.
- **No aparecen tus clases en “Mis clases”**
  - Verifica que tu usuario esté autenticado y que las migraciones estén aplicadas.
- **“No autorizado / row-level security”**
  - Revisa que la sesión esté activa y que el usuario sea el profesor de la clase o miembro.

## Buenas prácticas en sala

- Calentamiento rápido: 60s, nivel 1–2.
- Desafío semanal: 90s, nivel 3.
- Enfocar “precisión primero” en cursos iniciales.

