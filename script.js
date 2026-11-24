/**
 * ŞİLEM OPTİK - İnteraktif Web Sitesi Fonksiyonları
 * - Mobil hamburger menü kontrolü
 * - Header scroll efekti
 * - Ürün filtreleme sekmeleri
 * - Aktif menü vurgulama ve yumuşak kaydırma
 * - Görsel hata yakalama (Image Fallback)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Görsel Fallback Mekanizması (Dosya yolları toleransı)
  initImageFallbacks();

  // 2. Mobil Menü Çekmecesi
  initMobileMenu();

  // 3. Header Sticky & Scroll Stili
  initHeaderScroll();

  // 4. Ürün Filtreleme Sistemi
  initProductFilter();

  // 5. Yumuşak Kaydırma & Aktif Menü Takibi
  initScrollSpy();
});

/**
 * Görsellerin yüklenme durumunu kontrol eder.
 * Eğer göreceli dizin farkından dolayı resim bulunamazsa fallback adreslerini dener.
 */
function initImageFallbacks() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      const src = this.getAttribute('src');
      if (!src) return;

      // Eğer doğrudan "kapak.png" bulunamadıysa "resim/kapak.png" dene
      if (!src.includes('/') && !this.dataset.fallbackTried) {
        this.dataset.fallbackTried = 'true';
        this.src = 'resim/' + src;
      } else if (src.startsWith('resim/') && !this.dataset.fallbackTriedSecond) {
        this.dataset.fallbackTriedSecond = 'true';
        this.src = src.replace('resim/', '');
      }
    });
  });
}

/**
 * Mobil Hamburger Menü Yönetimi
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('mobile-backdrop');
  const closeBtn = document.getElementById('mobile-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openMenu() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ESC tuşuyla kapatma
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * Sayfa kaydırıldığında Header'a .scrolled sınıfı ekler
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Ürünler sekmesindeki kategori filtrelemesi
 */
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (!filterBtns.length || !productCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Aktif buton değiştirme
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * ScrollSpy: Kaydırıldıkça aktif menü elemanını günceller
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}
