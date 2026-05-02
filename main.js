import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// GSAP Initialization
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll
const isMobile = window.innerWidth < 768;

const lenis = new Lenis({
  duration: isMobile ? 1.0 : 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: isMobile ? 0.8 : 1.1,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Hero Parallax Background Glow
const bgGlow = document.querySelector('.bg-glow');
if (bgGlow) {
  gsap.to(bgGlow, {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
    },
    y: -200,
    rotate: 15,
    scale: 1.2,
    ease: 'none'
  });
}

// Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Custom Cursor (Hidden on Touch/Mobile)
const cursor = document.querySelector('.custom-cursor');
if (cursor && !isMobile) {
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: "power2.out"
    });
  });
} else if (cursor) {
  cursor.style.display = 'none';
}

  const interactiveElements = document.querySelectorAll('a, button, .glass-card, .btn, .project-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 3, opacity: 0.3, duration: 0.3, backgroundColor: 'var(--accent-primary)' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3, backgroundColor: 'var(--accent-primary)' });
    });
  });

// Cinematic Preloader Dismissal
const dismissLoader = () => {
  const loader = document.querySelector('#loader');
  if (loader && loader.style.display !== 'none') {
    const tl = gsap.timeline();
    tl.to(loader, {
      opacity: 0,
      duration: 1.2,
      ease: "expo.inOut",
      onComplete: () => {
        loader.style.display = 'none';
        startHeroAnimation();
        fetchGitHubRepos();
      }
    });
  }
};

setTimeout(dismissLoader, 3000);
window.addEventListener('load', dismissLoader);

function startHeroAnimation() {
  const tl = gsap.timeline();
  
  // Splitting text reveal for more impact
  tl.from(".reveal-text", { 
    y: 40, 
    opacity: 0, 
    duration: 1, 
    ease: "power4.out" 
  })
  .from(".reveal-title", { 
    y: 100, 
    opacity: 0, 
    duration: 1.5, 
    skewY: 7,
    ease: "power4.out" 
  }, "-=0.8")
  .from(".reveal-sub", { 
    y: 30, 
    opacity: 0, 
    duration: 1, 
    ease: "power3.out" 
  }, "-=1")
  .from(".reveal-btns", { 
    y: 20, 
    opacity: 0, 
    duration: 0.8, 
    stagger: 0.2,
    ease: "power2.out" 
  }, "-=0.8");
}

// Advanced Section Reveals
const revealSections = document.querySelectorAll('section');
revealSections.forEach(section => {
  const elements = section.querySelectorAll('.reveal-stagger, .glass-card, .timeline-item');
  if (elements.length > 0) {
    gsap.from(elements, {
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      y: isMobile ? 30 : 60, 
      opacity: 0,
      rotateX: isMobile ? 0 : -10,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "all"
    });
  }
});

// Stats Counting Animation
const stats = document.querySelectorAll('.stat-number');
stats.forEach(stat => {
  const target = +stat.getAttribute('data-target');
  gsap.to(stat, {
    scrollTrigger: {
      trigger: stat,
      start: "top 90%",
    },
    innerText: target,
    duration: 2.5,
    snap: { innerText: 1 },
    ease: "power2.inOut"
  });
});

// GitHub Integration
async function fetchGitHubRepos() {
  const container = document.getElementById('repo-container');
  if (!container) return;
  try {
    const response = await fetch('https://api.github.com/users/viswakpullepu/repos?sort=updated&per_page=6');
    const repos = await response.json();
    
    container.innerHTML = '';
    repos.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'glass-card repo-card reveal-stagger';
      card.innerHTML = `
        <div>
          <h3 style="color: var(--accent-primary);">${repo.name}</h3>
          <p style="font-size: 0.9rem; margin-top: 0.5rem; color: var(--text-dim);">${repo.description || 'Exploring the boundaries of code.'}</p>
        </div>
        <div class="repo-meta">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>${repo.language || 'Tech'}</span>
          <span>${new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>
        <a href="${repo.html_url}" target="_blank" class="btn btn-secondary" style="margin-top: 1.5rem; font-size: 0.8rem; padding: 0.5rem 1rem; text-align: center;">Source Code</a>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = '<div class="glass-card">GitHub connection offline.</div>';
  }
}

// Project Modal Logic (With reveal anims)
const projectData = {
  kotha: {
    title: "Kothas Atelier",
    overview: "A premium interior design showcase built to highlight cinematic aesthetics and craftsmanship.",
    problem: "Traditional portfolios often feel static and fail to capture the spatial feeling of interior design.",
    solution: "Implemented a sequential image scroll system and GSAP parallax effects to create a 'walk-through' experience.",
    tech: ["HTML5", "GSAP ScrollTrigger", "Lenis", "Vite"],
    link: "https://kothas-atelier.vercel.app"
  },
  lorven: {
    title: "Lorven",
    overview: "A sophisticated platform for corporate strategy, growth insights, and advisory services.",
    problem: "Data-heavy consulting sites can be overwhelming and difficult to navigate.",
    solution: "Used clean typography and glassmorphism to structure complex information into digestible, interactive modules.",
    tech: ["JavaScript", "Vanilla CSS", "SmoothScroll"],
    link: "https://lorven.vercel.app/"
  },
  reviso: {
    title: "Reviso",
    overview: "An EdTech application designed to help students master subjects using spaced repetition.",
    problem: "Students forget 70% of what they study within days without structured revision.",
    solution: "Built a dashboard that tracks learning progress and prompts revision based on forgetting curves.",
    tech: ["React", "CSS Modules", "Context API"],
    link: "https://reviso-tau.vercel.app/"
  }
};

const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.modal-close');

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.getAttribute('data-project');
    const data = projectData[id];
    if (!data) return;
    
    modalBody.innerHTML = `
      <h1 style="color: var(--accent-primary); margin-bottom: 1rem;">${data.title}</h1>
      <p style="font-size: 1.2rem; margin-bottom: 2rem;">${data.overview}</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
        <div>
          <h3 style="color: var(--accent-primary);">The Challenge</h3>
          <p>${data.problem}</p>
        </div>
        <div>
          <h3 style="color: var(--accent-primary);">The Solution</h3>
          <p>${data.solution}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 2rem;">
        <h3 style="color: var(--accent-primary); margin-bottom: 0.5rem;">Stack</h3>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${data.tech.map(t => `<span class="skill-tag">${t}</span>`).join('')}
        </div>
      </div>
      
      <a href="${data.link}" target="_blank" class="btn btn-primary">Live Experience</a>
    `;
    
    modal.style.display = 'flex';
    gsap.fromTo(modal, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power4.out" });
    lenis.stop();
  });
});

if (closeModal) {
  closeModal.addEventListener('click', () => {
    gsap.to(modal, {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      onComplete: () => {
        modal.style.display = 'none';
        lenis.start();
      }
    });
  });
}

// Contact Form Logic
const contactForm = document.getElementById('contact-form');
const successMsg = document.getElementById('success-msg');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: contactForm.querySelector('input[type="text"]').value,
      email: contactForm.querySelector('input[type="email"]').value,
      message: contactForm.querySelector('textarea').value
    };

    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      gsap.to(contactForm, { opacity: 0, duration: 0.5, onComplete: () => {
        contactForm.style.display = 'none';
        successMsg.style.display = 'block';
      }});
      return;
    }

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/portfolio_contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        gsap.to(contactForm, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          onComplete: () => {
            contactForm.style.display = 'none';
            successMsg.style.display = 'block';
            gsap.from(successMsg, { opacity: 0, y: 20, duration: 0.5 });
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  });
}

// Smooth Scroll for Nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) lenis.scrollTo(target);
  });
});
