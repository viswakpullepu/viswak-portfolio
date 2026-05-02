// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
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

// GSAP Initialization
gsap.registerPlugin(ScrollTrigger);

// Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
if (cursor) {
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: "power2.out"
    });
  });

  // Cursor Hover Effects
  const interactiveElements = document.querySelectorAll('a, button, .glass-card, .btn, .project-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 3, opacity: 0.3, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
    });
  });
}

// Failsafe Preloader Dismissal
const dismissLoader = () => {
  const loader = document.querySelector('#loader');
  if (loader && loader.style.display !== 'none') {
    gsap.to(loader, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        loader.style.display = 'none';
        startHeroAnimation();
        fetchGitHubRepos();
      }
    });
  }
};

// Dismiss after 3 seconds anyway
setTimeout(dismissLoader, 3000);

// Dismiss on window load
window.addEventListener('load', dismissLoader);

function startHeroAnimation() {
  const tl = gsap.timeline();
  tl.from(".reveal-text", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" })
    .from(".reveal-title", { y: 50, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.5")
    .from(".reveal-sub", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
    .from(".reveal-btns", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");
}

// Scroll Animations
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
      y: 30,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
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
    duration: 2,
    snap: { innerText: 1 },
    ease: "power2.out"
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
      card.className = 'glass-card repo-card';
      card.innerHTML = `
        <div>
          <h3 style="color: var(--accent-primary);">${repo.name}</h3>
          <p style="font-size: 0.9rem; margin-top: 0.5rem; color: var(--text-dim);">${repo.description || 'No description provided.'}</p>
        </div>
        <div class="repo-meta">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>${repo.language || 'Code'}</span>
          <span>Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>
        <a href="${repo.html_url}" target="_blank" class="btn btn-secondary" style="margin-top: 1.5rem; font-size: 0.8rem; padding: 0.5rem 1rem; text-align: center;">View on GitHub</a>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = '<div class="glass-card">Failed to load repositories. Please check your connection.</div>';
  }
}

// Project Modal Logic
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
    
    modalBody.innerHTML = `
      <h1 style="color: var(--accent-primary); margin-bottom: 1rem;">${data.title}</h1>
      <p style="font-size: 1.2rem; margin-bottom: 2rem;">${data.overview}</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
        <div>
          <h3 style="color: var(--accent-primary);">Problem</h3>
          <p>${data.problem}</p>
        </div>
        <div>
          <h3 style="color: var(--accent-primary);">Solution</h3>
          <p>${data.solution}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 2rem;">
        <h3 style="color: var(--accent-primary); margin-bottom: 0.5rem;">Technologies Used</h3>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${data.tech.map(t => `<span class="skill-tag">${t}</span>`).join('')}
        </div>
      </div>
      
      <a href="${data.link}" target="_blank" class="btn btn-primary">Visit Live Site</a>
    `;
    
    modal.style.display = 'flex';
    gsap.to(modal, { opacity: 1, duration: 0.4 });
    lenis.stop();
  });
});

if (closeModal) {
  closeModal.addEventListener('click', () => {
    gsap.to(modal, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        modal.style.display = 'none';
        lenis.start();
      }
    });
  });
}

// Contact Form Logic with Failsafe Env Checks
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
      console.warn("Supabase credentials missing. Submission skipped.");
      // Just simulate success for UX if keys are missing
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
      } else {
        alert("Submission failed. Check your Supabase configuration.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Connection error.");
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
