# 🚀 Guía Rápida: Configurar MCP en Cursor

## 📋 Lo que Necesitas

Para que Cursor pueda hacer modificaciones en Supabase, necesitas:

1. ✅ **PROJECT_REF**: `lvmoqwxzkkmdujiqltpn` (ya lo tienes)
2. ⏳ **SUPABASE_ACCESS_TOKEN**: Necesitas generarlo

## 🔑 Paso 1: Obtener el Access Token

1. Ve a: https://app.supabase.com
2. Haz clic en tu **avatar** (esquina superior derecha)
3. Selecciona **"Account Settings"**
4. Ve a **"Access Tokens"**
5. Haz clic en **"Generate New Token"**
6. Nombre: "Cursor MCP"
7. **Copia el token** (solo se muestra una vez)

## ⚙️ Paso 2: Configurar en Cursor

### Opción A: Si Cursor tiene interfaz MCP

1. Abre Cursor Settings
2. Busca "MCP" o "Model Context Protocol"
3. Agrega el servidor Supabase con:
   - **Access Token**: El token que copiaste
   - **Project Ref**: `lvmoqwxzkkmdujiqltpn`

### Opción B: Archivo de Configuración

1. Busca el archivo de configuración MCP de Cursor (puede estar en diferentes ubicaciones según tu OS)
2. Usa el contenido de `cursor-mcp-config.json` como referencia
3. Reemplaza `REEMPLAZA_CON_TU_ACCESS_TOKEN` con tu token real

## ✅ Paso 3: Verificar

Una vez configurado, puedes pedirme:
- "Lista las tablas en Supabase"
- "Muéstrame el esquema de products"
- "Agrega una columna a products"

Y podré hacerlo directamente desde Cursor.

## 📝 Resumen

**Ya tienes:**
- ✅ PROJECT_REF: `lvmoqwxzkkmdujiqltpn`

**Necesitas:**
- ⏳ SUPABASE_ACCESS_TOKEN: Generarlo desde Account Settings > Access Tokens

¡Con esto podrás hacer modificaciones en Supabase desde Cursor! 🎉

