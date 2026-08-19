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

/* =========================================================
   TOUR EIFFEL — Modèle 3D procédural chunky et lumineux
   Géométrie construite une seule fois, matériaux émissifs
   Synchronous rendering : JAMAIS de texture async ici
   ========================================================= */
function EiffelTower() {
  const group = useRef()
  const topLightRef = useRef()

  // Matériaux très émissifs — la tour brille dans la nuit
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e8b863',
    metalness: 0.85,
    roughness: 0.28,
    emissive: '#c89148',
    emissiveIntensity: 0.85,
  }), [])

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f8d47a',
    metalness: 0.9,
    roughness: 0.22,
    emissive: '#ffb84d',
    emissiveIntensity: 1.15,
  }), [])

  // ───────── Construction des jambes iconiques ─────────
  const legs = useMemo(() => {
    const result = []
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4
      const pts = []
      // Profil : base outermost (r=1.6) → sommet (r=0.04), sur 6 unités de haut
      for (let j = 0; j <= 14; j++) {
        const t = j / 14
        const r = THREE.MathUtils.lerp(1.6, 0.04, Math.pow(t, 0.9))
        const y = t * 6.0
        pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r))
      }
      const curve = new THREE.CatmullRomCurve3(pts)
      // CHUNKY : rayon tube 0.14 (au lieu de 0.04 avant)
      result.push(new THREE.TubeGeometry(curve, 40, 0.14, 10, false))
    }
    return result
  }, [])

  // ───────── Arcs emblématiques à la base ─────────
  const arches = useMemo(() => {
    const result = []
    for (let i = 0; i < 4; i++) {
      const a1 = (i / 4) * Math.PI * 2 + Math.PI / 4
      const a2 = ((i + 1) / 4) * Math.PI * 2 + Math.PI / 4
      const start = new THREE.Vector3(Math.cos(a1) * 1.6, 0, Math.sin(a1) * 1.6)
      const end = new THREE.Vector3(Math.cos(a2) * 1.6, 0, Math.sin(a2) * 1.6)
      const pts = []
      const N = 28
      for (let j = 0; j <= N; j++) {
        const t = j / N
        const omt = 1 - t
        // Bezier quadratique qui s'incurve vers l'intérieur et monte
        const mx = (start.x + end.x) / 2 * 0.55
        const mz = (start.z + end.z) / 2 * 0.55
        const my = 1.7
        const x = omt * omt * start.x + 2 * omt * t * mx + t * t * end.x
        const y = omt * omt * start.y + 2 * omt * t * my + t * t * end.y
        const z = omt * omt * start.z + 2 * omt * t * mz + t * t * end.z
        pts.push(new THREE.Vector3(x, y, z))
      }
      const curve = new THREE.CatmullRomCurve3(pts)
      result.push(new THREE.TubeGeometry(curve, 32, 0.07, 8, false))
    }
    return result
  }, [])

  // ───────── Plates-formes (paliers) ─────────
  const platforms = useMemo(() => [
    { y: 1.4, r: 1.10, h: 0.18 },
    { y: 2.9, r: 0.50, h: 0.14 },
    { y: 4.6, r: 0.20, h: 0.1 },
  ], [])

  // ───────── Lignes de croisillons (lattice) ─────────
  const lineGeometry = useMemo(() => {
    const positions = []
    const segments = [
      [0.1, 1.2],   // base → 1er palier
      [1.6, 2.7],   // 1er → 2e palier
      [3.0, 4.4],   // 2e → 3e palier
    ]
    const rAt = y => THREE.MathUtils.lerp(1.6, 0.04, Math.pow(y / 6, 0.9))
    segments.forEach(([y1, y2]) => {
      const r1 = rAt(y1)
      const r2 = rAt(y2)
      for (let i = 0; i < 4; i++) {
        const a1 = (i / 4) * Math.PI * 2 + Math.PI / 4
        const a2 = ((i + 1) / 4) * Math.PI * 2 + Math.PI / 4
        // Croix en X entre deux jambes adjacentes
        positions.push(Math.cos(a1) * r1, y1, Math.sin(a1) * r1,
                        Math.cos(a2) * r2, y2, Math.sin(a2) * r2)
        positions.push(Math.cos(a2) * r1, y1, Math.sin(a2) * r1,
                        Math.cos(a1) * r2, y2, Math.sin(a1) * r2)
      }
      // Anneau horizontal en haut du segment
      for (let i = 0; i < 4; i++) {
        const a1 = (i / 4) * Math.PI * 2 + Math.PI / 4
        const a2 = ((i + 1) / 4) * Math.PI * 2 + Math.PI / 4
        positions.push(Math.cos(a1) * r2, y2, Math.sin(a1) * r2,
                        Math.cos(a2) * r2, y2, Math.sin(a2) * r2)
      }
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [])

  // ───────── Animation vivante mais STATIQUE (tour ne tourne pas) ─────────
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      // Très subtile oscillation verticale (vivant)
      group.current.position.y = Math.sin(t * 0.35) * 0.04
    }
    if (topLightRef.current) {
      topLightRef.current.intensity = 1.0 + Math.sin(t * 1.2) * 0.2
    }
  })

  return (
    <group ref={group}>
      {/* 4 jambes iconiques */}
      {legs.map((geo, i) => (
        <mesh key={`leg-${i}`} geometry={geo} material={goldMat} />
      ))}

      {/* 4 arcs à la base */}
      {arches.map((geo, i) => (
        <mesh key={`arch-${i}`} geometry={geo} material={goldMat} />
      ))}

      {/* Treillis de croisillons */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#ffb84d" transparent opacity={0.7} linewidth={1} />
      </lineSegments>

      {/* Plates-formes */}
      {platforms.map((p, i) => (
        <mesh key={`plat-${i}`} position={[0, p.y, 0]} material={goldMat}>
          <cylinderGeometry args={[p.r, p.r, p.h, 32, 1]} />
        </mesh>
      ))}

      {/* Flèche (spire) */}
      <mesh position={[0, 5.4, 0]} material={accentMat}>
        <cylinderGeometry args={[0.02, 0.07, 1.6, 8]} />
      </mesh>

      {/* Antenne fine */}
      <mesh position={[0, 6.6, 0]} material={accentMat}>
        <cylinderGeometry args={[0.006, 0.014, 0.6, 4]} />
      </mesh>

      {/* Boule lumineuse au sommet */}
      <mesh position={[0, 7.0, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#fff5cc" toneMapped={false} />
      </mesh>

      {/* ───────── LUMIÈRES qui font briller la tour ───────── */}
      <pointLight position={[0, 3, 2.5]} color="#ffd680" intensity={7} distance={14} decay={2} />
      <pointLight ref={topLightRef} position={[0, 6.5, 1.5]} color="#fff0c0" intensity={1.2} distance={8} decay={2} />
      <pointLight position={[-3, 0, 3]} color="#d8a045" intensity={4} distance={16} decay={2} />
      <pointLight position={[3, 0, 3]} color="#d8a045" intensity={4} distance={16} decay={2} />
    </group>
  )
}

/* =========================================================
   PHOTOS EN ORBITE — Un anneau intérieur + un anneau extérieur
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

function PhotoRing({ pointer, tier, sources, radius, speed, yOffset, photoSize }) {
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
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        pointer.current.y * 0.08,
        0.04
      )
    }
    meshes.current.forEach((m, i) => {
      if (!m) return
      m.position.y = Math.sin(t * 0.5 + i * 1.6) * 0.2 + yOffset
      m.rotation.z = Math.sin(t * 0.35 + i) * 0.04
    })
  })

  return (
    <group ref={group}>
      {items.map((_, i) => {
        const a = (i / count) * Math.PI * 2
        return (
          <group key={i} position={[Math.cos(a) * radius, yOffset, Math.sin(a) * radius]} rotation={[0, -a, 0]}>
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
      positions[i * 3] = (Math.random() - 0.5) * 32
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 2
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
      if (arr[i * 3 + 1] > 12) arr[i * 3 + 1] = -12
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
        size={0.14}
        map={sprite}
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

/* =========================================================
   Caméra réactive — regarde le centre de la tour
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
   Positionnement adaptatif (responsive)
   ========================================================= */
function Composition({ children }) {
  const { viewport, size } = useThree()
  const group = useRef()
  const isWide = size.width >= 1024
  const isMobile = size.width < 700 || (size.width < 1024 && size.height >= size.width)

  // Tour légèrement décalée à droite pour laisser la place au texte
  const x = isWide ? viewport.width * 0.16 : isMobile ? 0 : viewport.width * 0.08
  const y = isWide ? -0.6 : isMobile ? -1.0 : -0.4
  const scale = isMobile ? (size.width < 700 ? 0.6 : 0.75) : isWide ? 1.25 : 1.1

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
      <fog attach="fog" args={['#08070a', 16, 42]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 10, 7]} intensity={1.4} color="#fff3dc" />
      <pointLight position={[-6, -3, 4]} intensity={2.5} color="#8b7bd8" distance={24} />
      <pointLight position={[6, 3, -4]} intensity={2} color="#6fd7d1" distance={24} />

      <Rig pointer={pointer} />

      {/* La Tour Eiffel — SYNCHRONE, jamais en Suspense */}
      <Composition>
        <EiffelTower />

        {/* Photos orbitales — ASYNC (useTexture), entourées de Suspense */}
        <Suspense fallback={null}>
          <PhotoRing
            pointer={pointer}
            tier={tier}
            sources={ORBIT_SRC_INNER}
            radius={5.2}
            speed={0.14}
            yOffset={-0.2}
            photoSize={[1.55, 1.95, 1, 1]}
          />
          <PhotoRing
            pointer={pointer}
            tier={tier}
            sources={ORBIT_SRC_OUTER}
            radius={7.2}
            speed={-0.08}
            yOffset={1.6}
            photoSize={[1.3, 1.65, 1, 1]}
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
        camera={{ position: [0, 1, 17], fov: 42, near: 0.1, far: 60 }}
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
