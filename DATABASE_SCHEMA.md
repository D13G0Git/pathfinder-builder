# Esquema de Base de Datos - Pathfinder Builder

## Tablas Requeridas en Supabase

### 1. user_characters

Tabla principal para almacenar los personajes de los usuarios.

```sql
CREATE TABLE user_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  class VARCHAR(100) NOT NULL,
  level INTEGER DEFAULT 1,
  race VARCHAR(100) NOT NULL,
  avatar TEXT,
  avatar_base64 TEXT,
  character_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. user_decisions

Tabla para almacenar el historial de decisiones en las aventuras.

```sql
CREATE TABLE user_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id UUID REFERENCES user_characters(id) ON DELETE CASCADE,
  scenario_id VARCHAR(255) NOT NULL,
  choice_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. scenarios (Opcional)

Para almacenar los escenarios de aventuras si decides hacerlos dinámicos.

```sql
CREATE TABLE scenarios (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  choices JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Políticas de Seguridad (Row Level Security)

### user_characters

```sql
-- Permitir que los usuarios vean solo sus propios personajes
CREATE POLICY "Users can view own characters" ON user_characters
  FOR SELECT USING (auth.uid() = user_id);

-- Permitir que los usuarios inserten sus propios personajes
CREATE POLICY "Users can insert own characters" ON user_characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permitir que los usuarios actualicen sus propios personajes
CREATE POLICY "Users can update own characters" ON user_characters
  FOR UPDATE USING (auth.uid() = user_id);

-- Permitir que los usuarios eliminen sus propios personajes
CREATE POLICY "Users can delete own characters" ON user_characters
  FOR DELETE USING (auth.uid() = user_id);
```

### user_decisions

```sql
-- Permitir que los usuarios vean solo sus propias decisiones
CREATE POLICY "Users can view own decisions" ON user_decisions
  FOR SELECT USING (auth.uid() = user_id);

-- Permitir que los usuarios inserten sus propias decisiones
CREATE POLICY "Users can insert own decisions" ON user_decisions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### scenarios

```sql
-- Permitir que todos los usuarios autenticados lean los escenarios
CREATE POLICY "Authenticated users can view scenarios" ON scenarios
  FOR SELECT USING (auth.role() = 'authenticated');
```

## Funciones de Base de Datos

### Actualizar timestamp automáticamente

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar a user_characters
CREATE TRIGGER update_user_characters_updated_at 
  BEFORE UPDATE ON user_characters 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Índices para Performance

```sql
-- Índices para user_characters
CREATE INDEX idx_user_characters_user_id ON user_characters(user_id);
CREATE INDEX idx_user_characters_created_at ON user_characters(created_at);

-- Índices para user_decisions
CREATE INDEX idx_user_decisions_user_id ON user_decisions(user_id);
CREATE INDEX idx_user_decisions_character_id ON user_decisions(character_id);
CREATE INDEX idx_user_decisions_scenario_id ON user_decisions(scenario_id);
```

## Script Completo de Configuración

```sql
-- Habilitar Row Level Security
ALTER TABLE user_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- Ejecutar todas las consultas anteriores en orden:
-- 1. Crear tablas
-- 2. Crear políticas
-- 3. Crear funciones
-- 4. Crear triggers
-- 5. Crear índices
```

## Datos de Prueba (Desarrollo)

```sql
-- Solo para desarrollo - NO ejecutar en producción
INSERT INTO scenarios (id, title, description, choices) VALUES
('start', 'El Comienzo de tu Aventura', 'Te encuentras en una encrucijada...', 
 '{"choice1": {"text": "Ir hacia el bosque", "next": "forest"}, "choice2": {"text": "Dirigirse a la ciudad", "next": "city"}}'
);
```

## Backup y Migración

Para producción, asegúrate de:

1. **Hacer backup regular** de la base de datos
2. **Usar migraciones** para cambios de esquema
3. **Monitorear performance** de las consultas
4. **Configurar alertas** para errores de base de datos 