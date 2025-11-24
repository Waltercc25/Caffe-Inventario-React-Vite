# 🔧 Solución: No Puedo Guardar Productos en Supabase

## 🔍 Diagnóstico del Problema

Si la tabla `products` ya existe pero no puedes guardar productos, el problema más común es con las **políticas de Row Level Security (RLS)**.

## ✅ Pasos para Solucionar

### Paso 1: Verificar que las Políticas RLS Están Creadas

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Ejecuta este query para verificar las políticas:

```sql
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'products';
```

**Deberías ver 4 políticas:**
- `Users can view own products` (SELECT)
- `Users can insert own products` (INSERT)
- `Users can update own products` (UPDATE)
- `Users can delete own products` (DELETE)

### Paso 2: Si Faltan Políticas, Ejecuta el Script Completo

Si no ves todas las políticas, ejecuta TODO el contenido de `supabase-schema.sql` nuevamente:

1. Ve a **SQL Editor**
2. Copia TODO el contenido de `supabase-schema.sql`
3. Pégalo y ejecuta (Run)

**Nota:** Si las políticas ya existen, el script las recreará (no hay problema).

### Paso 3: Verificar que Estás Autenticado

El problema más común es que intentas guardar sin estar autenticado. Verifica:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Console**
3. Intenta guardar un producto
4. Busca mensajes de error que digan:
   - "Usuario no autenticado"
   - "permission denied"
   - "new row violates row-level security policy"

### Paso 4: Verificar el User ID

1. En la consola del navegador, ejecuta:
   ```javascript
   // Verifica que estás autenticado
   const { data: { session } } = await supabase.auth.getSession()
   console.log('Usuario:', session?.user?.id)
   ```

2. Si `session` es `null`, necesitas iniciar sesión primero.

### Paso 5: Probar Inserción Directa en Supabase

1. Ve a **SQL Editor** en Supabase
2. Ejecuta este query (reemplaza `TU_USER_ID` con tu ID de usuario):

```sql
-- Primero obtén tu user_id desde Authentication > Users
-- Luego ejecuta esto:

INSERT INTO products (user_id, name, type, price, stock, sku, description)
VALUES (
  'TU_USER_ID_AQUI',  -- Reemplaza con tu user_id real
  'Producto de Prueba',
  'Coffee Bean',
  10.50,
  100,
  'TEST-001',
  'Este es un producto de prueba'
)
RETURNING *;
```

**Si esto funciona:** El problema está en el código de la app.
**Si esto NO funciona:** El problema está en las políticas RLS.

## 🚨 Errores Comunes y Soluciones

### Error: "new row violates row-level security policy"
**Causa:** Las políticas RLS están bloqueando la inserción.

**Solución:**
1. Verifica que ejecutaste TODO el script `supabase-schema.sql`
2. Verifica que estás autenticado cuando intentas guardar
3. Verifica que el `user_id` que envías coincide con `auth.uid()`

### Error: "permission denied for table products"
**Causa:** Las políticas no están creadas o RLS no está habilitado.

**Solución:**
1. Ejecuta el script `supabase-schema.sql` completo
2. Verifica que RLS está habilitado:
   ```sql
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ```

### Error: "Usuario no autenticado"
**Causa:** No estás logueado o la sesión expiró.

**Solución:**
1. Cierra sesión y vuelve a iniciar sesión
2. Verifica que recibiste y abriste el enlace del email
3. Verifica en la consola que `auth.uid()` no es `null`

### Error: "relation 'products' does not exist"
**Causa:** La tabla no existe.

**Solución:**
1. Ejecuta el script `supabase-schema.sql` completo
2. Verifica que la tabla se creó:
   ```sql
   SELECT * FROM products LIMIT 1;
   ```

## 🔍 Script de Verificación

He creado el archivo `verificar-supabase.sql` que puedes ejecutar en Supabase para verificar todo.

**Cómo usarlo:**
1. Ve a **SQL Editor** en Supabase
2. Copia y pega el contenido de `verificar-supabase.sql`
3. Ejecuta cada sección
4. Revisa los resultados

## ✅ Verificación Final

Después de seguir los pasos:

1. **Abre la consola del navegador** (F12)
2. **Intenta guardar un producto** en tu app
3. **Revisa los mensajes en la consola:**
   - Deberías ver: "Attempting to insert product:"
   - Deberías ver: "User ID: [tu-id]"
   - Si hay error, verás detalles completos

4. **Si hay error, copia el mensaje completo** y compártelo para más ayuda.

## 📝 Checklist Rápido

- [ ] Tabla `products` existe
- [ ] Row Level Security está habilitado
- [ ] Las 4 políticas están creadas
- [ ] Estás autenticado en la app
- [ ] El `user_id` se envía correctamente
- [ ] No hay errores en la consola del navegador

## 🆘 Si Aún No Funciona

1. Abre la consola del navegador (F12)
2. Intenta guardar un producto
3. Copia TODOS los mensajes de error que aparezcan
4. Compártelos para diagnóstico más específico

¡Con estos pasos deberías poder guardar productos! 🎉

