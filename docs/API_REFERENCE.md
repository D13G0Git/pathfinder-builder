# 📚 API Reference - Pathfinder Builder

## Endpoints Disponibles

### 🎨 Generación de Imágenes

#### `POST /api/generate-image`

Genera un avatar para un personaje usando Replicate AI.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "prompt": "string",
  "character": {
    "name": "string",
    "race": "string",
    "class": "string",
    "gender": "string"
  }
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://replicate.delivery/xxx/output.webp",
  "base64": "data:image/webp;base64,..."
}
```

**Errores:**
- `400` - Datos faltantes o inválidos
- `429` - Rate limit excedido
- `500` - Error interno del servidor

**Ejemplo:**
```javascript
const response = await fetch('/api/generate-image', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: "Un guerrero élfico con armadura dorada",
    character: {
      name: "Elaria",
      race: "Elfo",
      class: "Guerrero",
      gender: "Femenino"
    }
  })
});

const data = await response.json();
```

## 🗄️ Base de Datos (Supabase)

### Tablas Principales

#### `user_characters`
Almacena los personajes creados por los usuarios.

**Estructura:**
```sql
CREATE TABLE user_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  class VARCHAR(100) NOT NULL,
  race VARCHAR(100) NOT NULL,
  level INTEGER DEFAULT 1,
  avatar TEXT,
  avatar_base64 TEXT,
  character_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Políticas RLS:**
- Los usuarios solo pueden ver/editar sus propios personajes
- Se requiere autenticación para todas las operaciones

#### `adventures`
Almacena las aventuras de los usuarios.

**Estructura:**
```sql
CREATE TABLE adventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  character_id UUID REFERENCES user_characters(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  current_stage INTEGER DEFAULT 1,
  total_stages INTEGER DEFAULT 5,
  status VARCHAR(50) DEFAULT 'in_progress',
  adventure_data JSONB,
  result_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

#### `game_scenarios`
Escenarios individuales de las aventuras.

**Estructura:**
```sql
CREATE TABLE game_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adventure_id UUID REFERENCES adventures(id),
  scenario_number INTEGER NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  choice_1 TEXT NOT NULL,
  choice_2 TEXT NOT NULL,
  choice_3 TEXT,
  choice_4 TEXT,
  result_1 TEXT,
  result_2 TEXT,
  result_3 TEXT,
  result_4 TEXT
);
```

#### `player_scenario_progress`
Progreso del jugador en cada aventura.

**Estructura:**
```sql
CREATE TABLE player_scenario_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adventure_id UUID REFERENCES adventures(id),
  user_id UUID REFERENCES auth.users(id),
  current_scenario_number INTEGER NOT NULL,
  character_stats JSONB NOT NULL,
  last_played TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Operaciones de Base de Datos

### Crear Personaje

```javascript
const { data, error } = await supabase
  .from('user_characters')
  .insert({
    user_id: user.id,
    name: 'Nombre del Personaje',
    class: 'Guerrero',
    race: 'Humano',
    level: 1,
    avatar: 'url_de_imagen',
    character_data: {
      // Datos adicionales del personaje
    }
  });
```

### Obtener Personajes del Usuario

```javascript
const { data, error } = await supabase
  .from('user_characters')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

### Crear Nueva Aventura

```javascript
const { data, error } = await supabase
  .from('adventures')
  .insert({
    user_id: user.id,
    character_id: 'character-uuid',
    name: 'Aventura de [Nombre]',
    description: 'Descripción de la aventura',
    current_stage: 1,
    total_stages: 5,
    status: 'in_progress'
  });
```

### Obtener Aventuras del Usuario

```javascript
const { data, error } = await supabase
  .from('adventures')
  .select(`
    *,
    character:user_characters(*)
  `)
  .eq('user_id', user.id)
  .order('updated_at', { ascending: false });
```

### Actualizar Progreso de Aventura

```javascript
const { error } = await supabase
  .from('player_scenario_progress')
  .update({
    current_scenario_number: nextScenario,
    character_stats: {
      health: 105,
      gold: 200,
      experience: 150,
      strength: 12
    },
    last_played: new Date().toISOString()
  })
  .eq('adventure_id', adventureId)
  .eq('user_id', user.id);
```

## 🎯 Client-Side Functions

### Autenticación

```javascript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Registro
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});

// Logout
const { error } = await supabase.auth.signOut();

// Obtener usuario actual
const { data: { user } } = await supabase.auth.getUser();
```

### Character Builder Functions

```javascript
import { getCharacterBuild, hasBuildAvailable } from '@/lib/character-builds';

// Verificar si hay build disponible
const hasFoundryBuild = hasBuildAvailable('Guerrero', 'Humano');

// Obtener build completa
const foundryBuild = getCharacterBuild('Guerrero', 'Humano');
```

## 🔄 Real-time Subscriptions

### Escuchar cambios en personajes

```javascript
const subscription = supabase
  .channel('user_characters_changes')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'user_characters',
      filter: `user_id=eq.${user.id}`
    }, 
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

## 🎮 Game Logic Functions

### Manejo de Decisiones

```javascript
// Estructura de decisión
const choice = {
  scenarioId: 'uuid',
  choiceIndex: 1, // 1-4
  result: 'Texto del resultado'
};

// Guardar decisión
const { error } = await supabase
  .from('decisions')
  .insert({
    character_id: character.id,
    scenario_id: choice.scenarioId,
    choice_id: `choice_${choice.choiceIndex}`,
    result: choice.result
  });
```

### Cálculo de Estadísticas

```javascript
// Actualizar estadísticas basado en elecciones
function updateCharacterStats(currentStats, scenario, choice) {
  const updatedStats = { ...currentStats };
  
  // Ejemplo de lógica de estadísticas
  switch (scenario.scenario_number) {
    case 1:
      if (choice === 'topLeft') {
        updatedStats.experience += 10;
      } else if (choice === 'bottomLeft') {
        updatedStats.gold += 30;
        updatedStats.experience += 15;
      }
      break;
    // ... más casos
  }
  
  return updatedStats;
}
```

## 🎨 Image Generation

### Prompts Dinámicos

```javascript
// Generar prompt basado en personaje
function generateCharacterPrompt(character) {
  const raceDescriptions = {
    'Humano': 'human with average build',
    'Elfo': 'elf with pointed ears and graceful features',
    'Enano': 'dwarf with stocky build and impressive beard',
    // ... más razas
  };
  
  const classDescriptions = {
    'Guerrero': 'warrior in heavy armor with sword',
    'Mago': 'mage with flowing robes and magical staff',
    'Pícaro': 'rogue in dark leather with daggers',
    // ... más clases
  };
  
  return `A ${raceDescriptions[character.race]} ${classDescriptions[character.class]}, fantasy art style, detailed character portrait`;
}
```

## ⚠️ Error Handling

### Patrones Comunes

```javascript
// Manejo de errores de Supabase
async function handleSupabaseOperation() {
  try {
    const { data, error } = await supabase
      .from('table')
      .select('*');
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Supabase error:', error);
    toast.error('Error', {
      description: error.message || 'Something went wrong'
    });
    return null;
  }
}

// Manejo de errores de API
async function handleAPIRequest() {
  try {
    const response = await fetch('/api/endpoint');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API error:', error);
    toast.error('Error de red', {
      description: 'No se pudo conectar con el servidor'
    });
    return null;
  }
}
```

## 🔒 Security Best Practices

### Validación de Datos

```typescript
// Usar Zod para validación
import { z } from 'zod';

const CharacterSchema = z.object({
  name: z.string().min(1).max(255),
  class: z.enum(['Guerrero', 'Mago', 'Pícaro', 'Clérigo']),
  race: z.enum(['Humano', 'Elfo', 'Enano', 'Halfling']),
  level: z.number().int().min(1).max(20)
});

// Validar en API routes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CharacterSchema.parse(body);
    
    // Procesar datos validados
  } catch (error) {
    return Response.json(
      { error: 'Invalid data format' }, 
      { status: 400 }
    );
  }
}
```

### Row Level Security

```sql
-- Política para personajes
CREATE POLICY "Users can only access own characters"
ON user_characters
FOR ALL
USING (auth.uid() = user_id);

-- Política para aventuras
CREATE POLICY "Users can only access own adventures"
ON adventures
FOR ALL
USING (auth.uid() = user_id);
```

## 📊 Performance Optimization

### Query Optimization

```javascript
// Usar select específicos
const { data } = await supabase
  .from('user_characters')
  .select('id, name, class, race, level') // Solo campos necesarios
  .eq('user_id', user.id);

// Usar índices en queries frecuentes
// CREATE INDEX idx_characters_user_id ON user_characters(user_id);
```

### Caching

```javascript
// Cache de builds de Foundry VTT
const buildCache = new Map();

function getCachedBuild(className, race) {
  const key = `${className}-${race}`;
  if (buildCache.has(key)) {
    return buildCache.get(key);
  }
  
  const build = getCharacterBuild(className, race);
  buildCache.set(key, build);
  return build;
}
``` 