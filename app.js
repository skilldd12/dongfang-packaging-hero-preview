(() => {
  'use strict';

  const html = document.documentElement;
  const body = document.body;
  const params = new URLSearchParams(window.location.search);
  const initialScheme = ['1', '2', '3', '4', '5'].includes(params.get('scheme'))
    ? params.get('scheme')
    : '1';
  const isEmbed = params.get('embed') === '1';

  if (isEmbed) body.classList.add('is-embed');

  let currentScheme = initialScheme;
  let userReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  html.setAttribute('data-reduced-motion', String(userReducedMotion));

  const isReducedMotion = () => html.getAttribute('data-reduced-motion') === 'true';

  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  /* =========================================================
     Floating Scheme Dock & Mode Switcher
     ========================================================= */
  const dockTabs = Array.from(document.querySelectorAll('.dock-tab'));
  const panels = Array.from(document.querySelectorAll('[data-scheme-panel]'));
  const btnReplay = document.getElementById('btn-replay');
  const btnMotion = document.getElementById('btn-motion');
  const btnMobile = document.getElementById('btn-mobile');
  const mobileFrame = document.getElementById('mobile-frame');

  let schemeCtx = null;

  function playEntrance(id) {
    if (!window.gsap || isReducedMotion()) return;
    const panel = panels.find((p) => p.dataset.schemePanel === String(id));
    if (!panel) return;
    const lines = panel.querySelectorAll('.reveal-line > span, .s5-headline, .s2-monument');
    window.gsap.fromTo(
      lines,
      { y: 28, opacity: 0.15 },
      { y: 0, opacity: 1, duration: 0.72, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity' }
    );
  }

  function setupScrollChoreography() {
    if (schemeCtx) {
      schemeCtx.revert();
      schemeCtx = null;
    }
    if (!window.gsap || !window.ScrollTrigger || isReducedMotion()) return;

    schemeCtx = window.gsap.context(() => {
      // Scheme 01: 3-Act GSAP ScrollTrigger Cinema Scrub
      if (currentScheme === '1') {
        const runway = document.getElementById('s1-runway');
        const stage = document.getElementById('s1-stage');
        const l1 = document.getElementById('s1-l1');
        const l2 = document.getElementById('s1-l2');
        const l3 = document.getElementById('s1-l3');
        const c1 = document.getElementById('s1-copy-1');
        const c2 = document.getElementById('s1-copy-2');
        const c3 = document.getElementById('s1-copy-3');
        const bar = document.getElementById('s1-progress-bar');
        const lbl = document.getElementById('s1-progress-label');

        if (runway && stage) {
          const desktop = window.innerWidth >= 820;
          const driver = { p: 0 };

          const applyProgress = (p) => {
            if (bar) bar.style.transform = `scaleX(${(0.08 + p * 0.92).toFixed(3)})`;
            if (lbl) {
              lbl.textContent = p < 0.34 ? '01 / DAYLIGHT SHELF' : p < 0.7 ? '02 / BARRIER LAMINATE' : '03 / PRECISION ZIPPER';
            }
            const t2 = Math.max(0, Math.min(1, (p - 0.25) / 0.22));
            const t3 = Math.max(0, Math.min(1, (p - 0.62) / 0.22));

            if (l1) {
              l1.style.opacity = String(1 - t2);
              l1.style.transform = `scale(${(1 + p * 0.14).toFixed(3)})`;
            }
            if (l2) {
              l2.style.opacity = String(t2 * (1 - t3));
              l2.style.transform = `scale(${(1.12 - t2 * 0.12 + t3 * 0.08).toFixed(3)})`;
            }
            if (l3) {
              l3.style.opacity = String(t3);
              l3.style.transform = `scale(${(1.08 - t3 * 0.08).toFixed(3)})`;
            }

            if (c1) {
              const a1 = Math.max(0, 1 - p / 0.26);
              c1.style.opacity = String(a1);
              c1.style.transform = `translate3d(0, ${(-p * 65).toFixed(1)}px, 0)`;
            }
            if (c2) {
              const a2 = t2 * (1 - t3);
              c2.style.opacity = String(a2);
              c2.style.transform = `translate3d(0, ${((1 - t2) * 24).toFixed(1)}px, 0)`;
            }
            if (c3) {
              c3.style.opacity = String(t3);
              c3.style.transform = `translate3d(0, ${((1 - t3) * 24).toFixed(1)}px, 0)`;
            }
          };

          applyProgress(0);
          window.gsap.to(driver, {
            p: 1,
            ease: 'none',
            onUpdate: () => applyProgress(driver.p),
            scrollTrigger: {
              trigger: runway,
              pin: stage,
              start: 'top top',
              end: () => `+=${Math.round(window.innerHeight * (desktop ? 1.85 : 0.75))}`,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true
            }
          });
        }
      }

      // Scheme 03: Studio Freight Perimeter Scrub Parallax
      if (currentScheme === '3') {
        const gallery = document.getElementById('s3-gallery');
        const tiles = Array.from(document.querySelectorAll('#s3-scatter .s3-tile'));
        if (gallery && tiles.length) {
          window.gsap.fromTo(
            tiles,
            { y: 24, opacity: 0.2 },
            { y: 0, opacity: 1, duration: 0.85, stagger: 0.07, ease: 'power3.out' }
          );
          if (window.innerWidth > 820) {
            tiles.forEach((tile) => {
              const spd = parseFloat(tile.dataset.speed || '0.12');
              window.gsap.to(tile, {
                y: spd * 240,
                ease: 'none',
                scrollTrigger: {
                  trigger: gallery,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: true
                }
              });
            });
          }
        }
      }
    });

    window.ScrollTrigger.refresh();
  }

  function setScheme(id, { updateUrl = true } = {}) {
    currentScheme = String(id);
    body.setAttribute('data-active-scheme', currentScheme);

    dockTabs.forEach((t) => {
      const active = t.dataset.scheme === currentScheme;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
    });
    panels.forEach((p) => {
      p.classList.toggle('is-active', p.dataset.schemePanel === currentScheme);
    });

    if (updateUrl && !isEmbed) {
      const url = new URL(window.location.href);
      url.searchParams.set('scheme', currentScheme);
      window.history.replaceState({}, '', url);
    }

    syncScheme1Video();
    setupScrollChoreography();
    playEntrance(currentScheme);

    if (body.classList.contains('is-mobile-preview') && mobileFrame) {
      mobileFrame.src = `index.html?embed=1&scheme=${currentScheme}`;
    }
  }

  dockTabs.forEach((t) => t.addEventListener('click', () => setScheme(t.dataset.scheme)));

  if (btnReplay) {
    btnReplay.addEventListener('click', () => playEntrance(currentScheme));
  }

  if (btnMotion) {
    btnMotion.setAttribute('aria-pressed', String(userReducedMotion));
    btnMotion.addEventListener('click', () => {
      userReducedMotion = !userReducedMotion;
      html.setAttribute('data-reduced-motion', String(userReducedMotion));
      btnMotion.setAttribute('aria-pressed', String(userReducedMotion));
      syncScheme1Video();
      setupScrollChoreography();
    });
  }

  if (btnMobile) {
    btnMobile.addEventListener('click', () => {
      const next = !body.classList.contains('is-mobile-preview');
      body.classList.toggle('is-mobile-preview', next);
      btnMobile.setAttribute('aria-pressed', String(next));
      if (next && mobileFrame) {
        mobileFrame.src = `index.html?embed=1&scheme=${currentScheme}`;
      }
    });
  }

  /* =========================================================
     Mobile Navigation Drawer
     ========================================================= */
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => {
      const open = mobileDrawer.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    mobileDrawer.querySelectorAll('a, button').forEach((item) => {
      item.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================================================
     Scheme 01 Helpers (Specular Glaze, Magnet, Video Playback)
     ========================================================= */
  const s1Stage = document.getElementById('s1-stage');
  const s1Video = document.getElementById('s1-video');
  const s1Spec = document.getElementById('s1-specular');
  const s1Magnet = document.querySelector('.s1-magnet');

  function syncScheme1Video() {
    if (!s1Video) return;
    if (currentScheme === '1' && !isReducedMotion()) {
      s1Video.play().catch(() => {});
    } else {
      s1Video.pause();
    }
  }

  if (s1Stage && s1Spec) {
    let raf1 = 0;
    let mx = 0;
    let my = 0;
    s1Stage.addEventListener('pointermove', (e) => {
      if (isReducedMotion() || e.pointerType !== 'mouse') return;
      mx = e.clientX;
      my = e.clientY;
      if (!raf1) {
        raf1 = window.requestAnimationFrame(() => {
          raf1 = 0;
          const r = s1Stage.getBoundingClientRect();
          s1Spec.style.setProperty('--mx', `${(mx - r.left).toFixed(0)}px`);
          s1Spec.style.setProperty('--my', `${(my - r.top).toFixed(0)}px`);
        });
      }
    }, { passive: true });
  }

  if (s1Magnet) {
    s1Magnet.addEventListener('mousemove', (e) => {
      if (isReducedMotion()) return;
      const r = s1Magnet.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.14;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.18;
      s1Magnet.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    });
    s1Magnet.addEventListener('mouseleave', () => {
      s1Magnet.style.transform = '';
    });
  }

  /* =========================================================
     Scheme 02: Gander Monumental Wordmark + Pointer Gradient
     ========================================================= */
  const s2Canvas = document.getElementById('s2-canvas');
  const s2Backdrop = document.getElementById('s2-backdrop');
  const s2Monument = document.getElementById('s2-monument');

  if (s2Canvas && s2Backdrop && s2Monument) {
    let raf2 = 0;
    let sx = 0;
    let sy = 0;
    const qx = window.gsap ? window.gsap.quickTo(s2Backdrop, 'x', { duration: 0.8, ease: 'power3.out' }) : null;
    const qy = window.gsap ? window.gsap.quickTo(s2Backdrop, 'y', { duration: 0.8, ease: 'power3.out' }) : null;

    s2Canvas.addEventListener('pointermove', (e) => {
      if (isReducedMotion() || e.pointerType !== 'mouse') return;
      sx = e.clientX;
      sy = e.clientY;
      const nx = (e.clientX / window.innerWidth - 0.5) * -18;
      const ny = (e.clientY / window.innerHeight - 0.5) * -12;
      if (qx && qy) {
        qx(nx);
        qy(ny);
      }
      if (!raf2) {
        raf2 = window.requestAnimationFrame(() => {
          raf2 = 0;
          const mRect = s2Monument.getBoundingClientRect();
          s2Monument.style.setProperty('--gx', `${(sx - mRect.left).toFixed(0)}px`);
          s2Monument.style.setProperty('--gy', `${(sy - mRect.top).toFixed(0)}px`);
        });
      }
    }, { passive: true });

    s2Canvas.addEventListener('pointerleave', () => {
      if (qx && qy) {
        qx(0);
        qy(0);
      }
    });
  }

  /* =========================================================
     Scheme 04: Codrops 5-Panel Staggered Strip Switcher
     ========================================================= */
  const s4Panels = Array.from(document.querySelectorAll('#s4-strip .s4-panel'));
  const s4Kicker = document.getElementById('s4-chapter-kicker');
  const s4Title = document.getElementById('s4-chapter-title');
  const s4Desc = document.getElementById('s4-chapter-desc');
  const s4QuoteTrigger = document.getElementById('s4-quote-trigger');

  const s4Stories = [
    {
      kicker: '01 / 05 · CUSTOM PRINTED ROLLSTOCK',
      title: 'Rollstock built for speed.',
      desc: 'Continuous gravure-printed barrier film rolls wound accurately for automated packing lines.',
      quote: 'Printed Barrier Rollstock'
    },
    {
      kicker: '02 / 05 · PULL-TAB & ZIPPER CLOSURES',
      title: 'Resealable craftsmanship.',
      desc: 'Clean tear-notch geometry and crisp press-to-close zipper tracks sealed without distortion.',
      quote: 'Pull-Tab & Zipper Pouches'
    },
    {
      kicker: '03 / 05 · FLAGSHIP COFFEE SERIES',
      title: 'Your product. Our packaging.',
      desc: 'Eight-seal box pouches & stand-up bags built for natural shelf presence.',
      quote: 'Flagship Coffee Series'
    },
    {
      kicker: '04 / 05 · MULTI-LAYER BARRIER',
      title: 'Soft-touch matte laminates.',
      desc: 'Oxygen, moisture, and aroma protection engineered across up to 10 print stations.',
      quote: 'Matte Barrier Laminates'
    },
    {
      kicker: '05 / 05 · KRAFT & WINDOW POUCHES',
      title: 'Tactile bakery & snack bags.',
      desc: 'Natural kraft paper laminated with clear windows and optional carry handles.',
      quote: 'Kraft Window Pouches'
    }
  ];

  function selectS4Panel(idx) {
    const active = Math.max(0, Math.min(s4Stories.length - 1, idx));
    s4Panels.forEach((p, i) => {
      const diff = Math.abs(i - active);
      p.classList.toggle('is-center', diff === 0);
      p.classList.toggle('is-near', diff === 1);
      p.setAttribute('aria-selected', String(diff === 0));
    });

    const story = s4Stories[active];
    if (s4Kicker) s4Kicker.textContent = story.kicker;
    if (s4Title) s4Title.textContent = story.title;
    if (s4Desc) s4Desc.textContent = story.desc;
    if (s4QuoteTrigger) s4QuoteTrigger.dataset.quoteTrigger = story.quote;

    if (window.gsap && !isReducedMotion()) {
      window.gsap.fromTo([s4Title, s4Desc], { y: 12, opacity: 0.3 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' });
    }
  }

  s4Panels.forEach((p) => {
    p.addEventListener('click', () => selectS4Panel(Number(p.dataset.s4Idx)));
  });

  /* =========================================================
     Scheme 05: Codrops Multi-Layout + 1.8x Optical Lens
     ========================================================= */
  const s5RailBtns = Array.from(document.querySelectorAll('[data-s5-go]'));
  const s5Photos = Array.from(document.querySelectorAll('#s5-spread .s5-photo'));
  const s5Headline = document.getElementById('s5-headline');
  const s5Copy = document.getElementById('s5-copy');
  const s5Prev = document.getElementById('s5-prev');
  const s5Next = document.getElementById('s5-next');
  const s5LensZone = document.getElementById('s5-lens-zone');
  const s5Lens = document.getElementById('s5-lens');
  const s5LensBtn = document.getElementById('s5-lens-btn');

  const s5Slides = [
    {
      headline: 'Crafted<br />for shelf.',
      copy: 'Custom flat-bottom pouches, zipper seals, and high-barrier films engineered across 26 inspection stages.'
    },
    {
      headline: 'Printed in<br />Zhongshan.',
      copy: 'In-house rotogravure cylinders, kraft lamination, and continuous rollstock converters under one roof.'
    },
    {
      headline: 'Built for<br />everyday food.',
      copy: 'Clear bakery windows, tactile kraft carriers, and recyclable pouch formats tailored to what goes inside.'
    }
  ];

  let s5Index = 0;
  let s5LensActive = false;

  function showS5Slide(idx) {
    s5Index = ((idx % s5Slides.length) + s5Slides.length) % s5Slides.length;
    s5RailBtns.forEach((b) => b.classList.toggle('is-active', Number(b.dataset.s5Go) === s5Index));
    s5Photos.forEach((img) => img.classList.toggle('is-active', Number(img.dataset.slide) === s5Index));

    if (s5Headline) s5Headline.innerHTML = s5Slides[s5Index].headline;
    if (s5Copy) {
      const btn = s5Copy.querySelector('.s5-inline-link');
      s5Copy.textContent = s5Slides[s5Index].copy + ' ';
      if (btn) s5Copy.appendChild(btn);
    }

    if (s5LensActive && s5Lens) {
      s5LensActive = false;
      if (s5LensBtn) s5LensBtn.setAttribute('aria-pressed', 'false');
      s5Lens.classList.remove('is-visible');
    }
  }

  s5RailBtns.forEach((b) => b.addEventListener('click', () => showS5Slide(Number(b.dataset.s5Go))));
  if (s5Prev) s5Prev.addEventListener('click', () => showS5Slide(s5Index - 1));
  if (s5Next) s5Next.addEventListener('click', () => showS5Slide(s5Index + 1));

  function updateS5LensAt(clientX, clientY) {
    if (!s5LensZone || !s5Lens) return;
    const activeLeft = s5LensZone.querySelector('.s5-photo.is-active');
    if (!activeLeft || !activeLeft.naturalWidth) return;

    const r = s5LensZone.getBoundingClientRect();
    const rx = clientX - r.left;
    const ry = clientY - r.top;
    if (rx < 0 || ry < 0 || rx > r.width || ry > r.height) {
      s5Lens.classList.remove('is-visible');
      return;
    }

    const scale = Math.max(r.width / activeLeft.naturalWidth, r.height / activeLeft.naturalHeight);
    const drawW = activeLeft.naturalWidth * scale;
    const drawH = activeLeft.naturalHeight * scale;
    const offX = (r.width - drawW) * 0.5;
    const offY = (r.height - drawH) * 0.5;

    const zoom = 1.8;
    const lw = s5Lens.offsetWidth || 184;
    const lh = s5Lens.offsetHeight || 184;

    s5Lens.style.left = `${rx.toFixed(0)}px`;
    s5Lens.style.top = `${ry.toFixed(0)}px`;
    s5Lens.style.backgroundImage = `url("${activeLeft.currentSrc || activeLeft.src}")`;
    s5Lens.style.backgroundSize = `${(drawW * zoom).toFixed(1)}px ${(drawH * zoom).toFixed(1)}px`;
    s5Lens.style.backgroundPosition = `${(lw / 2 - (rx - offX) * zoom).toFixed(1)}px ${(lh / 2 - (ry - offY) * zoom).toFixed(1)}px`;
    s5Lens.classList.add('is-visible');
  }

  if (s5LensZone && s5Lens) {
    s5LensZone.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || window.innerWidth <= 820) return;
      if (s5LensActive) updateS5LensAt(e.clientX, e.clientY);
    });
    s5LensZone.addEventListener('pointerleave', () => {
      if (!s5LensActive) s5Lens.classList.remove('is-visible');
    });
  }

  if (s5LensBtn && s5LensZone && s5Lens) {
    s5LensBtn.addEventListener('click', () => {
      s5LensActive = !s5LensActive;
      s5LensBtn.setAttribute('aria-pressed', String(s5LensActive));
      if (s5LensActive) {
        const r = s5LensZone.getBoundingClientRect();
        updateS5LensAt(r.left + r.width * 0.48, r.top + r.height * 0.45);
      } else {
        s5Lens.classList.remove('is-visible');
      }
    });
  }

  /* =========================================================
     Quote Modal
     ========================================================= */
  const quoteModal = document.getElementById('quote-modal');
  const quoteClose = document.getElementById('quote-close');
  const quoteForm = document.getElementById('quote-form');
  const quoteTopic = document.getElementById('q-topic');
  const quoteFeedback = document.getElementById('quote-feedback');

  function openQuote(topic) {
    if (!quoteModal) return;
    if (quoteTopic && topic) quoteTopic.value = topic;
    if (quoteFeedback) quoteFeedback.classList.remove('is-visible');
    quoteModal.classList.add('is-open');
    window.setTimeout(() => document.getElementById('q-product')?.focus(), 40);
  }

  function closeQuote() {
    if (quoteModal) quoteModal.classList.remove('is-open');
  }

  document.querySelectorAll('[data-quote-trigger]').forEach((btn) => {
    btn.addEventListener('click', () => openQuote(btn.dataset.quoteTrigger));
  });

  if (quoteClose) quoteClose.addEventListener('click', closeQuote);
  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) closeQuote();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuote();
      if (s5LensActive && s5Lens && s5LensBtn) {
        s5LensActive = false;
        s5LensBtn.setAttribute('aria-pressed', 'false');
        s5Lens.classList.remove('is-visible');
      }
    }
  });

  if (quoteForm && quoteFeedback) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(quoteForm);
      const summary = [
        `Topic: ${fd.get('topic') || 'General'}`,
        `Product: ${fd.get('product') || '-'}`,
        `Quantity: ${fd.get('quantity') || 'To confirm'}`,
        `Contact: ${fd.get('contact') || '-'}`
      ].join(' | ');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(summary).catch(() => {});
      }
      quoteFeedback.textContent =
        `Demo mode (static frontend): enquiry brief prepared & copied — "${summary}". Connect backend/email endpoint before production launch.`;
      quoteFeedback.classList.add('is-visible');
    });
  }

  // Initialize active scheme cleanly
  setScheme(initialScheme, { updateUrl: false });

  /* =========================================================
     WordPress Implementation Playbook Modal & Snippet Copy
     ========================================================= */
  const wpModal = document.getElementById('wp-modal');
  const btnWp = document.getElementById('btn-wp');
  const wpClose = document.getElementById('wp-close');
  const wpName = document.getElementById('wp-scheme-name');
  const wpBadge = document.getElementById('wp-scheme-badge');
  const wpHowto = document.getElementById('wp-scheme-howto');
  const wpStack = document.getElementById('wp-scheme-stack');
  const wpWay = document.getElementById('wp-scheme-wpway');
  const wpEdit = document.getElementById('wp-scheme-edit');
  const wpCopyBtn = document.getElementById('wp-copy-snippet');
  const wpCopyStatus = document.getElementById('wp-copy-status');

  const wpPlaybook = {
    '1': {
      name: '方案 01 · 影院视频循环 + GSAP 三幕滚动推镜',
      badge: '★★★★★ WordPress 首推方案',
      howto: '在 WordPress 首页顶部全宽容器放置 1 段 1.5MB 左右的 MP4 循环短片，并在 WPCode 免费插件中仅对首页引入 gsap.min.js + ScrollTrigger.min.js（约 35 行脚本），即可在用户向下滚动时锁定舞台并依次显影热封层与拉链工艺。',
      stack: 'HTML5 Video + GSAP ScrollTrigger',
      wpway: 'Elementor 全宽容器 + WPCode 页脚挂载',
      edit: '极低（媒体库直接替换 MP4/JPG）',
      snippet: `<!-- WordPress Custom HTML / Elementor HTML Widget · 方案 01 滚动三幕骨架 -->
<section class="df-s1-runway" id="df-s1-runway">
  <div class="df-s1-stage" id="df-s1-stage" style="position:relative;height:100vh;overflow:hidden;">
    <video autoplay muted loop playsinline poster="REPLACE_HERO_POSTER_URL" style="width:100%;height:100%;object-fit:cover;">
      <source src="REPLACE_HERO_VIDEO_MP4_URL" type="video/mp4" />
    </video>
    <div style="position:absolute;inset:0;background:linear-gradient(12deg,rgba(12,16,22,.64),transparent 72%);"></div>
    <div style="position:relative;z-index:2;padding:96px 5vw;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%;">
      <h1 style="font-size:clamp(42px,5.4vw,76px);margin:0 0 14px;">Your product. Our packaging.</h1>
      <p>Custom flat-bottom, stand-up pouches &amp; barrier rollstock.</p>
    </div>
  </div>
</section>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script>
gsap.registerPlugin(ScrollTrigger);
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.timeline({ scrollTrigger: { trigger: '#df-s1-runway', start: 'top top', end: '+=160%', pin: '#df-s1-stage', scrub: 0.65 } })
    .to('#df-s1-stage video', { scale: 1.07, ease: 'none' }, 0);
}
</script>`
    },
    '2': {
      name: '方案 02 · Gander Monumental 巨字横幅 + 指针高光追随',
      badge: '★★★★★ 零插件 · PageSpeed 最快',
      howto: '几乎零 JS 负担：整幅深色工艺背景图配合 1 行 CSS background-clip: text 做出横跨全屏的镂空光泽字标；通过页脚 12 行原生 pointermove 监听更新 --gx / --gy 变量，鼠标准确经过之处字母产生金属扫光质感。',
      stack: '纯 CSS 渐变裁剪 + 12 行原生 JS',
      wpway: 'Gutenberg 封面块 / Elementor 标题 + Custom CSS',
      edit: '极低（改文字即改巨字）',
      snippet: `<!-- WordPress Custom HTML · 方案 02 巨字光追核心骨架 -->
<section id="df-s2" style="position:relative;height:100vh;overflow:hidden;background:#111821;">
  <img src="REPLACE_DARK_MACRO_POUCH_URL" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.76);" />
  <h1 id="df-s2-word" style="position:relative;z-index:2;margin:76px 0 0;text-align:center;font-size:clamp(54px,14vw,210px);font-weight:700;letter-spacing:-.048em;background-image:radial-gradient(360px circle at var(--gx,50%) var(--gy,40%),#fff,#cfe3f9 45%,rgba(244,246,249,.88));-webkit-background-clip:text;background-clip:text;color:transparent;">DONGFANG</h1>
</section>
<script>
document.getElementById('df-s2')?.addEventListener('pointermove', (e) => {
  const el = document.getElementById('df-s2-word');
  const r = el.getBoundingClientRect();
  el.style.setProperty('--gx', (e.clientX - r.left) + 'px');
  el.style.setProperty('--gy', (e.clientY - r.top) + 'px');
});
</script>`
    },
    '3': {
      name: '方案 03 · Studio Freight 极简白画布 + 四周视差画框',
      badge: '★★★★★ Elementor Pro 可零代码完成',
      howto: '采用纯白 #FFFFFF 首屏画布突出中央一句话定位与双按钮；四周 6 张包装实拍小窗在 Elementor Pro 中直接选中 Image 控件打开 Motion Effects → Scrolling Effects → Vertical Scroll（分别给正负速度差），无需写代码就能跑出异步视差。',
      stack: 'Elementor Motion Effects 或 GSAP Scrub',
      wpway: 'Elementor Pro 原生视差 / 区块模板',
      edit: '极低（拖图片进画框即换图）',
      snippet: `<!-- WordPress + GSAP 版 · 方案 03 纯白留白视差骨架（若使用 Elementor Pro 可直接在 Motion Effects 面板设 Vertical Scroll 代替 JS） -->
<section id="df-s3" style="position:relative;min-height:100vh;background:#fff;display:grid;place-items:center;overflow:hidden;">
  <div style="text-align:center;max-width:520px;z-index:3;">
    <h1 style="font-size:clamp(34px,3.8vw,56px);margin:0 0 14px;">Your product. Our packaging.</h1>
    <p>Flat-bottom, stand-up &amp; recyclable film routes printed in-house.</p>
  </div>
  <img data-speed="-0.16" src="REPLACE_TILE_1_URL" alt="" style="position:absolute;top:82px;left:3%;width:220px;height:150px;object-fit:cover;" />
  <img data-speed="0.18" src="REPLACE_TILE_2_URL" alt="" style="position:absolute;top:76px;right:3%;width:215px;height:160px;object-fit:cover;" />
</section>`
    },
    '4': {
      name: '方案 04 · Codrops 五联错落艺廊（点击切换中心焦点）',
      badge: '★★★★☆ 零重插件 · 25 行交互代码',
      howto: '使用 Flexbox 的 flex 与 height CSS 过渡即可做到丝滑的卡片缩放；将本演示的 5 连按钮骨架放入 Elementor HTML 小工具或 Gutenberg 自定义 HTML 块，点击任意产品卡片即自动切换中央焦点图与下方标题描述。',
      stack: 'CSS Flexbox Transition + 25 行 JS',
      wpway: 'Gutenberg Custom HTML 区块 / WPCode',
      edit: '中等（HTML 中修改 5 个图片链接与文案）',
      snippet: `<!-- WordPress Custom HTML · 方案 04 五联点击聚焦核心交互 -->
<style>
.df-s4-strip{display:flex;align-items:center;gap:18px;background:#0d1926;padding:64px 4vw;}
.df-s4-panel{flex:.72;height:196px;border:0;padding:0;overflow:hidden;border-radius:4px;cursor:pointer;opacity:.62;transition:flex .52s cubic-bezier(.16,1,.3,1),height .52s,opacity .32s;}
.df-s4-panel.is-near{flex:1.08;height:295px;opacity:.88;}
.df-s4-panel.is-center{flex:1.95;height:440px;opacity:1;}
.df-s4-panel img{width:100%;height:100%;object-fit:cover;display:block;}
</style>
<div class="df-s4-strip">
  <button class="df-s4-panel" data-idx="0"><img src="REPLACE_IMG_1" alt="" /></button>
  <button class="df-s4-panel is-near" data-idx="1"><img src="REPLACE_IMG_2" alt="" /></button>
  <button class="df-s4-panel is-center" data-idx="2"><img src="REPLACE_IMG_3" alt="" /></button>
  <button class="df-s4-panel is-near" data-idx="3"><img src="REPLACE_IMG_4" alt="" /></button>
  <button class="df-s4-panel" data-idx="4"><img src="REPLACE_IMG_5" alt="" /></button>
</div>
<script>
const panels=[...document.querySelectorAll('.df-s4-panel')];
panels.forEach((p)=>p.addEventListener('click',()=>{const a=+p.dataset.idx;panels.forEach((x,i)=>{const d=Math.abs(i-a);x.classList.toggle('is-center',d===0);x.classList.toggle('is-near',d===1);});}));
</script>`
    },
    '5': {
      name: '方案 05 · Multi-Layout 不对称画报拼版 + 1.8× 工艺放大镜',
      badge: '★★★★☆ 特色工艺特写首屏',
      howto: '左大图右双图不对称 CSS Grid 拼版，配合 clip-path 幕布擦除转场与 1.8× 光学放大镜（纯原生 background-position 坐标换算，免装商业相册放大插件）。非常适用于重印刷/封边热封细节验厂展示。',
      stack: 'CSS Grid + clip-path + 原生 1.8× 镜片 JS',
      wpway: 'Elementor HTML 小工具（单屏模块整块置入）',
      edit: '中等（HTML 中维护 3 组幻灯图链接）',
      snippet: `<!-- WordPress Custom HTML · 方案 05 1.8x 局部放大镜核心逻辑 -->
<div id="df-lens-zone" style="position:relative;overflow:hidden;cursor:crosshair;">
  <img id="df-lens-src" src="REPLACE_HERO_CLOSEUP_URL" alt="" style="width:100%;display:block;" />
  <div id="df-lens" style="position:absolute;width:184px;height:184px;border-radius:50%;border:1.5px solid rgba(255,255,255,.7);pointer-events:none;opacity:0;transform:translate(-50%,-50%);background-repeat:no-repeat;"></div>
</div>
<script>
const z=document.getElementById('df-lens-zone'),img=document.getElementById('df-lens-src'),l=document.getElementById('df-lens');
z?.addEventListener('pointermove',(e)=>{if(e.pointerType!=='mouse'||!img.naturalWidth)return;const r=z.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,k=1.8;l.style.left=x+'px';l.style.top=y+'px';l.style.backgroundImage='url("'+img.currentSrc+'")';l.style.backgroundSize=(r.width*k)+'px '+(r.height*k)+'px';l.style.backgroundPosition=(92-x*k)+'px '+(92-y*k)+'px';l.style.opacity='1';});
z?.addEventListener('pointerleave',()=>{l.style.opacity='0';});
</script>`
    }
  };

  function renderWpPlaybook(id) {
    const item = wpPlaybook[String(id)] || wpPlaybook['1'];
    if (wpName) wpName.textContent = item.name;
    if (wpBadge) wpBadge.textContent = item.badge;
    if (wpHowto) wpHowto.textContent = item.howto;
    if (wpStack) wpStack.textContent = item.stack;
    if (wpWay) wpWay.textContent = item.wpway;
    if (wpEdit) wpEdit.textContent = item.edit;
    if (wpCopyStatus) wpCopyStatus.textContent = '';
  }

  function openWpModal() {
    if (!wpModal) return;
    renderWpPlaybook(currentScheme);
    wpModal.classList.add('is-open');
  }

  function closeWpModal() {
    if (wpModal) wpModal.classList.remove('is-open');
  }

  if (btnWp) btnWp.addEventListener('click', openWpModal);
  if (wpClose) wpClose.addEventListener('click', closeWpModal);
  if (wpModal) {
    wpModal.addEventListener('click', (e) => {
      if (e.target === wpModal) closeWpModal();
    });
  }

  document.querySelectorAll('.wp-jump').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.wpScheme;
      if (targetId) {
        setScheme(targetId);
        renderWpPlaybook(targetId);
      }
    });
  });

  if (wpCopyBtn) {
    wpCopyBtn.addEventListener('click', () => {
      const item = wpPlaybook[String(currentScheme)] || wpPlaybook['1'];
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(item.snippet).then(() => {
          if (wpCopyStatus) wpCopyStatus.textContent = '已复制当前方案 WordPress 嵌入骨架到剪贴板';
        }).catch(() => {
          if (wpCopyStatus) wpCopyStatus.textContent = '复制受限，请直接查阅仓库内 WORDPRESS_IMPLEMENTATION_GUIDE.md';
        });
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeWpModal();
  });
})();
