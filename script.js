document.addEventListener('DOMContentLoaded', () => {
  // Typing effect (only if element exists)
  (function typingEffect() {
    const el = document.getElementById('typed-target');
    if (!el) return;
    const titles = ['GRAPHIC DESIGNER', 'WEB DEVELOPER', 'PRODUCT DESIGNER'];
    let i = 0, j = 0, deleting = false;
    function tick() {
      const current = titles[i];
      if (!deleting) {
        el.textContent = current.slice(0, ++j);
        if (j === current.length) setTimeout(() => deleting = true, 900);
      } else {
        el.textContent = current.slice(0, --j);
        if (j === 0) { deleting = false; i = (i + 1) % titles.length; }
      }
      const speed = deleting ? 60 : 90;
      setTimeout(tick, speed);
    }
    tick();
  })();

  
  // Counters (safe if no elements)
  (function countersOnView() {
    const nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const end = Number(el.dataset.count) || 0;
          const duration = 1200;
          const startTime = performance.now();
          function animate(t) {
            const p = Math.min(1, (t - startTime) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(end * eased) + '+';
            if (p < 1) requestAnimationFrame(animate);
          }
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      });
    }, { threshold: .5 });
    nums.forEach(n => observer.observe(n));
  })();

  // Carousel (only if #track exists)
  (function autoCarousel() {
    const track = document.getElementById('track');
    if (!track) return;
    const slides = Array.from(track.children);
    if (!slides.length) return;
    const slideCount = slides.length;
    const gap = 14;
    const firstClone = slides[0].cloneNode(true);
    track.appendChild(firstClone);
    let index = 0;
    function itemWidth() { return slides[0].getBoundingClientRect().width + gap; }
    function move() {
      index++;
      track.style.transition = 'transform .6s ease';
      track.style.transform = `translateX(-${index * itemWidth()}px)`;
      if (index === slideCount) {
        setTimeout(() => {
          track.style.transition = 'none';
          index = 0;
          track.style.transform = 'translateX(0px)';
        }, 600);
      }
    }
    let timer = setInterval(move, 1500);
    const parent = track.parentElement;
    if (parent) {
      parent.addEventListener('mouseenter', () => clearInterval(timer));
      parent.addEventListener('mouseleave', () => timer = setInterval(move, 1500));
    }
    window.addEventListener('resize', () => {
      track.style.transition = 'none';
      track.style.transform = `translateX(-${index * itemWidth()}px)`;
    });
  })();

  // Dark mode toggles (safe)
  function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark');
    document.querySelectorAll('.toggle-mode').forEach(btn => btn.textContent = isDark ? '☀️' : '🌙');
  }
  document.querySelectorAll('.toggle-mode').forEach(btn => btn.addEventListener('click', toggleDarkMode));

  // Hamburger menu (safe)
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('show');
    });
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('show');
    }));
    const closeMenuBtn = document.getElementById('close-menu');
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('show');
    });
  }

  // Expandable sections (safe)
  document.querySelectorAll(".show-more").forEach(button => {
    button.addEventListener("click", () => {
      const targetGrid = document.getElementById(button.dataset.target);
      if (!targetGrid) return;
      targetGrid.querySelectorAll(".card.hidden").forEach(card => card.classList.toggle("hidden"));
      button.textContent = button.textContent.trim() === "Show More" ? "Show Less" : "Show More";
    });
  });

  // Fullscreen image viewer — delegated and resilient
  (function () {
    const viewer = document.getElementById('image-viewer');
    const viewerImg = document.getElementById('viewer-img');
    if (!viewer || !viewerImg) return;

    // Open viewer when any .card img is clicked (delegation)
    document.body.addEventListener('click', (e) => {
      // Open
      if (e.target.matches('.card img')) {
        viewerImg.src = e.target.src;
        viewerImg.alt = e.target.alt || '';
        viewer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        return;
      }

      // Close when clicking the close button or overlay background
      if (e.target.id === 'close-viewer' || e.target.id === 'image-viewer') {
        viewer.classList.add('hidden');
        viewerImg.src = '';
        document.body.style.overflow = '';
        return;
      }
    });
  })();
});
