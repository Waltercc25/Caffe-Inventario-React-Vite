# 🚀 Guía de Despliegue - Vercel + GitHub Actions + SonarQube

Esta guía te ayudará a configurar el despliegue automático del proyecto en Vercel con CI/CD usando GitHub Actions y análisis de código con SonarQube.

## 📋 Prerrequisitos

1. **Cuenta de GitHub** con el repositorio del proyecto
2. **Cuenta de Vercel** (gratuita)
3. **Cuenta de SonarCloud** (gratuita) o servidor SonarQube propio
4. **Variables de entorno de Supabase** configuradas

---

## 🔧 Paso 1: Configurar Vercel

### Opción A: Conectar desde Vercel Dashboard (Recomendado)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New Project"**
3. Conecta tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite
5. Configura las variables de entorno:
   - `VITE_SUPABASE_URL` → Tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` → Tu Anon Key de Supabase
6. Haz clic en **"Deploy"**

### Opción B: Usar Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Iniciar sesión
vercel login

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

---

## 🔐 Paso 2: Configurar Secrets en GitHub

Necesitas agregar los siguientes secrets en tu repositorio de GitHub:

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Haz clic en **"New repository secret"**
4. Agrega los siguientes secrets:

### Secrets Requeridos:

| Secret Name | Descripción | Dónde obtenerlo |
|------------|-------------|-----------------|
| `VERCEL_TOKEN` | Token de Vercel para CI/CD | Vercel Dashboard → Settings → Tokens |
| `VITE_SUPABASE_URL` | URL de tu proyecto Supabase | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Anon Key de Supabase | Supabase Dashboard → Settings → API |
| `SONAR_TOKEN` | Token de SonarCloud/SonarQube | SonarCloud → My Account → Security |
| `SONAR_HOST_URL` | URL de SonarCloud (opcional) | `https://sonarcloud.io` (para SonarCloud) |

### Cómo obtener el VERCEL_TOKEN:

1. Ve a [Vercel Dashboard](https://vercel.com/account/tokens)
2. Haz clic en **"Create Token"**
3. Dale un nombre (ej: "GitHub Actions")
4. Copia el token generado
5. Pégalo en GitHub Secrets como `VERCEL_TOKEN`

---

## 🔍 Paso 3: Configurar SonarQube/SonarCloud

### Opción A: SonarCloud (Recomendado - Gratis)

1. Ve a [sonarcloud.io](https://sonarcloud.io)
2. Inicia sesión con tu cuenta de GitHub
3. Crea una nueva organización (si no tienes una)
4. Haz clic en **"Analyze new project"**
5. Selecciona tu repositorio de GitHub
6. SonarCloud generará automáticamente:
   - `SONAR_TOKEN` → Cópialo y agrégalo a GitHub Secrets
   - `SONAR_HOST_URL` → `https://sonarcloud.io` (ya está configurado)

### Opción B: SonarQube Self-Hosted

Si tienes tu propio servidor SonarQube:

1. Genera un token en tu servidor SonarQube
2. Agrega `SONAR_TOKEN` y `SONAR_HOST_URL` a GitHub Secrets
3. Actualiza `sonar-project.properties` con tu configuración

### Configurar sonar-project.properties

El archivo `sonar-project.properties` ya está configurado, pero puedes personalizarlo:

```properties
sonar.projectKey=cafe-inventory-system
sonar.projectName=Cafe Inventory System
sonar.projectVersion=0.1.0
```

---

## 🚀 Paso 4: Configurar GitHub Actions

Los workflows ya están creados en `.github/workflows/`:

### Archivos creados:

1. **`.github/workflows/ci-cd.yml`** - Pipeline completo de CI/CD
2. **`.github/workflows/sonarcloud.yml`** - Análisis de SonarCloud

### ¿Qué hace cada workflow?

#### `ci-cd.yml`:
- ✅ Ejecuta linter y type checking
- ✅ Construye el proyecto
- ✅ Ejecuta análisis de SonarQube
- ✅ Despliega automáticamente a Vercel (solo en `main`)

#### `sonarcloud.yml`:
- ✅ Análisis de código con SonarCloud
- ✅ Genera reportes de calidad de código
- ✅ Detecta bugs, vulnerabilidades y code smells

---

## 📝 Paso 5: Verificar la Configuración

### 1. Verificar que los workflows funcionen:

1. Haz un commit y push a la rama `main` o `develop`
2. Ve a **Actions** en tu repositorio de GitHub
3. Deberías ver los workflows ejecutándose

### 2. Verificar el despliegue en Vercel:

1. Ve a tu dashboard de Vercel
2. Deberías ver el proyecto desplegado
3. Cada push a `main` debería desplegar automáticamente

### 3. Verificar SonarCloud:

1. Ve a [sonarcloud.io](https://sonarcloud.io)
2. Selecciona tu proyecto
3. Deberías ver el análisis de código

---

## 🔄 Flujo de Trabajo

### Desarrollo Normal:

```bash
# 1. Crear una rama de feature
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios y commits
git add .
git commit -m "feat: nueva funcionalidad"

# 3. Push a GitHub
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request
# GitHub Actions ejecutará automáticamente:
# - Linter
# - Type checking
# - Build
# - SonarCloud analysis
```

### Despliegue a Producción:

```bash
# 1. Merge a main
git checkout main
git merge feature/nueva-funcionalidad
git push origin main

# 2. GitHub Actions automáticamente:
# - Ejecuta todos los checks
# - Despliega a Vercel
```

---

## 🐛 Solución de Problemas

### Error: "VERCEL_TOKEN not found"

- Verifica que hayas agregado el secret en GitHub
- Asegúrate de que el nombre del secret sea exactamente `VERCEL_TOKEN`

### Error: "Build failed in Vercel"

- Verifica que las variables de entorno estén configuradas en Vercel
- Revisa los logs en Vercel Dashboard

### Error: "SonarQube analysis failed"

- Verifica que `SONAR_TOKEN` esté configurado correctamente
- Verifica que `SONAR_HOST_URL` sea correcto
- Revisa que el proyecto exista en SonarCloud

### El despliegue no se ejecuta automáticamente

- Verifica que estés haciendo push a la rama `main`
- Verifica que el workflow esté habilitado en GitHub Actions
- Revisa los permisos del repositorio

---

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SonarCloud Documentation](https://docs.sonarcloud.io)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Checklist de Configuración

- [ ] Proyecto conectado en Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] `VERCEL_TOKEN` agregado a GitHub Secrets
- [ ] `VITE_SUPABASE_URL` agregado a GitHub Secrets
- [ ] `VITE_SUPABASE_ANON_KEY` agregado a GitHub Secrets
- [ ] Proyecto creado en SonarCloud
- [ ] `SONAR_TOKEN` agregado a GitHub Secrets
- [ ] Workflows de GitHub Actions funcionando
- [ ] Despliegue automático funcionando
- [ ] Análisis de SonarCloud funcionando

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu proyecto tendrá:

✅ Despliegue automático a Vercel  
✅ CI/CD con GitHub Actions  
✅ Análisis de código con SonarQube  
✅ Linting y type checking automáticos  
✅ Build automático en cada push  

¡Tu proyecto está listo para producción! 🚀

