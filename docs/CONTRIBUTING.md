# 🤝 Guía de Contribución - Pathfinder Builder

¡Gracias por tu interés en contribuir a Pathfinder Builder! Esta guía te ayudará a empezar.

## 🌟 Cómo Contribuir

### Formas de Contribuir

- 🐛 **Reportar bugs** - Encuentra y reporta errores
- ✨ **Proponer características** - Sugiere nuevas funcionalidades
- 📝 **Mejorar documentación** - Ayuda a mantener la documentación actualizada
- 🧪 **Escribir tests** - Mejora la cobertura de testing
- 🎨 **Mejorar UI/UX** - Diseño y experiencia de usuario
- 🛠️ **Corregir código** - Fix bugs y mejoras de performance

## 🚀 Primeros Pasos

### 1. Fork y Clone

```bash
# 1. Fork el repositorio en GitHub
# 2. Clonar tu fork
git clone https://github.com/TU-USERNAME/pathfinder-builder.git
cd pathfinder-builder

# 3. Agregar remote upstream
git remote add upstream https://github.com/ORIGINAL-OWNER/pathfinder-builder.git
```

### 2. Configurar Entorno de Desarrollo

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Verificar que todo funciona
npm run dev
npm run build
npm run type-check
npm run lint
```

### 3. Crear Rama de Trabajo

```bash
# Crear rama desde main
git checkout main
git pull upstream main
git checkout -b feature/nombre-de-tu-feature

# O para bugfixes
git checkout -b fix/descripcion-del-bug
```

## 📋 Estándares de Código

### Convenciones de Naming

```typescript
// Archivos y carpetas: kebab-case
character-creation.tsx
game-interface.tsx

// Componentes: PascalCase
export function CharacterCard() {}
export function GameInterface() {}

// Variables y funciones: camelCase
const characterData = {};
function handleSubmit() {}

// Constantes: UPPER_SNAKE_CASE
const API_ENDPOINTS = {};
const DEFAULT_CONFIG = {};

// Interfaces: PascalCase con I prefix (opcional)
interface Character {}
interface IGameScenario {} // Si prefieres prefijo
```

### Estructura de Componentes

```typescript
// components/character-card.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Character } from "@/types"

interface CharacterCardProps {
  character: Character
  onEdit?: () => void
  onDelete?: () => void
}

export function CharacterCard({ 
  character, 
  onEdit, 
  onDelete 
}: CharacterCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = async () => {
    setIsLoading(true)
    try {
      onEdit?.()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">{character.name}</h3>
      <p className="text-muted-foreground">
        {character.race} {character.class}
      </p>
      
      <div className="mt-4 flex gap-2">
        <Button onClick={handleEdit} disabled={isLoading}>
          Editar
        </Button>
        <Button variant="outline" onClick={onDelete}>
          Eliminar
        </Button>
      </div>
    </div>
  )
}
```

### Manejo de Estado

```typescript
// Usar useState para estado local
const [isOpen, setIsOpen] = useState(false)

// Usar useEffect con cleanup
useEffect(() => {
  const subscription = supabase
    .channel('changes')
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}, [])

// Manejo de errores consistente
try {
  const { data, error } = await supabase.from('table').select()
  if (error) throw error
  return data
} catch (error) {
  console.error('Operation failed:', error)
  toast.error('Error', {
    description: error.message || 'Something went wrong'
  })
  return null
}
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

### Escribir Tests

```typescript
// __tests__/components/character-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { CharacterCard } from '@/components/character-card'

const mockCharacter = {
  id: '1',
  name: 'Test Character',
  class: 'Guerrero',
  race: 'Humano',
  level: 1
}

describe('CharacterCard', () => {
  it('renders character information', () => {
    render(<CharacterCard character={mockCharacter} />)
    
    expect(screen.getByText('Test Character')).toBeInTheDocument()
    expect(screen.getByText('Humano Guerrero')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn()
    render(<CharacterCard character={mockCharacter} onEdit={onEdit} />)
    
    fireEvent.click(screen.getByText('Editar'))
    expect(onEdit).toHaveBeenCalled()
  })
})
```

## 🎨 Estándares de UI

### Usar Componentes del Design System

```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ✅ Correcto
<Button variant="outline" size="sm">
  Acción
</Button>

// ❌ Evitar custom buttons sin necesidad
<button className="custom-button">
  Acción
</button>
```

### Clases de Tailwind Consistentes

```typescript
// ✅ Estructura clara y consistente
<div className="flex flex-col gap-4 p-6 rounded-lg border bg-card">
  <h2 className="text-2xl font-bold tracking-tight">Título</h2>
  <p className="text-muted-foreground">Descripción</p>
</div>

// ❌ Clases desordenadas
<div className="p-6 bg-card border gap-4 rounded-lg flex flex-col">
  <h2 className="tracking-tight font-bold text-2xl">Título</h2>
  <p className="text-muted-foreground">Descripción</p>
</div>
```

### Responsive Design

```typescript
// Usar breakpoints de Tailwind consistentemente
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Contenido */}
</div>

// Texto responsive
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Título Principal
</h1>
```

## 🔧 Commits y Pull Requests

### Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Nuevas características
git commit -m "feat: agregar sistema de aventuras"
git commit -m "feat(auth): implementar login con Google"

# Correcciones de bugs
git commit -m "fix: corregir error en generación de imágenes"
git commit -m "fix(game): arreglar progreso de escenarios"

# Documentación
git commit -m "docs: actualizar guía de instalación"
git commit -m "docs(api): agregar ejemplos de endpoints"

# Refactoring
git commit -m "refactor: optimizar componente GameInterface"

# Styling
git commit -m "style: mejorar responsive en móviles"

# Tests
git commit -m "test: agregar tests para CharacterCard"
```

### Template de Pull Request

```markdown
## 📋 Descripción

Breve descripción de los cambios realizados.

## 🎯 Tipo de Cambio

- [ ] 🐛 Bug fix
- [ ] ✨ Nueva característica
- [ ] 💥 Breaking change
- [ ] 📝 Documentación
- [ ] 🎨 Styling
- [ ] ♻️ Refactoring
- [ ] 🧪 Tests

## 🧪 Testing

- [ ] Tests existentes pasan
- [ ] Nuevos tests agregados (si aplica)
- [ ] Funcionalidad probada manualmente

## 📱 Responsive

- [ ] Probado en móviles
- [ ] Probado en tablets
- [ ] Probado en desktop

## 📷 Screenshots

Si aplica, agregar screenshots del cambio.

## ✅ Checklist

- [ ] `npm run build` ejecuta sin errores
- [ ] `npm run type-check` pasa
- [ ] `npm run lint` sin errores
- [ ] Commits siguen [Conventional Commits](https://conventionalcommits.org/)
- [ ] PR tiene título descriptivo
```

## 🐛 Reportar Bugs

### Template de Issue

```markdown
## 🐛 Descripción del Bug

Descripción clara del problema.

## 🔄 Pasos para Reproducir

1. Ir a '...'
2. Hacer click en '...'
3. Desplazarse hacia '...'
4. Ver error

## 🎯 Comportamiento Esperado

Qué debería pasar.

## 📱 Entorno

- **OS**: Windows/Mac/Linux
- **Navegador**: Chrome, Firefox, Safari
- **Versión del navegador**: 
- **Dispositivo**: Desktop/Mobile/Tablet

## 📷 Screenshots

Si aplica, agregar screenshots del problema.

## 📋 Información Adicional

Cualquier contexto adicional sobre el problema.
```

## ✨ Proponer Características

### Template para Feature Request

```markdown
## 🚀 Característica Propuesta

Descripción clara de la característica.

## 💡 Motivación

¿Por qué es necesaria esta característica?

## 📋 Solución Propuesta

Descripción detallada de cómo debería funcionar.

## 🎨 Alternativas Consideradas

Otras soluciones que has considerado.

## ✅ Criterios de Aceptación

- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

## 📷 Mockups/Wireframes

Si tienes diseños, agrégalos aquí.
```

## 🔍 Review Process

### Como Reviewer

1. **Verificar funcionalidad**
   - ¿El código hace lo que dice que hace?
   - ¿Hay casos edge no considerados?

2. **Revisar código**
   - ¿Sigue las convenciones del proyecto?
   - ¿Es legible y mantenible?
   - ¿Hay optimizaciones obvias?

3. **Testing**
   - ¿Hay tests apropiados?
   - ¿Los tests cubren casos importantes?

4. **UI/UX**
   - ¿Es responsive?
   - ¿Sigue el design system?
   - ¿Es accesible?

### Como Contributor

- ❇️ **Responde rápido** a comentarios de review
- 🔄 **Mantén PR pequeños** y enfocados
- 📝 **Documenta cambios complejos**
- 🧪 **Incluye tests** para nueva funcionalidad
- 🎯 **Un PR = Un problema/característica**

## 📚 Recursos Útiles

### Documentación del Proyecto

- [Configuración del Entorno](./ENVIRONMENT_SETUP.md)
- [Esquema de Base de Datos](./DATABASE_SCHEMA.md)
- [Referencia de API](./API_REFERENCE.md)
- [Guía de Despliegue](./DEPLOYMENT_GUIDE.md)

### Tecnologías Utilizadas

- **[Next.js 15](https://nextjs.org/docs)** - Framework React
- **[TypeScript](https://www.typescriptlang.org/docs/)** - Tipado estático
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Framework CSS
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes UI
- **[Supabase](https://supabase.com/docs)** - Backend y base de datos
- **[Replicate](https://replicate.com/docs)** - IA para generación de imágenes

### Herramientas de Desarrollo

- **[ESLint](https://eslint.org/docs/)** - Linting
- **[Prettier](https://prettier.io/docs/)** - Formateo de código
- **[Jest](https://jestjs.io/docs/)** - Testing framework
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/)** - Testing de componentes

## 🆘 ¿Necesitas Ayuda?

- 📖 **Documentación**: Revisa los archivos en `/docs`
- 💬 **Discusiones**: Usa GitHub Discussions para preguntas
- 🐛 **Issues**: Crea un issue para bugs o problemas
- 📧 **Email**: Contacta a los maintainers directamente

¡Gracias por contribuir a Pathfinder Builder! 🎲⚔️ 