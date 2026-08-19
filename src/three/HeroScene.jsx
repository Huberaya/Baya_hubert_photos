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

/* Sprite lumineux doux (dégradé radial) */
function useGlowTexture(inner = 'rgba(255,235,170,1)', mid = 'rgba(255,200,120,0.5)') {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 512
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    g.addColorStop(0, inner)
    g.addColorStop(0.25, mid)
    g.addColorStop(0.55, 'rgba(216,160,90,0.18)')
    g.addColorStop(1, 'rgba(216,160,90,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 512, 512)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [inner, mid])
}

/* =========================================================
   TOUR EIFFEL — Image billboard toujours face caméra
   ========================================================= */
function EiffelTowerBillboard({ pointer }) {
  const texture = useTexture('/assets/images/eiffel-tower-512.png')
  const group = useRef()
  const plane = useRef()
  const glowTex = useGlowTexture()
  const haloRef = useRef()
  const lightRef = useRef()

  // Image aspect: 512 × 917 ≈ 0.558 (ratio largeur / hauteur)
  // Pour une tour de 6 unités de haut => largeur 6 × 0.558 = 3.35
  const towerWidth = 3.6
  const towerHeight = towerWidth * (917 / 512)

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
  }, [texture])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    // Léger flottement horizontal (oscillation très subtile)
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.4) * 0.08
      group.current.rotation.y = Math.sin(t * 0.15) * 0.04
    }
    // Pulsation du halo principal
    if (haloRef.current) {
      haloRef.current.material.opacity = 0.45 + Math.sin(t * 0.7) * 0.15
    }
    // Pulsation de la lumière interne
    if (lightRef.current) {
      lightRef.current.material.opacity = 0.5 + Math.sin(t * 0.5) * 0.2
    }
  })

  return (
    <group ref={group}>
      {/* Grand halo doré DERRIÈRE la tour — atmosphère */}
      <mesh ref={haloRef} position={[0, 0.5, -1.5]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial
          map={glowTex}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Halo vertical (plus resserré sur la tour) */}
      <mesh position={[0, 0, -1]} scale={[towerWidth * 1.4, towerHeight * 1.1, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTex}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* LA TOUR EIFFEL — Image billboard */}
      <mesh ref={plane}>
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

      {/* Lumière chaude INTERNES pour faire briller la tour */}
      <pointLight ref={lightRef} position={[0, 0, 1.5]} color="#ffd680" intensity={6} distance={9} decay={2} />
      <pointLight position={[0, 2, 2]} color="#ffba50" intensity={4} distance={10} decay={2} />
      <pointLight position={[0, -2, 2]} color="#d8a045" intensity={3} distance={8} decay={2} />
    </group>
  )
}

/* =========================================================
   PHOTOS EN ORBITE — Deux anneaux concentriques
   ========================================================= */
const ORBIT_SRC_INNER = [
  '/assets/images/gallery/thumbs/gastro-1.webp',
  '/assets/images/gallery/thumbs/portrait-1.webp',
  '/assets/images/gallery/thumbs/immobili-1.webp',
  '/assets/images/gallery/thumbs/shooting-1.webp',
  '/assets/images/gallery/thumbs/scene-2.webp',
]
const ORBIT_SRC_OUTER = [
  '/assets/images/gallery/thumbs/archi-1.webp',
  '/assets/images/gallery/thumbs/scene-1.webp',
  '/assets/images/gallery/thumbs/nuit-3.webp',
  '/assets/images/gallery/thumbs/rue-1.webp',
]

function PhotoRing({ pointer, tier, sources, radius, speed, yOffset, photoSize, fadeFrom = -1 }) {
  const count = tier === 'low' ? Math.min(3, sources.length) : sources.length
  const items = sources.slice(0, count)
  const textures = useTexture(items)
  const group = useRef()
  const meshes = useRef([])

  useMemo(() => {
    const arr = Array.isArray(textures) ? textures : [textures]
    arr.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
      t.generateMipmaps = true
    })
  }, [textures])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y += dt * speed
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.current.y * 0.1, 0.04)
    }
    const v = new THREE.Vector3()
    meshes.current.forEach((m, i) => {
      if (!m) return
      m.position.y = Math.sin(t * 0.5 + i * 1.6) * 0.25 + yOffset
      m.rotation.z = Math.sin(t * 0.35 + i) * 0.04
      m.getWorldPosition(v).project(state.camera)
      const fade = fadeFrom < -0.9 ? 1 : THREE.MathUtils.clamp((v.x - fadeFrom) / 0.18, 0, 1)
      m.material.opacity = 0.95 * fade
      m.visible = fade > 0.02
    })
  })

  return (
    <group ref={group}>
      {items.map((_, i) => {
        const a = (i / count) * Math.PI * 2
        return (
          <group key={i} position={[Math.cos(a) * radius, yOffset, Math.sin(a) * radius]} rotation={[0, -a + Math.PI / 2, 0]}>
            <mesh ref={(el) => (meshes.current[i] = el)}>
              <planeGeometry args={photoSize} />
              <meshBasicMaterial
                map={Array.isArray(textures) ? textures[i] : textures}
                transparent
                opacity={0.95}
                toneMapped={false}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
        )
      })}
    </group>
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
      positions[i * 3] = (Math.random() - 0.5) * 28
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2
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
    g.addColorStop(0.35, 'rgba(255,210,130,0.6)')
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
      if (arr[i * 3 + 1] > 10) arr[i * 3 + 1] = -10
    }
    points.current.geometry.attributes.position.needsUpdate = true
    points.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        map={sprite}
        transparent
        opacity={0.7}
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
    camera.position.x += (pointer.current.x * 1.5 - camera.position.x) * k
    camera.position.y += (-pointer.current.y * 0.9 - camera.position.y) * k
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* Composition — décale la tour dans la zone libre */
function Composition({ children, onLayout }) {
  const { viewport, size } = useThree()
  const group = useRef()
  const isWide = size.width >= 1024
  const isMobile = size.width < 700 || (size.width < 1024 && size.height >= size.width)
  // Position tour : décale vers le centre-droit
  const x = isWide ? viewport.width * (size.width >= 1600 ? 0.18 : 0.2) : isMobile ? 0 : viewport.width * 0.08
  const y = isWide ? -0.5 : isMobile ? (size.width < 700 ? -1.2 : -0.8) : -0.3
  const scale = isMobile ? (size.width < 700 ? 0.55 : 0.72) : isWide ? 1.4 : 1.2

  useEffect(() => { onLayout?.(isWide ? 0.28 : isMobile ? -1 : 0.08) }, [isWide, isMobile, onLayout])

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
  const [fadeFrom, setFadeFrom] = useState(0.2)
  return (
    <>
      <color attach="background" args={['#08070a']} />
      <fog attach="fog" args={['#08070a', 14, 36]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 6]} intensity={1.4} color="#fff3dc" />
      <pointLight position={[-6, -3, 4]} intensity={4} color="#8b7bd8" distance={20} />
      <pointLight position={[6, 3, -4]} intensity={3} color="#6fd7d1" distance={20} />

      <Rig pointer={pointer} />
      <Composition onLayout={setFadeFrom}>
        <EiffelTowerBillboard pointer={pointer} />
        <Suspense fallback={null}>
          <PhotoRing
            pointer={pointer}
            tier={tier}
            sources={ORBIT_SRC_INNER}
            radius={5.0}
            speed={0.12}
            yOffset={-0.3}
            photoSize={[1.35, 1.7, 1, 1]}
            fadeFrom={fadeFrom}
          />
          <PhotoRing
            pointer={pointer}
            tier={tier}
            sources={ORBIT_SRC_OUTER}
            radius={7.0}
            speed={-0.07}
            yOffset={1.2}
            photoSize={[1.2, 1.5, 1, 1]}
            fadeFrom={fadeFrom}
          />
        </Suspense>
      </Composition>
      <Dust tier={tier} />
      <Preload all />
    </>
  )
}

/* =========================================================
   CANVAS + garde-fous performance
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
        camera={{ position: [0, 0, 18], fov: 42, near: 0.1, far: 60 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.3
        }}
      >
        <SceneContent tier={tier} interactive={tier !== 'low'} />
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  )
}
