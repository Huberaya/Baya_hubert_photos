import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import Seo from '../components/Seo'
import PhotoCard from '../components/PhotoCard'
import Lightbox from '../components/Lightbox'
import { Aurora } from '../components/ui'
import { CATEGORIES, PHOTOS, STATS } from '../data/content'
import { PRINTS } from '../data/prints'
const HeroScene = lazy(() => import('../three/HeroScene'))

function HeroFallback(){
  return (
    <div className="hero__fallback" aria-hidden="true">
      <div className="hero__fallback-veil" />
      <img src="/assets/images/eiffel-tower-transparent-v2.png" alt="" className="hero__fallback-tower" loading="eager" />
    </div>
  )
}

function Hero({caps}){
  const [mounted,setMounted]=useState(false)
  useEffect(()=>{ const t=setTimeout(()=>setMounted(true),180); return()=>clearTimeout(t)},[])
  const use3D=caps.ready && caps.webgl && !caps.reducedMotion
  return (
    <section className="hero hero--futur">
      <div className="hero__scene">
        {use3D && mounted ? (
          <Suspense fallback={<HeroFallback/>}><HeroScene tier={caps.tier} className="hero__canvas" /></Suspense>
        ) : <HeroFallback/>}
        <div className="hero__vignette" aria-hidden="true" />
        <div className="hero__grain" aria-hidden="true" />
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__glow" aria-hidden="true" />
      </div>

      <div className="container hero__content--split">
        <div className="hero__left">
          <p className="hero__kicker" data-reveal><span className="hero__kicker-line"/> Baya Hubert — Paris <span className="hide-mobile">· Chambre noire du futur</span></p>
          <h1 className="hero__title hero__title--huge" data-reveal data-reveal-delay="80">
            <span className="hero__title-line">La lumière,</span>
            <span className="hero__title-line"><em>vraie.</em><span className="hero__underline" aria-hidden="true"/></span>
          </h1>
          <p className="hero__lede" data-reveal data-reveal-delay="280">
            Photographies en suspension. Une galerie orbitale où chaque image flotte dans le noir, révélée par la lumière qui la sculpte. Cinq univers, une exigence : l’authentique.
          </p>
          <div className="hero__actions" data-reveal data-reveal-delay="420">
            <Link to="/portfolio" className="btn btn--solid btn--magnetic">Explorer les œuvres <span className="btn__arrow">→</span></Link>
            <a href="#univers" className="btn btn--ghost btn--glass"><span className="dot" aria-hidden="true"/> Voir les univers</a>
          </div>
          <div className="hero__trust" data-reveal data-reveal-delay="560">
            <div className="hero__avatars" aria-hidden="true">
              <img src="/assets/images/gallery/thumbs/portrait-2.webp" alt="" /><img src="/assets/images/gallery/thumbs/scene-2.webp" alt="" /><img src="/assets/images/gallery/thumbs/rue-1.webp" alt="" />
            </div>
            <div className="hero__trust-text"><span className="mono">Confiance</span><span>120+ tirages livrés · 4.9/5</span></div>
            <span className="hero__trust-spacer" aria-hidden="true"/>
            <span className="mono hero__hint hide-mobile">Scroll — travelling</span>
          </div>
        </div>
        <div className="hero__right" aria-hidden="true">
          <div className="hero__stack">
            <div className="float-card float-card--a" data-depth="0.08"><img src="/assets/images/prints/canal-reflets.webp" alt="" /><span className="float-tag">01 — Canal, Reflets — 100 $</span><span className="float-arrow">↗</span></div>
            <div className="float-card float-card--b" data-depth="0.12"><img src="/assets/images/gallery/thumbs/archi-1.webp" alt="" /><span className="float-tag float-tag--gold">02 — Verrière — 90 $</span></div>
            <div className="float-card float-card--c" data-depth="0.09"><img src="/assets/images/gallery/thumbs/immobili-2.webp" alt="" /><span className="float-tag">Nef — noir & blanc</span></div>
            <div className="float-card float-card--d" data-depth="0.05"><img src="/assets/images/gallery/thumbs/nature-1.webp" alt="" /><span className="float-tag float-tag--dot">Disponible</span></div>
          </div>
          <p className="hero__caption mono">Système orbital — 5 tirages en lévitation</p>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true"><span className="hero__scroll-line"/><span className="hero__scroll-label">Défiler</span></div>
    </section>
  )
}

function Manifesto(){
  return (
    <section className="section manifesto manifesto--paper">
      <div className="container manifesto__grid">
        <div>
          <p className="eyebrow" data-reveal>Manifeste — Une nuit au studio</p>
          <h2 className="section-title section-title--display" data-reveal data-reveal-delay="60">La lumière<br/><em>ne se pose pas,</em><br/>elle se rencontre.</h2>
          <div className="rule-gold" data-reveal />
          <p className="mono muted" data-reveal>23 tirages · noir & blanc · Paris</p>
        </div>
        <div className="manifesto__body" data-reveal data-reveal-delay="160">
          <p className="lede lede--large">Je photographie ce qui reste quand la ville s’éteint : un reflet, une verrière, un pavé mouillé. Pas de mise en scène — <em>une écoute de la lumière</em>. Chaque image est tirée à la demande, numérotée, signée.</p>
          <div className="manifesto__stats">
            {STATS.map(s=>(
              <div key={s.label} className="stat"><span className="stat__num">{s.value}</span><span className="mono muted">{s.label}</span></div>
            ))}
          </div>
          <div className="manifesto__actions">
            <Link to="/apropos" className="btn btn--dark">Lire l’approche — Baya Hubert <span>→</span></Link>
            <Link to="/contact" className="btn btn--ghost-dark">Me parler</Link>
          </div>
        </div>
      </div>
      <div className="marquee" aria-hidden="true"><div className="marquee__track"><div className="marquee__group"><span>Rue & Instantanés <i>✦</i></span><span>Architecture & Lignes <i>✦</i></span><span>Nuit & Lumières <i>✦</i></span><span>Nature & Saisons <i>✦</i></span><span>Scène & Culture <i>✦</i></span></div><div className="marquee__group" aria-hidden="true"><span>Rue & Instantanés <i>✦</i></span><span>Architecture & Lignes <i>✦</i></span><span>Nuit & Lumières <i>✦</i></span><span>Nature & Saisons <i>✦</i></span><span>Scène & Culture <i>✦</i></span></div></div></div>
    </section>
  )
}

function Univers(){
  const trackRef=useRef(null)
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if(window.innerWidth<900) return
    let ctx, st
    ;(async()=>{
      const { gsap }=await import('gsap')
      const { ScrollTrigger }=await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      const track=trackRef.current; if(!track) return
      const getScroll=()=> track.scrollWidth - window.innerWidth + 56
      ctx=gsap.context(()=>{
        gsap.to(track,{ x:()=>-getScroll(), ease:'none', scrollTrigger:{ trigger:'#univers', start:'top 75%', end:()=>'+='+getScroll(), scrub:1, pin:true, anticipatePin:1 }})
      })
      st=()=>{}
    })()
    return()=>{ try{ctx?.revert()}catch{} }
  },[])
  const items=[
    {id:'01', title:'Rue & Instantanés', desc:'Le geste suspendu, le reflet qui passe.', img:'/assets/images/gallery/thumbs/rue-1.webp'},
    {id:'02', title:'Architecture & Lignes', desc:'Géométrie, verrière, répétition.', img:'/assets/images/gallery/thumbs/archi-1.webp'},
    {id:'03', title:'Nuit & Lumières', desc:'La ville quand elle respire bas.', img:'/assets/images/gallery/thumbs/nuit-1.webp'},
    {id:'04', title:'Nature & Saisons', desc:'Estuaire, courbe, matière.', img:'/assets/images/gallery/thumbs/nature-1.webp'},
    {id:'05', title:'Scène & Culture', desc:'Rideau, coupole, présence.', img:'/assets/images/gallery/thumbs/scene-1.webp'},
  ]
  return (
    <section id="univers" className="section univers">
      <div className="container">
        <div className="univers__head">
          <div><p className="eyebrow" style={{color:'var(--gold)'}}>01 — Univers</p><h2 className="section-title">Cinq regards.<br/><em>Une même lumière.</em></h2></div>
          <p className="lede" style={{maxWidth:'36ch', color:'var(--text-soft)'}}>Chaque série est une façon d’attendre la lumière. Filtrez, explorez, ouvrez — comme dans une exposition.</p>
        </div>
      </div>
      <div className="univers__wrap">
        <div ref={trackRef} className="univers__track">
          {items.map(m=>(
            <Link key={m.id} to="/portfolio" className="univers__card">
              <img src={m.img} alt="" loading="lazy" />
              <div className="univers__veil" />
              <span className="univers__num">{m.id}</span>
              <div className="univers__body">
                <h3>{m.title}</h3><p>{m.desc}</p><span className="mono" style={{color:'var(--gold)'}}>Explorer →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="container"><p className="mono muted univers__hint"><span>Glissez horizontalement</span><span className="flex-1" style={{height:1, background:'var(--hairline)'}}/><span className="hide-mobile">Scroll → travelling latéral</span></p></div>
    </section>
  )
}

function Gallery(){
  const [filter,setFilter]=useState('all')
  const [lightbox,setLightbox]=useState(-1)
  const visible=useMemo(()=> filter==='all' ? PHOTOS : PHOTOS.filter(p=>p.category===filter),[filter])
  return (
    <section className="section gallery gallery--paper" id="galerie">
      <div className="container">
        <div className="gallery__head">
          <h2 className="section-title">Œuvres<br/><em>sélectionnées</em></h2>
          <div className="filters" role="tablist">
            {CATEGORIES.map(c=>(
              <button key={c.id} role="tab" aria-selected={filter===c.id} className={`filter ${filter===c.id?'is-active':''}`} onClick={()=>setFilter(c.id)}>
                <span>{c.label}</span><em>{c.id==='all'?PHOTOS.length:PHOTOS.filter(p=>p.category===c.id).length}</em>
              </button>
            ))}
          </div>
        </div>
        <p className="mono muted" aria-live="polite">{visible.length} clichés {filter!=='all' && `· ${CATEGORIES.find(c=>c.id===filter)?.desc}`}</p>
        <div className="photo-grid photo-grid--editorial">
          {visible.slice(0,8).map((p,i)=><PhotoCard key={p.id} photo={p} index={i} priority={i<3} onOpen={()=>setLightbox(i)} />)}
        </div>
        <div className="gallery__more"><Link to="/portfolio" className="btn btn--ghost-dark">Voir le portfolio complet <span>→</span></Link></div>
      </div>
      {lightbox>=0 && <Lightbox photos={visible} index={lightbox} onClose={()=>setLightbox(-1)} onNav={setLightbox} />}
    </section>
  )
}

function AboutTeaser(){
  return (
    <section className="section about-teaser">
      <div className="container about-teaser__grid">
        <div className="about-teaser__media" data-reveal>
          <img src="/assets/images/gallery/thumbs/portrait-2.webp" alt="Baya Hubert" loading="lazy" />
          <div className="about-teaser__overlay"><p className="mono" style={{color:'var(--gold)'}}>Baya Hubert — Paris</p><h3 className="display">Photographe de<br/><em>l’ordinaire lumineux</em></h3></div>
          <span className="about-teaser__badge">Disponible — Portraits · Mode · Événementiel</span>
        </div>
        <div data-reveal data-reveal-delay="120">
          <p className="eyebrow" style={{color:'var(--gold)'}}>02 — À propos</p>
          <h2 className="section-title">Une présence<br/><em>derrière l’objectif.</em></h2>
          <p className="lede" style={{color:'var(--text-soft)'}}>Basé à Paris, je travaille la photo comme on travaille une matière : patience, cadre, attente. Mes séries naissent tôt le matin ou tard la nuit, quand la ville devient studio.</p>
          <ul className="about-teaser__list">
            <li><span>—</span> Approche documentaire, tirage d’art signé, édition limitée</li>
            <li><span>—</span> Boîtiers & optiques soignés, traitement fidèle au négatif</li>
            <li><span>—</span> Accompagnement humain : écoute, direction douce, restitution rapide</li>
          </ul>
          <div style={{display:'flex', gap:12, marginTop:18}}>
            <Link to="/apropos" className="btn btn--solid">Découvrir mon histoire <span>→</span></Link>
            <Link to="/contact" className="btn btn--ghost">Me écrire</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServicesTeaser(){
  return (
    <section className="section services-teaser services-teaser--paper">
      <div className="container">
        <div className="services-teaser__head">
          <div><p className="eyebrow">03 — Services</p><h2 className="section-title">Faire image,<br/><em>ensemble.</em></h2></div>
          <p className="lede" style={{maxWidth:'38ch'}}>Cinq terrains, une exigence : sublimer sans travestir. Devis clair, préparation soignée, livraison premium.</p>
        </div>
        <div className="services-teaser__grid">
          <div className="services-teaser__accordions">
            <details open><summary>Portrait & Mode <span>+</span></summary><p>Séance studio ou extérieur, direction naturelle, lumière sculptée. Idéal book, branding, presse.</p><span className="mono muted">À partir de 280 € · Galerie privée</span></details>
            <details><summary>Mariage & Événement <span>+</span></summary><p>Discrétion, anticipation, émotion vraie. Sans mise en scène lourde — l’instant d’abord.</p></details>
            <details><summary>Gastronomie & Lieux <span>+</span></summary><p>Restaurants, hôtels, architecture intérieure. Sublimer la matière, la carte, l’espace.</p></details>
            <details><summary>Branding & Éditorial <span>+</span></summary><p>Campagnes, lookbooks, contenus — une image cohérente, premium, utilisable partout.</p></details>
          </div>
          <div className="services-teaser__price">
            <p className="mono" style={{color:'var(--gold)'}}>Tableau comparatif</p><h3 className="display">Choisir<br/><em>sa formule</em></h3>
            <div className="price__rows"><div><span>Essentiel</span><span className="mono">À p. 180 €</span></div><div><span>Signature</span><span className="mono" style={{color:'var(--gold)'}}>À p. 420 € — recommandé</span></div><div><span>Atelier — Journée</span><span className="mono">Sur devis</span></div></div>
            <Link to="/contact" className="btn btn--paper">Demander un devis →</Link>
            <p className="mono muted" style={{textAlign:'center', fontSize:10, marginTop:10}}>Réponse sous 24h · créneaux le week-end</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactCTA(){
  return (
    <section className="section contact-cta">
      <div className="container">
        <div className="contact-cta__card">
          <div className="contact-cta__left">
            <p className="mono" style={{color:'var(--gold)'}}>04 — Contact</p>
            <h2 className="section-title">Parlons<br/><em>lumière.</em></h2>
            <p className="lede" style={{color:'var(--text-soft)'}}>Un projet, une date, une envie de tirage ? Écrivez-moi. Je réponds vite, avec des mots simples et une proposition claire.</p>
            <div className="contact-cta__chips"><span className="chip chip--solid">baya.hubert@email.com</span><span className="chip">Paris · disponible partout</span></div>
          </div>
          <form className="contact-cta__form" onSubmit={e=>e.preventDefault()}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}><label><span className="mono muted">Nom</span><input placeholder="Votre nom" className="input" /></label><label><span className="mono muted">Email</span><input placeholder="vous@exemple.com" className="input" /></label></div>
            <label><span className="mono muted">Message</span><textarea rows={4} placeholder="Parlez-moi de votre lumière..." className="input input--area" /></label>
            <Link to="/contact" className="btn btn--solid" style={{width:'100%', justifyContent:'center'}}>Envoyer — Réponse sous 24h →</Link>
          </form>
        </div>
      </div>
    </section>
  )
}

export default function Home(){
  const { caps } = useOutletContext()
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf
    const c=document.createElement('canvas'); const style=document.createElement('style')
    // reveal
    const obs=new IntersectionObserver(ents=>{ ents.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('is-in') }) },{threshold:0.15})
    document.querySelectorAll('[data-reveal]').forEach(el=>obs.observe(el))
    return()=>obs.disconnect()
  },[])
  return (
    <>
      <Seo title="Baya Hubert — La lumière, vraie." description="Portfolio immersif de Baya Hubert, photographe à Paris. Galerie orbitale futuriste, tirages d'art, lumière sculptée." image="/assets/images/prints/canal-reflets.webp" />
      <Hero caps={caps} />
      <Manifesto />
      <Univers />
      <Gallery />
      <AboutTeaser />
      <ServicesTeaser />
      <ContactCTA />
    </>
  )
}
