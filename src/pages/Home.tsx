import { useArchitectures } from '../hooks/useArchitectures'
import { ArchitectureGrid } from '../components/Home/ArchitectureGrid'
import { CreateInput } from '../components/Home/CreateInput'

export function Home() {
  const { architectures, loading, createArchitecture } = useArchitectures()

  return (
    <div className="flex-1 pb-32">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <ArchitectureGrid architectures={architectures} loading={loading} />
      </div>
      <CreateInput onSubmit={createArchitecture} />
    </div>
  )
}
