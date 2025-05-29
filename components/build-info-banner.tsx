import { Info, Download } from "lucide-react"

interface BuildInfoBannerProps {
  buildInfo: string | null
  characterName: string
  characterClass: string
  characterRace: string
  onExportClick?: () => void
}

export function BuildInfoBanner({ buildInfo, characterName, characterClass, characterRace, onExportClick }: BuildInfoBannerProps) {
  if (!buildInfo) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            No hay build de Foundry VTT disponible para {characterRace} {characterClass}. 
            Al completar la aventura podrás exportar las estadísticas finales.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">
              Build de Foundry VTT Disponible
            </p>
            <p className="text-xs text-green-600">
              {buildInfo}
            </p>
          </div>
        </div>
        {onExportClick && (
          <button
            onClick={onExportClick}
            className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded transition-colors"
          >
            Vista Previa
          </button>
        )}
      </div>
    </div>
  )
} 