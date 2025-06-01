import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Panel izquierdo con fondo épico acromático - Oculto en móvil */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
        
        {/* Efectos de partículas/luces en escala de grises */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-400/8 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gray-300/10 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
        
        {/* Elementos flotantes */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-white/20 rounded-full animate-float" />
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-gray-300/25 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-gray-200/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        
        {/* Contenido del panel izquierdo */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center space-x-3 transform transition-transform duration-500 hover:scale-105">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm animate-glow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Pathfinder Adventure</h1>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden">
              <h2 className="text-4xl font-bold leading-tight text-white transform translate-y-0 opacity-100 transition-all duration-700 delay-100">
                Embárcate en tu
              </h2>
              <div className="transform translate-y-0 opacity-100 transition-all duration-700 delay-300">
                <span className="block text-4xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                  aventura épica
                </span>
              </div>
            </div>
            
            <div className="transform translate-y-0 opacity-100 transition-all duration-700 delay-500">
              <p className="text-xl text-gray-300 leading-relaxed">
                Crea personajes únicos, explora mundos fantásticos y vive historias 
                que solo tú puedes escribir en el universo de Pathfinder.
              </p>
            </div>
            
            {/* Características destacadas */}
            <div className="space-y-4 pt-8">
              <div className="flex items-center space-x-3 transform translate-y-0 opacity-100 transition-all duration-700 delay-700 hover:translate-x-2">
                <div className="p-1 bg-gray-500/20 rounded-full">
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                </div>
                <span className="text-gray-200">Creación de personajes avanzada</span>
              </div>
              <div className="flex items-center space-x-3 transform translate-y-0 opacity-100 transition-all duration-700 delay-900 hover:translate-x-2">
                <div className="p-1 bg-gray-500/20 rounded-full">
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                </div>
                <span className="text-gray-200">Escenarios dinámicos e interactivos</span>
              </div>
              <div className="flex items-center space-x-3 transform translate-y-0 opacity-100 transition-all duration-700 delay-1000 hover:translate-x-2">
                <div className="p-1 bg-gray-600/20 rounded-full">
                  <div className="w-2 h-2 bg-gray-200 rounded-full" />
                </div>
                <span className="text-gray-200">Progresión y desarrollo épico</span>
              </div>
            </div>
          </div>

          <div className="transform translate-y-0 opacity-100 transition-all duration-700 delay-1200">
            <div className="text-sm text-gray-400">
              "El destino no está escrito en piedra, sino forjado por tus decisiones."
              <div className="mt-2 font-medium text-gray-300">— Maestros del Juego de Pathfinder</div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho con formulario acromático */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 relative overflow-hidden min-h-screen lg:min-h-0">
        {/* Efectos de fondo sutil en escala de grises */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-32 h-32 bg-gray-200/15 dark:bg-gray-500/8 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-32 left-20 w-24 h-24 bg-gray-300/15 dark:bg-gray-400/8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Header móvil - Solo visible en móvil */}
        <div className="absolute top-6 left-6 lg:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-bold">Pathfinder Adventure</h1>
          </div>
        </div>
        
        <div className="w-full max-w-sm sm:max-w-md relative z-10 mt-16 lg:mt-0">
          <LoginForm />
        </div>
      </div>
    </div>
  )
} 