-- Script para corregir el nombre de la columna lastUpdated a lastupdated
-- Ejecuta esto en el SQL Editor de Supabase si la tabla ya existe

-- Opción 1: Renombrar la columna (si existe como lastUpdated)
ALTER TABLE products RENAME COLUMN "lastUpdated" TO lastupdated;

-- Si el comando anterior da error, prueba esto:
-- ALTER TABLE products RENAME COLUMN lastUpdated TO lastupdated;

-- Opción 2: Si la columna no existe, créala
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS lastupdated TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Verificar que la columna existe con el nombre correcto
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name LIKE '%last%';

