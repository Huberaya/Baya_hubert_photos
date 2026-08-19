import { useRef, useMemo, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, AdaptiveDpr, Preload } from '@react-three/drei'
import * as THREE from 'three'

/* =========================================================
   Utilitaire : amortissement du pointeur
   ========================================================= */
function useDampedPointer(enabled) {
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  useEffect(() => {
    if (!enabled) return
    const onMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onLeave = () => { target.current.x = 0; target.current.y = 0 }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-4 * Math.min(dt, 0.1))
    current.current.x += (target.current.x - current.current.x) * k
    current.current.y += (target.current.y - current.current.y) * k
  })
  return current
}

/* Texture de halo radial (procedurale) */
function useGlowTexture(inner = 'rgba(255,235,170,1)', mid = 'rgba(255,200,120,0.55)', outer = 'rgba(255,170,80,0)') {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 512
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    g.addColorStop(0, inner)
    g.addColorStop(0.22, mid)
    g.addColorStop(0.55, 'rgba(216,160,90,0.18)')
    g.addColorStop(1, outer)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 512, 512)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [inner, mid, outer])
}

/* =========================================================
   LE SOLEIL — LA VRAIE TOUR EIFFEL comme centre rayonnant
   - Image PNG de la Tour Eiffel (haute qualité) en billboard
   - Halos autour pour effet de soleil
   - Toujours synchrone, jamais en Suspense
   ========================================================= */
function Sun() {
  const group = useRef()
  const halo1 = useRef()
  const halo2 = useRef()
  const halo3 = useRef()
  const rayGroupRef = useRef()

  const texture = useTexture('/assets/images/eiffel-tower-800-v2.png')
  const haloTex = useGlowTexture()
  const lightRayTex = useGlowTexture(
    'rgba(255,235,170,0.95)',
    'rgba(255,200,120,0.45)',
    'rgba(255,170,80,0)'
  )

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
  }, [texture])

  // Image aspect : 660/645 ≈ 1.024 (largeur/hauteur)
  // On veut une tour d'environ 7 unités de haut, donc 7.2 de large
  // Mais la tour iconique est plus haute que large → stretch vertical
  const towerWidth = 6.5
  const towerHeight = 12.0  // plus haute que large (effet dramatique)

  // 16 rayons solaires dorés
  const rays = useMemo(() => {
    const arr = []
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2
      const len = 12 + (i % 4) * 2
      arr.push({ angle: a, length: len })
    }
    return arr
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (halo1.current) halo1.current.material.opacity = 0.5 + Math.sin(t * 0.5) * 0.1
    if (halo2.current) halo2.current.material.opacity = 0.32 + Math.sin(t * 0.7 + 1) * 0.06
    if (halo3.current) halo3.current.material.opacity = 0.18 + Math.sin(t * 0.3 + 2) * 0.05
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.25) * 0.06
    }
    if (rayGroupRef.current) {
      rayGroupRef.current.rotation.y = t * 0.07
    }
  })

  // Pour avoir la tour billboard face caméra, on utilise un mesh standard sans roll
  // Quand la caméra se déplace, le mesh reste dans son orientation (pas de lookAt).
  // Pour que la tour "regarde" un peu la caméra mais reste vivante, on laisse fixe.

  return (
    <group ref={group}>

      {/* === HALOS ATMOSPHÉRIQUES DERRIÈRE LA TOUR === */}
      <mesh ref={halo1} position={[0, 4, -4]} renderOrder={-3}>
        <planeGeometry args={[26, 26]} />
        <meshBasicMaterial map={haloTex} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={halo2} position={[0, 4, -3]} renderOrder={-2}>
        <planeGeometry args={[16, 18]} />
        <meshBasicMaterial map={haloTex} transparent opacity={0.32} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={halo3} position={[0, 4, -2]} renderOrder={-1}>
        <planeGeometry args={[9, 12]} />
        <meshBasicMaterial map={haloTex} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* === TOUR EIFFEL — IMAGE BILLBOARD === */}
      <mesh>
        <planeGeometry args={[towerWidth, towerHeight]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={1}
          toneMapped
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* === 16 RAYONS LUMINEUX DORÉS (couronne solaire) === */}
      <group ref={rayGroupRef} position={[0, 4, 0]}>
        {rays.map((r, i) => (
          <mesh
            key={i}
            position={[Math.cos(r.angle) * (r.length / 2 + 4), 0, Math.sin(r.angle) * (r.length / 2 + 4)]}
            rotation={[0, -r.angle, 0]}
            renderOrder={-1}
          >
            <planeGeometry args={[r.length, 0.3]} />
            <meshBasicMaterial
              map={lightRayTex}
              transparent
              opacity={0.28}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* === LUMIÈRES === */}
      <pointLight position={[0, 6, 3]} color="#fff5cc" intensity={20} distance={36} decay={1.8} />
      <pointLight position={[0, 10, 0]} color="#ffd680" intensity={6} distance={14} decay={1.5} />
      <pointLight position={[-4, 2, 4]} color="#d8b26a" intensity={3.5} distance={18} decay={2} />
      <pointLight position={[4, 2, 4]} color="#d8b26a" intensity={3.5} distance={18} decay={2} />
    </group>
  )
}

/* =========================================================
   PLANÈTES — Photos bien plus grandes et indépendantes
   ========================================================= */
const PLANETS_DATA = [
  { id: 'gastro',    source: '/assets/images/gallery/thumbs/gastro-1.webp',    radius: 6.0, speed: 0.32, tilt: 0.10,  phase: 0 },
  { id: 'portrait',  source: '/assets/images/gallery/thumbs/portrait-1.webp',  radius: 8.4, speed: 0.23, tilt: -0.20, phase: Math.PI * 0.4 },
  { id: 'immobili', source: '/assets/images/gallery/thumbs/immobili-1.webp', radius: 10.6, speed: 0.18, tilt: 0.08,  phase: Math.PI * 0.7 },
  { id: 'shooting',  source: '/assets/images/gallery/thumbs/shooting-1.webp',  radius: 13.0, speed: 0.14, tilt: -0.12, phase: Math.PI * 0.2 },
  { id: 'mariage',   source: '/assets/images/gallery/thumbs/scene-2.webp',    radius: 15.5, speed: 0.11, tilt: 0.06,  phase: Math.PI * 0.5 },
]

function Planet({ source, radius, speed, tilt, phase, photoSize }) {
  const texture = useTexture(source)
  const group = useRef()
  const glowTex = useGlowTexture('rgba(255,235,180,1)', 'rgba(255,200,120,0.55)', 'rgba(255,170,80,0)')

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    texture.generateMipmaps = true
  }, [texture])

  useFrame((state, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * speed
    }
  })

  return (
    <group ref={group} rotation={[tilt, phase, 0]}>
      <group position={[radius, 0, 0]}>
        {/* Aura /glow derrière la photo */}
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[photoSize[0] * 1.55, photoSize[1] * 1.55]} />
          <meshBasicMaterial
            map={glowTex}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        {/* Halo doré plus serré pour effet planète */}
        <mesh position={[0, 0, -0.03]}>
          <planeGeometry args={[photoSize[0] * 1.2, photoSize[1] * 1.2]} />
          <meshBasicMaterial
            map={glowTex}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        {/* Photo elle-même */}
        <mesh renderOrder={2}>
          <planeGeometry args={photoSize} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={1}
            toneMapped={false}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  )
}

/* =========================================================
   TRAIL ORBITAL
   ========================================================= */
function OrbitalTrail({ radius, tilt, phase = 0, opacity }) {
  const geometry = useMemo(() => {
    const N = 128
    const points = []
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2
      points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [radius])

  return (
    <group rotation={[tilt, phase, 0]}>
      <line geometry={geometry}>
        <lineBasicMaterial color="#d8b26a" transparent opacity={opacity} />
      </line>
    </group>
  )
}

/* =========================================================
   ÉTINCELLES — Solar wind
   ========================================================= */
function SolarEmbers({ count = 150 }) {
  const points = useRef()
  const { positions, basePositions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const basePositions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const speedMag = 1.0 + Math.random() * 2.0
      const baseDist = Math.random() * 0.8
      basePositions[i*3] = Math.sin(phi) * Math.cos(theta) * baseDist
      basePositions[i*3+1] = 4 + Math.cos(phi) * baseDist * 0.5
      basePositions[i*3+2] = Math.sin(phi) * Math.sin(theta) * baseDist
      positions[i*3] = basePositions[i*3]
      positions[i*3+1] = basePositions[i*3+1]
      positions[i*3+2] = basePositions[i*3+2]
      velocities[i*3] = Math.sin(phi) * Math.cos(theta) * speedMag
      velocities[i*3+1] = Math.cos(phi) * speedMag * 0.4 + 0.2
      velocities[i*3+2] = Math.sin(phi) * Math.sin(theta) * speedMag
    }
    return { positions, basePositions, velocities }
  }, [count])

  const sprite = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,240,210,1)')
    g.addColorStop(0.35, 'rgba(255,210,130,0.65)')
    g.addColorStop(1, 'rgba(216,178,106,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useFrame((state, dt) => {
    const arr = points.current?.geometry.attributes.position.array
    if (!arr) return
    const d = Math.min(dt, 0.05)
    for (let i = 0; i < count; i++) {
      arr[i*3]   += velocities[i*3]   * d
      arr[i*3+1] += velocities[i*3+1] * d
      arr[i*3+2] += velocities[i*3+2] * d
      const dx = arr[i*3]   - basePositions[i*3]
      const dy = arr[i*3+1] - basePositions[i*3+1]
      const dz = arr[i*3+2] - basePositions[i*3+2]
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
      if (dist > 18) {
        arr[i*3]   = basePositions[i*3]
        arr[i*3+1] = basePositions[i*3+1]
        arr[i*3+2] = basePositions[i*3+2]
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        map={sprite}
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

/* =========================================================
   POUSSIÈRE LUMINEUSE
   ========================================================= */
function Dust({ tier }) {
  const count = tier === 'low' ? 220 : tier === 'mid' ? 500 : 900
  const points = useRef()
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 4
      speeds[i] = 0.03 + Math.random() * 0.1
    }
    return { positions, speeds }
  }, [count])

  const sprite = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,240,210,1)')
    g.addColorStop(0.35, 'rgba(216,178,106,0.55)')
    g.addColorStop(1, 'rgba(216,178,106,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useFrame((state, dt) => {
    const arr = points.current?.geometry.attributes.position.array
    if (!arr) return
    const d = Math.min(dt, 0.05)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * d
      if (arr[i * 3 + 1] > 17) arr[i * 3 + 1] = -17
    }
    points.current.geometry.attributes.position.needsUpdate = true
    points.current.rotation.y = state.clock.elapsedTime * 0.012
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.13}
        map={sprite}
        transparent
        opacity={0.72}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

/* =========================================================
   Caméra réactive
   ========================================================= */
function Rig({ pointer }) {
  const { camera } = useThree()
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-2.2 * Math.min(dt, 0.1))
    camera.position.x += (pointer.current.x * 1.8 - camera.position.x) * k
    camera.position.y += (-pointer.current.y * 1.0 - camera.position.y) * k
    camera.lookAt(0, 6, 0)
  })
  return null
}

/* =========================================================
   Composition : positionnement responsive
   ========================================================= */
function Composition({ children }) {
  const { viewport, size } = useThree()
  const group = useRef()
  const isWide = size.width >= 1024
  const isMobile = size.width < 700 || (size.width < 1024 && size.height >= size.width)
  const x = isWide ? viewport.width * 0.20 : isMobile ? 0 : viewport.width * 0.08
  const y = isWide ? -1.5 : isMobile ? -3.0 : -1.0
  const scale = isMobile ? (size.width < 700 ? 0.55 : 0.7) : isWide ? 1.15 : 1.0

  useFrame((_, dt) => {
    if (!group.current) return
    const k = 1 - Math.exp(-3 * Math.min(dt, 0.1))
    group.current.position.x += (x - group.current.position.x) * k
    group.current.position.y += (y - group.current.position.y) * k
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x || scale, scale, k))
  })

  return <group ref={group} position={[x, y, 0]} scale={scale}>{children}</group>
}

function SceneContent({ tier, interactive }) {
  const pointer = useDampedPointer(interactive)
  return (
    <>
      <color attach="background" args={['#08070a']} />
      <fog attach="fog" args={['#08070a', 28, 70]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} color="#fff3dc" />
      <pointLight position={[-8, -3, 4]} intensity={2} color="#8b7bd8" distance={30} />
      <pointLight position={[8, 3, -4]} intensity={2} color="#6fd7d1" distance={30} />

      <Rig pointer={pointer} />
      <Composition>

        {/* SOLEIL — Tour Eiffel (image) */}
        <Sun />

        {/* Trails orbitaux */}
        <group renderOrder={-2}>
          {PLANETS_DATA.map((p) => (
            <OrbitalTrail key={`trail-${p.id}`} radius={p.radius} tilt={p.tilt} phase={p.phase} opacity={0.16} />
          ))}
        </group>

        {/* Étincelles (solar wind) */}
        <SolarEmbers count={150} />

        {/* PLANÈTES — photos GRANDES en orbite */}
        <Suspense fallback={null}>
          {PLANETS_DATA.map((p) => (
            <Planet
              key={p.id}
              source={p.source}
              radius={p.radius}
              speed={p.speed}
              tilt={p.tilt}
              phase={p.phase}
              photoSize={[2.8, 3.6, 1, 1]}
            />
          ))}
        </Suspense>
      </Composition>

      <Dust tier={tier} />
      <Preload all />
    </>
  )
}

/* =========================================================
   CANVAS
   ========================================================= */
export default function HeroScene({ tier = 'high', className = '' }) {
  const wrap = useRef(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 })
    io.observe(el)
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const dpr = tier === 'high' ? [1, 1.75] : tier === 'mid' ? [1, 1.35] : [1, 1]

  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={dpr}
        gl={{ antialias: tier === 'high', alpha: false, powerPreference: 'high-performance', stencil: false, depth: true }}
        camera={{ position: [0, 2, 32], fov: 42, near: 0.1, far: 100 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.35
        }}
      >
        <SceneContent tier={tier} interactive={tier !== 'low'} />
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  )
}
