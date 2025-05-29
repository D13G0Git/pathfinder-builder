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

## 🚀 Tecnologías utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Shadcn/ui, Radix UI
- **Backend**: Supabase (Base de datos y autenticación)
- **IA**: Replicate (Generación de imágenes)
- **Deployment**: Netlify

## 🛠️ Configuración del proyecto

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- Cuenta de Replicate (para generación de imágenes)

### Instalación

1. **Clona este repositorio**
   ```bash
   git clone https://github.com/tu-usuario/pathfinder-builder.git
   cd pathfinder-builder
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp env.example .env.local
   ```
   
   Edita `.env.local` con tus credenciales:
   ```env
   # Supabase (Requerido)
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica_anonima
   
   # Replicate (Requerido para generación de imágenes)
   REPLICATE_API_TOKEN=tu_token_api_replicate
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

### Configuración de Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecuta las migraciones SQL necesarias (ver `docs/database-schema.sql`)
3. Configura las políticas RLS según tus necesidades
4. Obtén la URL y la clave anónima de tu proyecto

### Configuración de Replicate

1. Regístrate en [Replicate](https://replicate.com/)
2. Ve a tu perfil → API tokens
3. Crea un nuevo token y cópialo en tu `.env.local`

## 📦 Scripts disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter ESLint
- `npm run lint:fix` - Corregir errores de lint automáticamente
- `npm run type-check` - Verificación de tipos TypeScript

## 🚀 Despliegue en Producción

### Netlify (Recomendado)

1. **Conecta tu repositorio** en Netlify
2. **Configura las variables de entorno** en Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `REPLICATE_API_TOKEN`
3. **Deploy automático** con cada push a main

### Otros proveedores

El proyecto está configurado para desplegar en cualquier plataforma que soporte Next.js:
- Vercel
- Railway
- Render
- DigitalOcean App Platform

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

¿Interesado en contribuir? ¡Genial!

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:
- Abre un [issue](https://github.com/tu-usuario/pathfinder-builder/issues)
- Contacta al equipo de desarrollo

---

Hecho con ❤️ para la comunidad de Pathfinder 2e
