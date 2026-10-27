(() => {
  const root = document.documentElement;
  const trigger = document.getElementById('theme-trigger');
  const panel = document.getElementById('theme-panel');
  const closeButton = document.getElementById('panel-close');
  const accentPicker = document.getElementById('accent-picker');
  const modeButtons = [...document.querySelectorAll('[data-theme-mode]')];
  const accentButtons = [...document.querySelectorAll('.accent-choice[data-accent]')];
  const themeNames = { azure: 'Azure Sky', hokage: 'Hokage', 'nine-tails': 'Nine Tails', 'royal-heritage': 'Royal Heritage' };
  const storageKey = 'pavan-portfolio-theme';
  let preference = { mode: 'azure', accent: '1' };

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (stored && ['azure', 'hokage', 'nine-tails', 'royal-heritage'].includes(stored.mode)) {
      preference.mode = stored.mode;
      if (/^[1-9]$/.test(String(stored.accent))) preference.accent = String(stored.accent);
    }
  } catch (_) {
    // A storage restriction should not prevent the theme controls from working.
  }

  function applyPreference(save = false) {
    root.dataset.theme = preference.mode;
    root.dataset.accent = preference.accent;
    trigger.querySelector('.theme-trigger-label').textContent = themeNames[preference.mode];
    trigger.setAttribute('aria-label', `Appearance: ${themeNames[preference.mode]}`);
    modeButtons.forEach((button) => {
      const active = button.dataset.themeMode === preference.mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    accentPicker.hidden = preference.mode !== 'hokage';
    accentButtons.forEach((button) => {
      const active = button.dataset.accent === preference.accent;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const themeColors = { azure: '#f5f9ff', hokage: '#f5f9ff', 'nine-tails': '#10131d', 'royal-heritage': '#111827' };
    document.querySelector('meta[name="theme-color"]').content = themeColors[preference.mode];
    if (save) {
      try { localStorage.setItem(storageKey, JSON.stringify(preference)); } catch (_) { /* Keep theme usable when storage is unavailable. */ }
    }
  }

  function setPanel(open) {
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    if (open) closeButton.focus({ preventScroll: true });
    else trigger.focus({ preventScroll: true });
  }

  trigger.addEventListener('click', () => setPanel(panel.hidden));
  closeButton.addEventListener('click', () => setPanel(false));
  modeButtons.forEach((button) => button.addEventListener('click', () => {
    preference.mode = button.dataset.themeMode;
    applyPreference(true);
  }));
  accentButtons.forEach((button) => button.addEventListener('click', () => {
    preference.accent = button.dataset.accent;
    preference.mode = 'hokage';
    applyPreference(true);
  }));
  document.addEventListener('pointerdown', (event) => {
    if (!panel.hidden && !panel.contains(event.target) && !trigger.contains(event.target)) {
      panel.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setPanel(false);
    if (event.key === 'Escape' && !mobileNav.hidden) setMobileNav(false);
  });

  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  function setMobileNav(open) {
    mobileNav.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  }
  menuToggle.addEventListener('click', () => setMobileNav(mobileNav.hidden));
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMobileNav(false)));
  document.getElementById('year').textContent = String(new Date().getFullYear());

  applyPreference();
})();
