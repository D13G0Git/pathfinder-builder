"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'es' | 'en'

type Translations = {
  [key: string]: {
    es: string
    en: string
  }
}

// Traducciones básicas del sistema
const translations: Translations = {
  // Navegación y general
  'nav.dashboard': { es: 'Panel', en: 'Dashboard' },
  'nav.characters': { es: 'Personajes', en: 'Characters' },
  'nav.adventures': { es: 'Aventuras', en: 'Adventures' },
  'nav.game': { es: 'Juego', en: 'Game' },
  'nav.settings': { es: 'Configuración', en: 'Settings' },
  'nav.logout': { es: 'Cerrar Sesión', en: 'Logout' },
  'nav.profile': { es: 'Perfil', en: 'Profile' },
  
  // Configuraciones
  'settings.title': { es: 'Configuración', en: 'Settings' },
  'settings.personalization': { es: 'Personalización', en: 'Personalization' },
  'settings.account': { es: 'Información de Cuenta', en: 'Account Information' },
  'settings.language': { es: 'Idioma', en: 'Language' },
  'settings.language.description': { es: 'Selecciona tu idioma preferido', en: 'Select your preferred language' },
  'settings.theme': { es: 'Tema de la Aplicación', en: 'Application Theme' },
  'settings.theme.description': { es: 'Alterna entre modo claro y oscuro', en: 'Toggle between light and dark mode' },
  'settings.volume': { es: 'Volumen de la Aplicación', en: 'Application Volume' },
  'settings.volume.description': { es: 'Controla el volumen general de sonidos y música', en: 'Control general volume of sounds and music' },
  'settings.music': { es: 'Música de Fondo', en: 'Background Music' },
  'settings.music.description': { es: 'Reproduce música ambiente mientras usas la aplicación', en: 'Play ambient music while using the application' },
  'settings.tutorial': { es: 'Tutorial Interactivo', en: 'Interactive Tutorial' },
  'settings.tutorial.description': { es: 'Aprende a usar la aplicación paso a paso', en: 'Learn how to use the application step by step' },
  'settings.tutorial.start': { es: 'Iniciar Tutorial', en: 'Start Tutorial' },
  
  // Dashboard
  'dashboard.welcome': { es: '¡Bienvenido, {name}!', en: 'Welcome, {name}!' },
  'dashboard.subtitle': { es: 'Tu portal para aventuras épicas en el mundo de Pathfinder', en: 'Your portal for epic adventures in the Pathfinder world' },
  'dashboard.characters': { es: 'Personajes', en: 'Characters' },
  'dashboard.adventures': { es: 'Aventuras', en: 'Adventures' },
  'dashboard.averageLevel': { es: 'Nivel Promedio', en: 'Average Level' },
  'dashboard.createFirstCharacter': { es: 'Crea tu primer personaje', en: 'Create your first character' },
  'dashboard.heroesCreated': { es: 'Héroes creados', en: 'Heroes created' },
  'dashboard.inProgress': { es: 'en progreso', en: 'in progress' },
  'dashboard.ofYourCharacters': { es: 'De tus personajes', en: 'Of your characters' },
  'dashboard.recentCharacters': { es: 'Personajes Recientes', en: 'Recent Characters' },
  'dashboard.latestHeroes': { es: 'Tus últimos héroes creados', en: 'Your latest created heroes' },
  'dashboard.noCharactersYet': { es: 'No tienes personajes aún', en: 'You don\'t have characters yet' },
  'dashboard.createFirstCharacterBtn': { es: 'Crear Primer Personaje', en: 'Create First Character' },
  'dashboard.level': { es: 'Nivel', en: 'Level' },
  'dashboard.viewAllCharacters': { es: 'Ver Todos los Personajes', en: 'View All Characters' },
  'dashboard.activeAdventures': { es: 'Aventuras Activas', en: 'Active Adventures' },
  'dashboard.storiesInProgress': { es: 'Tus historias en progreso', en: 'Your stories in progress' },
  'dashboard.noActiveAdventures': { es: 'No tienes aventuras activas', en: 'You don\'t have active adventures' },
  'dashboard.startAdventure': { es: 'Comenzar Aventura', en: 'Start Adventure' },
  'dashboard.needCharacterFirst': { es: 'Necesitas un personaje primero', en: 'You need a character first' },
  'dashboard.stage': { es: 'Etapa', en: 'Stage' },
  'dashboard.of': { es: 'de', en: 'of' },
  'dashboard.completed': { es: 'Completada', en: 'Completed' },
  'dashboard.inProgressStatus': { es: 'En Progreso', en: 'In Progress' },
  'dashboard.viewAllAdventures': { es: 'Ver Todas las Aventuras', en: 'View All Adventures' },
  'dashboard.quickActions': { es: 'Acciones Rápidas', en: 'Quick Actions' },
  'dashboard.quickActionsDesc': { es: 'Accesos directos a las funciones principales', en: 'Quick access to main features' },
  'dashboard.createCharacter': { es: 'Crear Personaje', en: 'Create Character' },
  'dashboard.myCharacters': { es: 'Mis Personajes', en: 'My Characters' },
  'dashboard.adventuresBtn': { es: 'Aventuras', en: 'Adventures' },
  
  // Auth y loading
  'auth.verifyingAuth': { es: 'Verificando autenticación...', en: 'Verifying authentication...' },
  'auth.loadingDashboard': { es: 'Cargando tu dashboard...', en: 'Loading your dashboard...' },
  'auth.redirectingLogin': { es: 'Redirigiendo al login...', en: 'Redirecting to login...' },
  
  // Sidebar
  'sidebar.pathbuilder': { es: 'Pathbuilder', en: 'Pathbuilder' },
  'sidebar.panel': { es: 'Panel', en: 'Panel' },
  'sidebar.adventures': { es: 'Aventuras', en: 'Adventures' },
  'sidebar.characters': { es: 'Personajes', en: 'Characters' },
  'sidebar.game': { es: 'Juego', en: 'Game' },
  'sidebar.settings': { es: 'Configuración', en: 'Settings' },
  'sidebar.user': { es: 'Usuario', en: 'User' },
  'sidebar.notAuthenticated': { es: 'No autenticado', en: 'Not authenticated' },
  'sidebar.signIn': { es: 'Inicia sesión', en: 'Sign in' },
  'sidebar.signOut': { es: 'Cerrar Sesión', en: 'Sign Out' },
  'sidebar.sessionClosed': { es: 'Sesión cerrada', en: 'Session closed' },
  'sidebar.sessionClosedDesc': { es: 'Has cerrado sesión exitosamente', en: 'You have successfully signed out' },
  'sidebar.error': { es: 'Error', en: 'Error' },
  'sidebar.couldNotSignOut': { es: 'No se pudo cerrar la sesión', en: 'Could not sign out' },
  
  // Navbar
  'navbar.notifications': { es: 'Notificaciones', en: 'Notifications' },
  'navbar.messages': { es: 'Mensajes', en: 'Messages' },
  'navbar.profile': { es: 'Perfil', en: 'Profile' },
  'navbar.settings': { es: 'Configuración', en: 'Settings' },
  'navbar.logout': { es: 'Cerrar Sesión', en: 'Log out' },
  'navbar.adventurer': { es: 'Aventurero', en: 'Adventurer' },
  
  // Botones comunes
  'common.save': { es: 'Guardar', en: 'Save' },
  'common.cancel': { es: 'Cancelar', en: 'Cancel' },
  'common.close': { es: 'Cerrar', en: 'Close' },
  'common.continue': { es: 'Continuar', en: 'Continue' },
  'common.back': { es: 'Atrás', en: 'Back' },
  'common.next': { es: 'Siguiente', en: 'Next' },
  'common.finish': { es: 'Finalizar', en: 'Finish' },
  'common.skip': { es: 'Omitir', en: 'Skip' },
  'common.loading': { es: 'Cargando...', en: 'Loading...' },
  'common.error': { es: 'Error', en: 'Error' },
  'common.success': { es: 'Éxito', en: 'Success' },
  
  // Tutorial
  'tutorial.welcome.title': { es: '¡Bienvenido a Pathfinder Builder!', en: 'Welcome to Pathfinder Builder!' },
  'tutorial.welcome.description': { es: 'Te guiaremos a través de las principales funcionalidades de la aplicación.', en: 'We\'ll guide you through the main features of the application.' },
  'tutorial.characters.title': { es: 'Gestión de Personajes', en: 'Character Management' },
  'tutorial.characters.description': { es: 'Aquí puedes ver, crear y gestionar todos tus personajes de Pathfinder.', en: 'Here you can view, create and manage all your Pathfinder characters.' },
  'tutorial.creation.title': { es: 'Creación Narrativa', en: 'Narrative Creation' },
  'tutorial.creation.description': { es: 'Crea personajes únicos a través de una experiencia narrativa interactiva.', en: 'Create unique characters through an interactive narrative experience.' },
  'tutorial.adventures.title': { es: 'Aventuras Interactivas', en: 'Interactive Adventures' },
  'tutorial.adventures.description': { es: 'Embárcate en aventuras que moldearán las estadísticas de tu personaje.', en: 'Embark on adventures that will shape your character\'s stats.' },
  'tutorial.export.title': { es: 'Exportación a Foundry VTT', en: 'Export to Foundry VTT' },
  'tutorial.export.description': { es: 'Exporta tus personajes directamente a Foundry VTT con builds optimizadas.', en: 'Export your characters directly to Foundry VTT with optimized builds.' },
  'tutorial.progress': { es: 'Progreso del Tutorial', en: 'Tutorial Progress' },
  'tutorial.mainFeatures': { es: 'Características principales:', en: 'Main features:' },
  'tutorial.epicCharacters': { es: '¡Prepárate para crear personajes épicos para Pathfinder 2e!', en: 'Get ready to create epic characters for Pathfinder 2e!' },
  'tutorial.approxTime': { es: 'Este tutorial te llevará aproximadamente 2 minutos.', en: 'This tutorial will take you approximately 2 minutes.' },
  
  // Características del tutorial
  'tutorial.feature.viewCharacters': { es: 'Ver todos tus personajes creados', en: 'View all your created characters' },
  'tutorial.feature.editCharacters': { es: 'Editar información de personajes', en: 'Edit character information' },
  'tutorial.feature.deleteCharacters': { es: 'Eliminar personajes no deseados', en: 'Delete unwanted characters' },
  'tutorial.feature.createCharacters': { es: 'Crear nuevos personajes', en: 'Create new characters' },
  'tutorial.feature.narrativeSystem': { es: 'Sistema narrativo interactivo', en: 'Interactive narrative system' },
  'tutorial.feature.decisionsAffectStats': { es: 'Decisiones que afectan estadísticas', en: 'Decisions that affect statistics' },
  'tutorial.feature.autoGeneration': { es: 'Generación automática de fichas', en: 'Automatic character sheet generation' },
  'tutorial.feature.aiCustomization': { es: 'Personalización visual con IA', en: 'AI visual customization' },
  'tutorial.feature.proceduralAdventures': { es: 'Aventuras generadas proceduralmente', en: 'Procedurally generated adventures' },
  'tutorial.feature.multipleScenarios': { es: 'Múltiples escenarios y decisiones', en: 'Multiple scenarios and decisions' },
  'tutorial.feature.autoSave': { es: 'Progreso guardado automáticamente', en: 'Progress saved automatically' },
  'tutorial.feature.statsEvolution': { es: 'Evolución de estadísticas', en: 'Statistics evolution' },
  'tutorial.feature.foundryExport': { es: 'Exportación directa a Foundry VTT', en: 'Direct export to Foundry VTT' },
  'tutorial.feature.optimizedBuilds': { es: 'Builds optimizadas por clase y raza', en: 'Builds optimized by class and race' },
  'tutorial.feature.jsonFormat': { es: 'Formato JSON compatible', en: 'Compatible JSON format' },
  'tutorial.feature.importInstructions': { es: 'Instrucciones de importación incluidas', en: 'Import instructions included' },
  
  // Idiomas disponibles
  'language.spanish': { es: 'Español', en: 'Spanish' },
  'language.english': { es: 'Inglés', en: 'English' },
  
  // Errores y notificaciones
  'error.loadingCharacters': { es: 'Error cargando personajes', en: 'Error loading characters' },
  'error.loadingAdventures': { es: 'Error cargando aventuras', en: 'Error loading adventures' },
  'error.loadingDashboard': { es: 'Error cargando el dashboard', en: 'Error loading dashboard' },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es')
  const [isLoading, setIsLoading] = useState(true)

  // Cargar idioma guardado al iniciar
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('app-language') as Language
      if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage)
      }
    } catch (error) {
      console.warn('Error loading saved language:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Función para cambiar idioma
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('app-language', lang)
    } catch (error) {
      console.warn('Error saving language:', error)
    }
  }

  // Función de traducción
  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    return translation[language] || translation.es || key
  }

  const value = {
    language,
    setLanguage,
    t,
    isLoading
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 