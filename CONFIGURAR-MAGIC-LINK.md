# 🔗 Configuración del Magic Link en Supabase

Este documento explica cómo configurar correctamente las URLs de redirección para el Magic Link en Supabase.

## ⚠️ Problema Común

Si recibes el error **"localhost rechazó la conexión"** al hacer clic en el Magic Link, significa que las URLs de redirección no están configuradas correctamente en Supabase.

## ✅ Solución: Configurar URLs en Supabase Dashboard

### Paso 1: Acceder a la Configuración de Autenticación

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Authentication** → **URL Configuration**

### Paso 2: Configurar Site URL

En la sección **Site URL**, configura:

**Para Desarrollo Local:**
```
http://localhost:5173
```

**Para Producción (Vercel):**
```
https://tu-proyecto.vercel.app
```

### Paso 3: Configurar Redirect URLs

En la sección **Redirect URLs**, agrega las siguientes URLs (una por línea):

**Para Desarrollo:**
```
http://localhost:5173/dashboard
http://localhost:5173/*
```

**Para Producción:**
```
https://tu-proyecto.vercel.app/dashboard
https://tu-proyecto.vercel.app/*
```

**Importante:** Reemplaza `tu-proyecto.vercel.app` con la URL real de tu proyecto en Vercel.

### Paso 4: Guardar los Cambios

1. Haz clic en **Save** para guardar los cambios
2. Espera unos segundos para que los cambios se apliquen

## 🔍 Verificación

Después de configurar:

1. **En Desarrollo:**
   - Asegúrate de que tu servidor local esté corriendo (`npm run dev`)
   - El servidor debe estar en `http://localhost:5173`
   - Solicita un nuevo Magic Link
   - Haz clic en el enlace del correo
   - Deberías ser redirigido a `http://localhost:5173/dashboard`

2. **En Producción:**
   - Solicita un nuevo Magic Link desde tu aplicación desplegada
   - Haz clic en el enlace del correo
   - Deberías ser redirigido a `https://tu-proyecto.vercel.app/dashboard`

## 📝 Ejemplo de Configuración Completa

### Site URL:
```
https://cafe-inventory.vercel.app
```

### Redirect URLs:
```
http://localhost:5173/dashboard
http://localhost:5173/*
https://cafe-inventory.vercel.app/dashboard
https://cafe-inventory.vercel.app/*
```

## ⚡ Solución Rápida

Si necesitas una solución rápida mientras configuras Supabase:

1. **Copia la URL completa del Magic Link** del correo
2. **Abre una nueva pestaña** en tu navegador
3. **Pega la URL completa** del Magic Link
4. **Modifica la URL** cambiando `localhost` por la URL correcta:
   - Si estás en desarrollo: `http://localhost:5173/dashboard`
   - Si estás en producción: `https://tu-proyecto.vercel.app/dashboard`
5. **Presiona Enter** para acceder

## 🐛 Troubleshooting

### Error: "Invalid redirect URL"

- Verifica que la URL esté exactamente en la lista de Redirect URLs
- Asegúrate de incluir el protocolo (`http://` o `https://`)
- Verifica que no haya espacios al inicio o final de la URL

### Error: "localhost rechazó la conexión"

- Verifica que tu servidor local esté corriendo
- Verifica que el puerto sea el correcto (por defecto Vite usa 5173)
- Asegúrate de que `http://localhost:5173/dashboard` esté en Redirect URLs

### El Magic Link no redirige correctamente

- Espera unos minutos después de guardar los cambios en Supabase
- Solicita un nuevo Magic Link (los enlaces antiguos pueden no funcionar)
- Verifica que la URL en el correo coincida con una de las Redirect URLs configuradas

## 📚 Referencias

- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Configuración de URLs de Redirección](https://supabase.com/docs/guides/auth/redirect-urls)

