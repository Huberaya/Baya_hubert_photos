import { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, AdaptiveDpr, Preload } from '@react-three/drei'
import * as THREE from 'three'

/* =========================================================
   POINTEUR AVEC AMORTISSEMENT
   ========================================================= */
function useDampedPointer() {
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  useEffect(() => {
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
  }, [])
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-4 * Math.min(dt, 0.05))
    current.current.x += (target.current.x - current.current.x) * k
    current.current.y += (target.current.y - current.current.y) * k
  })
  return current
}

/* =========================================================
   TEXTURE DE HALO (procédurale)
   ========================================================= */
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 512
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    g.addColorStop(0, 'rgba(255,235,170,1)')
    g.addColorStop(0.2, 'rgba(255,200,120,0.45)')
    g.addColorStop(0.55, 'rgba(216,160,90,0.15)')
    g.addColorStop(1, 'rgba(255,170,80,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 512, 512)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
}

/* =========================================================
   TOUR EIFFEL — silhouette en arrière-plan
   Atmosphère, pas spectacle. SYNCHRONE.
   ========================================================= */
function EiffelSilhouette({ haloTex }) {
  const group = useRef()
  const haloRef = useRef()
  const texture = useTexture('/assets/images/eiffel-tower-800-v2.png')

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
  }, [texture])

  // Dimensions : la tour est en ARRIÈRE-PLAN, pas dominante
  const towerWidth = 5.0
  const towerHeight = 9.5

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.2) * 0.04
    }
    if (haloRef.current) {
      haloRef.current.material.opacity = 0.28 + Math.sin(t * 0.4) * 0.05
    }
  })

  return (
    <group ref={group} position={[0, 0.5, -2.5]}>
      {/* Halo doux derrière la tour */}
      <mesh ref={haloRef} position={[0, 2, -1]} renderOrder={-2}>
        <planeGeometry args={[12, 14]} />
        <meshBasicMaterial map={haloTex} transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* Tour Eiffel — silhouette */}
      <mesh renderOrder={-1}>
        <planeGeometry args={[towerWidth, towerHeight]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.92}
          toneMapped={false}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Lumière douce qui éclaire la scène */}
      <pointLight position={[0, 2, 2]} color="#ffd680" intensity={6} distance={20} decay={2} />
      <pointLight position={[0, -2, 2]} color="#d8a045" intensity={2} distance={14} decay={2} />
    </group>
  )
}

/* =========================================================
   PHOTO FLOTTANTE — apparaît dans l'espace avec profondeur
   Pas d'orbite, juste un mouvement très subtil (flottaison)
   ========================================================= */
const PHOTOS_DATA = [
  { src: '/assets/images/gallery/thumbs/shooting-1.webp',  x: -3.0,  y: 0.8,  z: 1.5,  rot: 0.10,  scale: 0.95 },
  { src: '/assets/images/gallery/thumbs/portrait-1.webp',  x: -1.4,  y: -0.6, z: 0.5,  rot: -0.08, scale: 1.05 },
  { src: '/assets/images/gallery/thumbs/gastro-1.webp',     x: 1.7,   y: 0.4,  z: 0.8,  rot: 0.05,  scale: 1.0 },
  { src: '/assets/images/gallery/thumbs/immobili-1.webp',   x: 3.2,   y: -0.4, z: 1.2,  rot: -0.06, scale: 0.9 },
  { src: '/assets/images/gallery/thumbs/scene-2.webp',       x: 0.2,   y: 1.6,  z: -0.5, rot: 0.12,  scale: 0.85 },
]

function FloatingPhoto({ source, basePos, rot, scaleMul, pointer }) {
  const texture = useTexture(source)
  const group = useRef()

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
  }, [texture])

  useFrame((state, dt) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    // Flottaison très subtile (oscillation lente)
    group.current.position.y = basePos[1] + Math.sin(t * 0.4 + basePos[0]) * 0.06
    group.current.rotation.y = rot + Math.sin(t * 0.2) * 0.03
    // Parallaxe souris très subtile
    group.current.position.x = basePos[0] + pointer.current.x * 0.15
    group.current.position.z = basePos[2] + pointer.current.y * 0.08
  })

  return (
    <group ref={group} position={basePos} rotation={[0, rot, 0]}>
      <mesh scale={scaleMul}>
        <planeGeometry args={[1.6, 2.05, 1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.92}
          toneMapped={false}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* =========================================================
   POUSSIÈRE DORÉE — sparse, premium
   ========================================================= */
function Dust({ count = 90 }) {
  const points = useRef()
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const base = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const bd = 4 + Math.random() * 4
      base[i*3] = Math.sin(phi) * Math.cos(theta) * bd
      base[i*3+1] = Math.cos(phi) * bd * 0.8
      base[i*3+2] = Math.sin(phi) * Math.sin(theta) * bd
      pos[i*3] = base[i*3]
      pos[i*3+1] = base[i*3+1]
      pos[i*3+2] = base[i*3+2]
      vel[i*3] = (Math.random() - 0.5) * 0.15
      vel[i*3+1] = (Math.random() - 0.5) * 0.1
      vel[i*3+2] = (Math.random() - 0.5) * 0.15
    }
    return { pos, base, vel }
  }, [count])

  const sprite = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,235,170,1)')
    g.addColorStop(0.4, 'rgba(255,200,120,0.4)')
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
      arr[i*3]   += data.vel[i*3]   * d
      arr[i*3+1] += data.vel[i*3+1] * d
      arr[i*3+2] += data.vel[i*3+2] * d
      const dx = arr[i*3]   - data.base[i*3]
      const dy = arr[i*3+1] - data.base[i*3+1]
      const dz = arr[i*3+2] - data.base[i*3+2]
      if (Math.sqrt(dx*dx + dy*dy + dz*dz) > 3) {
        arr[i*3]   = data.base[i*3]
        arr[i*3+1] = data.base[i*3+1]
        arr[i*3+2] = data.base[i*3+2]
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.18} map={sprite} transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  )
}

/* =========================================================
   CAMÉRA — mouvement subtil, regarde la tour
   ========================================================= */
function Rig({ pointer }) {
  const { camera } = useThree()
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-2.0 * Math.min(dt, 0.1))
    camera.position.x += (pointer.current.x * 1.2 - camera.position.x) * k
    camera.position.y += (-pointer.current.y * 0.8 - camera.position.y) * k
    camera.lookAt(0, 1, 0)
  })
  return null
}

/* =========================================================
   SCENE — composition épurée
   ========================================================= */
function SceneContent({ tier }) {
  const haloTex = useGlowTexture()
  const pointer = useDampedPointer()

  return (
    <>
      <color attach="background" args={['#08070a']} />
      <fog attach="fog" args={['#08070a', 12, 30]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 4]} intensity={1.0} color="#fff3dc" />

      <Rig pointer={pointer} />

      {/* Tour Eiffel en silhouette — SYNCHRONE */}
      <EiffelSilhouette haloTex={haloTex} />

      {/* Poussière dorée */}
      <Dust count={90} />

      {/* Photos flottantes — ASYNC (Suspense) */}
      <Suspense fallback={null}>
        {PHOTOS_DATA.map((p, i) => (
          <FloatingPhoto
            key={i}
            source={p.src}
            basePos={[p.x, p.y, p.z]}
            rot={p.rot}
            scaleMul={p.scale}
            pointer={pointer}
          />
        ))}
      </Suspense>
      <Preload all />
    </>
  )
}

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

  const dpr = tier === 'high' ? [1, 1.5] : tier === 'mid' ? [1, 1.2] : [1, 1]

  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={dpr}
        gl={{ antialias: tier === 'high', alpha: false, powerPreference: 'high-performance', stencil: false, depth: true }}
        camera={{ position: [0, 0.5, 14], fov: 38, near: 0.1, far: 80 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.2
        }}
      >
        <SceneContent tier={tier} />
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  )
}
