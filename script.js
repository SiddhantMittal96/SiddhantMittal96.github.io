/* ============================================================
   PORTFOLIO SCRIPTS
   - Sticky nav shadow
   - Mobile hamburger
   - Scroll fade-in animations
   - Card renderer (reads from data.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL SHADOW ──────────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // ── SMOOTH SCROLL WITH NAV OFFSET ─────────────────────────
  // Intercept anchor clicks so fixed nav (68px) doesn't cover target
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── MOBILE HAMBURGER ───────────────────────────────────────
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks  = document.querySelector('.nav__links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // ── ACTIVE NAV LINK ────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── SCROLL FADE-IN (IntersectionObserver) ─────────────────
  const fadeEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ── CARD RENDERER ─────────────────────────────────────────
  // Looks for elements with data-render="cards" and fills them
  // with cards built from the CASE_STUDIES array in data.js.
  //
  // Supported data attributes on the container:
  //   data-type     — "delivery-hero" | "interview-challenge" | "all"
  //   data-featured — "true" to only show featured:true items
  //   data-limit    — max number of cards to render
  //
  // This function is called after DOMContentLoaded so data.js
  // must be loaded before script.js in each HTML file.

  const cardContainers = document.querySelectorAll('[data-render="cards"]');
  if (cardContainers.length && typeof CASE_STUDIES !== 'undefined') {
    cardContainers.forEach(container => {
      const filterType    = container.dataset.type     || 'all';
      const featuredOnly  = container.dataset.featured === 'true';
      const limit         = parseInt(container.dataset.limit)  || Infinity;

      let items = CASE_STUDIES.filter(cs => {
        if (filterType !== 'all' && cs.type !== filterType) return false;
        if (featuredOnly && !cs.featured) return false;
        return true;
      }).slice(0, limit);

      if (items.length === 0) {
        container.innerHTML = renderEmpty(filterType);
        return;
      }

      container.innerHTML = items.map(cs => renderCard(cs)).join('');

      // Attach fade-up to newly rendered cards
      container.querySelectorAll('.card').forEach((card, i) => {
        card.classList.add('fade-up');
        if (i < 4) card.classList.add(`fade-up-delay-${i + 1}`);
      });

      // Re-run observer for newly added elements
      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
        }, { threshold: 0.1 });
        container.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
      } else {
        container.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
      }
    });
  }

  // ── INTERVIEW CHALLENGES EMPTY STATE ──────────────────────
  // Handled by card renderer above — if no items match
  // type="interview-challenge", renderEmpty() is shown.

  // ── COUNTER ANIMATION (highlight strip) ───────────────────
  // Animates numbers from 0 to their target value when scrolled into view.
  // Parses values like "€113M+", "120k+", "75+", "4 yrs".
  const counterEls = document.querySelectorAll('.highlight-item__number');
  if ('IntersectionObserver' in window && counterEls.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        counterObs.unobserve(entry.target);
        animateCounter(entry.target);
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObs.observe(el));
  }

});

/* ── COUNTER ANIMATION HELPER ──────────────────────────────── */
function animateCounter(el) {
  const raw    = el.textContent.trim();
  // Extract numeric part (supports €, k, M, +, yrs)
  const match  = raw.match(/([\D]*)(\d+(?:\.\d+)?)([\D]*)/);
  if (!match) return;
  const prefix = match[1];   // e.g. "€"
  const target = parseFloat(match[2]);
  const suffix = match[3];   // e.g. "M+", "k+", " yrs"
  const duration = 1400;     // ms
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── CARD TEMPLATE ─────────────────────────────────────────── */
function renderCard(cs) {
  const isComingSoon = cs.status === 'coming-soon';
  const metricsHTML  = (cs.metrics || []).map(m => `<span class="metric-badge">${m}</span>`).join('');
  const tagsHTML     = (cs.tags    || []).map(t => `<span class="tag">${t}</span>`).join('');
  const comingSoonBadge = isComingSoon ? '<span class="coming-soon-badge">Coming Soon</span>' : '';
  const linkText = cs.type === 'interview-challenge' ? 'View Challenge' : 'Read Case Study';
  const linkHTML = isComingSoon
    ? `<span class="card__link" style="color:var(--text-muted);pointer-events:none;">Coming soon</span>`
    : `<a href="${cs.file}" class="card__link">
         ${linkText}
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
           <path d="M5 12h14M12 5l7 7-7 7"/>
         </svg>
       </a>`;

  const typeLabel = cs.type === 'interview-challenge' ? 'Interview Challenge' : 'Case Study';
  const hasImage  = !!cs.image;
  const imgStyle  = hasImage ? `background-image:url('${cs.image}'); background-size:cover; background-position:center;` : '';

  return `
    <article class="card${isComingSoon ? ' card--coming-soon' : ''}" style="--card-color:${cs.color || 'var(--navy)'}">
      <div class="card__header${hasImage ? ' card__header--img' : ''}" style="${imgStyle}">
        <div class="card__header-bg"></div>
        <div class="card__header-pattern"></div>
        <span class="card__header-type">${typeLabel}</span>
      </div>
      <div class="card__body">
        ${comingSoonBadge}
        <p class="card__subtitle">${cs.subtitle || ''}</p>
        <h3 class="card__title">${cs.title}</h3>
        <p class="card__summary">${cs.summary}</p>
        <div class="card__metrics">${metricsHTML}</div>
        <div class="card__tags">${tagsHTML}</div>
        <div class="card__footer">
          ${linkHTML}
        </div>
      </div>
    </article>
  `;
}

/* ── EMPTY STATE TEMPLATE ──────────────────────────────────── */
function renderEmpty(type) {
  if (type === 'interview-challenge') {
    return `
      <div class="ic-empty">
        <div class="ic-empty__icon">📋</div>
        <h3 class="ic-empty__title">Interview challenges coming soon</h3>
        <p class="ic-empty__desc">
          Real product case studies from interviews at top startups — methodology,
          frameworks used, and my recommendations. Being written up now.
        </p>
        <div class="ic-empty__note">
          <strong>For me (Siddhant):</strong> To add a challenge, open
          <code>data.js</code>, add an object with
          <code>type: "interview-challenge"</code>, then create the HTML page.
          The card will appear here automatically.
        </div>
      </div>
    `;
  }
  return `<p style="color:var(--text-muted)">No items found.</p>`;
}
