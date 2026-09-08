/* ============================================================
 * eggyui 主题 · 顶栏交互（对齐主站 SiteHeader 行为）
 * 汉堡开合 / ESC / 点外关闭 / 滚动加深 / 加载进度条 / 搜索提交
 * ============================================================ */
(function () {
  'use strict';

  var header = document.getElementById('glassHeader');
  var navLinks = document.getElementById('navLinks');
  var hamburger = document.getElementById('hamburgerBtn');
  var loadingBar = document.getElementById('loadingBar');
  var form = header && header.querySelector('.search-form');

  function setScrollLock(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  function closeMenu() {
    if (!navLinks) {
      return;
    }
    navLinks.classList.remove('open');
    if (hamburger) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    setScrollLock(false);
  }

  function toggleMenu() {
    if (!navLinks) {
      return;
    }
    var isOpen = navLinks.classList.contains('open');
    navLinks.classList.toggle('open');
    if (hamburger) {
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(!isOpen));
    }
    setScrollLock(!isOpen);
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // ESC 关闭 + 焦点回到按钮
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      closeMenu();
      if (hamburger) {
        hamburger.focus();
      }
    }
  });

  // 点击外部关闭
  document.addEventListener('click', (e) => {
    if (!header) {
      return;
    }
    if (!header.contains(e.target) && navLinks && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });

  // 滚动加深毛玻璃
  var ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking && header) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 20) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
        ticking = false;
      });
      ticking = true;
    }
  });

  // 加载进度条（视觉装饰）
  function simulateLoading() {
    if (!loadingBar) {
      return;
    }
    var p = 0;
    var step = 2;
    loadingBar.classList.add('active');
    var timer = setInterval(() => {
      p += step;
      if (p >= 100) {
        p = 100;
        clearInterval(timer);
        setTimeout(() => {
          loadingBar.classList.add('done');
          setTimeout(() => {
            loadingBar.classList.remove('active', 'done');
            loadingBar.style.width = '0%';
          }, 500);
        }, 300);
      }
      loadingBar.style.width = p + '%';
    }, 50);
    window.addEventListener('load', () => {
      if (p < 100) {
        clearInterval(timer);
        p = 100;
        loadingBar.style.width = '100%';
        setTimeout(() => {
          loadingBar.classList.add('done');
          setTimeout(() => {
            loadingBar.classList.remove('active', 'done');
            loadingBar.style.width = '0%';
          }, 500);
        }, 300);
      }
    });
  }
  if (document.readyState === 'complete') {
    simulateLoading();
  } else {
    document.addEventListener('DOMContentLoaded', () => { setTimeout(simulateLoading, 100) });
  }

  // 顶栏搜索：点图标 = 提交表单（导航到本站 /search/?q=）
  if (form) {
    var icon = form.querySelector('.search-icon');
    if (icon) {
      icon.addEventListener('click', (e) => {
        e.preventDefault();
        var input = form.querySelector('input[name="q"]');
        if (input && input.value.trim()) {
          form.submit();
        } else if (input) {
          input.focus();
        }
      });
    }
    // 空关键词不提交，聚焦输入框
    form.addEventListener('submit', (e) => {
      var input = form.querySelector('input[name="q"]');
      if (input && !input.value.trim()) {
        e.preventDefault();
        input.focus();
      }
    });
  }
})();
