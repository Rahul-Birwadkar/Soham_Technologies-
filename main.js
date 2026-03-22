/* ==============================================
   SOHAM Technologies — Main JS
   ============================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ── GSAP + ScrollTrigger ──
  gsap.registerPlugin(ScrollTrigger);

  // ── Init all modules ──
  initCursor();
  initHeroAnim();
  initScrollReveal();
  initCounters();

  // ── Chat enter key ──
  var inp = document.getElementById('chatInput');
  if (inp) inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendChat(); });

});

/* ══════════════════════════════════
   CURSOR
══════════════════════════════════ */
function initCursor() {
  var cur  = document.getElementById('cursor');
  var curR = document.getElementById('cursorRing');
  if (!cur || !curR || window.matchMedia('(hover:none)').matches) return;

  document.addEventListener('mousemove', function (e) {
    gsap.to(cur,  { x: e.clientX, y: e.clientY, duration: .1 });
    gsap.to(curR, { x: e.clientX, y: e.clientY, duration: .18 });
  });

  document.querySelectorAll('a, button, .scard, .htile, .why-item, .tcard, .faq-q, .cinfo-card').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      gsap.to(cur,  { width: 16, height: 16, duration: .18 });
      gsap.to(curR, { width: 54, height: 54, borderColor: 'rgba(212,30,46,.6)', duration: .18 });
    });
    el.addEventListener('mouseleave', function () {
      gsap.to(cur,  { width: 10, height: 10, duration: .18 });
      gsap.to(curR, { width: 36, height: 36, borderColor: 'rgba(212,30,46,.4)', duration: .18 });
    });
  });
}

/* ══════════════════════════════════
   PAGE NAVIGATION
══════════════════════════════════ */
function go(name) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });

  // Show target
  var target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');

  // Update nav links
  document.querySelectorAll('.nav-links a').forEach(function (a) { a.classList.remove('active'); });
  var navLink = document.getElementById('nav-' + name);
  if (navLink) navLink.classList.add('active');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-run reveals for new page
  setTimeout(initScrollReveal, 100);
}

/* ══════════════════════════════════
   MOBILE NAV
══════════════════════════════════ */
function openMob()  { document.getElementById('mobNav').classList.add('open'); }
function closeMob() { document.getElementById('mobNav').classList.remove('open'); }

/* ══════════════════════════════════
   SERVICE TABS
══════════════════════════════════ */
function switchTab(tabId, btn) {
  // Deactivate all
  document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
  document.querySelectorAll('.tab-pane').forEach(function (p) { p.classList.remove('active'); });

  // Activate selected
  btn.classList.add('active');
  var pane = document.getElementById('tab-' + tabId);
  if (!pane) return;
  pane.classList.add('active');

  // Animate cards in
  var cards = pane.querySelectorAll('.scard');
  gsap.from(cards, { opacity: 0, y: 24, stagger: .07, duration: .45, ease: 'power2.out' });
}

/* ══════════════════════════════════
   STICKY BAR
══════════════════════════════════ */
window.addEventListener('scroll', function () {
  var bar = document.getElementById('stickyBar');
  if (bar) bar.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

/* ══════════════════════════════════
   HERO GSAP ENTRANCE
══════════════════════════════════ */
function initHeroAnim() {
  var tl = gsap.timeline({ delay: .1 });
  tl
    .from('.hero-eyebrow', { opacity: 0, y: 22, duration: .6, ease: 'power2.out' })
    .from('.hero-h1 .line1', { opacity: 0, y: 32, duration: .55, ease: 'power2.out' }, '-=.28')
    .from('.hero-h1 .line2', { opacity: 0, y: 32, duration: .55, ease: 'power2.out' }, '-=.32')
    .from('.hero-h1 .line3', { opacity: 0, y: 32, duration: .55, ease: 'power2.out' }, '-=.32')
    .from('.hero-desc',      { opacity: 0, y: 20, duration: .5,  ease: 'power2.out' }, '-=.22')
    .from('.hero-btns',      { opacity: 0, y: 16, duration: .45, ease: 'power2.out' }, '-=.2')
    .from('.hero-trust',     { opacity: 0, y: 14, duration: .45, ease: 'power2.out' }, '-=.18')
    .from('.htile',          { opacity: 0, x: 24, stagger: .08, duration: .42, ease: 'power2.out' }, '-=.45');
  gsap.from('.abar', { opacity: 0, y: -18, duration: .45, delay: .15 });
}

/* ══════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════ */
function initScrollReveal() {
  var els = document.querySelectorAll('.reveal:not(.in), .reveal-l:not(.in), .reveal-r:not(.in)');
  if (!els.length) return;

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });

  els.forEach(function (el) { obs.observe(el); });
}

/* ══════════════════════════════════
   ANIMATED COUNTERS
══════════════════════════════════ */
function initCounters() {
  var statsEl = document.querySelector('.stats-bar');
  if (!statsEl) return;
  var done = false;

  new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !done) {
      done = true;
      document.querySelectorAll('[data-count]').forEach(function (el) {
        var target = parseInt(el.dataset.count, 10);
        var suffix = el.dataset.suffix || '';
        gsap.to({ val: 0 }, {
          val: target, duration: 2.2, ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val).toLocaleString() + suffix;
          }
        });
      });
    }
  }, { threshold: .3 }).observe(statsEl);
}

/* ══════════════════════════════════
   FAQ ACCORDION
══════════════════════════════════ */
function toggleFaq(questionEl) {
  var item = questionEl.closest('.faq-item');
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
  if (!wasOpen) {
    item.classList.add('open');
    var ans = item.querySelector('.faq-a');
    gsap.from(ans, { opacity: 0, y: -8, duration: .28 });
  }
}

/* ══════════════════════════════════
   CONTACT FORM → WhatsApp
══════════════════════════════════ */
function submitForm() {
  var name    = document.getElementById('fname').value.trim();
  var phone   = document.getElementById('fphone').value.trim();
  var service = document.getElementById('fservice').value;
  var desc    = document.getElementById('fdesc').value.trim();

  if (!name || !phone || !service || !desc) {
    alert('Please fill in all required fields (*)');
    return;
  }

  var brand = (document.getElementById('fbrand').value || '').trim() || 'N/A';
  var model = (document.getElementById('fmodel').value || '').trim() || 'N/A';

  var msg = encodeURIComponent(
    'Hello SOHAM Technologies!\n' +
    'Name: ' + name + '\n' +
    'Phone: ' + phone + '\n' +
    'Service: ' + service + '\n' +
    'Brand: ' + brand + '\n' +
    'Model: ' + model + '\n' +
    'Fault: ' + desc
  );
  window.open('https://wa.me/918046079676?text=' + msg, '_blank');
}

/* ══════════════════════════════════
   AI CHATBOT
══════════════════════════════════ */

var SYSTEM_PROMPT = [
  'You are the AI customer support assistant for SOHAM Technologies — an industrial electronics repair company based in Mumbai, India. Founded in 2014 by Mr. Gajanan Pandurang Kasar.',
  '',
  'COMPANY INFO:',
  '- Phone/WhatsApp: +91 80460 79676',
  '- Email: sohamtechnologiesmumbai@gmail.com',
  '- Address: Floor-1, 42B Hanuman Industrial Estate, G D Ambekar Marg, Mumbai 400031',
  '- Hours: Mon–Fri 9AM–6PM, Sat 9AM–4PM',
  '',
  'SERVICES: Servo Motor Drive Repair (AC/DC), VFD Repair, Electronic PCB Repair, PLC Repair (Siemens/Delta/Mitsubishi/Allen Bradley/Omron/Fatek), HMI Repair (Touch Panels), CNC Controller Repair (Fanuc/Siemens/Mitsubishi), CNC Lathe/Laser Cutting, Elevator Drive Repair, Elevator Door Drive, Excavator ECU/ECM (Komatsu/CAT/JCB/Hyundai/Volvo), Machine Maintenance AMC, Shearing & Bending Machine Repair, Control Panel Repair, Fire Alarm Systems, Industrial Monitor Repair, Ship Dashboard Display Panel, Power Supply/SMPS Repair, Encoder Repair, Crane Controller Joystick, DC Drives Repair, Robot Spares Repair, Hydraulic Equipment.',
  '',
  'KEY FACTS:',
  '- SMPS repairs from ₹2,500',
  '- Drives ₹5,000–₹50,000 (saves 60–80% vs OEM replacement)',
  '- 90-day warranty on all repairs',
  '- Turnaround: 2–5 days standard, express available',
  '- 98% repair success rate',
  '- Free diagnosis',
  '- Brands: Siemens, ABB, Fanuc, Yaskawa, Mitsubishi, Allen Bradley, Omron, Delta, Bosch Rexroth, Schneider, Vacon, Danfoss, Lenze, Parker + 100 more',
  '',
  'BEHAVIOUR:',
  '- Be professional, helpful and concise.',
  '- Respond in the same language the customer uses (English / Hindi / Marathi).',
  '- Always offer to connect via WhatsApp +91 80460 79676 for quotes.',
  '- Do NOT mention GST or registration numbers unless directly asked.',
  '- Do NOT make up prices for specific models — say you will provide a quote after diagnosis.'
].join('\n');

var chatHistory = [];
var chatBusy = false;

function toggleChat() {
  var win = document.getElementById('chatWin');
  var isOpen = win.classList.toggle('open');
  if (isOpen) {
    gsap.from(win, { opacity: 0, y: 16, scale: .97, duration: .28, ease: 'back.out(1.6)' });
  }
}

function quickQuestion(q) {
  document.getElementById('chatOpts').innerHTML = '';
  addMessage(q, 'user');
  callAI(q);
}

function sendChat() {
  if (chatBusy) return;
  var inp = document.getElementById('chatInput');
  var text = inp.value.trim();
  if (!text) return;
  inp.value = '';
  document.getElementById('chatOpts').innerHTML = '';
  addMessage(text, 'user');
  callAI(text);
}

function addMessage(text, role) {
  var msgs = document.getElementById('chatMsgs');
  var div = document.createElement('div');
  div.className = 'msg ' + role;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function showChatActions() {
  var opts = document.getElementById('chatOpts');
  opts.innerHTML = '';
  var actions = [
    { label: '💬 WhatsApp Us', fn: "window.open('https://wa.me/918046079676','_blank')" },
    { label: 'Get a Quote',   fn: "toggleChat();go('contact')" },
    { label: 'View Services', fn: "toggleChat();go('services')" }
  ];
  actions.forEach(function (a) {
    var btn = document.createElement('button');
    btn.className = 'chat-opt';
    btn.textContent = a.label;
    btn.onclick = function () { eval(a.fn); };
    opts.appendChild(btn);
  });
}

async function callAI(userMsg) {
  chatBusy = true;
  var typingEl = addMessage('Typing…', 'typing');
  chatHistory.push({ role: 'user', content: userMsg });

  try {
    var resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: chatHistory
      })
    });
    var data = await resp.json();
    typingEl.remove();
    var reply = (data.content && data.content[0] && data.content[0].text)
      ? data.content[0].text
      : 'Sorry, I could not connect. Please WhatsApp us directly at +91 80460 79676.';
    addMessage(reply, 'bot');
    chatHistory.push({ role: 'assistant', content: reply });
  } catch (err) {
    typingEl.remove();
    addMessage('Connection error. Please WhatsApp us at +91 80460 79676 or call directly.', 'bot');
  }

  showChatActions();
  chatBusy = false;
}
