# 🚀 Inicio Rápido - Despliegue

Guía rápida para desplegar el proyecto en Vercel con CI/CD y SonarQube.

## ⚡ Configuración Rápida (5 minutos)

### 1️⃣ Conectar a Vercel

1. Ve a [vercel.com](https://vercel.com) → **Add New Project**
2. Conecta tu repositorio de GitHub
3. Agrega variables de entorno:
   ```
   VITE_SUPABASE_URL=tu_url
   VITE_SUPABASE_ANON_KEY=tu_key
   ```
4. Click **Deploy** ✅

### 2️⃣ Configurar GitHub Secrets

Ve a tu repo → **Settings** → **Secrets and variables** → **Actions**

Agrega estos secrets:

| Secret | Dónde obtenerlo |
|--------|----------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API |
| `SONAR_TOKEN` | [sonarcloud.io](https://sonarcloud.io) → My Account → Security |

### 3️⃣ Configurar SonarCloud (Opcional)

1. Ve a [sonarcloud.io](https://sonarcloud.io)
2. Inicia sesión con GitHub
3. **Analyze new project** → Selecciona tu repo
4. Copia el `SONAR_TOKEN` y agrégalo a GitHub Secrets

### 4️⃣ ¡Listo! 🎉

Haz un push a `main` y el proyecto se desplegará automáticamente.

---

## 📋 Checklist

- [ ] Proyecto conectado en Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] `VERCEL_TOKEN` en GitHub Secrets
- [ ] `VITE_SUPABASE_URL` en GitHub Secrets
- [ ] `VITE_SUPABASE_ANON_KEY` en GitHub Secrets
- [ ] Proyecto creado en SonarCloud (opcional)
- [ ] `SONAR_TOKEN` en GitHub Secrets (opcional)

---

## 🆘 Problemas Comunes

**El deploy falla:**
- Verifica que las variables de entorno estén en Vercel
- Revisa los logs en GitHub Actions

**SonarQube no funciona:**
- Verifica que `SONAR_TOKEN` esté correcto
- Asegúrate de que el proyecto exista en SonarCloud

**No se despliega automáticamente:**
- Verifica que estés haciendo push a `main`
- Revisa que los workflows estén habilitados

---

Para más detalles, consulta [`DEPLOYMENT.md`](./DEPLOYMENT.md)

