import { useRef, useMemo, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, AdaptiveDpr, Preload } from '@react-three/drei'
import * as THREE from 'three'

/* =========================================================
   Pointeur avec amortissement
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
   Texture de halo (procédurale)
   ========================================================= */
function useGlowTexture(inner, mid, outer) {
  return useMemo(() => {
    inner = inner || 'rgba(255,235,170,1)'
    mid = mid || 'rgba(255,200,120,0.55)'
    outer = outer || 'rgba(255,170,80,0)'
    const c = document.createElement('canvas')
    c.width = c.height = 512
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    g.addColorStop(0, inner)
    g.addColorStop(0.22, mid)
    g.addColorStop(0.55, 'rgba(216,160,90,0.2)')
    g.addColorStop(1, outer)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 512, 512)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [inner, mid, outer])
}

/* =========================================================
   SOLEIL — Tour Eiffel comme image billboard
   SYNCHRONE : ne dépend d'aucune texture async
   ========================================================= */
function Sun({ haloTex, rayTex }) {
  const group = useRef()
  const halo1 = useRef()
  const halo2 = useRef()
  const raysRef = useRef()

  const texture = useTexture('/assets/images/eiffel-tower-800-v2.png')

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
  }, [texture])

  // Image aspect ≈ 1.024 — on étire verticalement pour effet dramatique : 6 × 11.5
  const towerWidth = 6.0
  const towerHeight = 11.5

  // 16 rayons dorés
  const rays = useMemo(() => {
    const arr = []
    for (let i = 0; i < 16; i++) {
      arr.push({ angle: (i / 16) * Math.PI * 2, length: 14 + (i % 3) * 2 })
    }
    return arr
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (halo1.current) halo1.current.material.opacity = 0.55 + Math.sin(t * 0.5) * 0.1
    if (halo2.current) halo2.current.material.opacity = 0.35 + Math.sin(t * 0.7) * 0.06
    if (group.current) group.current.position.y = Math.sin(t * 0.25) * 0.06
    if (raysRef.current) raysRef.current.rotation.y = t * 0.06
  })

  return (
    <group ref={group}>
      {/* HALO LARGE ATMOSPHÉRIQUE */}
      <mesh ref={halo1} position={[0, 4, -4]} renderOrder={-2}>
        <planeGeometry args={[28, 28]} />
        <meshBasicMaterial map={haloTex} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* HALO MOYEN */}
      <mesh ref={halo2} position={[0, 4, -3]} renderOrder={-1}>
        <planeGeometry args={[14, 16]} />
        <meshBasicMaterial map={haloTex} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* TOUR EIFFEL (image billboard) */}
      <mesh position={[0, 1.5, 0]}>
        <planeGeometry args={[towerWidth, towerHeight]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={1}
          toneMapped={false}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 16 RAYONS COURONNE SOLAIRE */}
      <group ref={raysRef} position={[0, 4, 0]}>
        {rays.map((r, i) => (
          <mesh key={i}
            position={[Math.cos(r.angle) * (r.length / 2 + 4), 0, Math.sin(r.angle) * (r.length / 2 + 4)]}
            rotation={[0, -r.angle, 0]}
          >
            <planeGeometry args={[r.length, 0.4]} />
            <meshBasicMaterial map={rayTex} transparent opacity={0.32} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* LUMIÈRES */}
      <pointLight position={[0, 4, 6]} color="#fff5cc" intensity={26} distance={40} decay={1.6} />
      <pointLight position={[0, 10, 2]} color="#ffd680" intensity={6} distance={16} decay={1.5} />
      <pointLight position={[-5, 2, 4]} color="#d8a045" intensity={4} distance={20} decay={2} />
      <pointLight position={[5, 2, 4]} color="#d8a045" intensity={4} distance={20} decay={2} />
    </group>
  )
}

/* =========================================================
   PLANÈTE — Photo en orbite
   ========================================================= */
function Planet({ source, radius, speed, tilt, phase, photoSize, haloTex }) {
  const texture = useTexture(source)
  const group = useRef()

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
  }, [texture])

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * speed
  })

  return (
    <group ref={group} rotation={[tilt, phase, 0]}>
      {/* Le point pivot tourne ; la planète est positionnée au bout du bras */}
      <group position={[radius, 0, 0]}>
        {/* Aura derrière */}
        <mesh position={[0, 0, -0.08]}>
          <planeGeometry args={[photoSize[0] * 1.7, photoSize[1] * 1.7]} />
          <meshBasicMaterial map={haloTex} transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        {/* Photo */}
        <mesh>
          <planeGeometry args={photoSize} />
          <meshBasicMaterial map={texture} transparent opacity={1} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}

/* =========================================================
   TRAIL ORBITAL (ellipse fine)
   ========================================================= */
function Trail({ radius, tilt, phase }) {
  const geometry = useMemo(() => {
    const N = 96
    const pts = []
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [radius])
  return (
    <group rotation={[tilt, phase, 0]}>
      <line geometry={geometry}>
        <lineBasicMaterial color="#d8b26a" transparent opacity={0.16} />
      </line>
    </group>
  )
}

/* =========================================================
   ÉTINCELLES (solar wind)
   ========================================================= */
function Embers({ count = 120 }) {
  const points = useRef()
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const base = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const sp = 1.2 + Math.random() * 2.0
      const bd = Math.random() * 0.7
      base[i*3] = Math.sin(phi) * Math.cos(theta) * bd
      base[i*3+1] = 4 + Math.cos(phi) * bd * 0.5
      base[i*3+2] = Math.sin(phi) * Math.sin(theta) * bd
      positions[i*3] = base[i*3]
      positions[i*3+1] = base[i*3+1]
      positions[i*3+2] = base[i*3+2]
      vel[i*3] = Math.sin(phi) * Math.cos(theta) * sp
      vel[i*3+1] = Math.cos(phi) * sp * 0.4 + 0.2
      vel[i*3+2] = Math.sin(phi) * Math.sin(theta) * sp
    }
    return { positions, base, vel }
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
      arr[i*3]   += data.vel[i*3]   * d
      arr[i*3+1] += data.vel[i*3+1] * d
      arr[i*3+2] += data.vel[i*3+2] * d
      const dx = arr[i*3]   - data.base[i*3]
      const dy = arr[i*3+1] - data.base[i*3+1]
      const dz = arr[i*3+2] - data.base[i*3+2]
      if (Math.sqrt(dx*dx + dy*dy + dz*dz) > 18) {
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
        <bufferAttribute attach="attributes-position" count={count} array={data.positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.22} map={sprite} transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  )
}

/* =========================================================
   CAMÉRA — suit la souris subtilement
   ========================================================= */
function Rig({ pointer }) {
  const { camera } = useThree()
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-2.2 * Math.min(dt, 0.1))
    camera.position.x += (pointer.current.x * 2.4 - camera.position.x) * k
    camera.position.y += (-pointer.current.y * 1.6 - camera.position.y) * k
    camera.lookAt(1, 4, 0)
  })
  return null
}

/* =========================================================
   COMPOSITION — adaptatif
   ========================================================= */
function Composition({ children, scaleMul = 1 }) {
  const { viewport, size } = useThree()
  const group = useRef()
  const isWide = size.width >= 1024
  const isMid = size.width < 1024 && size.width >= 700
  const isMobile = size.width < 700 || (size.width < 1024 && size.height >= size.width)

  const x = isWide ? viewport.width * 0.05 : isMid ? viewport.width * 0.06 : 0
  const y = isWide ? -3.0 : isMobile ? -5.0 : -2.0
  const scale = (isMobile ? 0.45 : isWide ? 1.25 : 0.9) * scaleMul

  useFrame((_, dt) => {
    if (!group.current) return
    const k = 1 - Math.exp(-3 * Math.min(dt, 0.1))
    group.current.position.x += (x - group.current.position.x) * k
    group.current.position.y += (y - group.current.position.y) * k
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x || scale, scale, k))
  })

  return <group ref={group} position={[x, y, 0]} scale={scale}>{children}</group>
}

/* =========================================================
   10 PLANÈTES — 5 univers + double par univers
   Vitesses Kepler-like : plus proche = plus rapide
   ========================================================= */
const PLANETS_DATA = [
  { id: 'gastro-a',   source: '/assets/images/gallery/thumbs/gastro-1.webp',    radius: 6.0,  speed: 0.34, tilt: 0.10,  phase: 0 },
  { id: 'gastro-b',   source: '/assets/images/gallery/thumbs/gastro-2.webp',    radius: 8.5,  speed: 0.27, tilt: -0.18, phase: Math.PI * 0.21 },
  { id: 'portrait-a', source: '/assets/images/gallery/thumbs/portrait-1.webp',  radius: 11.0, speed: 0.22, tilt: 0.08,  phase: Math.PI * 0.45 },
  { id: 'portrait-b', source: '/assets/images/gallery/thumbs/portrait-2.webp',  radius: 13.5, speed: 0.18, tilt: -0.12, phase: Math.PI * 0.7 },
  { id: 'immobili-a', source: '/assets/images/gallery/thumbs/immobili-1.webp', radius: 16.0, speed: 0.15, tilt: 0.06,  phase: Math.PI * 0.95 },
  { id: 'immobili-b', source: '/assets/images/gallery/thumbs/immobili-2.webp', radius: 19.0, speed: 0.13, tilt: -0.10, phase: Math.PI * 0.15 },
  { id: 'shooting-a', source: '/assets/images/gallery/thumbs/shooting-1.webp',  radius: 22.0, speed: 0.11, tilt: 0.12,  phase: Math.PI * 0.4 },
  { id: 'shooting-b', source: '/assets/images/gallery/thumbs/shooting-2.webp',  radius: 25.0, speed: 0.09, tilt: -0.06, phase: Math.PI * 0.65 },
  { id: 'mariage-a',  source: '/assets/images/gallery/thumbs/scene-2.webp',    radius: 28.0, speed: 0.08, tilt: 0.08,  phase: Math.PI * 0.85 },
  { id: 'mariage-b',  source: '/assets/images/gallery/thumbs/scene-1.webp',    radius: 31.0, speed: 0.07, tilt: -0.10, phase: Math.PI * 0.3 },
]

function SceneContent({ tier }) {
  const haloTex = useGlowTexture()
  const rayTex = useGlowTexture('rgba(255,235,170,0.95)', 'rgba(255,200,120,0.45)', 'rgba(255,170,80,0)')
  const planetHaloTex = useGlowTexture('rgba(255,235,180,1)', 'rgba(255,200,120,0.55)', 'rgba(255,170,80,0)')

  const pointer = useDampedPointer()

  return (
    <>
      <color attach="background" args={['#08070a']} />
      <fog attach="fog" args={['#08070a', 30, 80]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} color="#fff3dc" />

      <Rig pointer={pointer} />

      <Composition scaleMul={tier === 'low' ? 0.6 : 1}>
        {/* SOLEIL — SYNCHRONE */}
        <Sun haloTex={haloTex} rayTex={rayTex} />

        {/* TRAILS */}
        {PLANETS_DATA.map((p) => (
          <Trail key={`t-${p.id}`} radius={p.radius} tilt={p.tilt} phase={p.phase} />
        ))}

        {/* ÉTINCELLES */}
        <Embers count={120} />

        {/* PLANÈTES — Suspense */}
        <Suspense fallback={null}>
          {PLANETS_DATA.map((p) => (
            <Planet
              key={p.id}
              source={p.source}
              radius={p.radius}
              speed={p.speed}
              tilt={p.tilt}
              phase={p.phase}
              photoSize={[4.5, 5.8, 1, 1]}
              haloTex={planetHaloTex}
            />
          ))}
        </Suspense>
      </Composition>
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

  const dpr = tier === 'high' ? [1, 1.75] : tier === 'mid' ? [1, 1.35] : [1, 1]

  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={dpr}
        gl={{ antialias: tier === 'high', alpha: false, powerPreference: 'high-performance', stencil: false, depth: true }}
        camera={{ position: [0, 3, 56], fov: 42, near: 0.1, far: 160 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.3
        }}
      >
        <SceneContent tier={tier} />
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  )
}
