# 🚀 Guía de Despliegue - Pathfinder Builder

## Opciones de Despliegue

### 🎯 Netlify (Recomendado)
- **Ideal para**: Proyectos de frontend con generación estática
- **Ventajas**: Deploy automático, CDN global, SSL gratuito
- **Costo**: Gratis para proyectos pequeños
- **Límites**: 100GB bandwidth/mes, 300 build minutes/mes

### ⚡ Vercel
- **Ideal para**: Aplicaciones Next.js
- **Ventajas**: Optimizado para Next.js, Edge Functions
- **Costo**: Gratis para uso personal
- **Límites**: 100GB bandwidth/mes, 6000 serverless function executions/día

### 🌊 Railway
- **Ideal para**: Full-stack applications
- **Ventajas**: Base de datos incluida, fácil escalamiento
- **Costo**: $5/mes por servicio
- **Límites**: Sin límites estrictos

## 🎯 Despliegue en Netlify (Paso a Paso)

### 1. Preparar el Repositorio

```bash
# Asegurar que el código está en GitHub
git add .
git commit -m "Preparar para deploy en producción"
git push origin main
```

### 2. Configurar Netlify

#### Conectar repositorio:
1. **Ir a [Netlify](https://netlify.com)**
2. **Crear cuenta** o iniciar sesión
3. **Click en "New site from Git"**
4. **Conectar con GitHub** y autorizar
5. **Seleccionar** el repositorio `pathfinder-builder`

#### Configuración de build:
```yaml
# Build settings en Netlify
Build command: npm run build
Publish directory: .next
Functions directory: netlify/functions
```

#### Variables de entorno en Netlify:
1. **Ir a** `Site settings` → `Environment variables`
2. **Agregar variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxx
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://tu-sitio.netlify.app
   ```

### 3. Configuración avanzada de Netlify

#### Archivo `netlify.toml` (ya incluido):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## ⚡ Despliegue en Vercel

### 1. Configurar Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy desde el directorio del proyecto
vercel

# Seguir las instrucciones interactivas
```

### 2. Configuración de variables de entorno

```bash
# Agregar variables una por una
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add REPLICATE_API_TOKEN

# O usar el dashboard de Vercel
```

### 3. Archivo `vercel.json` (opcional):
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

## 🌊 Despliegue en Railway

### 1. Configurar Railway

1. **Ir a [Railway](https://railway.app)**
2. **Crear cuenta** con GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. **Seleccionar** repositorio

### 2. Configuración

#### Variables de entorno:
```bash
# En el dashboard de Railway
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxx
NODE_ENV=production
PORT=3000
```

#### Build settings:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

## 🔧 Configuración de Producción en Supabase

### 1. Políticas de seguridad

Verificar que las políticas RLS estén habilitadas:

```sql
-- Verificar RLS en todas las tablas
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Activar RLS si no está activo
ALTER TABLE user_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_scenario_progress ENABLE ROW LEVEL SECURITY;
```

### 2. Configurar dominios permitidos

En Supabase → `Authentication` → `URL Configuration`:

```
Site URL: https://tu-dominio.netlify.app
Redirect URLs: 
- https://tu-dominio.netlify.app/auth/callback
- https://tu-dominio.netlify.app/login
```

### 3. Backup automático

En Supabase → `Settings` → `Database`:
- Activar **Point-in-time Recovery (PITR)**
- Configurar **Scheduled backups**

## 🎨 Configuración de Replicate para Producción

### 1. Método de pago

1. **Ir a** [Billing](https://replicate.com/account/billing)
2. **Agregar** método de pago
3. **Configurar** límites de gasto mensuales

### 2. Monitoreo de uso

```bash
# Verificar créditos restantes
curl -H "Authorization: Token $REPLICATE_API_TOKEN" \
  https://api.replicate.com/v1/account
```

### 3. Optimización de costos

- **Reducir calidad** de imágenes si es necesario
- **Implementar cache** para imágenes generadas
- **Limitar** generaciones por usuario/día

## 📊 Monitoreo y Analíticas

### 1. Configurar Sentry (Opcional)

```bash
npm install @sentry/nextjs

# Configurar en next.config.js
```

### 2. Google Analytics (Opcional)

```env
# Agregar a variables de entorno
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Uptime monitoring

- **UptimeRobot**: Gratis para 50 monitores
- **Pingdom**: Plan gratuito disponible
- **StatusCake**: Gratis para sitios públicos

## 🔒 Configuración de Seguridad

### 1. Headers de seguridad

Ya configurados en `next.config.mjs`:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }
]
```

### 2. Rate limiting (Recomendado)

Para APIs de generación de imágenes:

```typescript
// lib/rate-limit.ts
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function rateLimit(identifier: string) {
  const result = await redis.incr(`rate_limit:${identifier}`)
  if (result === 1) {
    await redis.expire(`rate_limit:${identifier}`, 3600) // 1 hora
  }
  return result > 10 // Máximo 10 requests por hora
}
```

## 🚨 Checklist Pre-Deploy

### Código y Build
- [ ] `npm run build` ejecuta sin errores
- [ ] `npm run type-check` pasa todas las verificaciones
- [ ] `npm run lint` sin errores críticos
- [ ] Todas las pruebas pasan
- [ ] Variables de entorno configuradas

### Base de Datos
- [ ] Políticas RLS habilitadas y probadas
- [ ] Backup configurado
- [ ] Datos de prueba eliminados
- [ ] Índices de performance creados

### APIs Externas
- [ ] Replicate API key válida y con créditos
- [ ] Límites de rate configurados
- [ ] Método de pago configurado (producción)

### Seguridad
- [ ] Headers de seguridad configurados
- [ ] Dominio configurado en Supabase Auth
- [ ] CORS configurado correctamente
- [ ] No hay secrets en el código

### Performance
- [ ] Imágenes optimizadas
- [ ] Lazy loading implementado
- [ ] Compresión habilitada
- [ ] CDN configurado

## 🔄 Post-Deploy

### 1. Verificar funcionalidad

- [ ] **Página principal** carga correctamente
- [ ] **Registro de usuario** funciona
- [ ] **Login** funciona
- [ ] **Creación de personajes** funciona
- [ ] **Generación de imágenes** funciona
- [ ] **Aventuras** se cargan y funcionan
- [ ] **Exportación de personajes** funciona

### 2. Performance testing

```bash
# Lighthouse CI (opcional)
npm install -g @lhci/cli
lhci autorun

# Análisis de bundle
npm run analyze
```

### 3. Monitoreo continuo

- **Configurar alertas** de uptime
- **Monitorear** logs de errores
- **Revisar** métricas de performance
- **Verificar** costos de APIs regularmente

## 🆘 Rollback Plan

### Netlify/Vercel
1. **Ir al dashboard** del proveedor
2. **Deployments** → Seleccionar versión anterior
3. **Restore** o **Revert**

### Base de datos
1. **Supabase** → **Database** → **Backups**
2. **Restore** from point-in-time

### Código
```bash
# Revertir commit problemático
git revert HEAD
git push origin main

# O rollback a commit específico
git reset --hard <commit-hash>
git push --force origin main
```

## 📞 Soporte Post-Deploy

Para problemas después del deploy:

1. **Verificar** status de servicios (Netlify, Supabase, Replicate)
2. **Revisar** logs de errores en el dashboard del proveedor
3. **Comprobar** variables de entorno
4. **Verificar** configuración de DNS (si usas dominio personalizado)
5. **Contactar soporte** del proveedor si es necesario 