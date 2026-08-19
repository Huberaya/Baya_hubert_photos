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
function useGlowTexture(inner = 'rgba(255,242,214,1)', mid = 'rgba(216,178,106,0.42)') {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, inner)
    g.addColorStop(0.32, mid)
    g.addColorStop(1, 'rgba(216,178,106,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [inner, mid])
}

/* =========================================================
   TOUR EIFFEL — Modèle procédural stylisé
   ========================================================= */
function EiffelTower({ pointer, tier }) {
  const group = useRef()
  const glowTex = useGlowTexture()
  const beamRef = useRef()

  // Profil de la tour : [hauteur, demi-largeur]
  const profile = useMemo(() => [
    [0, 2.4],      // base (pieds)
    [0.3, 2.2],
    [0.8, 1.85],
    [1.3, 1.55],
    [2.0, 1.3],    // 1er palier
    [2.3, 1.15],
    [2.8, 0.95],
    [3.3, 0.8],
    [3.8, 0.65],   // 2e palier
    [4.2, 0.52],
    [4.6, 0.4],
    [5.0, 0.28],
    [5.3, 0.18],
    [5.6, 0.1],
    [5.9, 0.04],
    [6.3, 0.012],  // sommet
    [6.8, 0.005],  // antenne
  ], [])

  const metalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#b89538',
    metalness: 0.85,
    roughness: 0.3,
    emissive: '#8a6a1f',
    emissiveIntensity: 0.15,
  }), [])

  const darkMetalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#6b5420',
    metalness: 0.9,
    roughness: 0.35,
    emissive: '#5a4518',
    emissiveIntensity: 0.08,
  }), [])

  // Construire la structure
  const { legs, crossBraces, platforms, glowPoints, topGlow } = useMemo(() => {
    const legs = []
    const crossBraces = []
    const platforms = []
    const glowPoints = []

    // 4 pieds
    for (let fi = 0; fi < 4; fi++) {
      const angle = (fi / 4) * Math.PI * 2 + Math.PI / 4
      const pts = profile.map(([h, w]) => new THREE.Vector3(
        Math.cos(angle) * w,
        h - 3.2,
        Math.sin(angle) * w
      ))
      const curve = new THREE.CatmullRomCurve3(pts)
      const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.04, 6, false)
      legs.push({ geo: tubeGeo, angle })
    }

    // Croisillons diagonaux entre les pieds
    for (let i = 0; i < profile.length - 1; i += 2) {
      const [h1, w1] = profile[i]
      const [h2, w2] = profile[Math.min(i + 2, profile.length - 1)]
      for (let fi = 0; fi < 4; fi++) {
        const a1 = (fi / 4) * Math.PI * 2 + Math.PI / 4
        const a2 = ((fi + 1) / 4) * Math.PI * 2 + Math.PI / 4
        const midH = (h1 + h2) / 2 - 3.2
        const midW = (w1 + w2) / 2 * 0.92

        // Croisillon X entre deux pieds adjacents
        const start = new THREE.Vector3(Math.cos(a1) * w1, h1 - 3.2, Math.sin(a1) * w1)
        const end = new THREE.Vector3(Math.cos(a2) * w1, h1 - 3.2, Math.sin(a2) * w1)
        const midPt = new THREE.Vector3(
          (Math.cos(a1) * w1 + Math.cos(a2) * w1) / 2,
          midH + 0.1,
          (Math.sin(a1) * w1 + Math.sin(a2) * w1) / 2
        )

        // Barre horizontale
        crossBraces.push({
          from: start,
          to: end,
        })

        // Croisillon diagonal
        if (i < profile.length - 3) {
          const topStart = new THREE.Vector3(Math.cos(a1) * w2, h2 - 3.2, Math.sin(a1) * w2)
          crossBraces.push({ from: start, to: midPt })
          crossBraces.push({ from: midPt, to: new THREE.Vector3(Math.cos(a2) * w1, h1 - 3.2, Math.sin(a2) * w1) })
        }
      }
    }

    // Plates-formes (paliers)
    const platformHeights = [2.0, 3.8, 5.6]
    const platformWidths = [1.3, 0.65, 0.1]
    platformHeights.forEach((h, idx) => {
      platforms.push({ height: h - 3.2, width: platformWidths[idx], idx })
    })

    // Points lumineux le long des pieds
    for (let i = 0; i < profile.length; i += 3) {
      const [h, w] = profile[i]
      for (let fi = 0; fi < 4; fi++) {
        const angle = (fi / 4) * Math.PI * 2 + Math.PI / 4
        glowPoints.push(new THREE.Vector3(
          Math.cos(angle) * w,
          h - 3.2,
          Math.sin(angle) * w
        ))
      }
    }

    return { legs, crossBraces, platforms, glowPoints, topGlow: new THREE.Vector3(0, 6.8 - 3.2, 0) }
  }, [profile])

  // Barres de connexion entre pieds (lines)
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = []
    crossBraces.forEach(({ from, to }) => {
      positions.push(from.x, from.y, from.z, to.x, to.y, to.z)
    })
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [crossBraces])

  // Construction des meshes de plates-formes
  const platformGeos = useMemo(() =>
    platforms.map(({ height, width }) => {
      const geo = new THREE.CylinderGeometry(width + 0.12, width + 0.12, 0.06, 24, 1)
      return { geo, height }
    }), [platforms])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      // Rotation continue lente
      group.current.rotation.y += dt * 0.04
      // Inclinaison réactive à la souris
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.current.y * 0.15, 0.05)
      // Souffle de la tour (oscillation verticale subtile)
      group.current.position.y = Math.sin(t * 0.4) * 0.06
    }
    // Phare au sommet
    if (beamRef.current) {
      beamRef.current.material.opacity = 0.25 + Math.sin(t * 0.8) * 0.15
      beamRef.current.rotation.y = t * 0.3
    }
  })

  return (
    <group ref={group}>
      {/* Pieds tubulaires */}
      {legs.map((leg, i) => (
        <mesh key={`leg-${i}`} geometry={leg.geo} material={metalMat} />
      ))}

      {/* Croisillons (lignes) */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#a07c28" transparent opacity={0.7} />
      </lineSegments>

      {/* Plates-formes */}
      {platformGeos.map(({ geo, height }, i) => (
        <mesh key={`plat-${i}`} geometry={geo} position={[0, height, 0]} material={darkMetalMat} />
      ))}

      {/* Antenne sommet */}
      <mesh position={[0, 3.4, 0]} material={metalMat}>
        <cylinderGeometry args={[0.008, 0.02, 0.6, 6]} />
      </mesh>

      {/* Phare rotatif au sommet */}
      <group ref={beamRef} position={[0, 3.55, 0]}>
        <mesh>
          <boxGeometry args={[2.8, 0.01, 0.01]} />
          <meshBasicMaterial color="#ffd680" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[2.8, 0.01, 0.01]} />
          <meshBasicMaterial color="#ffd680" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* Points lumineux sur la structure */}
      {glowPoints.map((pos, i) => (
        <mesh key={`glow-${i}`} position={pos}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshBasicMaterial color="#ffd680" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}

      {/* Halo au sommet */}
      <mesh position={[0, 3.5, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial map={glowTex} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Halo général derrière la tour */}
      <mesh position={[0, 0, -1.2]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial map={glowTex} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Lumières */}
      <pointLight position={[0, 3.6, 1.5]} color="#f0d49a" intensity={5} distance={8} decay={2} />
      <pointLight position={[-2, 0, 2]} color="#d8b26a" intensity={3} distance={10} decay={2} />
      <pointLight position={[2, 2, -2]} color="#8b7bd8" intensity={3} distance={12} decay={2} />
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
  '/assets/images/gallery/thumbs/mariage-1.webp',
]
const ORBIT_SRC_OUTER = [
  '/assets/images/gallery/thumbs/archi-1.webp',
  '/assets/images/gallery/thumbs/scene-1.webp',
  '/assets/images/gallery/thumbs/nuit-3.webp',
  '/assets/images/gallery/thumbs/rue-1.webp',
]

function PhotoRing({ pointer, tier, sources, radius, speed, yOffset, fadeFrom = -1 }) {
  const count = tier === 'low' ? Math.min(3, sources.length) : sources.length
  const items = sources.slice(0, count)
  const textures = useTexture(items)
  const group = useRef()
  const meshes = useRef([])

  useMemo(() => {
    const arr = Array.isArray(textures) ? textures : [textures]
    arr.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
      t.generateMipmaps = true
    })
  }, [textures])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y += dt * speed
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.current.y * 0.12, 0.04)
    }
    const v = new THREE.Vector3()
    meshes.current.forEach((m, i) => {
      if (!m) return
      m.position.y = Math.sin(t * 0.5 + i * 1.6) * 0.2 + yOffset
      m.rotation.z = Math.sin(t * 0.35 + i) * 0.03
      m.getWorldPosition(v).project(state.camera)
      const fade = fadeFrom < -0.9 ? 1 : THREE.MathUtils.clamp((v.x - fadeFrom) / 0.18, 0, 1)
      m.material.opacity = 0.88 * fade
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
              <planeGeometry args={[1.1, 1.38, 1, 1]} />
              <meshBasicMaterial
                map={Array.isArray(textures) ? textures[i] : textures}
                transparent
                opacity={0.85}
                toneMapped={false}
                side={THREE.DoubleSide}
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
      positions[i * 3] = (Math.random() - 0.5) * 24
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2
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
      if (arr[i * 3 + 1] > 8) arr[i * 3 + 1] = -8
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
        size={0.1}
        map={sprite}
        transparent
        opacity={0.65}
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
    camera.position.x += (pointer.current.x * 1.3 - camera.position.x) * k
    camera.position.y += (-pointer.current.y * 0.8 - camera.position.y) * k
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* Décale la composition dans la zone libre (droite en desktop, haut en mobile) */
function Composition({ children, onLayout }) {
  const { viewport, size } = useThree()
  const group = useRef()
  const isWide = size.width >= 1024
  const isMobile = size.width < 700 || (size.width < 1024 && size.height >= size.width)
  const x = isWide ? viewport.width * (size.width >= 1600 ? 0.22 : 0.25) : isMobile ? 0 : viewport.width * 0.14
  const y = isMobile ? viewport.height * (size.width < 700 ? 0.3 : 0.25) : 0
  const scale = isMobile ? (size.width < 700 ? 0.48 : 0.58) : isWide ? 1.05 : 0.92

  useEffect(() => { onLayout?.(isWide ? 0.3 : isMobile ? -1 : 0.1) }, [isWide, isMobile, onLayout])

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
      <fog attach="fog" args={['#08070a', 10, 28]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 6]} intensity={1.2} color="#fff3dc" />
      <pointLight position={[-6, -3, 4]} intensity={4} color="#8b7bd8" distance={20} />
      <pointLight position={[6, 3, -4]} intensity={3} color="#6fd7d1" distance={20} />

      <Rig pointer={pointer} />
      <Composition onLayout={setFadeFrom}>
        <EiffelTower pointer={pointer} tier={tier} />
        <Suspense fallback={null}>
          <PhotoRing
            pointer={pointer}
            tier={tier}
            sources={ORBIT_SRC_INNER}
            radius={4.2}
            speed={0.1}
            yOffset={-0.5}
            fadeFrom={fadeFrom}
          />
          <PhotoRing
            pointer={pointer}
            tier={tier}
            sources={ORBIT_SRC_OUTER}
            radius={5.8}
            speed={-0.06}
            yOffset={0.8}
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
   AMBIANCE SONORE — voir src/three/useHeroAudio.js
   ========================================================= */

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
        camera={{ position: [0, 0.5, 12], fov: 38, near: 0.1, far: 50 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.1
        }}
      >
        <SceneContent tier={tier} interactive={tier !== 'low'} />
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  )
}
