import { CharacterCreationForm } from "@/components/character-creation-form"
import { Sidebar } from "@/components/sidebar"

export default function CharacterCreatePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <CharacterCreationForm />
        </div>
      </main>
    </div>
  )
} 