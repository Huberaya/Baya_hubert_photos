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
   TOUR EIFFEL — Modèle procédural stylisé, éclairé et lumineux
   ========================================================= */
function EiffelTower({ pointer }) {
  const group = useRef()
  const glowTex = useGlowTexture('rgba(255,235,180,1)', 'rgba(255,200,120,0.65)')
  const beamRef = useRef()
  const haloRef = useRef()

  // Profil de la tour : [hauteur, demi-largeur] (en mètres relatifs)
  const profile = useMemo(() => [
    [0, 2.6],
    [0.3, 2.35],
    [0.8, 2.0],
    [1.3, 1.65],
    [2.0, 1.35],    // 1er palier
    [2.3, 1.18],
    [2.8, 0.95],
    [3.3, 0.78],
    [3.8, 0.62],    // 2e palier
    [4.2, 0.48],
    [4.6, 0.36],
    [5.0, 0.25],
    [5.3, 0.16],
    [5.6, 0.08],
    [5.9, 0.035],
    [6.3, 0.012],
    [6.8, 0.005],   // antenne
  ], [])

  // Matériaux dorés très émissifs — la tour brille dans la nuit
  const metalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e8b863',
    metalness: 0.9,
    roughness: 0.28,
    emissive: '#c89148',
    emissiveIntensity: 0.5,
  }), [])

  const brightMetalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f5cc6e',
    metalness: 0.95,
    roughness: 0.2,
    emissive: '#ffb84d',
    emissiveIntensity: 0.85,
  }), [])

  const darkMetalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#a87834',
    metalness: 0.95,
    roughness: 0.32,
    emissive: '#8a5e1f',
    emissiveIntensity: 0.3,
  }), [])

  // Construction de la structure
  const { legs, crossBraces, platforms, glowPoints, lights, arches } = useMemo(() => {
    const legs = []
    const crossBraces = []
    const platforms = []
    const glowPoints = []
    const lights = []
    const arches = []

    // 4 pieds courbes (les jambes iconiques)
    for (let fi = 0; fi < 4; fi++) {
      const angle = (fi / 4) * Math.PI * 2 + Math.PI / 4
      const pts = profile.map(([h, w]) => new THREE.Vector3(
        Math.cos(angle) * w,
        h - 3.2,
        Math.sin(angle) * w
      ))
      const curve = new THREE.CatmullRomCurve3(pts)
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.06, 8, false)
      legs.push({ geo: tubeGeo, angle })
    }

    // Arcs à la base (les arches emblématiques)
    for (let fi = 0; fi < 4; fi++) {
      const a1 = (fi / 4) * Math.PI * 2 + Math.PI / 4
      const a2 = ((fi + 1) / 4) * Math.PI * 2 + Math.PI / 4
      // Arc entre deux pieds adjacents au niveau du sol
      const archPts = []
      for (let t = 0; t <= 20; t++) {
        const p = t / 20
        const start = new THREE.Vector3(Math.cos(a1) * 2.6, -3.2, Math.sin(a1) * 2.6)
        const end = new THREE.Vector3(Math.cos(a2) * 2.6, -3.2, Math.sin(a2) * 2.6)
        const mid = new THREE.Vector3(
          (start.x + end.x) / 2 * 0.55,
          -3.2 + Math.sin(p * Math.PI) * 1.4,
          (start.z + end.z) / 2 * 0.55
        )
        const pt = new THREE.Vector3().lerpVectors(
          new THREE.Vector3().lerpVectors(start, mid, p),
          new THREE.Vector3().lerpVectors(mid, end, p),
          p
        )
        archPts.push(pt)
      }
      const curve = new THREE.CatmullRomCurve3(archPts)
      arches.push(new THREE.TubeGeometry(curve, 24, 0.04, 6, false))
    }

    // Croisillons entre les pieds
    for (let i = 0; i < profile.length - 1; i += 1) {
      const [h1, w1] = profile[i]
      const [h2, w2] = profile[Math.min(i + 2, profile.length - 1)]
      for (let fi = 0; fi < 4; fi++) {
        const a1 = (fi / 4) * Math.PI * 2 + Math.PI / 4
        const a2 = ((fi + 1) / 4) * Math.PI * 2 + Math.PI / 4

        // Barre horizontale entre deux pieds
        crossBraces.push({
          from: new THREE.Vector3(Math.cos(a1) * w1, h1 - 3.2, Math.sin(a1) * w1),
          to: new THREE.Vector3(Math.cos(a2) * w1, h1 - 3.2, Math.sin(a2) * w1),
        })

        // Croisillon diagonal montant vers le palier suivant
        if (i < profile.length - 2) {
          crossBraces.push({
            from: new THREE.Vector3(Math.cos(a1) * w1, h1 - 3.2, Math.sin(a1) * w1),
            to: new THREE.Vector3(Math.cos(a2) * w2, h2 - 3.2, Math.sin(a2) * w2),
          })
        }
      }
    }

    // Plates-formes (paliers)
    const platformSpecs = [
      { height: 2.0 - 3.2, width: 1.35 },
      { height: 3.8 - 3.2, width: 0.62 },
      { height: 5.6 - 3.2, width: 0.16 },
    ]
    platformSpecs.forEach(({ height, width }) => {
      platforms.push({ height, width })
    })

    // Lumières le long des pieds (sphères émissives brillantes)
    for (let i = 0; i < profile.length; i += 2) {
      const [h, w] = profile[i]
      for (let fi = 0; fi < 4; fi++) {
        const angle = (fi / 4) * Math.PI * 2 + Math.PI / 4
        const pos = new THREE.Vector3(
          Math.cos(angle) * w,
          h - 3.2,
          Math.sin(angle) * w
        )
        glowPoints.push(pos)
        if (i % 4 === 0) {
          lights.push(pos)
        }
      }
    }

    return { legs, crossBraces, platforms, glowPoints, lights, arches }
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
      const geo = new THREE.CylinderGeometry(width + 0.14, width + 0.14, 0.07, 28, 1)
      return { geo, height, width }
    }), [platforms])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      // Rotation continue lente autour de l'axe Y
      group.current.rotation.y += dt * 0.05
      // Inclinaison réactive à la souris (très subtile)
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -pointer.current.y * 0.12,
        0.05
      )
      // Souffle vertical de la tour
      group.current.position.y = Math.sin(t * 0.4) * 0.05
    }
    // Phare rotatif au sommet
    if (beamRef.current) {
      beamRef.current.material.opacity = 0.4 + Math.sin(t * 0.8) * 0.2
      beamRef.current.rotation.y = t * 0.4
    }
    // Halo principal pulsant
    if (haloRef.current) {
      haloRef.current.material.opacity = 0.35 + Math.sin(t * 0.6) * 0.1
    }
  })

  return (
    <group ref={group}>
      {/* HALO DERRIÈRE LA TOUR — toujours visible */}
      <mesh ref={haloRef} position={[0, 0.5, -2]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial map={glowTex} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Pieds tubulaires (les 4 jambes) */}
      {legs.map((leg, i) => (
        <mesh key={`leg-${i}`} geometry={leg.geo} material={metalMat} />
      ))}

      {/* Arcs à la base */}
      {arches.map((geo, i) => (
        <mesh key={`arch-${i}`} geometry={geo} material={brightMetalMat} />
      ))}

      {/* Croisillons (lignes) */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#d8a045" transparent opacity={0.85} linewidth={1.5} />
      </lineSegments>

      {/* Plates-formes (paliers) */}
      {platformGeos.map(({ geo, height }, i) => (
        <mesh key={`plat-${i}`} geometry={geo} position={[0, height, 0]} material={darkMetalMat} />
      ))}

      {/* Antenne sommet */}
      <mesh position={[0, 3.5, 0]} material={brightMetalMat}>
        <cylinderGeometry args={[0.012, 0.025, 0.7, 6]} />
      </mesh>

      {/* Phare rotatif au sommet */}
      <group ref={beamRef} position={[0, 3.7, 0]}>
        <mesh>
          <boxGeometry args={[3.2, 0.012, 0.012]} />
          <meshBasicMaterial color="#ffd680" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[3.2, 0.012, 0.012]} />
          <meshBasicMaterial color="#ffd680" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* Halo au sommet */}
      <mesh position={[0, 3.7, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial map={glowTex} transparent opacity={0.65} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Points lumineux brillants sur la structure */}
      {glowPoints.map((pos, i) => (
        <mesh key={`glow-${i}`} position={pos}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffe4a0" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}

      {/* Halos individuels sur quelques points clés */}
      {glowPoints.filter((_, i) => i % 3 === 0).map((pos, i) => (
        <mesh key={`halo-${i}`} position={pos}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshBasicMaterial map={glowTex} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}

      {/* Éclairage intense pour faire briller la tour */}
      <pointLight position={[0, 0, 1.5]} color="#ffd680" intensity={8} distance={12} decay={2} />
      <pointLight position={[0, 3.6, 1.5]} color="#ffeaa0" intensity={6} distance={10} decay={2} />
      <pointLight position={[-3, 0, 3]} color="#d8b26a" intensity={5} distance={14} decay={2} />
      <pointLight position={[3, 2, -3]} color="#8b7bd8" intensity={4} distance={16} decay={2} />
      <pointLight position={[0, -3, 0]} color="#ffd680" intensity={3} distance={10} decay={2} />
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
      positions[i * 3] = (Math.random() - 0.5) * 26
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18
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
      if (arr[i * 3 + 1] > 9) arr[i * 3 + 1] = -9
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
        opacity={0.75}
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

/* Composition — décale la tour dans la zone libre (droite desktop, centré mobile) */
function Composition({ children, onLayout }) {
  const { viewport, size } = useThree()
  const group = useRef()
  const isWide = size.width >= 1024
  const isMobile = size.width < 700 || (size.width < 1024 && size.height >= size.width)
  // Tour centrée avec léger décalage à droite sur grand écran
  const x = isWide ? viewport.width * (size.width >= 1600 ? 0.15 : 0.18) : isMobile ? 0 : viewport.width * 0.08
  const y = isMobile ? viewport.height * (size.width < 700 ? 0.32 : 0.26) : 0
  const scale = isMobile ? (size.width < 700 ? 0.55 : 0.7) : isWide ? 1.35 : 1.15

  useEffect(() => { onLayout?.(isWide ? 0.25 : isMobile ? -1 : 0.08) }, [isWide, isMobile, onLayout])

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
      <fog attach="fog" args={['#08070a', 12, 32]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 6]} intensity={1.5} color="#fff3dc" />
      <pointLight position={[-6, -3, 4]} intensity={4} color="#8b7bd8" distance={20} />
      <pointLight position={[6, 3, -4]} intensity={3} color="#6fd7d1" distance={20} />

      <Rig pointer={pointer} />
      <Composition onLayout={setFadeFrom}>
        <EiffelTower pointer={pointer} />
        <Suspense fallback={null}>
          <PhotoRing
            pointer={pointer}
            tier={tier}
            sources={ORBIT_SRC_INNER}
            radius={4.5}
            speed={0.12}
            yOffset={-0.4}
            photoSize={[1.3, 1.62, 1, 1]}
            fadeFrom={fadeFrom}
          />
          <PhotoRing
            pointer={pointer}
            tier={tier}
            sources={ORBIT_SRC_OUTER}
            radius={6.4}
            speed={-0.07}
            yOffset={0.9}
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
        camera={{ position: [0, 0, 15], fov: 42, near: 0.1, far: 60 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.25
        }}
      >
        <SceneContent tier={tier} interactive={tier !== 'low'} />
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  )
}
