# 🔍 Diagnóstico: Magic Link No Inicia Sesión

## Problema
Al hacer clic en el Magic Link, no se inicia sesión correctamente.

## ✅ Verificaciones Necesarias

### 1. Verificar Configuración en Supabase Dashboard

**Site URL debe ser:**
```
https://caffe-proyecto4.vercel.app
```
(No debe incluir `/login` ni ninguna ruta adicional)

**Redirect URLs deben incluir:**
```
http://localhost:5173/login
http://localhost:5173/*
https://caffe-proyecto4.vercel.app/login
https://caffe-proyecto4.vercel.app/*
```

### 2. Verificar en la Consola del Navegador

Abre la consola del navegador (F12) cuando hagas clic en el Magic Link y busca:

1. **Mensajes de error:**
   - `Invalid redirect URL`
   - `Access token expired`
   - `Session not found`

2. **Mensajes de log:**
   - `Magic Link detected, waiting for Supabase to process...`
   - `Auth state change: SIGNED_IN`
   - `Magic Link verified on login page`

### 3. Verificar la URL del Magic Link

El Magic Link del correo debe tener esta estructura:
```
https://lvmoqwxzkkmdujiqltpn.supabase.co/auth/v1/verify?token=...&type=magiclink&redirect_to=https://caffe-proyecto4.vercel.app/login
```

**Verifica que:**
- El `redirect_to` apunte a `https://caffe-proyecto4.vercel.app/login`
- No tenga caracteres extraños o codificados incorrectamente

### 4. Verificar Variables de Entorno en Vercel

En Vercel Dashboard → Settings → Environment Variables, verifica:

- `VITE_SUPABASE_URL` = `https://lvmoqwxzkkmdujiqltpn.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 5. Probar en Modo Incógnito

1. Abre una ventana de incógnito
2. Ve a `https://caffe-proyecto4.vercel.app/login`
3. Solicita un nuevo Magic Link
4. Haz clic en el enlace del correo
5. Verifica si funciona

## 🔧 Soluciones Comunes

### Solución 1: Solicitar un Nuevo Magic Link

Los Magic Links antiguos pueden expirar o no funcionar si cambiaste la configuración:
1. Solicita un **nuevo** Magic Link desde la aplicación
2. Usa ese enlace (no uno antiguo)

### Solución 2: Verificar que Supabase Procese el Hash

Si ves el hash `#access_token=...` en la URL pero no inicia sesión:

1. Abre la consola del navegador
2. Ejecuta:
```javascript
// Verificar si hay sesión
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

// Verificar el hash
console.log('Hash:', window.location.hash)
```

### Solución 3: Limpiar Cache y Cookies

1. Limpia el cache del navegador
2. Elimina las cookies del sitio
3. Intenta nuevamente

### Solución 4: Verificar que el Email Provider Esté Habilitado

En Supabase Dashboard:
1. Ve a **Authentication** → **Providers**
2. Verifica que **Email** esté habilitado
3. Verifica que no haya restricciones de dominio

## 🐛 Debugging Avanzado

### Agregar Logs Temporales

Si el problema persiste, puedes agregar estos logs temporales en la consola:

```javascript
// En la consola del navegador, después de hacer clic en el Magic Link:
console.log('Current URL:', window.location.href)
console.log('Hash:', window.location.hash)
console.log('Pathname:', window.location.pathname)

// Verificar sesión
const { data: { session } } = await supabase.auth.getSession()
console.log('Current session:', session)
```

## 📞 Información para Reportar

Si el problema persiste, proporciona:

1. **URL completa del Magic Link** (puedes ocultar el token)
2. **Mensajes de la consola** del navegador
3. **Screenshot** de la configuración de Supabase (URL Configuration)
4. **Screenshot** de las variables de entorno en Vercel

