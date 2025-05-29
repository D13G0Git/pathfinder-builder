# Builds de Foundry VTT para Pathfinder Builder

## Descripción General

Este sistema genera automáticamente builds de personajes de Pathfinder 2e compatibles con Foundry VTT cuando los jugadores completan aventuras en el juego.

## Builds Disponibles

### Guerrero
- **Humano**: Guerrero tanque con armadura pesada y espada larga
- **Elfo**: Arquero élfico especializado en combate a distancia

### Mago
- **Humano**: Mago generalista con escuela arcana
- **Gnomo**: Ilusionista con habilidades fey

### Pícaro
- **Humano**: Pícaro urbano especializado en combate con dos armas
- **Halfling**: Explorador ágil con habilidades de supervivencia

### Clérigo
- **Humano**: Clérigo de Sarenrae con dominio del fuego

### Explorador
- **Humano**: Explorador con compañero animal (lobo)

## Cómo Funciona

1. **Durante el Juego**: Los jugadores toman decisiones que afectan sus estadísticas
2. **Al Completar**: Se genera un JSON con la build base + modificaciones de la aventura
3. **Exportación**: El archivo incluye:
   - Datos del personaje original
   - Estadísticas finales después de la aventura
   - Build completa de Foundry VTT
   - Instrucciones de importación

## Estructura del Archivo Exportado

```json
{
  "version": "1.0",
  "character": {
    "id": "uuid",
    "name": "Nombre del Personaje",
    "class": "Guerrero",
    "race": "Humano",
    "level": 1
  },
  "stats": {
    "health": 105,
    "gold": 200,
    "experience": 150,
    "strength": 12
  },
  "foundryVTT": {
    "success": true,
    "build": {
      // Build completa de Foundry VTT
    }
  },
  "instructions": {
    "foundryVTT": "Instrucciones de importación",
    "general": "Información general"
  }
}
```

## Importar en Foundry VTT

1. Abrir Foundry VTT
2. Ir a la pestaña de Actores
3. Crear nuevo Actor de tipo "Character"
4. Hacer clic en "Import Data" o "Importar Datos"
5. Copiar el contenido del campo `foundryVTT` del archivo exportado
6. Pegar y confirmar la importación

## Modificaciones por Aventura

Las builds base se modifican según el progreso del jugador:

- **Nombre**: Se actualiza con el nombre del personaje del juego
- **Nivel**: Aumenta según la experiencia ganada (cada 100 XP = 1 nivel)
- **Oro**: Se suma el oro ganado durante la aventura
- **Salud**: Se ajustan los HP bonus según la salud final

## Fallbacks

- Si no hay build específica para una raza, se usa la build humana de esa clase
- Si no hay build para la clase, se exporta solo las estadísticas sin build de Foundry

## Extensibilidad

Para agregar nuevas builds:

1. Editar `lib/character-builds.ts`
2. Agregar nueva entrada en `CHARACTER_BUILDS`
3. Seguir la estructura de interfaz `FOUNDRY_BUILD`
4. Incluir todas las propiedades requeridas por Foundry VTT

## Clases Pendientes

Las siguientes clases están preparadas pero sin builds implementadas:
- Alquimista, Bárbaro, Bardo, Campeón
- Druida, Hechicero, Monje
- Y otras clases disponibles en el formulario de creación

Para implementarlas, seguir el mismo patrón de las clases existentes. 