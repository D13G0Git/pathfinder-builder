import { CharacterCreationForm } from "@/components/character-creation-form"
import { Sidebar } from "@/components/sidebar"

export default function CharacterCreatePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-6">
          <CharacterCreationForm />
        </div>
      </main>
    </div>
  )
} 