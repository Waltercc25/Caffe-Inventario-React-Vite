# Café Manager - Sistema de Inventario

Sistema de gestión de inventario para cafeterías desarrollado con React + Vite, Supabase y TypeScript.

## 🚀 Características

- ✅ Autenticación con Magic Link (enlace de verificación por correo)
- ✅ Gestión completa de productos (CRUD)
- ✅ Generación automática de códigos QR para productos
- ✅ Dashboard con métricas en tiempo real
- ✅ Base de datos en Supabase con Row Level Security
- ✅ Integración con Model Context Protocol (MCP) para Supabase
- ✅ CI/CD con GitHub Actions
- ✅ Deploy automático a Vercel
- ✅ Análisis de código con SonarQube/SonarCloud

## 📋 Requisitos Previos

- Node.js 18 o superior
- Cuenta de Supabase
- Cuenta de Vercel (para deployment)

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd Proyecto-Parcial4
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

Edita `.env` y agrega tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

**Obtén estas credenciales desde:** [Supabase Dashboard](https://app.supabase.com) > Settings > API

4. Configura la base de datos en Supabase:
   - Ve a tu proyecto en Supabase
   - Abre el SQL Editor
   - Ejecuta el contenido del archivo `supabase-schema.sql`

## 🚀 Desarrollo

Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Build

Para crear el build de producción:
```bash
npm run build
```

## 🧪 Testing

Ejecuta el linter:
```bash
npm run lint
```

## 🔐 Autenticación

El sistema utiliza autenticación con Magic Link:
1. El usuario ingresa su correo electrónico
2. Recibe un enlace de verificación por correo
3. Al hacer clic en el enlace, se autentica automáticamente

## 📊 Base de Datos

El esquema de la base de datos incluye:
- Tabla `products` con Row Level Security
- Políticas de seguridad para que cada usuario solo vea sus propios productos
- Índices para optimizar las consultas

## 🔄 CI/CD

El proyecto incluye GitHub Actions para:
- ✅ Linting automático
- ✅ Type checking
- ✅ Build en cada push
- ✅ Análisis de código con SonarQube/SonarCloud
- ✅ Deploy automático a Vercel en la rama main/master
- ✅ Preview deployments en Pull Requests

### Configuración de Secrets en GitHub

Agrega los siguientes secrets en tu repositorio (Settings → Secrets and variables → Actions):

**Secrets Requeridos:**
- `VITE_SUPABASE_URL`: URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY`: Anon key de Supabase
- `VERCEL_TOKEN`: Token de Vercel ([obtener aquí](https://vercel.com/account/tokens))
- `SONAR_TOKEN`: Token de SonarCloud ([obtener aquí](https://sonarcloud.io))
- `SONAR_HOST_URL`: URL de SonarCloud (usar `https://sonarcloud.io`)

**Opcionales (para preview deployments):**
- `VERCEL_ORG_ID`: ID de tu organización en Vercel
- `VERCEL_PROJECT_ID`: ID de tu proyecto en Vercel

### Workflows de GitHub Actions

El proyecto incluye 3 workflows:

1. **`.github/workflows/ci-cd.yml`** - Pipeline completo de CI/CD
   - Ejecuta tests, linting y build
   - Análisis con SonarQube
   - Deploy automático a producción

2. **`.github/workflows/sonarcloud.yml`** - Análisis de código
   - Escaneo de código con SonarCloud
   - Detección de bugs y vulnerabilidades

3. **`.github/workflows/vercel-preview.yml`** - Preview deployments
   - Crea preview deployments en Pull Requests

## 🚢 Deploy a Vercel

### Opción 1: Conectar desde Vercel Dashboard (Recomendado)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New Project"**
3. Conecta tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite
5. Configura las variables de entorno:
   - `VITE_SUPABASE_URL` → Tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` → Tu Anon Key de Supabase
6. Haz clic en **"Deploy"**

### Opción 2: Usar Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Deploy Automático

Cada push a la rama `main` desplegará automáticamente a producción usando GitHub Actions.

## 🔍 SonarQube/SonarCloud

El proyecto está configurado para análisis de código con SonarCloud:

1. **Crea una cuenta en [SonarCloud](https://sonarcloud.io)**
2. **Conecta tu repositorio de GitHub**
3. **Agrega el `SONAR_TOKEN` a GitHub Secrets**
4. **El análisis se ejecutará automáticamente en cada push**

Para más detalles, consulta [`DEPLOYMENT.md`](./DEPLOYMENT.md)

## 📱 Funcionalidades

### Dashboard
- Vista general del inventario
- Métricas: Total de productos, valor del inventario, productos con bajo stock
- Lista de productos recientes

### Inventario
- Agregar, editar y eliminar productos
- Búsqueda por nombre, SKU o tipo
- Generación automática de códigos QR
- Visualización e impresión de códigos QR

## 🤖 Integración con MCP (Model Context Protocol)

Este proyecto está configurado para trabajar con Supabase a través del Model Context Protocol (MCP), permitiendo una integración eficiente con aplicaciones de inteligencia artificial.

### Configuración MCP

Para más detalles sobre la configuración de MCP, consulta el archivo [`mcp-config.md`](./mcp-config.md).

**Configuración rápida:**
1. El cliente de Supabase ya está optimizado para MCP
2. Opcionalmente, puedes configurar un servidor MCP dedicado usando `mcp.json`
3. Las variables de entorno MCP son opcionales (ver `.env.example`)

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **TypeScript** - Tipado estático
- **Supabase** - Backend como servicio (BaaS)
- **Model Context Protocol (MCP)** - Integración con IA
- **React Router** - Enrutamiento
- **Tailwind CSS** - Estilos
- **Radix UI** - Componentes UI accesibles
- **QRCode.react** - Generación de códigos QR
- **Sonner** - Notificaciones toast

## 📝 Licencia

Este proyecto es privado.

## 👨‍💻 Autor

Desarrollado como proyecto parcial.

