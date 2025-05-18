# Pathfinder Builder

Un creador de personajes narrativo para Pathfinder 2e, donde tu historia determina tu aventura.

## Descripción

Pathfinder Builder es una aplicación web interactiva que te permite crear personajes para Pathfinder 2e a través de una experiencia narrativa. En lugar de simplemente elegir estadísticas, vivirás una historia donde tus decisiones darán forma a tu personaje.

## Características principales

- **Experiencia narrativa**: Crea tu personaje a través de una historia interactiva con múltiples elecciones que impactan en las características finales.
- **Compatibilidad con FoundryVTT**: Exporta tu personaje en formato JSON para importarlo directamente en FoundryVTT.
- **Biblioteca de personajes**: Revisa tus personajes creados anteriormente y descubre personajes creados por otros usuarios.
- **Interfaz intuitiva**: Diseño moderno y fácil de usar que te guía a través de toda la experiencia de creación.

## Cómo empezar

1. Accede a la aplicación web
2. Inicia una nueva historia
3. Toma decisiones que moldearán tu personaje
4. Al final de la experiencia, obtendrás una hoja de personaje completa
5. Exporta tu personaje para usarlo en FoundryVTT o guárdalo en tu biblioteca

## Tecnologías utilizadas

- Next.js
- Tailwind CSS
- FoundryVTT API compatible

## Contribuciones

¿Interesado en contribuir? ¡Genial! Siéntete libre de:
- Reportar errores
- Sugerir nuevas características
- Enviar pull requests

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

## Configuración del proyecto

1. Clona este repositorio
2. Instala las dependencias con `npm install`
3. Configura las variables de entorno:
   - Crea un archivo `.env.local` en la raíz del proyecto
   - Añade las siguientes variables:
     ```
     # Supabase
     NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
     
     # Replicate - Servicio de generación de imágenes IA
     REPLICATE_API_TOKEN=tu_token_api_replicate
     ```
   - Para obtener tu token de Replicate:
     1. Regístrate en [Replicate](https://replicate.com/)
     2. Ve a tu perfil y busca la sección de API tokens
     3. Crea un nuevo token y cópialo en tu archivo `.env.local`

4. Inicia el servidor de desarrollo con `npm run dev`
