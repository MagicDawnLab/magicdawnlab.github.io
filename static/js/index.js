/* ===== Carousel Init Registry ===== */
var carouselOpts = { slidesToScroll: 1, slidesToShow: 1, loop: true, infinite: true, autoplay: true, autoplaySpeed: 5000 };
var initializedPanels = {};

function initCarouselsInPanel(panel) {
  var id = panel.id;
  if (initializedPanels[id]) return;
  initializedPanels[id] = true;

  var carousels = panel.querySelectorAll('.carousel');
  if (!carousels.length) return;

  carousels.forEach(function(c) {
    var instances = bulmaCarousel.attach(c, carouselOpts);
    instances.forEach(function(inst) {
      inst.on('show', function() { setTimeout(refreshAllCmp, 50); });
    });
  });

  initSliders();
  initMethodTabs();

  setTimeout(function() { refreshAllCmp(); }, 100);
  setTimeout(function() { refreshAllCmp(); }, 500);
}

/* ===== Paper Panel Switching ===== */
function switchPaper(id) {
  document.querySelectorAll('.paper-view').forEach(function(p) {
    p.classList.remove('is-active');
  });
  var el = document.getElementById(id);
  if (el) { el.classList.add('is-active'); }

  document.querySelectorAll('.picker-card').forEach(function(c) {
    c.classList.toggle('is-active', c.getAttribute('data-target') === id);
  });

  document.querySelectorAll('.bib-panel').forEach(function(b) {
    b.style.display = b.getAttribute('data-paper') === id ? '' : 'none';
  });

  history.replaceState(null, '', '#' + id);

  var hero = document.querySelector('.site-hero');
  if (hero) {
    var y = hero.getBoundingClientRect().bottom + window.pageYOffset;
    window.scrollTo({ top: y - 60, behavior: 'smooth' });
  }

  /* Lazy-init carousels when the panel first becomes visible */
  if (el) {
    setTimeout(function() {
      initCarouselsInPanel(el);
      refreshAllCmp();
    }, 50);
  }
}

/* ===== Refresh comparison overlay widths ===== */
function refreshAllCmp() {
  document.querySelectorAll('.cmp-box').forEach(function(box) {
    if (box.offsetParent === null) return;
    var w = box.getBoundingClientRect().width;
    if (!w) return;
    box.querySelectorAll('.cmp-over img').forEach(function(i) { i.style.width = w + 'px'; });
    var over = box.querySelector('.cmp-over');
    var handle = box.querySelector('.cmp-handle');
    if (over && !over._userMoved) over.style.width = '50%';
    if (handle && !handle._userMoved) handle.style.left = '50%';
  });
}

/* ===== Back-to-top ===== */
function goTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

window.addEventListener('scroll', function() {
  var btn = document.querySelector('.btn-top');
  if (btn) btn.classList.toggle('visible', window.pageYOffset > 300);

  var bar = document.getElementById('site-topbar');
  if (bar) bar.classList.toggle('scrolled', window.pageYOffset > 50);
});

/* ===== DOM Ready ===== */
$(document).ready(function() {
  bulmaSlider.attach();

  /* Init carousels for any visible panel (paper-view or standalone page) */
  var activePanel = document.querySelector('.paper-view.is-active');
  if (activePanel) {
    initCarouselsInPanel(activePanel);
  }

  /* Standalone detail page: init all carousels in <main> */
  if (!activePanel) {
    var mainEl = document.querySelector('main');
    if (mainEl) {
      var carousels = mainEl.querySelectorAll('.carousel');
      if (carousels.length) {
        carousels.forEach(function(c) {
          var instances = bulmaCarousel.attach(c, carouselOpts);
          instances.forEach(function(inst) {
            inst.on('show', function() { setTimeout(refreshAllCmp, 50); });
          });
        });
        initSliders();
        initMethodTabs();
        setTimeout(function() { refreshAllCmp(); }, 100);
        setTimeout(function() { refreshAllCmp(); }, 500);
      }
    }
  }

  /* Handle direct-link to a paper via URL hash */
  var h = location.hash.replace('#', '');
  if (h && document.getElementById(h) && document.getElementById(h).classList.contains('paper-view')) {
    switchPaper(h);
  }

  /* Ensure overlays are correct after all images load */
  window.addEventListener('load', function() {
    refreshAllCmp();
  });
});

/* ===== Comparison Slider Drag ===== */
function initSliders() {
  document.querySelectorAll('.cmp-box').forEach(function(box) {
    if (box._sliderInit) return;
    box._sliderInit = true;
    var handle = box.querySelector('.cmp-handle');
    var over   = box.querySelector('.cmp-over');
    var drag   = false;

    function pos(e) {
      var r = box.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      return Math.max(0, Math.min(x, r.width));
    }
    function move(x) {
      var w = box.getBoundingClientRect().width;
      if (!w) return;
      var p = (x / w) * 100;
      over.style.width = p + '%';
      handle.style.left = p + '%';
      over._userMoved = true;
      handle._userMoved = true;
    }
    function syncW() {
      var w = box.getBoundingClientRect().width;
      if (!w) return;
      over.querySelectorAll('img').forEach(function(i) { i.style.width = w + 'px'; });
    }

    handle.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); drag = true; });
    box.addEventListener('mousedown', function(e) { e.stopPropagation(); drag = true; move(pos(e)); });
    document.addEventListener('mousemove', function(e) { if (drag) { e.preventDefault(); move(pos(e)); } });
    document.addEventListener('mouseup', function() { drag = false; });

    handle.addEventListener('touchstart', function(e) { e.preventDefault(); e.stopPropagation(); drag = true; }, { passive: false });
    box.addEventListener('touchstart', function(e) { e.stopPropagation(); drag = true; move(pos(e)); }, { passive: false });
    box.addEventListener('touchmove', function(e) { if (drag) { e.preventDefault(); e.stopPropagation(); move(pos(e)); } }, { passive: false });
    document.addEventListener('touchmove', function(e) { if (drag) move(pos(e)); });
    document.addEventListener('touchend', function() { drag = false; });

    window.addEventListener('resize', syncW);
    var base = box.querySelector('.cmp-under');
    if (base) { base.complete ? syncW() : base.addEventListener('load', syncW); }
  });
}

/* ===== Method Toggle Tabs ===== */
function initMethodTabs() {
  document.querySelectorAll('.method-switch').forEach(function(sw) {
    if (sw._tabsInit) return;
    sw._tabsInit = true;
    var box = null;
    var node = sw.parentElement;
    while (node && !box) {
      box = node.querySelector('.cmp-box');
      if (!box) node = node.parentElement;
    }
    if (!box) return;
    var over = box.querySelector('.cmp-over');
    var tag  = box.querySelector('.cmp-tag-left');
    var btns = sw.querySelectorAll('.method-btn');

    btns.forEach(function(b) {
      b.addEventListener('click', function(e) {
        e.stopPropagation();
        var m = b.getAttribute('data-method');
        btns.forEach(function(t) { t.classList.remove('is-active'); });
        b.classList.add('is-active');
        over.querySelectorAll('img[data-method]').forEach(function(i) {
          i.style.display = i.getAttribute('data-method') === m ? '' : 'none';
        });
        if (tag) tag.textContent = b.textContent;
        var w = box.getBoundingClientRect().width;
        if (w > 0) {
          var vi = over.querySelector('img[data-method="' + m + '"]');
          if (vi) vi.style.width = w + 'px';
        }
      });
    });
  });
}
