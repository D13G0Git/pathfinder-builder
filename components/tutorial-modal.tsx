"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/language-context'
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  User, 
  Gamepad2, 
  Download, 
  Settings,
  BookOpen,
  Sparkles
} from 'lucide-react'

interface TutorialStep {
  id: string
  titleKey: string
  descriptionKey: string
  icon: React.ReactNode
  features: string[]
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    titleKey: 'tutorial.welcome.title',
    descriptionKey: 'tutorial.welcome.description',
    icon: <Sparkles className="h-8 w-8 text-purple-500" />,
    features: []
  },
  {
    id: 'characters',
    titleKey: 'tutorial.characters.title',
    descriptionKey: 'tutorial.characters.description',
    icon: <User className="h-8 w-8 text-blue-500" />,
    features: [
      'tutorial.feature.viewCharacters',
      'tutorial.feature.editCharacters',
      'tutorial.feature.deleteCharacters',
      'tutorial.feature.createCharacters'
    ]
  },
  {
    id: 'creation',
    titleKey: 'tutorial.creation.title',
    descriptionKey: 'tutorial.creation.description',
    icon: <BookOpen className="h-8 w-8 text-green-500" />,
    features: [
      'tutorial.feature.narrativeSystem',
      'tutorial.feature.decisionsAffectStats',
      'tutorial.feature.autoGeneration',
      'tutorial.feature.aiCustomization'
    ]
  },
  {
    id: 'adventures',
    titleKey: 'tutorial.adventures.title',
    descriptionKey: 'tutorial.adventures.description',
    icon: <Gamepad2 className="h-8 w-8 text-orange-500" />,
    features: [
      'tutorial.feature.proceduralAdventures',
      'tutorial.feature.multipleScenarios',
      'tutorial.feature.autoSave',
      'tutorial.feature.statsEvolution'
    ]
  },
  {
    id: 'export',
    titleKey: 'tutorial.export.title',
    descriptionKey: 'tutorial.export.description',
    icon: <Download className="h-8 w-8 text-indigo-500" />,
    features: [
      'tutorial.feature.foundryExport',
      'tutorial.feature.optimizedBuilds',
      'tutorial.feature.jsonFormat',
      'tutorial.feature.importInstructions'
    ]
  }
]

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Log cuando cambia isOpen
  useEffect(() => {
    console.log('🎯 [TutorialModal] isOpen cambió a:', isOpen) // Debug
  }, [isOpen])

  // Asegurar que el componente esté montado antes de acceder a localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  // Verificar si el usuario ya vio el tutorial
  useEffect(() => {
    if (mounted) {
      try {
        const tutorialSeen = localStorage.getItem('tutorial-seen')
        setHasSeenTutorial(tutorialSeen === 'true')
      } catch (error) {
        console.warn('Error accessing localStorage:', error)
      }
    }
  }, [mounted])

  // Marcar tutorial como visto al completar
  const markTutorialAsSeen = () => {
    try {
      localStorage.setItem('tutorial-seen', 'true')
      setHasSeenTutorial(true)
    } catch (error) {
      console.warn('Error saving to localStorage:', error)
    }
  }

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    markTutorialAsSeen()
    onClose()
  }

  const handleSkip = () => {
    markTutorialAsSeen()
    onClose()
  }

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100
  const step = tutorialSteps[currentStep]

  if (!step) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      console.log('🎯 [TutorialModal] Dialog onOpenChange:', open) // Debug
      if (!open) {
        onClose()
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              {step.icon}
              {t(step.titleKey)}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {currentStep + 1} / {tutorialSteps.length}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSkip}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t('tutorial.progress')}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Contenido del paso */}
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {t(step.descriptionKey)}
            </p>

            {/* Lista de características (si las hay) */}
            {step.features.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">{t('tutorial.mainFeatures')}</h4>
                <div className="grid gap-2">
                  {step.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      <span>{t(feature)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso de bienvenida especial */}
            {step.id === 'welcome' && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border">
                <div className="text-center space-y-2">
                  <div className="text-2xl">🏰</div>
                  <p className="text-sm font-medium">
                    {t('tutorial.epicCharacters')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('tutorial.approxTime')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navegación */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('common.back')}
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                {t('common.skip')}
              </Button>
              
              <Button onClick={handleNext} className="flex items-center gap-2">
                {currentStep === tutorialSteps.length - 1 ? (
                  <>
                    {t('common.finish')}
                    <Settings className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    {t('common.next')}
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Indicadores de paso */}
          <div className="flex justify-center gap-2 pt-2">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-primary' 
                    : index < currentStep 
                      ? 'bg-primary/50' 
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook para facilitar el uso del tutorial
export function useTutorial() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const startTutorial = () => {
    console.log('🎯 [useTutorial] startTutorial llamado') // Debug
    setIsOpen(true)
    console.log('🎯 [useTutorial] isOpen establecido a true') // Debug
  }
  const closeTutorial = () => {
    console.log('🎯 [useTutorial] closeTutorial llamado') // Debug
    setIsOpen(false)
  }

  const hasSeenTutorial = () => {
    if (!mounted) return false
    try {
      return localStorage.getItem('tutorial-seen') === 'true'
    } catch (error) {
      console.warn('Error accessing localStorage:', error)
      return false
    }
  }

  const resetTutorial = () => {
    if (mounted) {
      try {
        localStorage.removeItem('tutorial-seen')
      } catch (error) {
        console.warn('Error removing from localStorage:', error)
      }
    }
  }

  return {
    isOpen,
    startTutorial,
    closeTutorial,
    hasSeenTutorial,
    resetTutorial,
    TutorialModal: () => {
      console.log('🎯 [TutorialModal Component] Renderizando con isOpen:', isOpen) // Debug
      return <TutorialModal isOpen={isOpen} onClose={closeTutorial} />
    }
  }
} 