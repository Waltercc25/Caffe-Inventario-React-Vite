-- Script de Verificación para Supabase
-- Ejecuta este script en el SQL Editor de Supabase para verificar la configuración

-- 1. Verificar que la tabla existe
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- 2. Verificar que Row Level Security está habilitado
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'products';

-- 3. Verificar las políticas de seguridad
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'products';

-- 4. Verificar que el usuario actual puede insertar
-- (Ejecuta esto después de autenticarte en tu app)
SELECT 
  auth.uid() as current_user_id,
  CASE 
    WHEN auth.uid() IS NOT NULL THEN 'Usuario autenticado'
    ELSE 'Usuario NO autenticado'
  END as auth_status;

-- 5. Verificar índices
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'products';

-- 6. Verificar triggers
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'products';

-- 7. Probar inserción (solo si estás autenticado)
-- Descomenta y ejecuta esto para probar:
/*
INSERT INTO products (user_id, name, type, price, stock, sku, description)
VALUES (
  auth.uid(),
  'Producto de Prueba',
  'Coffee Bean',
  10.50,
  100,
  'TEST-001',
  'Este es un producto de prueba'
)
RETURNING *;
*/

-- 8. Ver productos del usuario actual (solo si estás autenticado)
-- Descomenta y ejecuta esto:
/*
SELECT * FROM products WHERE user_id = auth.uid();
*/

