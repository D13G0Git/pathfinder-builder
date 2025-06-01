# 🔧 Configuración del Entorno - Pathfinder Builder

## Prerrequisitos del Sistema

### Node.js y npm
- **Node.js**: Versión 18.0.0 o superior
- **npm**: Versión 9.0.0 o superior (incluido con Node.js)
- **Sistema operativo**: Windows 10+, macOS 10.15+, o Linux (Ubuntu 20.04+)

### Verificar instalación
```bash
node --version  # Debe mostrar v18.0.0+
npm --version   # Debe mostrar 9.0.0+
```

## 🛠️ Configuración Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/pathfinder-builder.git
cd pathfinder-builder
```

### 2. Instalar Dependencias

```bash
# Instalación básica
npm install

# Verificar que no hay vulnerabilidades
npm audit
npm audit fix  # Si es necesario
```

### 3. Configuración de Variables de Entorno

#### Crear archivo de entorno local
```bash
# Copiar el archivo de ejemplo
cp .env.example .env.local

# O crear manualmente
touch .env.local
```

#### Variables requeridas en `.env.local`:
```env
# 🔗 Supabase (OBLIGATORIO)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica_anonima

# 🎨 Replicate API para generación de imágenes (OBLIGATORIO)
REPLICATE_API_TOKEN=r8_***tu_token_completo***

# 🔧 Configuraciones opcionales
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configuración de Supabase

#### Crear proyecto en Supabase

1. **Ir a [Supabase](https://supabase.com)**
2. **Crear cuenta** si no tienes una
3. **Crear nuevo proyecto**
   - Nombre: `pathfinder-builder`
   - Región: Elige la más cercana a tus usuarios
   - Password: Genera una contraseña segura
4. **Esperar** a que se complete la configuración (2-3 minutos)

#### Obtener credenciales

1. **En el dashboard de tu proyecto**, ir a:
   - `Settings` → `API`
2. **Copiar los valores**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Configurar base de datos

1. **Ir a** `SQL Editor` en Supabase
2. **Ejecutar el script** de `docs/DATABASE_SCHEMA.md`
3. **Verificar** que todas las tablas se crearon correctamente

### 5. Configuración de Replicate

#### Crear cuenta y obtener API key

1. **Ir a [Replicate](https://replicate.com)**
2. **Crear cuenta** con GitHub o email
3. **Ir a [API Tokens](https://replicate.com/account/api-tokens)**
4. **Crear nuevo token**
   - Nombre: `pathfinder-builder`
   - Copiar el token generado
5. **Pegar el token** en `REPLICATE_API_TOKEN`

#### Verificar créditos
- Los nuevos usuarios reciben créditos gratuitos
- Para producción, configura un método de pago
- Cada imagen cuesta aproximadamente $0.01-0.02

### 6. Verificar Configuración

#### Probar conexión a Supabase
```bash
# En el directorio del proyecto
npm run dev

# En otra terminal, probar la conexión
curl http://localhost:3000/api/test-supabase
```

#### Probar generación de imágenes
```bash
# Probar API de Replicate
curl http://localhost:3000/api/test-replicate
```

## 🔧 Configuración de Desarrollo

### Scripts de desarrollo disponibles

```bash
# Servidor de desarrollo con hot reload
npm run dev

# Verificación de tipos TypeScript
npm run type-check

# Linter para calidad de código
npm run lint
npm run lint:fix  # Corrección automática

# Build de producción
npm run build
npm run start     # Servidor de producción
```

### Configuración del editor (VSCode recomendado)

#### Extensiones recomendadas:
- **TypeScript and JavaScript Language Features** (incluido)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Auto Rename Tag**
- **Prettier - Code formatter**
- **ESLint**

#### Configuración de VSCode (`.vscode/settings.json`):
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescript"
  }
}
```

## 🔍 Solución de Problemas Comunes

### Error: "Module not found"
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Supabase connection failed"
1. Verificar que las URLs no tengan espacios en blanco
2. Confirmar que el proyecto Supabase está activo
3. Verificar las políticas RLS en Supabase

### Error: "Replicate API unauthorized"
1. Verificar que el token empiece con `r8_`
2. Confirmar que el token no ha expirado
3. Verificar créditos disponibles en Replicate

### Puerto 3000 ocupado
```bash
# Cambiar puerto
npx next dev -p 3001

# O matar proceso que usa puerto 3000
npx kill-port 3000
```

### Problemas de TypeScript
```bash
# Limpiar cache de TypeScript
npx tsc --build --clean

# Verificar configuración
npm run type-check
```

## 📝 Variables de Entorno Completas

### Desarrollo (`.env.local`)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Replicate
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Desarrollo
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Producción (Variables en Netlify/Vercel)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Replicate
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Producción
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://tu-dominio.netlify.app
```

## ✅ Checklist de Configuración

- [ ] Node.js 18+ instalado
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env.local` creado
- [ ] Proyecto Supabase creado y configurado
- [ ] Base de datos configurada con esquema
- [ ] Cuenta Replicate creada y API key obtenida
- [ ] Variables de entorno configuradas
- [ ] `npm run dev` funciona sin errores
- [ ] Login/registro funciona
- [ ] Creación de personajes funciona
- [ ] Generación de imágenes funciona

## 🆘 Soporte

Si encuentras problemas durante la configuración:

1. **Verificar** la documentación en `docs/`
2. **Revisar** errores en la consola del navegador
3. **Verificar** logs del servidor (`npm run dev`)
4. **Crear issue** en GitHub con:
   - Descripción del problema
   - Pasos para reproducir
   - Logs de error
   - Sistema operativo y versiones 