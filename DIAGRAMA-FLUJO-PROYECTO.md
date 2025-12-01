# Diagrama de Flujo del Proyecto - Café Manager

Este documento contiene los diagramas de flujo que describen el funcionamiento completo del sistema de gestión de inventario.

---

## 1. Flujo de Autenticación (Magic Link)

Este diagrama muestra el proceso completo de autenticación mediante Magic Link:

```mermaid
flowchart TD
    A[Usuario accede a la aplicación] --> B{¿Está autenticado?}
    B -->|Sí| C[Redirigir a Dashboard]
    B -->|No| D[Mostrar página de Login]
    
    D --> E[Usuario ingresa email]
    E --> F{Validar email}
    F -->|Inválido| E
    F -->|Válido| G[Verificar rate limit]
    
    G -->|Demasiadas solicitudes| H[Mostrar error: Esperar 60 segundos]
    H --> E
    
    G -->|Permitido| I[Supabase: signInWithOtp]
    I --> J{¿Envío exitoso?}
    J -->|Error| K[Mostrar error al usuario]
    K --> E
    J -->|Éxito| L[Mostrar mensaje: Revisa tu correo]
    
    L --> M[Usuario abre correo]
    M --> N[Usuario hace clic en Magic Link]
    N --> O[Redirección a /login con access_token]
    
    O --> P[AuthProvider detecta access_token]
    P --> Q[Supabase procesa token]
    Q --> R[onAuthStateChange: SIGNED_IN]
    R --> S[Actualizar estado de usuario]
    S --> T[Limpiar hash de URL]
    T --> U[Redirigir a Dashboard]
    
    U --> V[Usuario autenticado]
    
    style A fill:#e1f5ff
    style V fill:#c8e6c9
    style K fill:#ffcdd2
    style H fill:#ffcdd2
```

---

## 2. Flujo de Gestión de Productos (CRUD)

Este diagrama muestra el proceso completo de creación, lectura, actualización y eliminación de productos:

```mermaid
flowchart TD
    A[Usuario en Dashboard/Inventario] --> B{Acción del usuario}
    
    B -->|Ver productos| C[Cargar productos desde Supabase]
    C --> D[ProductStore.getProducts]
    D --> E[Query: SELECT * FROM products WHERE user_id = ?]
    E --> F{¿Query exitosa?}
    F -->|Error| G[Mostrar error]
    F -->|Éxito| H[Mostrar lista de productos]
    
    B -->|Agregar producto| I[Abrir formulario de producto]
    I --> J[Usuario completa formulario]
    J --> K{¿SKU proporcionado?}
    K -->|No| L[Generar SKU automático]
    K -->|Sí| M[Usar SKU proporcionado]
    
    L --> N[generateSKU: Extraer iniciales del nombre]
    N --> O[Generar número aleatorio 4 dígitos]
    O --> P[Formato: INICIALES-NUMERO]
    P --> Q{¿SKU único?}
    Q -->|No| O
    Q -->|Sí| R[Generar URL del QR]
    
    M --> R
    R --> S[URL: baseUrl/product/SKU]
    S --> T[ProductStore.addProduct]
    T --> U[INSERT INTO products]
    U --> V{¿Inserción exitosa?}
    V -->|Error| W[Mostrar error]
    V -->|Éxito| X[Mostrar éxito]
    X --> C
    
    B -->|Editar producto| Y[Seleccionar producto]
    Y --> Z[Abrir formulario con datos]
    Z --> AA[Usuario modifica datos]
    AA --> AB{¿SKU o nombre cambiado?}
    AB -->|Sí| AC[Regenerar URL del QR]
    AB -->|No| AD[Actualizar solo campos modificados]
    AC --> AD
    AD --> AE[ProductStore.updateProduct]
    AE --> AF[UPDATE products SET ... WHERE id = ? AND user_id = ?]
    AF --> AG{¿Actualización exitosa?}
    AG -->|Error| W
    AG -->|Éxito| AH[Mostrar éxito]
    AH --> C
    
    B -->|Eliminar producto| AI[Confirmar eliminación]
    AI --> AJ{¿Confirmado?}
    AJ -->|No| B
    AJ -->|Sí| AK[ProductStore.deleteProduct]
    AK --> AL[DELETE FROM products WHERE id = ? AND user_id = ?]
    AL --> AM{¿Eliminación exitosa?}
    AM -->|Error| W
    AM -->|Éxito| AN[Mostrar éxito]
    AN --> C
    
    B -->|Buscar productos| AO[Filtrar por nombre/SKU/tipo]
    AO --> AP[Mostrar resultados filtrados]
    
    style A fill:#e1f5ff
    style H fill:#c8e6c9
    style X fill:#c8e6c9
    style AH fill:#c8e6c9
    style AN fill:#c8e6c9
    style W fill:#ffcdd2
    style G fill:#ffcdd2
```

---

## 3. Flujo de Generación de SKU y QR

Este diagrama detalla el proceso de generación automática de SKU y códigos QR:

```mermaid
flowchart TD
    A[Usuario crea/edita producto] --> B{¿SKU proporcionado?}
    
    B -->|Sí| C[Validar SKU]
    C --> D{¿SKU válido?}
    D -->|No| E[Mostrar error]
    D -->|Sí| F[Usar SKU proporcionado]
    
    B -->|No| G[Iniciar generación automática]
    G --> H[Extraer iniciales del nombre]
    H --> I[Limpiar caracteres especiales]
    I --> J[Convertir a mayúsculas]
    J --> K{¿Nombre tiene espacios?}
    K -->|Sí| L[Tomar primera letra de cada palabra]
    K -->|No| M[Tomar primeras 4 letras]
    L --> N[Limitar a 4 caracteres]
    M --> N
    
    N --> O{¿Iniciales < 2 caracteres?}
    O -->|Sí| P[Completar con letras aleatorias]
    O -->|No| Q[Generar número aleatorio 4 dígitos]
    P --> Q
    
    Q --> R[Formato: INICIALES-NUMERO]
    R --> S[Verificar unicidad en BD]
    S --> T{¿SKU existe?}
    T -->|Sí| U{¿Intentos < 10?}
    U -->|Sí| Q
    U -->|No| V[Agregar timestamp]
    T -->|No| W[SKU único generado]
    V --> W
    
    F --> X[Generar URL del QR]
    W --> X
    
    X --> Y[Obtener baseUrl]
    Y --> Z{¿VITE_APP_URL configurada?}
    Z -->|Sí| AA[Usar VITE_APP_URL]
    Z -->|No| AB[Usar window.location.origin]
    AA --> AC[Formato: baseUrl/product/SKU]
    AB --> AC
    
    AC --> AD[Guardar QR en base de datos]
    AD --> AE[Producto guardado con QR]
    
    style A fill:#e1f5ff
    style W fill:#c8e6c9
    style AE fill:#c8e6c9
    style E fill:#ffcdd2
```

---

## 4. Flujo de Escaneo de Código QR

Este diagrama muestra cómo funciona el escaneo de códigos QR para ver detalles del producto:

```mermaid
flowchart TD
    A[Usuario escanea código QR] --> B[QR contiene URL: baseUrl/product/SKU]
    B --> C[Navegador abre URL]
    C --> D[ProductDetailPage se carga]
    
    D --> E[Extraer SKU de la URL]
    E --> F[Decodificar SKU de la URL]
    F --> G[ProductStore.getProductBySku]
    
    G --> H[Query: SELECT * FROM products WHERE SKU ILIKE ?]
    H --> I{¿Producto encontrado?}
    
    I -->|No| J[Mostrar error: Producto no encontrado]
    J --> K[Botón: Volver al inicio]
    
    I -->|Sí| L[Mostrar página de detalles]
    L --> M[Mostrar información del producto]
    M --> N[Nombre, SKU, Tipo]
    M --> O[Precio, Stock]
    M --> P[Descripción, Proveedor]
    M --> Q[Fecha de última actualización]
    M --> R[Mostrar código QR del producto]
    
    R --> S[Usuario puede imprimir etiqueta]
    
    style A fill:#e1f5ff
    style L fill:#c8e6c9
    style J fill:#ffcdd2
```

---

## 5. Flujo de CI/CD (GitHub Actions)

Este diagrama muestra el proceso completo de integración y despliegue continuo:

```mermaid
flowchart TD
    A[Desarrollador hace push a GitHub] --> B{¿Rama?}
    
    B -->|main/develop| C[Trigger: CI/CD Pipeline]
    B -->|Pull Request| C
    
    C --> D[Job 1: Test & Lint]
    D --> E[Checkout código]
    E --> F[Setup Node.js 20]
    F --> G[Instalar dependencias: npm ci]
    G --> H[Ejecutar linter: npm run lint]
    H --> I{¿Lint exitoso?}
    I -->|Error| J[Continuar con continue-on-error]
    I -->|Éxito| K[Type check: tsc --noEmit]
    J --> K
    K --> L{¿Type check exitoso?}
    L -->|Error| M[Workflow falla]
    L -->|Éxito| N[Build: npm run build]
    N --> O{¿Build exitoso?}
    O -->|Error| M
    O -->|Éxito| P[Job 1 completado]
    
    P --> Q[Job 2: SonarCloud Analysis]
    Q --> R[Checkout código con fetch-depth: 0]
    R --> S[Setup Node.js 20]
    S --> T[Instalar dependencias]
    T --> U[Ejecutar SonarCloud Scan]
    U --> V{¿Análisis exitoso?}
    V -->|Error| W[Reportar en GitHub]
    V -->|Éxito| X[Job 2 completado]
    
    P --> Y{¿Rama main y push?}
    Y -->|No| Z[No desplegar]
    Y -->|Sí| AA[Job 3: Deploy to Vercel]
    
    AA --> AB[Checkout código]
    AB --> AC[Setup Node.js 20]
    AC --> AD[Instalar dependencias]
    AD --> AE[Instalar Vercel CLI]
    AE --> AF[Build proyecto]
    AF --> AG[Deploy a producción: vercel deploy --prod]
    AG --> AH{¿Deploy exitoso?}
    AH -->|Error| AI[Workflow falla]
    AH -->|Éxito| AJ[Aplicación desplegada en Vercel]
    
    style A fill:#e1f5ff
    style P fill:#c8e6c9
    style X fill:#c8e6c9
    style AJ fill:#c8e6c9
    style M fill:#ffcdd2
    style AI fill:#ffcdd2
```

---

## 6. Arquitectura General del Sistema

Este diagrama muestra la arquitectura completa del sistema y cómo interactúan todos los componentes:

```mermaid
flowchart TB
    subgraph "Frontend - React + Vite"
        A[App.tsx - Router Principal]
        B[AuthProvider - Contexto de Autenticación]
        C[LoginPage - Autenticación]
        D[DashboardLayout - Layout Principal]
        E[DashboardPage - Panel de Control]
        F[InventoryPage - Gestión de Productos]
        G[ProductDetailPage - Detalles Públicos]
        H[ProductForm - Formulario de Productos]
        I[QRCodeDisplay - Visualización QR]
    end
    
    subgraph "Lógica de Negocio"
        J[ProductStore - CRUD de Productos]
        K[SKU Generator - Generación de SKU]
        L[Auth Context - Gestión de Sesión]
    end
    
    subgraph "Backend - Supabase"
        M[Supabase Auth - Autenticación]
        N[Supabase Database - PostgreSQL]
        O[Row Level Security - RLS]
        P[Tabla: products]
    end
    
    subgraph "Servicios Externos"
        Q[GitHub - Repositorio]
        R[GitHub Actions - CI/CD]
        S[SonarCloud - Análisis de Código]
        T[Vercel - Hosting]
    end
    
    A --> B
    A --> C
    A --> D
    D --> E
    D --> F
    A --> G
    
    C --> L
    L --> M
    B --> L
    
    F --> H
    F --> I
    H --> J
    J --> K
    J --> N
    G --> J
    
    N --> O
    O --> P
    
    Q --> R
    R --> S
    R --> T
    
    style A fill:#e1f5ff
    style J fill:#fff9c4
    style N fill:#c8e6c9
    style T fill:#f3e5f5
```

---

## 7. Flujo de Navegación y Rutas

Este diagrama muestra todas las rutas de la aplicación y cómo se navega entre ellas:

```mermaid
flowchart TD
    A[Usuario accede a la aplicación] --> B{¿Autenticado?}
    
    B -->|No| C[/login - LoginPage]
    C --> D[Usuario ingresa email]
    D --> E[Magic Link enviado]
    E --> F[Usuario hace clic en link]
    F --> C
    F --> G[Autenticación exitosa]
    
    B -->|Sí| H[/dashboard - DashboardLayout]
    G --> H
    
    H --> I[/dashboard - DashboardPage]
    H --> J[/dashboard/inventory - InventoryPage]
    H --> K[/dashboard/metrics - MetricsPage]
    
    I --> L[Ver métricas generales]
    I --> J
    I --> K
    
    J --> M[Agregar producto]
    J --> N[Editar producto]
    J --> O[Eliminar producto]
    J --> P[Ver código QR]
    J --> Q[Buscar productos]
    
    P --> R[Mostrar QR en diálogo]
    R --> S[Imprimir etiqueta]
    
    T[Escaneo de QR externo] --> U[/product/:sku - ProductDetailPage]
    U --> V[Mostrar detalles públicos]
    V --> W[Mostrar QR del producto]
    
    H --> X[Cerrar sesión]
    X --> C
    
    style A fill:#e1f5ff
    style H fill:#c8e6c9
    style C fill:#fff9c4
    style U fill:#f3e5f5
```

---

## 8. Flujo de Seguridad (Row Level Security)

Este diagrama muestra cómo funciona la seguridad a nivel de fila en Supabase:

```mermaid
flowchart TD
    A[Usuario autenticado] --> B[Request a Supabase]
    B --> C[Supabase verifica JWT token]
    C --> D{¿Token válido?}
    
    D -->|No| E[Rechazar request]
    D -->|Sí| F[Extraer user_id del token]
    
    F --> G[RLS Policy activada]
    G --> H{¿Tipo de operación?}
    
    H -->|SELECT| I[Policy: SELECT solo productos WHERE user_id = auth.uid]
    H -->|INSERT| J[Policy: INSERT solo si user_id = auth.uid]
    H -->|UPDATE| K[Policy: UPDATE solo productos WHERE user_id = auth.uid]
    H -->|DELETE| L[Policy: DELETE solo productos WHERE user_id = auth.uid]
    
    I --> M[Ejecutar query con filtro automático]
    J --> M
    K --> M
    L --> M
    
    M --> N{¿Query exitosa?}
    N -->|Sí| O[Retornar datos al usuario]
    N -->|No| P[Retornar error]
    
    Q[Request público: getProductBySku] --> R[No requiere autenticación]
    R --> S[SELECT productos por SKU]
    S --> T[Retornar datos públicos]
    
    style A fill:#e1f5ff
    style O fill:#c8e6c9
    style T fill:#c8e6c9
    style E fill:#ffcdd2
    style P fill:#ffcdd2
```

---

## Resumen de Componentes Principales

### Frontend
- **React 18**: Biblioteca de UI
- **Vite**: Build tool y dev server
- **TypeScript**: Tipado estático
- **React Router**: Enrutamiento
- **Tailwind CSS**: Estilos
- **Radix UI**: Componentes accesibles

### Backend
- **Supabase**: Backend como servicio
  - Autenticación (Magic Link)
  - Base de datos PostgreSQL
  - Row Level Security (RLS)

### CI/CD
- **GitHub Actions**: Automatización
- **SonarCloud**: Análisis de código
- **Vercel**: Hosting y deployment

### Funcionalidades Clave
1. **Autenticación sin contraseña**: Magic Link
2. **Gestión de inventario**: CRUD completo
3. **Generación automática de SKU**: Basado en nombre del producto
4. **Códigos QR**: Para acceso rápido a productos
5. **Seguridad por usuario**: RLS garantiza aislamiento de datos
6. **Deployment automático**: CI/CD completo

---

## Notas Importantes

1. **Rate Limiting**: El sistema previene spam limitando solicitudes de Magic Link a 1 por minuto
2. **SKU Único**: Se verifica la unicidad antes de asignar un SKU generado automáticamente
3. **QR Codes**: Contienen URLs que apuntan a la página de detalles del producto
4. **RLS**: Todas las operaciones de base de datos están protegidas por Row Level Security
5. **Páginas públicas**: La página de detalles del producto es accesible sin autenticación para permitir el escaneo de QR

---

*Última actualización: Enero 2025*

