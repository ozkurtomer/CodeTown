import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'

type BuildingData = {
  name: string
  filePath: string
  lineCount: number
  methodCount: number
  maxMethodComplexity: number
}

type CityData = {
  schemaVersion: number
  buildings: BuildingData[]
}

function getBuildingColor(complexity: number): string {
  if (complexity === 0) {
    return '#9aa7a0'
  }

  if (complexity <= 5) {
    return '#4f946f'
  }

  if (complexity <= 10) {
    return '#dca64d'
  }

  return '#c85f55'
}

export default function App() {
  const [city, setCity] = useState<CityData | null>(null)
  const [selected, setSelected] = useState<BuildingData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCity() {
      try {
        const response = await fetch('/city.json', {
          signal: controller.signal,
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('city.json okunamadı. public klasörünü kontrol et.')
        }

        const data: CityData = await response.json()

        if (data.schemaVersion !== 1 || !Array.isArray(data.buildings)) {
          throw new Error('Şehir verisinin biçimi desteklenmiyor.')
        }

        setCity(data)
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Veri yüklenemedi.')
        }
      }
    }

    void loadCity()

    return () => controller.abort()
  }, [])

  if (error) {
    return <div className="message">{error}</div>
  }

  if (!city) {
    return <div className="message">Şehir yükleniyor…</div>
  }

  const columns = Math.max(1, Math.ceil(Math.sqrt(city.buildings.length)))
  const rows = Math.ceil(city.buildings.length / columns)
  const groundSize = Math.max(12, columns * 3 + 4, rows * 3 + 4)

  return (
    <main className="app">
      <header className="header">
        <div>
          <span className="eyebrow">KODUNUN BİR ADRESİ VAR</span>
          <h1>CodeTown<span>3D</span></h1>
        </div>

        <span className="badge">{city.buildings.length} bina</span>
      </header>

      <div className="workspace">
        <section className="scene" aria-label="Kod şehri">
          <Canvas
            shadows
            orthographic
            camera={{ position: [12, 12, 12], zoom: 48 }}
            onPointerMissed={() => setSelected(null)}
            fallback={<p>3D görünüm için WebGL desteği gerekiyor.</p>}
          >
            <color attach="background" args={['#dce6df']} />

            <ambientLight intensity={1.2} />
            <directionalLight
              position={[8, 16, 8]}
              intensity={2}
              castShadow
            />

            <mesh position={[0, -0.15, 0]} receiveShadow>
              <boxGeometry args={[groundSize, 0.3, groundSize]} />
              <meshStandardMaterial color="#829d8b" />
            </mesh>

            <gridHelper
              args={[groundSize, groundSize, '#536e60', '#779482']}
              position={[0, 0.01, 0]}
            />

            {city.buildings.map((building, index) => {
              const height = Math.max(0.5, building.lineCount / 20)
              const x = (index % columns - (columns - 1) / 2) * 3
              const z = (Math.floor(index / columns) - (rows - 1) / 2) * 3
              const isSelected = selected === building

              return (
                <group
                  key={`${building.filePath}:${building.name}:${index}`}
                  position={[x, 0, z]}
                  onClick={(event) => {
                    event.stopPropagation()
                    setSelected(building)
                  }}
                >
                  <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.5, height, 1.5]} />
                    <meshStandardMaterial
                      color={getBuildingColor(building.maxMethodComplexity)}
                      emissive={isSelected ? '#ffffff' : '#000000'}
                      emissiveIntensity={isSelected ? 0.15 : 0}
                      roughness={0.8}
                    />
                  </mesh>

                  <mesh position={[0, height + 0.1, 0]} castShadow>
                    <boxGeometry args={[1.7, 0.2, 1.7]} />
                    <meshStandardMaterial color="#e9dfc9" />
                  </mesh>

                  <Html
                    position={[0, height + 1, 0]}
                    center
                    occlude={false}
                    zIndexRange={[1000, 100]}
                    style={{ pointerEvents: 'none' }}
                  >
                    <span className="building-label">
                      {building.name}
                    </span>
                  </Html>
                </group>
              )
            })}

            <OrbitControls
              makeDefault
              target={[0, 1.5, 0]}
              minZoom={15}
              maxZoom={120}
              maxPolarAngle={Math.PI / 2.2}
            />
          </Canvas>

          <div className="scene-hint">
            Sürükle: döndür · Tekerlek: yakınlaş · Bina: seç
          </div>
        </section>

        <aside className="panel">
          <span className="eyebrow">BİNA İNCELEMESİ</span>

          {selected ? (
            <>
              <h2>{selected.name}</h2>

              <div className="metric">
                <span>Satır sayısı</span>
                <strong>{selected.lineCount}</strong>
              </div>

              <div className="metric">
                <span>Metot sayısı</span>
                <strong>{selected.methodCount}</strong>
              </div>

              <div className="metric">
                <span>Karmaşıklık (maks.)</span>
                <strong>{selected.maxMethodComplexity}</strong>
              </div>

              <h3>Kaynak dosya</h3>
              <p className="file-path">{selected.filePath}</p>
            </>
          ) : (
            <>
              <h2>Mahallene hoş geldin.</h2>
              <p>Bir binaya tıklayarak sınıfın ölçümlerini incele.</p>
            </>
          )}

          <p className="legend">
            Yükseklik: sınıfın satır sayısı.
            <br />
            Renk: en karmaşık metodun değeri.
            <br />
            Yeşil: 1–5 · Sarı: 6–10 · Kırmızı: 11+
            <br />
            Gri: ölçülebilen metot yok.
          </p>
        </aside>
      </div>
    </main>
  )
}