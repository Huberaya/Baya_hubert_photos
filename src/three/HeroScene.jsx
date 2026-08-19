import { useRef, useMemo, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, AdaptiveDpr, Preload, Billboard } from '@react-three/drei'
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

/* Texture procédurale : halo radial (utilisée pour tous les glows) */
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
   LE SOLEIL — Tour Eiffel irradiante
   Tour chunky + halos atmosphériques + rayons lumineux
   SYNCHRONE (jamais en Suspense)
   ========================================================= */
function Sun() {
  const group = useRef()
  const halo1 = useRef()
  const halo2 = useRef()
  const halo3 = useRef()
  const rayGroupRef = useRef()
  const haloTex = useGlowTexture()

  // Matériaux super émissifs — la tour BRILLE comme le soleil
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#fff0c4',
    metalness: 0.85,
    roughness: 0.25,
    emissive: '#ffc466',
    emissiveIntensity: 1.4,
  }), [])

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#fff5cc',
    metalness: 0.9,
    roughness: 0.2,
    emissive: '#ffd680',
    emissiveIntensity: 1.7,
  }), [])

  // ─── Construction de la Tour Eiffel ───
  const legs = useMemo(() => {
    const result = []
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4
      const pts = []
      for (let j = 0; j <= 14; j++) {
        const t = j / 14
        const r = THREE.MathUtils.lerp(1.8, 0.05, Math.pow(t, 0.9))
        const y = t * 6.5
        pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r))
      }
      const curve = new THREE.CatmullRomCurve3(pts)
      result.push(new THREE.TubeGeometry(curve, 40, 0.16, 10, false))
    }
    return result
  }, [])

  const arches = useMemo(() => {
    const result = []
    for (let i = 0; i < 4; i++) {
      const a1 = (i / 4) * Math.PI * 2 + Math.PI / 4
      const a2 = ((i + 1) / 4) * Math.PI * 2 + Math.PI / 4
      const start = new THREE.Vector3(Math.cos(a1) * 1.8, 0, Math.sin(a1) * 1.8)
      const end = new THREE.Vector3(Math.cos(a2) * 1.8, 0, Math.sin(a2) * 1.8)
      const pts = []
      const N = 28
      for (let j = 0; j <= N; j++) {
        const t = j / N
        const omt = 1 - t
        const mx = (start.x + end.x) / 2 * 0.55
        const mz = (start.z + end.z) / 2 * 0.55
        const my = 1.8
        const x = omt*omt*start.x + 2*omt*t*mx + t*t*end.x
        const y = omt*omt*start.y + 2*omt*t*my + t*t*end.y
        const z = omt*omt*start.z + 2*omt*t*mz + t*t*end.z
        pts.push(new THREE.Vector3(x, y, z))
      }
      const curve = new THREE.CatmullRomCurve3(pts)
      result.push(new THREE.TubeGeometry(curve, 32, 0.08, 8, false))
    }
    return result
  }, [])

  const platforms = useMemo(() => [
    { y: 1.5, h: 0.20, r: 1.2 },
    { y: 3.1, h: 0.16, r: 0.55 },
    { y: 4.8, h: 0.10, r: 0.22 },
  ], [])

  const lineGeometry = useMemo(() => {
    const positions = []
    const segments = [
      [0.1, 1.3],
      [1.7, 2.9],
      [3.3, 4.6],
    ]
    const rAt = y => THREE.MathUtils.lerp(1.8, 0.05, Math.pow(y / 6.5, 0.9))
    segments.forEach(([y1, y2]) => {
      const r1 = rAt(y1), r2 = rAt(y2)
      for (let i = 0; i < 4; i++) {
        const a1 = (i / 4) * Math.PI * 2 + Math.PI / 4
        const a2 = ((i + 1) / 4) * Math.PI * 2 + Math.PI / 4
        // Croix en X
        positions.push(Math.cos(a1)*r1, y1, Math.sin(a1)*r1, Math.cos(a2)*r2, y2, Math.sin(a2)*r2)
        positions.push(Math.cos(a2)*r1, y1, Math.sin(a2)*r1, Math.cos(a1)*r2, y2, Math.sin(a1)*r2)
      }
      // Anneau horizontal
      for (let i = 0; i < 4; i++) {
        const a1 = (i / 4) * Math.PI * 2 + Math.PI / 4
        const a2 = ((i + 1) / 4) * Math.PI * 2 + Math.PI / 4
        positions.push(Math.cos(a1)*r2, y2, Math.sin(a1)*r2, Math.cos(a2)*r2, y2, Math.sin(a2)*r2)
      }
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [])

  // ─── 12 RAYONS LUMINEUX qui irradient du soleil (style couronne solaire) ───
  const rayGroup = useRef()
  const rays = useMemo(() => {
    const arr = []
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      const len = 8 + (i % 3) * 2  // longueurs variées
      arr.push({ angle: a, length: len })
    }
    return arr
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Pulsation des halos
    if (halo1.current) halo1.current.material.opacity = 0.45 + Math.sin(t * 0.5) * 0.08
    if (halo2.current) halo2.current.material.opacity = 0.28 + Math.sin(t * 0.7 + 1) * 0.05
    if (halo3.current) halo3.current.material.opacity = 0.15 + Math.sin(t * 0.3 + 2) * 0.04
    // Très subtile oscillation du groupe
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.3) * 0.04
    }
    // Rotation lente des rayons (effet couronne solaire)
    if (rayGroup.current) {
      rayGroup.current.rotation.y = t * 0.06
    }
  })

  return (
    <group ref={group}>

      {/* === HALOS ATMOSPHÉRIQUES DERRIÈRE LA TOUR (effet soleil) === */}
      <mesh ref={halo1} position={[0, 3, -3]} renderOrder={-3}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial map={haloTex} transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={halo2} position={[0, 3, -2]} renderOrder={-2}>
        <planeGeometry args={[12, 14]} />
        <meshBasicMaterial map={haloTex} transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={halo3} position={[0, 3, -1]} renderOrder={-1}>
        <planeGeometry args={[6, 9]} />
        <meshBasicMaterial map={haloTex} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* === TOUR EIFFEL CHUNKY (cœur du soleil) === */}
      {legs.map((geo, i) => (
        <mesh key={`leg-${i}`} geometry={geo} material={goldMat} />
      ))}
      {arches.map((geo, i) => (
        <mesh key={`arch-${i}`} geometry={geo} material={goldMat} />
      ))}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#ffd680" transparent opacity={0.85} linewidth={1} />
      </lineSegments>

      {/* Plates-formes */}
      {platforms.map((p, i) => (
        <mesh key={`plat-${i}`} position={[0, p.y, 0]} material={goldMat}>
          <cylinderGeometry args={[p.r, p.r, p.h, 32, 1]} />
        </mesh>
      ))}

      {/* Flèche + antenne + boule */}
      <mesh position={[0, 5.6, 0]} material={accentMat}>
        <cylinderGeometry args={[0.025, 0.08, 1.8, 8]} />
      </mesh>
      <mesh position={[0, 6.9, 0]} material={accentMat}>
        <cylinderGeometry args={[0.008, 0.018, 0.7, 4]} />
      </mesh>
      {/* Boule lumineuse */}
      <mesh position={[0, 7.4, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#fff5cc" toneMapped={false} />
      </mesh>

      {/* === 12 RAYONS LUMINEUX (couronne solaire) === */}
      <group ref={rayGroup} position={[0, 3, 0]}>
        {rays.map((r, i) => (
          <mesh
            key={i}
            position={[Math.cos(r.angle) * (r.length / 2 + 2), 0, Math.sin(r.angle) * (r.length / 2 + 2)]}
            rotation={[0, -r.angle, 0]}
            renderOrder={-1}
          >
            <planeGeometry args={[r.length, 0.25]} />
            <meshBasicMaterial
              map={haloTex}
              transparent
              opacity={0.22}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* === LUMIÈRES (le soleil éclaire tout son système solaire) === */}
      <pointLight position={[0, 3, 0]} color="#fff5cc" intensity={22} distance={32} decay={1.8} />
      <pointLight position={[0, 6, 0]} color="#ffd680" intensity={6} distance={12} decay={1.5} />
      <pointLight position={[-3, 1, 3]} color="#d8b26a" intensity={3} distance={16} decay={2} />
      <pointLight position={[3, 1, 3]} color="#d8b26a" intensity={3} distance={16} decay={2} />
    </group>
  )
}

/* =========================================================
   PLANÈTES — Photos orbitant sur leurs propres trajectoires
   ========================================================= */
const PLANETS_DATA = [
  { id: 'gastro',    source: '/assets/images/gallery/thumbs/gastro-1.webp',    radius: 4.2, speed: 0.30, tilt: 0.10,  phase: 0 },
  { id: 'portrait',  source: '/assets/images/gallery/thumbs/portrait-1.webp',  radius: 5.6, speed: 0.22, tilt: -0.18, phase: Math.PI * 0.4 },
  { id: 'immobili', source: '/assets/images/gallery/thumbs/immobili-1.webp', radius: 6.7, speed: 0.18, tilt: 0.08,  phase: Math.PI * 0.7 },
  { id: 'shooting',  source: '/assets/images/gallery/thumbs/shooting-1.webp',  radius: 7.9, speed: 0.15, tilt: -0.12, phase: Math.PI * 0.2 },
  { id: 'mariage',   source: '/assets/images/gallery/thumbs/scene-2.webp',    radius: 9.2, speed: 0.12, tilt: 0.06,  phase: Math.PI * 0.5 },
]

function Planet({ source, radius, speed, tilt, phase, photoSize }) {
  const texture = useTexture(source)
  const group = useRef()
  const glowTex = useGlowTexture('rgba(255,235,180,1)', 'rgba(255,200,120,0.5)')

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
      {/* Le pivot tourne : la planète fait son tour d'orbite */}
      <group position={[radius, 0, 0]}>
        {/* Aura / atmosphère derrière la planète (glow additif) */}
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[photoSize[0] * 1.7, photoSize[1] * 1.7]} />
          <meshBasicMaterial
            map={glowTex}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        {/* La planète (la photo) */}
        <mesh>
          <planeGeometry args={photoSize} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.96}
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
   TRAIL ORBITAL — fine ligne lumineuse qui dessine l'orbite
   ========================================================= */
function OrbitalTrail({ radius, tilt, phase = 0, opacity }) {
  const geometry = useMemo(() => {
    const N = 128
    const points = []
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2
      points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    return geo
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
   ÉTINCELLES — Solar wind (particules irradiant du soleil)
   ========================================================= */
function SolarEmbers({ count = 120 }) {
  const points = useRef()
  const { positions, basePositions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const basePositions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const speedMag = 0.8 + Math.random() * 1.5
      const baseDist = Math.random() * 0.6
      basePositions[i*3] = Math.sin(phi) * Math.cos(theta) * baseDist
      basePositions[i*3+1] = 3 + Math.cos(phi) * baseDist * 0.5
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
      if (dist > 14) {
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
        size={0.18}
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
   POUSSIÈRE LUMINEUSE (background)
   ========================================================= */
function Dust({ tier }) {
  const count = tier === 'low' ? 220 : tier === 'mid' ? 500 : 900
  const points = useRef()
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = (Math.random() - 0.5) * 28
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22 - 4
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
      if (arr[i * 3 + 1] > 14) arr[i * 3 + 1] = -14
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
   Caméra réactive — dirigée vers le soleil (0, 3, 0)
   ========================================================= */
function Rig({ pointer }) {
  const { camera } = useThree()
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-2.2 * Math.min(dt, 0.1))
    camera.position.x += (pointer.current.x * 1.6 - camera.position.x) * k
    camera.position.y += (-pointer.current.y * 0.9 - camera.position.y) * k
    camera.lookAt(0, 3, 0)
  })
  return null
}

/* =========================================================
   Composition : positionnement responsive du système solaire
   ========================================================= */
function Composition({ children }) {
  const { viewport, size } = useThree()
  const group = useRef()
  const isWide = size.width >= 1024
  const isMobile = size.width < 700 || (size.width < 1024 && size.height >= size.width)
  const x = isWide ? viewport.width * 0.18 : isMobile ? 0 : viewport.width * 0.08
  const y = isWide ? -0.8 : isMobile ? -1.2 : -0.5
  const scale = isMobile ? (size.width < 700 ? 0.65 : 0.78) : isWide ? 1.3 : 1.1

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
   SCENE PRINCIPALE
   ========================================================= */
function SceneContent({ tier, interactive }) {
  const pointer = useDampedPointer(interactive)
  return (
    <>
      <color attach="background" args={['#08070a']} />
      <fog attach="fog" args={['#08070a', 18, 50]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} color="#fff3dc" />
      <pointLight position={[-8, -3, 4]} intensity={2} color="#8b7bd8" distance={30} />
      <pointLight position={[8, 3, -4]} intensity={1.8} color="#6fd7d1" distance={30} />

      <Rig pointer={pointer} />
      <Composition>
        {/* SOLEIL — Tour Eiffel irradiante */}
        <Sun />

        {/* TRAILS ORBITAUX (en arrière des planètes, en avant du soleil) */}
        <group renderOrder={-2}>
          {PLANETS_DATA.map((p) => (
            <OrbitalTrail
              key={`trail-${p.id}`}
              radius={p.radius}
              tilt={p.tilt}
              phase={p.phase}
              opacity={0.13}
            />
          ))}
        </group>

        {/* ÉTINCELLES — Vent solaire */}
        <SolarEmbers count={120} />

        {/* PLANÈTES — Photos en orbite (ASYNC, dans Suspense) */}
        <Suspense fallback={null}>
          {PLANETS_DATA.map((p) => (
            <Planet
              key={p.id}
              source={p.source}
              radius={p.radius}
              speed={p.speed}
              tilt={p.tilt}
              phase={p.phase}
              photoSize={[1.55, 1.95, 1, 1]}
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
        camera={{ position: [0, 1, 23], fov: 42, near: 0.1, far: 80 }}
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
