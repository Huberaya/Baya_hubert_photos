import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, AdaptiveDpr, Preload } from '@react-three/drei'
import * as THREE from 'three'

// Pointer amorti
function useDampedPointer(){
  const target=useRef({x:0,y:0}), cur=useRef({x:0,y:0})
  useEffect(()=>{
    const onMove=e=>{ target.current.x=(e.clientX/window.innerWidth)*2-1; target.current.y=(e.clientY/window.innerHeight)*2-1 }
    const onLeave=()=>{ target.current.x=0; target.current.y=0 }
    window.addEventListener('pointermove',onMove,{passive:true})
    window.addEventListener('pointerleave',onLeave)
    return()=>{ window.removeEventListener('pointermove',onMove); window.removeEventListener('pointerleave',onLeave)}
  },[])
  useFrame((_,dt)=>{
    const k=1-Math.exp(-3.5*Math.min(dt,0.05))
    cur.current.x+=(target.current.x-cur.current.x)*k
    cur.current.y+=(target.current.y-cur.current.y)*k
  })
  return cur
}

function useGlowTex(){
  return useMemo(()=>{
    const c=document.createElement('canvas'); c.width=c.height=512
    const ctx=c.getContext('2d')
    const g=ctx.createRadialGradient(256,256,0,256,256,256)
    g.addColorStop(0,'rgba(255,235,170,1)'); g.addColorStop(0.18,'rgba(255,200,120,0.45)'); g.addColorStop(0.5,'rgba(216,160,90,0.12)'); g.addColorStop(1,'rgba(0,0,0,0)')
    ctx.fillStyle=g; ctx.fillRect(0,0,512,512)
    const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t
  },[])
}

// Tour silhouette très subtile en fond
function Backdrop({tex}){
  const g=useRef()
  useFrame(s=>{ if(g.current) g.current.position.y=Math.sin(s.clock.elapsedTime*0.15)*0.03 })
  return (
    <group ref={g} position={[2.8, -0.2, -4.5]}>
      <mesh>
        <planeGeometry args={[4.2,8]} />
        <meshBasicMaterial map={tex} transparent opacity={0.10} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0,2,2]} color="#ffd680" intensity={3} distance={18} decay={2} />
    </group>
  )
}

const PHOTOS=[
  {src:'/assets/images/gallery/thumbs/shooting-1.webp', p:[-3.2,0.9,1.8], r:0.08, s:1.05},
  {src:'/assets/images/gallery/thumbs/portrait-1.webp', p:[-1.1,-0.55,0.6], r:-0.06, s:1.0},
  {src:'/assets/images/gallery/thumbs/gastro-1.webp', p:[1.8,0.45,1.0], r:0.04, s:0.98},
  {src:'/assets/images/gallery/thumbs/immobili-1.webp', p:[3.4,-0.35,1.4], r:-0.05, s:0.92},
  {src:'/assets/images/gallery/thumbs/scene-2.webp', p:[0.15,1.55,-0.3], r:0.09, s:0.86},
]

function Floating({src, base, rot, scale, pointer}){
  const tex=useTexture(src)
  const ref=useRef()
  useMemo(()=>{ tex.colorSpace=THREE.SRGBColorSpace; tex.anisotropy=8 },[tex])
  useFrame((state)=>{
    if(!ref.current) return
    const t=state.clock.elapsedTime
    ref.current.position.y=base[1]+Math.sin(t*0.35+base[0])*0.07
    ref.current.rotation.y=rot+Math.sin(t*0.18)*0.025
    ref.current.position.x=base[0]+pointer.current.x*0.18
    ref.current.position.z=base[2]+pointer.current.y*0.1
  })
  return (
    <group ref={ref} position={base} rotation={[0,rot,0]}>
      {/* cadre premium */}
      <mesh scale={scale}>
        <planeGeometry args={[1.72,2.18]} />
        <meshBasicMaterial map={tex} transparent opacity={0.96} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* bordure chrome subtile */}
      <mesh scale={scale} position={[0,0,0.01]}>
        <planeGeometry args={[1.74,2.20]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} wireframe={false} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Dust({count=90}){
  const ref=useRef()
  const {pos, base, vel} = useMemo(()=>{
    const pos=new Float32Array(count*3), base=new Float32Array(count*3), vel=new Float32Array(count*3)
    for(let i=0;i<count;i++){
      const th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1), r=4+Math.random()*5
      base[i*3]=Math.sin(ph)*Math.cos(th)*r; base[i*3+1]=Math.cos(ph)*r*0.7; base[i*3+2]=Math.sin(ph)*Math.sin(th)*r
      pos[i*3]=base[i*3]; pos[i*3+1]=base[i*3+1]; pos[i*3+2]=base[i*3+2]
      vel[i*3]=(Math.random()-0.5)*0.12; vel[i*3+1]=(Math.random()-0.5)*0.08; vel[i*3+2]=(Math.random()-0.5)*0.12
    }
    return {pos,base,vel}
  },[count])
  const sprite=useMemo(()=>{
    const c=document.createElement('canvas'); c.width=c.height=64
    const ctx=c.getContext('2d'); const g=ctx.createRadialGradient(32,32,0,32,32,32)
    g.addColorStop(0,'rgba(255,235,170,1)'); g.addColorStop(0.4,'rgba(255,200,120,0.35)'); g.addColorStop(1,'rgba(0,0,0,0)')
    ctx.fillStyle=g; ctx.fillRect(0,0,64,64); const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t
  },[])
  useFrame((_,dt)=>{
    const arr=ref.current?.geometry.attributes.position.array; if(!arr) return
    const d=Math.min(dt,0.05)
    for(let i=0;i<count;i++){ arr[i*3]+=vel[i*3]*d; arr[i*3+1]+=vel[i*3+1]*d; arr[i*3+2]+=vel[i*3+2]*d
      const dx=arr[i*3]-base[i*3], dy=arr[i*3+1]-base[i*3+1], dz=arr[i*3+2]-base[i*3+2]
      if(Math.sqrt(dx*dx+dy*dy+dz*dz)>3.5){ arr[i*3]=base[i*3]; arr[i*3+1]=base[i*3+1]; arr[i*3+2]=base[i*3+2] }
    }
    ref.current.geometry.attributes.position.needsUpdate=true
  })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.16} map={sprite} transparent opacity={0.65} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  )
}

function Rig({pointer}){
  const {camera}=useThree()
  useFrame((_,dt)=>{
    const k=1-Math.exp(-2*Math.min(dt,0.08))
    camera.position.x+=(pointer.current.x*0.9 - camera.position.x)*k
    camera.position.y+=(-pointer.current.y*0.6 - camera.position.y)*k
    camera.lookAt(0,0.6,0)
  })
  return null
}

function Scene({tier}){
  const halo=useGlowTex()
  const pointer=useDampedPointer()
  const eiffel=useTexture('/assets/images/eiffel-tower-800-v2.png')
  useMemo(()=>{ eiffel.colorSpace=THREE.SRGBColorSpace; eiffel.minFilter=THREE.LinearFilter; eiffel.generateMipmaps=false },[eiffel])
  return (
    <>
      <color attach="background" args={['#050408']} />
      <fog attach="fog" args={['#050408',14,32]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4,6,4]} intensity={1.0} color="#fff3dc" />
      <Rig pointer={pointer} />
      <Backdrop tex={eiffel} />
      <Dust count={tier==='high'?90:45} />
      <Suspense fallback={null}>
        {PHOTOS.map((p,i)=><Floating key={i} src={p.src} base={p.p} rot={p.r} scale={p.s} pointer={pointer} />)}
      </Suspense>
      <Preload all />
    </>
  )
}

export default function HeroScene({tier='high', className='' }){
  const wrap=useRef(null)
  useEffect(()=>{
    const el=wrap.current; if(!el) return
    const io=new IntersectionObserver(([e])=>{ if(!e.isIntersecting) {} },{threshold:0.01})
    io.observe(el); return()=>io.disconnect()
  },[])
  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas dpr={tier==='high'?[1,1.5]:[1,1.2]} gl={{antialias:tier==='high', alpha:false, powerPreference:'high-performance'}} camera={{position:[0,0.6,14], fov:36, near:0.1, far:80}} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping; gl.toneMappingExposure=1.22}}>
        <Scene tier={tier} />
        <AdaptiveDpr />
      </Canvas>
    </div>
  )
}
