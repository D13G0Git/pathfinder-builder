"use client"

import { Loader2, Shield } from "lucide-react"

interface AuthLoadingProps {
  message?: string
}

export function AuthLoading({ message = "Verificando autenticación..." }: AuthLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="text-center space-y-6 p-8">
        {/* Icono animado acromático */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
        </div>
        
        {/* Spinner y mensaje */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-400" />
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {message}
            </span>
          </div>
          
          <div className="w-64 mx-auto">
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gray-600 to-gray-800 rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Esto solo tomará unos segundos...
          </p>
        </div>
      </div>
    </div>
  )
} 