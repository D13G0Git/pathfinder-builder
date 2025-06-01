# Pathfinder Builder

Un creador de personajes narrativo para Pathfinder 2e, donde tu historia determina tu aventura.

## 🎯 Descripción

Pathfinder Builder es una aplicación web interactiva que te permite crear personajes para Pathfinder 2e a través de una experiencia narrativa. En lugar de simplemente elegir estadísticas, vivirás una historia donde tus decisiones darán forma a tu personaje.

## ✨ Características principales

- **Experiencia narrativa**: Crea tu personaje a través de una historia interactiva con múltiples elecciones que impactan en las características finales.
- **Compatibilidad con FoundryVTT**: Exporta tu personaje en formato JSON para importarlo directamente en FoundryVTT.
- **Biblioteca de personajes**: Revisa tus personajes creados anteriormente y descubre personajes creados por otros usuarios.
- **Interfaz intuitiva**: Diseño moderno y fácil de usar que te guía a través de toda la experiencia de creación.
- **Generación de avatares IA**: Crea avatares únicos para tus personajes usando IA.
- **Sistema de aventuras**: Vive aventuras interactivas con tus personajes creados.

## 🚀 Tecnologías utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Shadcn/ui, Radix UI
- **Backend**: Supabase (Base de datos y autenticación)
- **IA**: Replicate (Generación de imágenes)
- **Deployment**: Netlify

## 📚 Documentación

### 🔧 Guías de Configuración
- **[Configuración del Entorno](./docs/ENVIRONMENT_SETUP.md)** - Guía completa paso a paso para configurar el proyecto desde cero
- **[Esquema de Base de Datos](./docs/DATABASE_SCHEMA.md)** - Estructura completa de la base de datos y migraciones SQL
- **[Guía de Despliegue](./docs/DEPLOYMENT_GUIDE.md)** - Instrucciones detalladas para deploy en producción

### 🎮 Características del Juego
- **[Builds de Foundry VTT](./docs/FOUNDRY_VTT_BUILDS.md)** - Sistema de exportación y builds disponibles
- **[Funcionalidad de Música](./docs/MUSIC_FEATURE.md)** - Sistema de música ambiental
- **[Mejoras Responsive](./docs/RESPONSIVE_IMPROVEMENTS.md)** - Optimizaciones para dispositivos móviles

### 🔧 Desarrollo y API
- **[Referencia de API](./docs/API_REFERENCE.md)** - Documentación completa de endpoints y funciones
- **[Lista de Verificación de Producción](./docs/PRODUCTION_CHECKLIST.md)** - Checklist completo para deploy en producción

### 🔐 Autenticación y Seguridad
- **[Arreglos de Autenticación](./docs/AUTH_FIX_SUMMARY.md)** - Resumen de correcciones de autenticación
- **[Sincronización de Auth](./docs/AUTH_SYNCHRONIZATION_FIX.md)** - Detalles técnicos de sincronización
- **[Rediseño de Login](./docs/LOGIN_REDESIGN.md)** - Mejoras en la experiencia de inicio de sesión

## 🛠️ Configuración Rápida

### Prerrequisitos del Sistema

| Herramienta | Versión Mínima | Notas |
|-------------|----------------|-------|
| **Node.js** | 18.0.0+ | [Descargar](https://nodejs.org/) |
| **npm** | 9.0.0+ | Incluido con Node.js |
| **Git** | 2.0+ | Para clonar el repositorio |

### Verificar Prerrequisitos

```bash
# Verificar versiones instaladas
node --version  # Debe mostrar v18.0.0+
npm --version   # Debe mostrar 9.0.0+
git --version   # Cualquier versión 2.0+
```

### Instalación Básica

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/pathfinder-builder.git
cd pathfinder-builder

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales (ver abajo)

# 4. Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno Básicas

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# 🔗 Supabase (OBLIGATORIO)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 🎨 Replicate API (OBLIGATORIO para generación de imágenes)
REPLICATE_API_TOKEN=r8_***tu_token_aquí***

# 🔧 Configuración opcional
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Configuración de Servicios Externos

#### 🗄️ Supabase Setup

1. **Crear proyecto**:
   - Ir a [Supabase](https://supabase.com)
   - Crear nuevo proyecto
   - Esperar 2-3 minutos para completar setup

2. **Obtener credenciales**:
   - `Settings` → `API`
   - Copiar `Project URL` y `anon public key`

3. **Configurar base de datos**:
   - Ir a `SQL Editor`
   - Ejecutar script de [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)

#### 🎨 Replicate Setup

1. **Crear cuenta**:
   - Ir a [Replicate](https://replicate.com)
   - Registrarse con GitHub o email

2. **Obtener API key**:
   - Ir a [API Tokens](https://replicate.com/account/api-tokens)
   - Crear nuevo token
   - Copiar token (empieza con `r8_`)

3. **Configurar billing** (para producción):
   - Agregar método de pago
   - Cada imagen cuesta ~$0.01-0.02

### Verificación de Instalación

```bash
# Ejecutar todos los checks
npm run build      # Build de producción
npm run type-check # Verificación TypeScript
npm run lint       # Verificación de código

# Si todo funciona, iniciar desarrollo
npm run dev
```

**Verificar en el navegador**:
- Ir a `http://localhost:3000`
- Registrar nuevo usuario
- Crear un personaje
- Generar imagen de avatar

**Para configuración detallada**, consulta [ENVIRONMENT_SETUP.md](./docs/ENVIRONMENT_SETUP.md)

## 📦 Scripts Disponibles

| Script | Descripción | Uso |
|--------|-------------|-----|
| `npm run dev` | Servidor de desarrollo con hot-reload | Desarrollo diario |
| `npm run build` | Build optimizado para producción | Pre-deploy |
| `npm run start` | Servidor de producción | Post-build |
| `npm run lint` | Verificación de calidad de código | CI/CD |
| `npm run lint:fix` | Corrección automática de lint | Desarrollo |
| `npm run type-check` | Verificación de tipos TypeScript | Pre-commit |

## 🚀 Despliegue en Producción

### Opciones de Deployment

| Plataforma | Costo | Ideal Para | Configuración |
|------------|--------|------------|---------------|
| **[Netlify](https://netlify.com)** 🎯 | Gratis | Frontend estático | [Guía detallada](./docs/DEPLOYMENT_GUIDE.md#netlify) |
| **[Vercel](https://vercel.com)** ⚡ | Gratis | Apps Next.js | [Guía detallada](./docs/DEPLOYMENT_GUIDE.md#vercel) |
| **[Railway](https://railway.app)** 🌊 | $5/mes | Full-stack | [Guía detallada](./docs/DEPLOYMENT_GUIDE.md#railway) |

### Deploy Rápido en Netlify

```bash
# 1. Preparar código
npm run build
git add . && git commit -m "Preparar para producción"

# 2. Conectar en Netlify.com
# - New site from Git
# - Conectar repositorio GitHub
# - Build command: npm run build
# - Publish directory: .next

# 3. Configurar variables de entorno en Netlify
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY  
# REPLICATE_API_TOKEN
```

**Para instrucciones completas**, consulta [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)

## 🧪 Testing y Calidad de Código

```bash
# Verificar tipos
npm run type-check

# Linter
npm run lint

# Build de producción
npm run build
```

## 📊 Monitoreo y Performance

- **Web Vitals**: Optimizado para LCP, CLS, FID
- **SEO**: Meta tags configurados
- **Accesibilidad**: Componentes Radix UI conformes a ARIA
- **Performance**: Lazy loading, optimización de imágenes

## 🔒 Seguridad

- Variables de entorno validadas
- Políticas RLS en Supabase
- Headers de seguridad configurados
- Validación de inputs en APIs

## 🤝 Contribuciones

¡Nos encantaría contar con tu ayuda para mejorar Pathfinder Builder! 

### Formas de Contribuir

- 🐛 **Reportar bugs** y problemas
- ✨ **Proponer nuevas características**
- 📝 **Mejorar documentación**
- 🎨 **Mejorar UI/UX**
- 🧪 **Escribir tests**
- 🛠️ **Corregir código**

### Proceso Rápido

```bash
# 1. Fork y clonar
git clone https://github.com/tu-usuario/pathfinder-builder.git

# 2. Crear rama de trabajo
git checkout -b feature/mi-mejora

# 3. Hacer cambios y commit
git commit -m "feat: agregar nueva característica"

# 4. Push y crear Pull Request
git push origin feature/mi-mejora
```

**Para instrucciones detalladas**, consulta [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

## 📝 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:
- Abre un [issue](https://github.com/tu-usuario/pathfinder-builder/issues)
- Contacta al equipo de desarrollo

---

Hecho con ❤️ para la comunidad de Pathfinder 2e
