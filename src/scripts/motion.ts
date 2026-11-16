import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

/** Wrap each word of [data-split] headings so it can rise into view. Keeps inline markup like <em>. */
function splitWords(el: HTMLElement) {
  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent || '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.append(document.createTextNode(part));
            return;
          }
          const outer = document.createElement('span');
          outer.className = 'sw';
          const inner = document.createElement('span');
          inner.className = 'swi';
          inner.textContent = part;
          outer.append(inner);
          frag.append(outer);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(el);
}

function formatCount(value: number, el: HTMLElement) {
  const dec = Number(el.dataset.dec || 0);
  const text = value.toFixed(dec);
  return el.hasAttribute('data-sep') ? Number(text).toLocaleString('en-US') : text;
}

function init() {
  root.classList.add('js-motion');
  if (reduced) {
    root.classList.add('reduced-motion');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scrolling ---------- */
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((a) => {
    a.addEventListener('click', (event) => {
      const url = new URL(a.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -86 });
      history.pushState(null, '', url.hash);
    });
  });
  // Pause smooth scrolling while the command palette is open.
  const dialog = document.querySelector('dialog');
  if (dialog) {
    new MutationObserver(() => (dialog.open ? lenis.stop() : lenis.start())).observe(dialog, {
      attributes: true,
      attributeFilter: ['open'],
    });
  }

  /* ---------- headline word reveal ---------- */
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    splitWords(el);
    gsap.from(el.querySelectorAll('.swi'), {
      yPercent: 115,
      duration: 1.05,
      ease: 'expo.out',
      stagger: 0.045,
      delay: 0.1,
    });
  });
  gsap.from('.hero-lede, .hero-context, .hero-cta, .hero-social, .hero-visual', {
    y: 26,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.09,
    delay: 0.45,
  });
  if (document.querySelector('.hero')) {
    gsap.to('.hero-copy', {
      yPercent: -14,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  /* ---------- scroll reveals ---------- */
  const revealTargets = gsap.utils.toArray<HTMLElement>(
    '[data-reveal], .section-header, .timeline-item, .publication, .expertise-grid article, .about-grid > *, .contact-inner > *, .case-content section, .case-aside',
  );
  gsap.set(revealTargets, { y: 34, opacity: 0 });
  ScrollTrigger.batch(revealTargets, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });

  /* ---------- counters ---------- */
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const state = { v: 0 };
    el.textContent = formatCount(0, el);
    gsap.to(state, {
      v: end,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => {
        el.textContent = formatCount(state.v, el);
      },
      onComplete: () => {
        el.textContent = formatCount(end, el);
      },
    });
  });

  /* ---------- statement: words light up as you scroll ---------- */
  const statement = document.querySelector<HTMLElement>('#statement');
  if (statement) {
    splitWords(statement);
    const words = [...statement.querySelectorAll<HTMLElement>('.sw')];
    words.forEach((w) => w.classList.add('dim'));
    ScrollTrigger.create({
      trigger: statement,
      start: 'top 80%',
      end: 'bottom 45%',
      scrub: true,
      onUpdate: (st) => {
        const k = Math.round(st.progress * words.length);
        words.forEach((w, i) => w.classList.toggle('dim', i >= k));
      },
    });
  }

  /* ---------- pinned horizontal project reel (desktop) ---------- */
  const reel = document.querySelector<HTMLElement>('#reel');
  if (reel) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const distance = () => Math.max(0, reel.scrollWidth - window.innerWidth);
      const tween = gsap.to(reel, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: '#reel-wrap',
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      gsap.utils.toArray<HTMLElement>('.panel .project-visual').forEach((art) => {
        gsap.fromTo(
          art,
          { rotate: -4, scale: 0.94 },
          {
            rotate: 3,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: art.closest('.panel'),
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      });
    });
  }

  /* ---------- cursor ring + magnetic buttons (fine pointers only) ---------- */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.append(ring);
    const rx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' });
    addEventListener(
      'pointermove',
      (e) => {
        ring.classList.add('ready');
        rx(e.clientX);
        ry(e.clientY);
      },
      { passive: true },
    );
    document.addEventListener('pointerover', (e) => {
      const hit = (e.target as Element).closest('a, button, input');
      ring.classList.toggle('on', Boolean(hit));
    });
    document.documentElement.addEventListener('pointerleave', () => ring.classList.remove('ready'));

    document.querySelectorAll<HTMLElement>('.mag').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const box = btn.getBoundingClientRect();
        const x = e.clientX - box.left - box.width / 2;
        const y = e.clientY - box.top - box.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: 'power3' });
      });
      btn.addEventListener('pointerleave', () =>
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }),
      );
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
}

init();
