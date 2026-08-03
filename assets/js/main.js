
(() => {
  const data = window.SITE_DATA;
  if (!data) return;

  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => [...root.querySelectorAll(s)];
  const imgSet = (img) => `${img.src640} 640w, ${img.src1100} 1100w, ${img.src1800} 1800w`;
  const bg = (img, size = '1800') => `url("${img[`src${size}`] || img.src1800}")`;
  const setResponsiveHero = (el, desktop, mobile, desktopPosition = 'center', mobilePosition = 'center') => {
    el.style.setProperty('--hero-desktop', bg(desktop));
    el.style.setProperty('--hero-mobile', bg(mobile));
    el.style.setProperty('--hero-position-desktop', desktopPosition);
    el.style.setProperty('--hero-position-mobile', mobilePosition);
  };

  qsa('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const header = qs('[data-header]');
  const menuToggle = qs('[data-menu-toggle]');
  const nav = qs('[data-nav]');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      qs('.menu-toggle__label', menuToggle).textContent = open ? 'Close' : 'Menu';
    });
    qsa('a', nav).forEach(a => a.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }
  const solidHeader = () => header?.classList.toggle('is-solid', window.scrollY > 45);
  solidHeader();
  addEventListener('scroll', solidHeader, {passive:true});

  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -5% 0px' }) : null;
  const observeReveals = () => qsa('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('is-visible'));

  function setCurrentNav(category) {
    qsa('.site-nav a').forEach(a => {
      const url = new URL(a.href, location.href);
      const isCategory = url.searchParams.get('category') === category;
      const isPage = url.pathname.split('/').pop() === location.pathname.split('/').pop();
      if (isCategory || (!category && isPage)) a.setAttribute('aria-current', 'page');
    });
  }

  const projectGrid = qs('[data-project-grid]');
  if (projectGrid) {
    const homeHero = qs('[data-home-hero-media]');
    const homeCategory = data.categories.landscape;
    setResponsiveHero(homeHero, homeCategory.heroDesktop, homeCategory.heroMobile, homeCategory.heroPositionDesktop, homeCategory.heroPositionMobile);

    data.categoryOrder.forEach(key => {
      const cat = data.categories[key];
      const article = document.createElement('a');
      article.className = 'project-card reveal';
      article.href = `gallery.html?category=${key}`;
      article.setAttribute('aria-label', `Open ${cat.title} gallery`);
      const desktopHero = cat.cover || cat.heroDesktop || cat.hero;
      const mobileHero = cat.cover || cat.heroMobile || desktopHero;
      article.innerHTML = `
        <picture class="project-card__media">
          <source media="(max-width: 760px)" srcset="${mobileHero.src640} 640w, ${mobileHero.src1100} 1100w" sizes="100vw">
          <img src="${desktopHero.src1100}" srcset="${imgSet(desktopHero)}" sizes="(max-width: 760px) 100vw, 55vw" alt="${desktopHero.alt}" loading="lazy" decoding="async">
        </picture>
        <div class="project-card__content">
          <h3>${cat.title}</h3>
          <p>${cat.description}</p>
        </div>`;
      projectGrid.append(article);
    });
    observeReveals();
  }

  function makePhoto(image, index) {
    const figure = document.createElement('figure');
    figure.className = 'gallery-item reveal';
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.imageIndex = index;
    button.setAttribute('aria-label', `Open image ${index + 1}: ${image.alt}`);
    const img = document.createElement('img');
    img.src = image.src1100;
    img.srcset = imgSet(image);
    img.sizes = '(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw';
    img.width = image.width;
    img.height = image.height;
    img.alt = image.alt;
    img.loading = index < 2 ? 'eager' : 'lazy';
    img.decoding = 'async';
    // A missing file must never leave visible alt text or a large empty gap.
    img.addEventListener('error', () => figure.remove(), { once: true });
    button.append(img);
    figure.append(button);
    return figure;
  }


  const galleryPage = qs('[data-gallery-page]');
  if (galleryPage) {
    const params = new URLSearchParams(location.search);
    let category = params.get('category') || data.categoryOrder[0];
    if (!data.categories[category]) category = data.categoryOrder[0];
    const cat = data.categories[category];
    document.title = `${cat.title} — ${data.site.name}`;
    setCurrentNav(category);
    qs('[data-gallery-title]').textContent = cat.title;
    qs('[data-gallery-description]').textContent = cat.description;
    const heroMedia = qs('[data-gallery-hero-media]');
    setResponsiveHero(heroMedia, cat.heroDesktop, cat.heroMobile, cat.heroPositionDesktop, cat.heroPositionMobile);
    // Keep all selected photographs in the gallery, including the cover image.
    // The People gallery opens with a balanced two-image composition:
    // the autumn-leaf portrait stays in its original landscape format, while
    // the following portrait completes the row without leaving an empty space.
    const galleryImages = cat.images;

    const rowsRoot = qs('[data-gallery-rows]');
    const galleryContent = rowsRoot.closest('.gallery-content');
    if (category === 'people' && galleryImages.length >= 2) {
      const featuredPeople = document.createElement('div');
      featuredPeople.className = 'gallery-featured-people';
      galleryImages.slice(0, 2).forEach((image, index) => featuredPeople.append(makePhoto(image, index)));
      galleryContent.insertBefore(featuredPeople, rowsRoot);
      galleryImages.slice(2).forEach((image, offset) => rowsRoot.append(makePhoto(image, offset + 2)));
    } else {
      galleryImages.forEach((image, index) => rowsRoot.append(makePhoto(image, index)));
    }

    const currentIndex = data.categoryOrder.indexOf(category);
    const nextKey = data.categoryOrder[(currentIndex + 1) % data.categoryOrder.length];
    const nextCat = data.categories[nextKey];
    qs('[data-next-project]').innerHTML = `<a href="gallery.html?category=${nextKey}"><span><small>Next project</small><strong>${nextCat.title}</strong></span><span aria-hidden="true">→</span></a>`;

    const lightbox = qs('[data-lightbox]');
    const lightboxImage = qs('[data-lightbox-image]');
    const caption = qs('[data-lightbox-caption]');
    let active = 0;
    let touchStartX = 0;
    const renderLightbox = () => {
      const image = galleryImages[active];
      lightboxImage.src = image.src1800;
      lightboxImage.srcset = imgSet(image);
      lightboxImage.alt = image.alt;
      caption.textContent = `${active + 1} / ${galleryImages.length}`;
    };
    const openLightbox = (index) => {
      active = Number(index);
      renderLightbox();
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
      qs('[data-lightbox-close]').focus();
    };
    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.classList.remove('lightbox-open');
    };
    const move = delta => { active = (active + delta + galleryImages.length) % galleryImages.length; renderLightbox(); };
    galleryContent.addEventListener('click', e => {
      const button = e.target.closest('[data-image-index]');
      if (button) openLightbox(button.dataset.imageIndex);
    });
    qs('[data-lightbox-close]').addEventListener('click', closeLightbox);
    qs('[data-lightbox-prev]').addEventListener('click', () => move(-1));
    qs('[data-lightbox-next]').addEventListener('click', () => move(1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    lightbox.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, {passive:true});
    lightbox.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 55) move(delta > 0 ? -1 : 1);
    }, {passive:true});
    document.addEventListener('keydown', e => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
    });
    observeReveals();
  }

  const aboutCopy = qs('[data-about-copy]');
  if (aboutCopy) {
    setCurrentNav();
    const image = data.site.aboutImage || data.categories.people.heroMobile;
    const aboutImage = qs('[data-about-image]');
    aboutImage.style.backgroundImage = bg(image, '1100');
    aboutImage.style.backgroundPosition = 'center';
    aboutImage.setAttribute('role', 'img');
    aboutImage.setAttribute('aria-label', image.alt || 'Portrait of Kai Pitre Salgado');
    data.site.about.forEach(text => {
      const p = document.createElement('p'); p.textContent = text; aboutCopy.append(p);
    });
    const meta = document.createElement('div');
    meta.className = 'about-layout__meta';
    meta.textContent = data.site.location;
    aboutCopy.append(meta);
  }

  const contactDetails = qs('[data-contact-details]');
  if (contactDetails) {
    setCurrentNav();
    const links = [{label:data.site.email, href:`mailto:${data.site.email}`}];
    if (data.site.instagram) links.push({label:`Instagram · ${data.site.instagramHandle || '@kai.pitre.sgd'}`, href:data.site.instagram, icon:'instagram'});
    if (data.site.linkedin) links.push({label:'LinkedIn', href:data.site.linkedin});
    links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.href;
      if (link.icon === 'instagram') {
        a.className = 'contact-link contact-link--instagram';
        a.innerHTML = `<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.4" cy="6.6" r="1"></circle></svg><span>${link.label}</span>`;
      } else {
        a.className = 'contact-link';
        a.textContent = link.label;
      }
      if (link.href.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener'; }
      contactDetails.append(a);
    });
  }
})();
