# 🚀 Guía de Deploy en Vercel

## Opción 1: Deploy Automático desde GitHub (Recomendado)

### Pasos:

1. **Ve a [Vercel](https://vercel.com) e inicia sesión**
   - Puedes usar tu cuenta de GitHub

2. **Importa tu repositorio**
   - Click en "Add New Project"
   - Selecciona "Import Git Repository"
   - Busca `DonGeeo87/TypingQuest`
   - Click en "Import"

3. **Configura el proyecto**
   - **Framework Preset**: Vite (Vercel lo detecta automáticamente)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Agrega las Variables de Entorno**
   
   En la sección "Environment Variables", agrega:
   
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   # Alternativa recomendada (si tu Supabase la provee):
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

5. **Click en "Deploy"**
   - Vercel construirá y desplegará automáticamente
   - El deploy tomará aproximadamente 1-2 minutos

6. **Configura el dominio (opcional)**
   - Ve a "Settings" > "Domains"
   - Agrega tu dominio personalizado si tienes uno

---

## Opción 2: Deploy con Vercel CLI

### Prerrequisitos
- Tener Vercel CLI instalado: `npm i -g vercel`
- Tener cuenta de Vercel

### Pasos:

1. **Login en Vercel**
```bash
vercel login
```

2. **Deploy de prueba (preview)**
```bash
vercel
```

3. **Deploy a producción**
```bash
vercel --prod
```

4. **Configura las variables de entorno**
   
   Crea un archivo `.vercel.env` o configúralas en el dashboard:
   
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

---

## Configuración de Variables de Entorno

### En Vercel Dashboard:

1. Ve a tu proyecto en Vercel
2. Click en "Settings"
3. Selecciona "Environment Variables"
4. Agrega las siguientes variables:

| Variable | Valor | Environment |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key-here` | Production, Preview, Development |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` | Production, Preview, Development |
| `VITE_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Production, Preview, Development |
| `VITE_PLAUSIBLE_DOMAIN` | `yourdomain.com` | Production, Preview, Development |
| `VITE_SITE_URL` | `https://tu-dominio-vercel.vercel.app` (sin barra final) | Production (recomendado); ver abajo |

5. Click en "Save"

### Supabase — enlaces de correo (magic link / verificar email)

Si el botón del correo abre `localhost` o falla el redirect:

1. En [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication** → **URL Configuration**:
   - **Site URL**: usa tu URL pública de producción (ej. `https://typing-quest-ochre.vercel.app`), no solo `http://localhost:5173`.
   - **Redirect URLs**: añade la misma URL y variaciones que uses, por ejemplo:
     - `http://localhost:5173/**` (solo para desarrollo local)
     - `https://typing-quest-ochre.vercel.app/**`
     - `https://*.vercel.app/**` (opcional, para previews de Vercel)

2. En Vercel, define **`VITE_SITE_URL`** igual a tu URL de producción canónica. La app la usa como `emailRedirectTo` para que el enlace del correo siempre vuelva al sitio correcto aunque el flujo se haya probado desde otro entorno.

3. Para **texto y diseño del correo** (asunto, HTML, marca TypingQuest): **Authentication → Email Templates** en Supabase. Guía con variables y ejemplo: `docs/auth-email-templates.md`.

---

## Post-Deploy

### 1. Verifica el Build
- Ve a la pestaña "Deployments" en Vercel
- Asegúrate que el build fue exitoso
- Click en el deployment para ver los logs

### 2. Prueba la Aplicación
- Abre la URL proporcionada por Vercel
- Registra un nombre de usuario
- Prueba todas las funcionalidades

### 3. Configura Dominio Personalizado (Opcional)
- Ve a "Settings" > "Domains"
- Agrega tu dominio
- Configura los DNS records según las instrucciones de Vercel

### 4. Monitoreo
- Revisa los logs en "Deployment" > "View Logs"
- Usa Vercel Analytics para métricas de uso

---

## Actualizaciones Futuras

### Deploy Automático
Cada push a la rama `master` desplegará automáticamente:

```bash
# Hacer cambios
git add .
git commit -m "feat: nueva característica"
git push origin master
```

Vercel detectará el cambio y desplegará automáticamente.

### Deploy Manual
```bash
vercel --prod
```

---

## Solución de Problemas

### Error: "Environment variables not found"
- Asegúrate de agregar las variables en Vercel Dashboard
- Las variables deben estar en mayúsculas y con el prefijo `VITE_`
- Reinicia el deployment después de agregar variables

### Error: "Build failed"
- Revisa los logs en Vercel Dashboard
- Ejecuta `npm run build` localmente para verificar
- Asegúrate de que no haya errores de TypeScript

### Error: "Supabase connection failed"
- Verifica que las credenciales de Supabase sean correctas
- Asegúrate de que las migraciones SQL estén ejecutadas
- Revisa las RLS policies en Supabase

---

## Enlaces Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Vite en Vercel](https://vercel.com/guides/deploying-vite-with-vercel)
- [Supabase + Vercel](https://supabase.com/docs/guides/getting-started/quickstarts/vercel)

---

## URLs

- **Repositorio**: https://github.com/DonGeeo87/TypingQuest
- **Demo**: (Tu URL de Vercel aquí)
- **Supabase Dashboard**: https://supabase.com/dashboard/project/cqpqbwptqfvyqhpulrcx

---

**¡Listo! Tu aplicación está en producción 🎉**
