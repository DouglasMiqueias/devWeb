const select = (s, el=document)=>el.querySelector(s)
const selectAll = (s, el=document)=>[...el.querySelectorAll(s)]

const menuToggle = select('.menu-toggle')
const menu = select('.menu')
if(menuToggle){
  menuToggle.addEventListener('click', ()=>{
    menu.classList.toggle('open')
  })
}

// Interactive Motion CTA (tilt + magnetic button)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
const mcta = select('.mcta-card')
const mctaBtn = select('.mcta-btn')
if (mcta && !prefersReduced && !isTouch) {
  let raf = null
  const reset = ()=>{ mcta.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'; mcta.style.transition = 'transform .2s ease' }
  const onMove = (e)=>{
    const rect = mcta.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rx = ((y / rect.height) - 0.5) * -10 // tilt up/down
    const ry = ((x / rect.width) - 0.5) * 12  // tilt left/right
    if (raf) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(()=>{
      mcta.style.transition = 'transform .06s ease'
      mcta.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
    })
  }
  mcta.addEventListener('mousemove', onMove)
  mcta.addEventListener('mouseleave', reset)
}

if (mctaBtn && !prefersReduced && !isTouch) {
  const wrap = mctaBtn.parentElement
  let magnetEnabled = true
  const onMove = (e)=>{
    if(!magnetEnabled) return
    const rect = mctaBtn.getBoundingClientRect()
    const cx = rect.left + rect.width/2
    const cy = rect.top + rect.height/2
    const dx = (e.clientX - cx)
    const dy = (e.clientY - cy)
    const max = 28
    const clamp = (v, m)=> Math.max(-m, Math.min(m, v))
    mctaBtn.style.transform = `translate(${clamp(dx*0.06, max*0.2)}px, ${clamp(dy*0.06, max*0.2)}px)`
  }
  wrap.addEventListener('mousemove', onMove)
  wrap.addEventListener('mouseleave', ()=>{ mctaBtn.style.transform = 'translate(0,0)' })
  mctaBtn.addEventListener('pointerdown', ()=>{
    magnetEnabled = false
    mctaBtn.style.transition = 'transform .15s ease'
    mctaBtn.style.transform = 'translate(0,0)'
  })
  mctaBtn.addEventListener('pointerup', ()=>{
    magnetEnabled = true
    mctaBtn.style.transition = ''
  })
  mctaBtn.addEventListener('click', ()=>{ mctaBtn.style.transform = 'translate(0,0)' })
}

const onScrollReveal = ()=>{
  const vh = window.innerHeight
  selectAll('.reveal').forEach(el=>{
    const rect = el.getBoundingClientRect()
    const visible = rect.top < vh*0.85 && rect.bottom > vh*0.15
    if(visible){ el.classList.add('visible') }
  })
}

onScrollReveal()
window.addEventListener('scroll', onScrollReveal, {passive:true})

const updateTimeline = ()=>{
  const timeline = select('.timeline')
  const progress = select('.timeline-progress')
  if(!timeline || !progress) return
  const rect = timeline.getBoundingClientRect()
  const vh = window.innerHeight
  // posição absoluta do topo da timeline no documento
  const docTop = window.scrollY + rect.top
  // offset para começar a preencher após a timeline entrar ~60% na viewport
  const offset = vh * 0.6
  const scrolledInside = window.scrollY + offset - docTop
  const total = rect.height
  const clamped = Math.max(0, Math.min(total, scrolledInside))
  progress.style.height = `${clamped}px`
}

updateTimeline()
window.addEventListener('scroll', ()=>{onScrollReveal(); updateTimeline()}, {passive:true})
window.addEventListener('resize', updateTimeline)

let lastY = 0
const navbar = select('.navbar')
if (navbar) {
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY
    if(y>20){ navbar.style.borderBottomColor = 'rgba(255,255,255,.12)' } else { navbar.style.borderBottomColor = 'rgba(255,255,255,.06)' }
    lastY = y
  }, {passive:true})
}

