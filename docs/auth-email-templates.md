# Personalizar correos de Supabase Auth (TypingQuest)

El contenido HTML de los mensajes lo define **Supabase**, no el front. Lo editas en el panel del proyecto.

**Ruta:** [Dashboard](https://supabase.com/dashboard) → tu proyecto → **Authentication** → **Email Templates**.

## Plantillas útiles para esta app

| Plantilla | Uso en TypingQuest |
|-----------|-------------------|
| **Magic Link** | Inicio de sesión por enlace (`signInWithOtp`) |
| **Confirm signup** | Alta por OTP / confirmar email |
| **Change Email Address** | Cambio de email (`updateUser`) |
| **Reset password** | Si más adelante usas recuperación por contraseña |

## Variables que puedes usar (Go templates)

Supabase documenta variables como `{{ .ConfirmationURL }}`, `{{ .Token }}`, `{{ .TokenHash }}`, `{{ .SiteURL }}`, `{{ .Email }}`, `{{ .Data }}`, `{{ .RedirectTo }}` según la plantilla. Revisa la documentación actual en [Supabase — Auth Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates).

Enlaces de confirmación deben seguir usando **`{{ .ConfirmationURL }}`** (o el campo equivalente que muestre el editor) para que el flujo de verificación no se rompa.

## Marca y tono (ejemplo mínimo)

Sustituye el cuerpo por algo alineado a TypingQuest, por ejemplo:

**Asunto (Magic Link):** `Tu enlace para entrar a TypingQuest`

**Cuerpo (fragmento):**

```html
<h2>¡Hola!</h2>
<p>Entra a <strong>TypingQuest</strong> con un clic:</p>
<p><a href="{{ .ConfirmationURL }}">Abrir TypingQuest</a></p>
<p>Si no pediste este correo, ignóralo.</p>
```

Ajusta **Site URL** y **Redirect URLs** en **Authentication → URL Configuration** como en `DEPLOY.md` para que los enlaces apunten a producción y no a `localhost`.

## Recordatorio UX

Tras verificar el correo, la app envía a los usuarios con cuenta **no anónima** a elegir **apodo y avatar** (el perfil en base de datos ya no se considera “válido” si solo tiene el nombre automático `user_xxxxxxxx`).
