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
   L'IRIS : diaphragme d'objectif en 3D
   ========================================================= */
function Aperture({ pointer, tier }) {
  const group = useRef()
  const blades = useRef([])
  const inner = useRef()
  const halo = useRef()
  const glowTex = useGlowTexture()
  const haloTex = useGlowTexture('rgba(240,212,154,0.55)', 'rgba(216,178,106,0.18)')

  // Lame de diaphragme : fine, incurvée, elle referme le cercle
  const bladeGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0.86, -0.06)
    shape.quadraticCurveTo(1.12, 0.16, 1.04, 0.44)
    shape.lineTo(0.06, 0.3)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelSize: 0.008,
      bevelThickness: 0.008,
      bevelSegments: 1,
      curveSegments: 8,
    })
  }, [])

  const bladeCount = tier === 'low' ? 7 : 9

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.z += dt * 0.05
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.current.y * 0.26, 0.06)
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.current.x * 0.3, 0.06)
      group.current.position.y = Math.sin(t * 0.5) * 0.08
    }
    // ouverture / fermeture du diaphragme
    const open = 0.5 + (Math.sin(t * 0.35) * 0.5 + 0.5) * 0.45
    blades.current.forEach((b, i) => {
      if (!b) return
      const a = (i / bladeCount) * Math.PI * 2
      b.position.set(Math.cos(a) * open * 1.05, Math.sin(a) * open * 1.05, (i % 2) * 0.012)
      b.rotation.z = a + Math.PI * 0.5 + (1 - open) * 0.55
      b.scale.setScalar(0.94)
    })
    if (inner.current) {
      const s = 0.42 + open * 0.42
      inner.current.scale.setScalar(s)
      inner.current.material.opacity = 0.6 + (1 - open) * 0.35
    }
    if (halo.current) halo.current.material.opacity = 0.42 + Math.sin(t * 0.35) * 0.1
  })

  return (
    <group ref={group}>
      {/* Bague extérieure : le fût de l'objectif */}
      <mesh>
        <torusGeometry args={[2.05, 0.055, 14, 96]} />
        <meshStandardMaterial color="#d8b26a" metalness={1} roughness={0.24} emissive="#a37c33" emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[0, 0, -0.12]}>
        <torusGeometry args={[1.72, 0.02, 10, 96]} />
        <meshStandardMaterial color="#8b7bd8" metalness={0.7} roughness={0.35} emissive="#8b7bd8" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0, -0.3]}>
        <torusGeometry args={[2.42, 0.008, 8, 96]} />
        <meshStandardMaterial color="#6fd7d1" emissive="#6fd7d1" emissiveIntensity={0.8} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Lames */}
      {Array.from({ length: bladeCount }).map((_, i) => (
        <mesh key={i} ref={(el) => (blades.current[i] = el)} geometry={bladeGeo} castShadow={false}>
          <meshStandardMaterial color="#211d29" metalness={0.9} roughness={0.34} emissive="#a37c33" emissiveIntensity={0.045} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Cœur lumineux + halo */}
      <mesh ref={inner} position={[0, 0, -0.2]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial map={glowTex} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={halo} position={[0, 0, -0.9]}>
        <planeGeometry args={[9.5, 9.5]} />
        <meshBasicMaterial map={haloTex} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 0, 1.1]} color="#f0d49a" intensity={7} distance={9} decay={2} />
      <pointLight position={[-2.4, 1.6, 2.6]} color="#fff0d0" intensity={6} distance={12} decay={2} />
    </group>
  )
}

/* =========================================================
   PHOTOS EN ORBITE — vraies images du portfolio
   ========================================================= */
const ORBIT_SRC = [
  '/assets/images/gallery/thumbs/archi-1.webp',
  '/assets/images/gallery/thumbs/nuit-3.webp',
  '/assets/images/gallery/thumbs/rue-1.webp',
  '/assets/images/gallery/thumbs/scene-1.webp',
  '/assets/images/gallery/thumbs/nature-1.webp',
  '/assets/images/gallery/thumbs/archi-2.webp',
]

function PhotoRing({ pointer, tier, fadeFrom = -1 }) {
  const count = tier === 'low' ? 4 : 6
  const sources = ORBIT_SRC.slice(0, count)
  const textures = useTexture(sources)
  const group = useRef()
  const items = useRef([])

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
      group.current.rotation.y += dt * 0.13
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.current.y * 0.16 + 0.06, 0.05)
    }
    const v = new THREE.Vector3()
    items.current.forEach((m, i) => {
      if (!m) return
      m.position.y = Math.sin(t * 0.6 + i * 1.3) * 0.28
      m.rotation.z = Math.sin(t * 0.4 + i) * 0.04
      // Les clichés s'effacent lorsqu'ils passent devant la zone de texte (gauche)
      m.getWorldPosition(v).project(state.camera)
      const fade = fadeFrom < -0.9 ? 1 : THREE.MathUtils.clamp((v.x - fadeFrom) / 0.18, 0, 1)
      m.material.opacity = 0.92 * fade
      m.visible = fade > 0.02
    })
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      {sources.map((_, i) => {
        const a = (i / count) * Math.PI * 2
        const r = 3.15
        return (
          <group key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]} rotation={[0, -a + Math.PI / 2, 0]}>
            <mesh ref={(el) => (items.current[i] = el)}>
              <planeGeometry args={[1.16, 1.45, 1, 1]} />
              <meshBasicMaterial
                map={Array.isArray(textures) ? textures[i] : textures}
                transparent
                opacity={0.9}
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
      positions[i * 3] = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 13
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2
      speeds[i] = 0.04 + Math.random() * 0.12
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
      if (arr[i * 3 + 1] > 6.5) arr[i * 3 + 1] = -6.5
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
        size={0.11}
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
    camera.position.x += (pointer.current.x * 1.1 - camera.position.x) * k
    camera.position.y += (-pointer.current.y * 0.75 - camera.position.y) * k
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* Décale la composition dans la zone libre (droite en desktop, haut en mobile) */
function Composition({ children, onLayout }) {
  const { viewport, size } = useThree()
  const group = useRef()
  const isWide = size.width >= 1024
  // Mise en page « empilée » : mobile, ou tablette en portrait
  const isMobile = size.width < 700 || (size.width < 1024 && size.height >= size.width)
  const x = isWide ? viewport.width * (size.width >= 1600 ? 0.24 : 0.26) : isMobile ? 0 : viewport.width * 0.16
  const y = isMobile ? viewport.height * (size.width < 700 ? 0.28 : 0.24) : 0
  const scale = isMobile ? (size.width < 700 ? 0.42 : 0.52) : isWide ? 0.8 : 0.7

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
      <fog attach="fog" args={['#08070a', 9, 24]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 6]} intensity={1.4} color="#fff3dc" />
      <pointLight position={[-6, -3, 4]} intensity={5} color="#8b7bd8" distance={20} />
      <pointLight position={[6, 3, -4]} intensity={4} color="#6fd7d1" distance={20} />

      <Rig pointer={pointer} />
      <Composition onLayout={setFadeFrom}>
        <Aperture pointer={pointer} tier={tier} />
        <Suspense fallback={null}>
          <PhotoRing pointer={pointer} tier={tier} fadeFrom={fadeFrom} />
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
        camera={{ position: [0, 0, 9.2], fov: 42, near: 0.1, far: 50 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
      >
        <SceneContent tier={tier} interactive={tier !== 'low'} />
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  )
}
