# 🔧 Configurar Servidor MCP de Supabase en Cursor

## 📋 ¿Qué es MCP?

El Model Context Protocol (MCP) permite que Cursor interactúe directamente con tu proyecto de Supabase, permitiéndote hacer modificaciones desde Cursor que se reflejen automáticamente en Supabase.

## ✅ Lo que Necesitas

Para configurar MCP en Cursor, necesitas:

1. **SUPABASE_ACCESS_TOKEN** - Token de acceso personal de Supabase
2. **PROJECT_REF** - ID de referencia de tu proyecto Supabase

## 🔑 Paso 1: Obtener el Access Token

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Haz clic en tu **perfil** (avatar) en la esquina superior derecha
3. Selecciona **"Account Settings"** o **"Configuración de Cuenta"**
4. Ve a la sección **"Access Tokens"** o **"Tokens de Acceso"**
5. Haz clic en **"Generate New Token"** o **"Generar Nuevo Token"**
6. Dale un nombre descriptivo (ej: "Cursor MCP")
7. **Copia el token** - Solo se muestra una vez, guárdalo bien

## 🔍 Paso 2: Obtener el Project Ref

El Project Ref es el identificador único de tu proyecto. Lo puedes encontrar de dos formas:

### Opción A: Desde la URL
- Tu URL de Supabase es: `https://lvmoqwxzkkmdujiqltpn.supabase.co`
- El **Project Ref** es: `lvmoqwxzkkmdujiqltpn`

### Opción B: Desde el Dashboard
1. Ve a tu proyecto en Supabase Dashboard
2. Ve a **Settings** > **General**
3. Busca **"Reference ID"** o **"ID de Referencia"**
4. Copia ese valor

## ⚙️ Paso 3: Configurar en Cursor

Cursor necesita la configuración MCP en un archivo específico. Sigue estos pasos:

### Opción A: Configuración Global de Cursor

1. Abre Cursor
2. Ve a **Settings** (Configuración)
3. Busca la sección **"MCP"** o **"Model Context Protocol"**
4. Agrega la configuración del servidor Supabase

### Opción B: Archivo de Configuración

1. Crea o edita el archivo de configuración MCP de Cursor
2. La ubicación típica es:
   - **Windows**: `%APPDATA%\Cursor\User\globalStorage\mcp.json`
   - **Mac**: `~/Library/Application Support/Cursor/User/globalStorage/mcp.json`
   - **Linux**: `~/.config/Cursor/User/globalStorage/mcp.json`

3. Agrega esta configuración:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "TU_ACCESS_TOKEN_AQUI",
        "PROJECT_REF": "lvmoqwxzkkmdujiqltpn"
      }
    }
  }
}
```

**Reemplaza `TU_ACCESS_TOKEN_AQUI` con el token que copiaste en el Paso 1.**

## 📝 Paso 4: Variables de Entorno (Alternativa)

Si Cursor no tiene una interfaz para MCP, puedes configurarlo usando variables de entorno:

1. Agrega estas variables a tu archivo `.env` (aunque no se usen en el código, Cursor puede leerlas):

```env
SUPABASE_ACCESS_TOKEN=tu_access_token_aqui
PROJECT_REF=lvmoqwxzkkmdujiqltpn
```

2. Reinicia Cursor para que lea las nuevas variables

## ✅ Paso 5: Verificar que Funciona

Una vez configurado, puedes probar pidiéndome que:

1. **Liste las tablas** de tu base de datos
2. **Muestre el esquema** de una tabla
3. **Ejecute una consulta** SQL
4. **Modifique la estructura** de una tabla

Por ejemplo, puedes pedirme: *"Lista las tablas en mi proyecto de Supabase"* o *"Muéstrame el esquema de la tabla products"*

## 🚨 Solución de Problemas

### Error: "Cannot connect to MCP server"
- Verifica que el Access Token es correcto
- Verifica que el Project Ref es correcto
- Asegúrate de que `@supabase/mcp-server-supabase` está instalado

### Error: "Invalid access token"
- Genera un nuevo token en Supabase
- Asegúrate de copiar el token completo
- Verifica que el token no haya expirado

### No puedo encontrar la configuración MCP en Cursor
- Cursor puede tener la configuración en un lugar diferente
- Busca en Settings > Extensions o Settings > Features
- Consulta la documentación de Cursor sobre MCP

## 📊 Resumen de Credenciales Necesarias

| Credencial | Dónde Obtenerla | Valor para tu Proyecto |
|------------|----------------|------------------------|
| **SUPABASE_ACCESS_TOKEN** | Account Settings > Access Tokens | Generar nuevo token |
| **PROJECT_REF** | URL o Settings > General | `lvmoqwxzkkmdujiqltpn` |

## 🎯 Una Vez Configurado

Con MCP configurado, podrás pedirme cosas como:
- "Agrega una nueva columna a la tabla products"
- "Crea una nueva tabla para proveedores"
- "Modifica las políticas RLS de la tabla products"
- "Ejecuta esta consulta SQL en Supabase"

Y yo podré hacerlo directamente desde Cursor, reflejándose automáticamente en tu proyecto de Supabase.

## 📝 Nota Importante

⚠️ **Seguridad**: El Access Token tiene permisos completos en tu proyecto. Manténlo seguro y no lo compartas públicamente.

¡Con esto podrás hacer modificaciones en Supabase directamente desde Cursor! 🎉

