    const clamp = (n, min, max) => Math.max(min, Math.min(n, max));
    const toRGBA = (hex, alpha=1) => {
      if (!hex) return `rgba(255,255,255,${alpha})`;
      const h = hex.replace('#','');
      const bigint = parseInt(h.length===3 ? h.split('').map(x=>x+x).join('') : h, 16);
      const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
      return `rgba(${r},${g},${b},${alpha})`;
    };

    function createCard(link, settings, index) {
      const a = document.createElement('a');
      a.href = link.url || '#';
      if (settings.openInNewTab) a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('data-aos', 'fade-up');
      a.setAttribute('data-aos-delay', String(60 * (index % 6)));
      a.setAttribute('aria-label', link.title || '链接');

      const radius = link?.style?.radius ?? 16;
      const height = settings.cardHeight ?? 150;
      const hoverScale = settings?.hover?.scale ?? 1.02;
      const hoverLift = settings?.hover?.lift ?? 8;


      const card = document.createElement('div');
      card.className = 'relative overflow-hidden transition-transform duration-300 ease-out';
      card.style.borderRadius = radius + 'px';
      card.style.height = height + 'px';
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = link?.style?.shadow || '0 10px 26px rgba(2,6,23,0.35)';


      const bg = document.createElement('div');
      bg.className = 'absolute inset-0';
      if (link?.bg?.enabled) {
        const type = link?.bg?.type || 'color';
        const val = link?.bg?.value || '#1f2937';
        if (type === 'color') {
          bg.style.background = val;
        } else if (type === 'image') {
          bg.style.backgroundImage = `url("${val}")`;
          bg.style.backgroundSize = 'cover';
          bg.style.backgroundPosition = 'center';
        } else if (type === 'gradient') {
          bg.style.backgroundImage = val;
        }
      } else {

        bg.style.background = 'rgba(255,255,255,0.05)';
        bg.style.backdropFilter = 'blur(8px)';
        bg.style.border = '1px solid rgba(255,255,255,0.08)';
      }


      const needOverlay = link?.bg?.enabled && (link?.bg?.type === 'image' || link?.bg?.type === 'gradient');
      const overlay = document.createElement('div');
      overlay.className = 'absolute inset-0';
      const ov = link.overlay || settings.defaultOverlay;
      overlay.style.background = toRGBA(ov?.color || '#0b1220', clamp(ov?.opacity ?? (needOverlay ? 0.35 : 0), 0, 0.85));


      const content = document.createElement('div');
      content.className = 'relative h-full w-full p-4 flex flex-col items-start justify-between';

      const top = document.createElement('div');
      top.className = 'flex items-center gap-3';

      const iconWrap = document.createElement('div');
      iconWrap.className = 'shrink-0';
      const icon = document.createElement('img');
      icon.alt = link.title || 'logo';
      icon.referrerPolicy = 'no-referrer';
      icon.loading = 'lazy';
      icon.width = 44; icon.height = 44;
      icon.style.width = '44px'; icon.style.height = '44px';
      icon.style.borderRadius = '12px';
      icon.style.boxShadow = '0 6px 16px rgba(0,0,0,.22)';
      icon.src = link.icon || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><rect width="100%" height="100%" rx="12" fill="%2360a5fa"/><text x="50%" y="58%" font-family="Inter,Arial" font-size="18" text-anchor="middle" fill="white">?</text></svg>';
      iconWrap.appendChild(icon);

      const info = document.createElement('div');
      info.className = 'min-w-0';
      const title = document.createElement('div');
      title.className = 'text-base md:text-lg font-semibold tracking-tight';
      title.textContent = link.title || '未命名站点';

      const desc = document.createElement('div');
      desc.className = 'card-desc text-xs md:text-sm opacity-90 mt-0.5';
      desc.textContent = link.desc || '';

      const line1 = document.createElement('div');
      line1.className = 'flex items-center gap-2';

      if (link.badge) {
        const badge = document.createElement('span');
        badge.textContent = link.badge;
        badge.className = 'text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 font-medium';
        line1.appendChild(badge);
      }

      info.appendChild(line1);
      info.appendChild(title);
      info.appendChild(desc);

      top.appendChild(iconWrap);
      top.appendChild(info);

      const bottom = document.createElement('div');
      bottom.className = 'flex items-center justify-between w-full';

      const hint = document.createElement('div');
      hint.className = 'text-xs opacity-80';
      hint.textContent = (new URL(a.href, location.href)).hostname.replace('www.', '');

      const cta = document.createElement('div');
      cta.className = 'inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 transition-colors';
      cta.innerHTML = '<span>打开</span><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" class="opacity-90"><path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"></path><path fill="currentColor" d="M5 5h6V3H3v8h2V5z"></path></svg>';

      bottom.appendChild(hint);
      bottom.appendChild(cta);

      content.appendChild(top);
      content.appendChild(bottom);


      const txtColor = link.textColor || (link?.bg?.enabled ? '#ffffff' : '#e5e7eb');
      [title, desc, hint, cta].forEach(el => el.style.color = txtColor);
      cta.style.borderColor = toRGBA('#ffffff', 0.25);
      cta.style.background = toRGBA('#ffffff', 0.12);


      a.addEventListener('mouseenter', () => {
        card.style.transform = `translateY(${-hoverLift}px) scale(${hoverScale})`;
      });
      a.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });

      card.appendChild(bg);
      card.appendChild(overlay);
      card.appendChild(content);
      a.appendChild(card);
      return a;
    }

    function applyGlobalBackground(settings) {
      const bgConfig = settings?.globalBackground;
      if (!bgConfig?.enabled) {

        document.body.style.background = '#020617';
        return;
      }

      const type = bgConfig.type || 'image';
      const value = bgConfig.value || '';
      
      switch (type) {
        case 'color':
          document.body.style.background = value;
          break;
        case 'image':
          if (value) {
            document.body.style.backgroundImage = `url("${value}")`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
          }
          break;
        case 'gradient':
          document.body.style.background = value;
          break;
        default:
          document.body.style.background = '#020617';
      }
    }

    function render() {
      const cfgEl = document.getElementById('nav-config');
      let data = { settings: {}, links: [] };
      try { data = JSON.parse(cfgEl.textContent.trim()); } catch(e) { console.error('JSON 解析失败', e); }
      const settings = data.settings || {};
      const links = Array.isArray(data.links) ? data.links : [];
      

      applyGlobalBackground(settings);
      
      const root = document.getElementById('cards');
      root.innerHTML = '';
      links.forEach((lnk, i) => root.appendChild(createCard(lnk, settings, i)));
      AOS.init({ duration: 520, once: true, easing: 'ease-out-quart' });
    }


    function attachSearch() {
      const input = document.getElementById('search');
      const cfgEl = document.getElementById('nav-config');
      let original = { settings: {}, links: [] };
      try { original = JSON.parse(cfgEl.textContent.trim()); } catch(e) {}
      input.addEventListener('input', () => {
        const kw = input.value.trim().toLowerCase();
        const filtered = kw
          ? original.links.filter(l => (l.title||'').toLowerCase().includes(kw) || (l.desc||'').toLowerCase().includes(kw))
          : original.links;
        const temp = { settings: original.settings, links: filtered };
        document.getElementById('nav-config').textContent = JSON.stringify(temp);
        render();
      });
    }


    function showConfigPage() {
        const cards = document.getElementById('nav-cards');
        const config = document.getElementById('config-page');
        

        cards.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        cards.style.opacity = '0';
        cards.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            cards.style.display = 'none';
            config.style.display = 'block';
            config.style.opacity = '0';
            config.style.transform = 'translateY(20px)';
            

            requestAnimationFrame(() => {
                config.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                config.style.opacity = '1';
                config.style.transform = 'translateY(0)';
            });
        }, 300);
        
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    function showMainPage() {
        const cards = document.getElementById('nav-cards');
        const config = document.getElementById('config-page');
        

        config.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        config.style.opacity = '0';
        config.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            config.style.display = 'none';
            cards.style.display = 'grid';
            cards.style.opacity = '0';
            cards.style.transform = 'translateY(-20px)';
            

            requestAnimationFrame(() => {
                cards.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                cards.style.opacity = '1';
                cards.style.transform = 'translateY(0)';
            });
        }, 300);
        
        window.scrollTo({top: 0, behavior: 'smooth'});
    }


    document.getElementById('year').textContent = new Date().getFullYear();
    render();
    attachSearch();
    

    if (typeof window !== 'undefined') {
        window.showConfigPage = showConfigPage;
        window.showMainPage = showMainPage;
    }