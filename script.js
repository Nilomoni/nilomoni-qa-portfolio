// Smooth reveal animations and interactive portfolio details
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Typing headline
const phrases = ['QA LEAD', 'TEST AUTOMATION ENGINEER', 'QUALITY ADVOCATE'];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typing = document.getElementById('typing');
function typeLoop() {
  const phrase = phrases[phraseIndex];
  typing.textContent = phrase.slice(0, charIndex);
  if (!deleting && charIndex < phrase.length) { charIndex++; setTimeout(typeLoop, 85); }
  else if (!deleting) { deleting = true; setTimeout(typeLoop, 1250); }
  else if (charIndex > 0) { charIndex--; setTimeout(typeLoop, 38); }
  else { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; setTimeout(typeLoop, 300); }
}
typeLoop();

// Reading progress
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('progress').style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
});

// Animated counters
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, target = Number(el.dataset.count), start = performance.now(), duration = 1300;
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick); counterObserver.unobserve(el);
  });
}, { threshold: .7 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Demo pipeline animation
const runButton = document.getElementById('runPipeline');
const pipelineNote = document.getElementById('pipelineNote');
const steps = [...document.querySelectorAll('.flow-step')];
let running = false;
runButton.addEventListener('click', async () => {
  if (running) return;
  running = true; runButton.disabled = true; runButton.textContent = '⏳ Running demo...';
  steps.forEach(s => s.classList.remove('active', 'done'));
  for (let i = 0; i < steps.length; i++) {
    steps.forEach(s => s.classList.remove('active'));
    steps[i].classList.add('active');
    pipelineNote.textContent = ['Loading test specs and data…','Preparing reusable page objects…','Executing browser and API checks…','Generating an illustrative HTML report…','Sending sample feedback to CI pipeline…'][i];
    await new Promise(resolve => setTimeout(resolve, 720));
    steps[i].classList.remove('active'); steps[i].classList.add('done');
  }
  pipelineNote.textContent = '✓ Demo complete — workflow stages illustrated (no tests were run).';
  runButton.textContent = '↻ Run again'; runButton.disabled = false; running = false;
});

// Lightweight animated particle background
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * devicePixelRatio; canvas.height = rect.height * devicePixelRatio;
  canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  particles = Array.from({length: Math.min(65, Math.floor(rect.width / 18))}, () => ({
    x: Math.random()*rect.width, y: Math.random()*rect.height,
    vx: (Math.random()-.5)*.25, vy: (Math.random()-.5)*.25, r: Math.random()*1.5+.4
  }));
}
function drawParticles() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  ctx.clearRect(0,0,w,h);
  particles.forEach((p,i) => {
    p.x += p.vx; p.y += p.vy;
    if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(100,210,230,.55)'; ctx.fill();
    for(let j=i+1;j<particles.length;j++){
      const q=particles[j], dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);
      if(d<105){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(90,160,210,${.11*(1-d/105)})`;ctx.stroke();}
    }
  });
  requestAnimationFrame(drawParticles);
}
resizeCanvas(); window.addEventListener('resize', resizeCanvas); drawParticles();
