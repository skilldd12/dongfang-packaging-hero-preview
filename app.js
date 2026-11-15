(() => {
  'use strict';

  const body = document.body;
  const params = new URLSearchParams(window.location.search);
  const initialScheme = ['1', '2', '3', '4', '5'].includes(params.get('scheme'))
    ? params.get('scheme')
    : '1';
  const isEmbed = params.get('embed') === '1';

  if (isEmbed) body.classList.add('is-embed');

  let currentScheme = initialScheme;
  const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     Floating Scheme Dock & Switcher
     ========================================================= */
  const dockTabs = Array.from(document.querySelectorAll('.dock-tab'));
  const panels = Array.from(document.querySelectorAll('[data-scheme-panel]'));
  const btnReplay = document.getElementById('btn-replay');
  const btnMobile = document.getElementById('btn-mobile');
  const mobileFrame = document.getElementById('mobile-frame');

  function playEntrance(id) {
    if (!window.gsap || isReducedMotion()) return;
    const panel = panels.find((p) => p.dataset.schemePanel === String(id));
    if (!panel) return;
    const targets = panel.querySelectorAll('.reveal-line > span, .s5-headline, .s2-monument, .s1-slide.is-active .s1-title');
    if (!targets.length) return;
    window.gsap.fromTo(
      targets,
      { y: 20, opacity: 0.2 },
      { y: 0, opacity: 1, duration: 0.65, stagger: 0.07, ease: 'power3.out', clearProps: 'transform,opacity' }
    );
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

    playEntrance(currentScheme);

    if (body.classList.contains('is-mobile-preview') && mobileFrame) {
      mobileFrame.src = `index.html?embed=1&scheme=${currentScheme}`;
    }
  }

  dockTabs.forEach((t) => t.addEventListener('click', () => setScheme(t.dataset.scheme)));
  if (btnReplay) btnReplay.addEventListener('click', () => playEntrance(currentScheme));

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
     Scheme 01: Erewhon Minimalist Carousel (Zero Jitter)
     ========================================================= */
  const s1Slides = Array.from(document.querySelectorAll('.s1-slide'));
  const s1Dots = Array.from(document.querySelectorAll('[data-s1-dot]'));
  const s1Prev = document.getElementById('s1-prev');
  const s1Next = document.getElementById('s1-next');
  let s1Index = 0;
  let s1Timer = null;

  function showS1Slide(idx) {
    if (!s1Slides.length) return;
    s1Index = ((idx % s1Slides.length) + s1Slides.length) % s1Slides.length;
    s1Slides.forEach((sl, i) => sl.classList.toggle('is-active', i === s1Index));
    s1Dots.forEach((dt, i) => dt.classList.toggle('is-active', i === s1Index));
  }

  function resetS1Autoplay() {
    if (s1Timer) window.clearInterval(s1Timer);
    if (isReducedMotion()) return;
    s1Timer = window.setInterval(() => {
      if (currentScheme === '1' && !document.hidden) {
        showS1Slide(s1Index + 1);
      }
    }, 6200);
  }

  if (s1Prev) {
    s1Prev.addEventListener('click', () => {
      showS1Slide(s1Index - 1);
      resetS1Autoplay();
    });
  }
  if (s1Next) {
    s1Next.addEventListener('click', () => {
      showS1Slide(s1Index + 1);
      resetS1Autoplay();
    });
  }
  s1Dots.forEach((d) => {
    d.addEventListener('click', () => {
      showS1Slide(Number(d.dataset.s1Dot));
      resetS1Autoplay();
    });
  });
  resetS1Autoplay();

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
    const qx = window.gsap ? window.gsap.quickTo(s2Backdrop, 'x', { duration: 0.85, ease: 'power3.out' }) : null;
    const qy = window.gsap ? window.gsap.quickTo(s2Backdrop, 'y', { duration: 0.85, ease: 'power3.out' }) : null;

    s2Canvas.addEventListener('pointermove', (e) => {
      if (isReducedMotion() || e.pointerType !== 'mouse') return;
      sx = e.clientX;
      sy = e.clientY;
      const nx = (e.clientX / window.innerWidth - 0.5) * -16;
      const ny = (e.clientY / window.innerHeight - 0.5) * -10;
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
     Scheme 03: Studio Freight Silky Pointer Depth Parallax
     ========================================================= */
  const s3Gallery = document.getElementById('s3-gallery');
  const s3Tiles = Array.from(document.querySelectorAll('#s3-scatter .s3-tile'));
  if (s3Gallery && s3Tiles.length && window.gsap) {
    const movers = s3Tiles.map((tile) => ({
      depth: parseFloat(tile.dataset.depth || '14'),
      qx: window.gsap.quickTo(tile, 'x', { duration: 0.9, ease: 'power3.out' }),
      qy: window.gsap.quickTo(tile, 'y', { duration: 0.9, ease: 'power3.out' })
    }));

    s3Gallery.addEventListener('pointermove', (e) => {
      if (isReducedMotion() || e.pointerType !== 'mouse' || window.innerWidth <= 820) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      movers.forEach(({ depth, qx, qy }) => {
        qx(nx * depth);
        qy(ny * depth);
      });
    }, { passive: true });

    s3Gallery.addEventListener('pointerleave', () => {
      movers.forEach(({ qx, qy }) => {
        qx(0);
        qy(0);
      });
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
     Quote & WordPress Playbook Modals
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
      quoteFeedback.textContent = `Demo mode: brief copied — "${summary}".`;
      quoteFeedback.classList.add('is-visible');
    });
  }

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
      name: '方案 01 · Erewhon 极简轮播首屏（丝滑 GPU 慢推）',
      badge: '★★★★★ WordPress 原生即可完成',
      howto: '参考 ship.erewhon.com 的做法：深炭灰顶栏下方使用 3 帧大跨度棚拍轮播，结合纯 CSS transform: translate3d / scale3d 合成层缓慢呼吸推镜（彻底不用容易抽搐抖动的压缩视频），后台媒体库直接更换轮播图即可。',
      stack: 'Elementor Slides / Swiper + CSS GPU Keyframes',
      wpway: 'Elementor 轮播容器或 15 行原生 fade 切换',
      edit: '极易（媒体库直接换 3 张大图）',
      snippet: `<!-- WordPress Custom HTML / Elementor · 方案 01 Erewhon 极简轮播骨架 -->
<style>
@keyframes dfSlowBreathe { 0%{transform:translate3d(0,0,0) scale3d(1.01,1.01,1)} 100%{transform:translate3d(-0.9%,-0.3%,0) scale3d(1.06,1.06,1)} }
.df-e-stage{position:relative;height:calc(100vh - 68px);overflow:hidden;background:#1c1d1d;}
.df-e-slide{position:absolute;inset:0;opacity:0;transition:opacity .9s ease;}
.df-e-slide.is-active{opacity:1;}
.df-e-slide img{width:100%;height:100%;object-fit:cover;will-change:transform;}
.df-e-slide.is-active img{animation:dfSlowBreathe 16s ease-in-out infinite alternate;}
</style>
<div class="df-e-stage">
  <div class="df-e-slide is-active"><img src="REPLACE_HERO_1_URL" alt="" /></div>
  <div class="df-e-slide"><img src="REPLACE_HERO_2_URL" alt="" /></div>
</div>`
    },
    '2': {
      name: '方案 02 · Gander Monumental 巨字横幅 + 指针光追',
      badge: '★★★★★ 零插件 · PageSpeed 最快',
      howto: '整幅深色工艺图配合 CSS background-clip: text 镂空大字，通过 12 行原生 pointermove 脚本实时更新 --gx/--gy 坐标，光斑随鼠标在巨字表面流畅扫过，体积 < 1KB。',
      stack: '纯 CSS 渐变裁剪 + 12 行原生 JS',
      wpway: 'Gutenberg 封面块 / Elementor Heading',
      edit: '极易（改文字即改巨字）',
      snippet: `<!-- WordPress Custom HTML · 方案 02 巨字光追核心骨架 -->
<section id="df-s2" style="position:relative;height:100vh;overflow:hidden;background:#141920;">
  <img src="REPLACE_DARK_POUCH_URL" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.76);" />
  <h1 id="df-s2-word" style="position:relative;z-index:2;margin:72px 0 0;text-align:center;font-size:clamp(54px,14vw,210px);font-weight:700;letter-spacing:-.048em;background-image:radial-gradient(360px circle at var(--gx,50%) var(--gy,40%),#fff,#cfe3f9 42%,rgba(244,246,249,.9));-webkit-background-clip:text;background-clip:text;color:transparent;">DONGFANG</h1>
</section>
<script>
document.getElementById('df-s2')?.addEventListener('pointermove',(e)=>{const w=document.getElementById('df-s2-word'),r=w.getBoundingClientRect();w.style.setProperty('--gx',(e.clientX-r.left)+'px');w.style.setProperty('--gy',(e.clientY-r.top)+'px');});
</script>`
    },
    '3': {
      name: '方案 03 · Studio Freight 极简白画布 + 深度视差矩阵',
      badge: '★★★★★ Elementor Pro 原生零代码',
      howto: '纯白留白画布正中放置核心声明，四周 6 张实拍小窗在 Elementor Pro 中打开 Motion Effects → Mouse Effects（Mouse Track 设不同正负深度），鼠标移动即可产生柔和的多层景深视差。',
      stack: 'Elementor Mouse Track 或 GSAP quickTo',
      wpway: 'Elementor Pro 原生动态面板',
      edit: '极易（可视化拖图片）',
      snippet: `<!-- Elementor Pro 可直接用 Mouse Track 原生零代码开启；若用区块代码可在容器内为四周图片挂 data-depth 与 gsap.quickTo -->`
    },
    '4': {
      name: '方案 04 · Codrops 五联错落艺廊（点击切换中心焦点）',
      badge: '★★★★☆ 零插件 · 25 行交互代码',
      howto: '5 张卡片利用 Flexbox flex 比例与 height CSS 过渡做出居中放大切换；放入 Gutenberg Custom HTML 或 Elementor HTML 小工具即可运行，点击任意产品卡片自动展开为焦点大图。',
      stack: 'CSS Flexbox Transition + 25 行 JS',
      wpway: 'Custom HTML 区块 / WPCode',
      edit: '中等（HTML 内更换 5 个图片链接）',
      snippet: `<!-- 方案 04 五联点击聚焦核心交互已整理于 WAREHOUSE/WORDPRESS_IMPLEMENTATION_GUIDE.md -->`
    },
    '5': {
      name: '方案 05 · Multi-Layout 不对称拼版 + 1.8× 工艺放大镜',
      badge: '★★★★☆ 细节特写首屏',
      howto: '左大图右双叠图 CSS Grid 拼版，配合 clip-path 幕布转场与 1.8× 光学局部放大镜，无重插件依赖。适合突出热封边、印刷网点与拉链细节。',
      stack: 'CSS Grid + clip-path + 原生 1.8× 镜片 JS',
      wpway: 'Elementor HTML 小工具',
      edit: '中等（HTML 内维护 3 组图片链接）',
      snippet: `<!-- 方案 05 1.8x 局部放大镜核心脚本可从仓库 app.js updateS5LensAt() 直接复用 -->`
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
        }).catch(() => {});
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuote();
      closeWpModal();
      if (s5LensActive && s5Lens && s5LensBtn) {
        s5LensActive = false;
        s5LensBtn.setAttribute('aria-pressed', 'false');
        s5Lens.classList.remove('is-visible');
      }
    }
  });

  setScheme(initialScheme, { updateUrl: false });
})();
