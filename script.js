/**
 * Portfolio Core JavaScript
 * Handles dynamic content rendering from data.js and all interactive behaviors.
 */

// Tool SVG icon mapping
const TOOL_ICONS = {
  "git": `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M3 12h3M18 12h3M12 3v3M12 18v3"/></svg>`,
  "github": `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>`,
  "vs code": `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  "azure cloud": `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>`,
  "ai-ml models": `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="12" cy="12" r="3"/><path d="M8 8l2.5 2.5M16 8l-2.5 2.5M8 16l2.5-2.5M16 16l-2.5-2.5"/></svg>`
};

// Main initialization on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio();
  initializeInteractivity();
  initHeroCanvas();
});

/**
 * Dynamic Content Rendering Functions
 */
function renderPortfolio() {
  const data = PORTFOLIO_DATA;

  // Set Document Title
  document.title = `${data.profile.name} — Portfolio`;

  // Set Navigation Logo
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) navLogo.textContent = data.profile.shortName;

  // Render Hero Section
  const heroTag = document.querySelector('#hero .hero-tag');
  if (heroTag) heroTag.textContent = data.profile.tagline;

  const heroSub = document.querySelector('#hero .hero-sub');
  if (heroSub) heroSub.textContent = data.profile.sub;

  // Render About Paragraphs
  const aboutTextContainer = document.querySelector('#aboutTextContainer');
  if (aboutTextContainer) {
    aboutTextContainer.innerHTML = '';
    // Append standard title
    const titleEl = document.createElement('h2');
    titleEl.className = 's-title';
    titleEl.style.marginBottom = '1.5rem';
    titleEl.innerHTML = `Computer Science <em>student</em> &amp; developer.`;
    aboutTextContainer.appendChild(titleEl);

    // Append Paragraphs
    data.focusParagraphs = [
      "I'm a B.Tech CSE undergraduate at SR University, Warangal, with a passion for building things that solve real problems. My foundation is strong in data structures, algorithms, and object-oriented design.",
      "I approach development with discipline — consistent practice on LeetCode, clean modular code, and an ownership mindset. Whether it's a Java backend system or a web interface, I aim for clarity and correctness.",
      "Currently building toward a software engineering career, I'm eager to contribute to teams that value quality and continuous learning."
    ];
    data.focusParagraphs.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      aboutTextContainer.appendChild(p);
    });

    // Append Stats Row
    const statRow = document.createElement('div');
    statRow.className = 'stat-row';
    statRow.innerHTML = `
      <div class="stat-item"><div class="num" data-target="${data.stats.leetcode}">0</div><div class="lbl">LeetCode Problems</div></div>
      <div class="stat-item"><div class="num" data-target="${data.stats.projects}">0</div><div class="lbl">Projects Built</div></div>
      <div class="stat-item"><div class="num">${data.stats.cgpa}</div><div class="lbl">CGPA / 10</div></div>
    `;
    aboutTextContainer.appendChild(statRow);
  }

  // Render Focus List
  const aboutFocusContainer = document.querySelector('#aboutFocusContainer');
  if (aboutFocusContainer) {
    aboutFocusContainer.innerHTML = data.focus.map(item => `
      <div style="display:flex;align-items:center;gap:.75rem;font-size:.85rem">
        <span style="width:6px;height:6px;background:var(--ink);border-radius:50%;flex-shrink:0"></span>
        ${item}
      </div>
    `).join('');
  }

  // Render Location Box
  const aboutLocationContainer = document.querySelector('#aboutLocationContainer');
  if (aboutLocationContainer) {
    aboutLocationContainer.innerHTML = `
      <div style="font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:.75rem">Location</div>
      <div style="font-family:var(--ff-head);font-size:1.1rem;font-weight:700">${data.profile.location}</div>
      <div style="font-size:.8rem;color:rgba(255,255,255,.5);margin-top:.25rem">${data.profile.timeZone}</div>
      <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.1);font-size:.8rem;color:rgba(255,255,255,.5)">${data.profile.workStatus}</div>
    `;
  }

  // Render Education List
  const educationContainer = document.querySelector('#educationContainer');
  if (educationContainer) {
    educationContainer.innerHTML = data.education.map(edu => {
      const gpaMarkup = edu.cgpa
        ? `<div class="cgpa-wrap"><span class="cgpa-num" data-target="${edu.cgpa}" data-decimal="1">0</span><span class="cgpa-lbl">CGPA / 10</span></div>`
        : `<div class="cgpa-wrap"><span class="cgpa-num">${edu.grade}</span><span class="cgpa-lbl">Grade %</span></div>`;

      const coursesMarkup = edu.courses && edu.courses.length > 0
        ? `<div class="edu-courses">${edu.courses.map(c => `<span class="course-tag">${c}</span>`).join('')}</div>`
        : '';

      return `
        <div class="edu-card">
          <div>
            <h3>${edu.degree}</h3>
            <div>${edu.major}</div>
            <div class="inst">${edu.institution} · ${edu.location} · ${edu.duration}</div>
            ${coursesMarkup}
          </div>
          ${gpaMarkup}
        </div>
      `;
    }).join('');
  }

  // Render Experience Section
  const experienceContainer = document.querySelector('#experienceContainer');
  if (experienceContainer) {
    experienceContainer.innerHTML = data.experience.map(exp => `
      <div class="exp-card reveal">
        <div>
          <div class="exp-role">${exp.role}</div>
          <div class="exp-org">${exp.organization}</div>
          <ul class="exp-pts">
            ${exp.points.map(pt => `<li>${pt}</li>`).join('')}
          </ul>
        </div>
        <div style="display:flex;flex-direction:column;gap:.75rem;align-items:flex-end">
          <span class="exp-badge">${exp.duration}</span>
          <span style="font-size:.75rem;color:var(--ink3)">${exp.meta}</span>
        </div>
      </div>
    `).join('');
  }

  // Render Journey Section
  const journeyContainer = document.querySelector('#journeyContainer');
  if (journeyContainer) {
    journeyContainer.innerHTML = data.journey.map(j => `
      <div class="tl-item">
        <div class="tl-dot"></div>
        <div class="tl-year">${j.year}</div>
        <div class="tl-title">${j.title}</div>
        <div class="tl-desc">${j.desc}</div>
      </div>
    `).join('');
  }

  // Render Skills Categories
  const skillsContainer = document.querySelector('#skillsContainer');
  if (skillsContainer) {
    skillsContainer.innerHTML = data.skills.categories.map(cat => `
      <div class="skill-cat">
        <h4>${cat.title}</h4>
        ${cat.items.map(item => `
          <div class="skill-item">
            <div class="skill-top"><span>${item.name}</span><span>${item.level}%</span></div>
            <div class="skill-bar">
              <div class="skill-fill" data-width="${item.level}"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  // Render Tools
  const toolsContainer = document.querySelector('#toolsContainer');
  if (toolsContainer) {
    toolsContainer.innerHTML = data.skills.tools.map(tool => {
      const key = tool.toLowerCase();
      const svgIcon = TOOL_ICONS[key] || `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg>`;
      return `
        <div class="tool-chip">
          <div class="tool-icon">${svgIcon}</div>${tool}
        </div>
      `;
    }).join('');
  }

  // Render Projects Grid
  const projectsContainer = document.querySelector('#projectsContainer');
  if (projectsContainer) {
    projectsContainer.innerHTML = data.projects.map((proj, idx) => {
      const delay = idx * 0.1;
      const linkMarkup = proj.isCurrentSite
        ? `<span style="font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink3);margin-top:.5rem;display:inline-block">You're looking at it →</span>`
        : `<a href="${proj.link}" target="_blank" class="proj-link">View on GitHub <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 10L10 2M10 2H4M10 2v6"/></svg></a>`;

      return `
        <div class="proj-card reveal" style="transition-delay:${delay}s">
          <div class="proj-num">${proj.num}</div>
          <h3>${proj.title}</h3>
          <p class="proj-desc">${proj.desc}</p>
          <div class="proj-tech">
            ${proj.tech.map(t => `<span>${t}</span>`).join('')}
          </div>
          ${linkMarkup}
        </div>
      `;
    }).join('');
  }

  // Render Achievements
  const achievementsContainer = document.querySelector('#achievementsContainer');
  if (achievementsContainer) {
    achievementsContainer.innerHTML = data.achievements.map(ach => {
      if (ach.type === 'leetcode') {
        return `
          <div class="ach-card">
            <div class="ach-num" data-target="${ach.num}">0</div>
            <div class="ach-label">${ach.label}</div>
            <a href="${ach.link}" target="_blank" class="ach-link">${ach.linkText}</a>
          </div>
        `;
      } else {
        return `
          <div class="ach-card">
            <div class="ach-num" style="font-size:2rem;line-height:1.3">${ach.num}</div>
            <div class="ach-label" style="margin-top:.5rem;font-weight:600;font-size:.85rem;color:var(--ink)">${ach.boldLabel}</div>
            <div class="ach-label">${ach.label}</div>
          </div>
        `;
      }
    }).join('');
  }

  // Render Soft Skills
  const softSkillsContainer = document.querySelector('#softSkillsContainer');
  if (softSkillsContainer) {
    softSkillsContainer.innerHTML = data.skills.soft.map(skill => `
      <span class="soft-chip">${skill}</span>
    `).join('');
  }

  // Render Contact Links
  const contactLinksContainer = document.querySelector('#contactLinksContainer');
  if (contactLinksContainer) {
    contactLinksContainer.innerHTML = `
      <a href="mailto:${data.contact.email}" class="c-link">
        <span class="c-link-icon">✉</span>
        <div>
          <div style="color:#fff;font-size:.85rem">${data.contact.email}</div>
          <div style="font-size:.72rem;margin-top:.1rem">Email me directly</div>
        </div>
      </a>
      <a href="${data.contact.phoneLink}" class="c-link">
        <span class="c-link-icon">📞</span>
        <div>
          <div style="color:#fff;font-size:.85rem">${data.contact.phone}</div>
          <div style="font-size:.72rem;margin-top:.1rem">Call or WhatsApp</div>
        </div>
      </a>
      <a href="${data.contact.linkedin}" target="_blank" class="c-link">
        <span class="c-link-icon">in</span>
        <div>
          <div style="color:#fff;font-size:.85rem">LinkedIn</div>
          <div style="font-size:.72rem;margin-top:.1rem">Connect professionally</div>
        </div>
      </a>
      <a href="${data.contact.github}" target="_blank" class="c-link">
        <span class="c-link-icon">⌥</span>
        <div>
          <div style="color:#fff;font-size:.85rem">GitHub</div>
          <div style="font-size:.72rem;margin-top:.1rem">See my code</div>
        </div>
      </a>
    `;
  }

  // Render Footer Copyright
  const footerText = document.querySelector('footer p');
  if (footerText) {
    footerText.innerHTML = `&copy; ${new Date().getFullYear()} ${data.profile.name} &middot; Built with HTML, CSS &amp; JS`;
  }
}

/**
 * Interactive Features and Animation Handling
 */
function initializeInteractivity() {
  const data = PORTFOLIO_DATA;

  // 1. Hero Name Reveal Animation
  (function() {
    const name = data.profile.name;
    const words = name.split(' ');
    const el = document.getElementById('heroName');
    if (!el) return;
    
    el.innerHTML = ''; // clear original placeholder
    let delay = 0.5;
    words.forEach(w => {
      const wd = document.createElement('span');
      wd.className = 'word';
      [...w].forEach(ch => {
        const l = document.createElement('span');
        l.className = 'letter';
        l.textContent = ch;
        l.style.animationDelay = delay + 's';
        delay += 0.05;
        wd.appendChild(l);
      });
      el.appendChild(wd);
      delay += 0.05;
    });
  })();

  // 2. Navigation Scroll Highlighting & Styling
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    
    // Highlight Active Link
    const sections = ['about', 'education', 'experience', 'journey', 'skills', 'projects', 'achievements', 'contact'];
    let currentSection = '';
    sections.forEach(id => {
      const s = document.getElementById(id);
      if (s && window.scrollY >= s.offsetTop - 120) {
        currentSection = id;
      }
    });

    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + currentSection) {
        a.classList.add('active');
      }
    });
  });

  // 3. Mouse Parallax Effect on Hero
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      
      const content = document.querySelector('.hero-content');
      const grid = document.querySelector('.hero-grid');
      
      if (content) content.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      if (grid) grid.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
  }

  // 4. Count-up Animation Helper
  function countUp(el) {
    if (!el.dataset.target || el.classList.contains('counted')) return;
    el.classList.add('counted');
    const target = parseFloat(el.dataset.target);
    const decimal = el.dataset.decimal ? parseInt(el.dataset.decimal) : 0;
    const duration = 1500;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = decimal 
        ? current.toFixed(decimal) 
        : Math.floor(current) + (target >= 100 ? '+' : '');
    }, step);
  }

  // 5. Intersection Observer for Reveal Elements & Triggers
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        
        // Populate skill fill widths inside visible element
        e.target.querySelectorAll('.skill-fill').forEach(b => {
          b.style.width = b.dataset.width + '%';
        });
        
        // Trigger countUp on stats
        e.target.querySelectorAll('[data-target]').forEach(n => {
          countUp(n);
        });
        
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  // Select all dynamic cards and reveal elements to observe
  document.querySelectorAll('.reveal, .tl-item, .edu-card, .exp-card, .ach-card, .cert-card').forEach(el => {
    el.classList.add('reveal-target');
    io.observe(el);
  });

  // Ensure individual counters in sections trigger even if not inside a standard reveal
  document.querySelectorAll('[data-target]').forEach(el => {
    const trigger = el.closest('.reveal') || el.closest('.ach-card') || el.closest('.edu-card') || el.parentElement;
    if (trigger) io.observe(trigger);
  });

  // 6. Skill bars & Achievements Independent Observer (for direct grid scrolls)
  const barIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill').forEach(b => b.style.width = b.dataset.width + '%');
        e.target.querySelectorAll('[data-target]').forEach(n => countUp(n));
        barIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skills-grid, .ach-grid, .stat-row').forEach(el => {
    barIo.observe(el);
  });

  // 7. Timeline specific animation observer
  const tlIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), 100);
        tlIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  
  document.querySelectorAll('.tl-item').forEach(el => tlIo.observe(el));
}

/**
 * Global Menu and Action Controllers
 */
window.toggleMenu = function() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
};

window.submitForm = function() {
  const nameVal = document.getElementById('fname').value.trim();
  const emailVal = document.getElementById('femail').value.trim();
  const msgVal = document.getElementById('fmsg').value.trim();
  
  if (!nameVal || !emailVal || !msgVal) {
    alert('Please fill in all fields.');
    return;
  }
  
  const btn = document.querySelector('.btn-submit');
  if (btn) {
    btn.textContent = 'Sending...';
    btn.disabled = true;
  }
  
  // Submit contact form via Web3Forms
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      access_key: 'eeb40171-e3f4-48d3-a8fd-6cd137c1ccd4',
      name: nameVal,
      email: emailVal,
      message: msgVal
    })
  })
  .then(async (response) => {
    let json = await response.json();
    if (response.status == 200) {
      const form = document.getElementById('contactForm');
      const success = document.getElementById('formSuccess');
      if (form) form.style.display = 'none';
      if (success) success.style.display = 'block';
    } else {
      alert(json.message || 'Something went wrong. Please try again.');
      if (btn) {
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }
    }
  })
  .catch(error => {
    console.error(error);
    alert('Form submission failed. Please check your internet connection and try again.');
    if (btn) {
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }
  });
};

/**
 * Hero Background Canvas Particles (Google Antigravity style)
 */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;
  
  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    createParticles();
  });
  
  const colors = [
    'rgba(29, 78, 216, 0.65)',   // premium blue
    'rgba(124, 58, 237, 0.65)',  // purple
    'rgba(219, 39, 119, 0.65)',  // magenta/pink
    'rgba(245, 158, 11, 0.65)',  // orange
    'rgba(234, 179, 8, 0.65)',   // yellow
    'rgba(14, 165, 233, 0.65)'   // cyan
  ];
  
  let particles = [];
  
  function createParticles() {
    particles = [];
    const count = 280;
    const centerX = width / 2;
    const centerY = height / 2;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Distribute points in a ring/oval shape
      const distance = (0.2 + 0.8 * Math.pow(Math.random(), 1.5)) * Math.min(width, height) * 0.45;
      const x = centerX + Math.cos(angle) * distance * (width / height);
      const y = centerY + Math.sin(angle) * distance;
      
      particles.push({
        baseX: x,
        baseY: y,
        x: x,
        y: y,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: angle,
        speed: 0.1 + Math.random() * 0.3,
        distance: distance,
        waveRange: 5 + Math.random() * 10,
        waveSpeed: 0.01 + Math.random() * 0.02,
        time: Math.random() * 100
      });
    }
  }
  
  let mouse = { x: null, y: null, radius: 120 };
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.time += p.waveSpeed;
      const offset = Math.sin(p.time) * p.waveRange;
      let targetX = p.baseX + Math.cos(p.angle) * offset;
      let targetY = p.baseY + Math.sin(p.angle) * offset;
      
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          targetX -= Math.cos(angle) * force * 25;
          targetY -= Math.sin(angle) * force * 25;
        }
      }
      
      p.x += (targetX - p.x) * 0.08;
      p.y += (targetY - p.y) * 0.08;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  
  createParticles();
  animate();
}
