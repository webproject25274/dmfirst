// Default configuration for DmFirst
const defaultConfig = {
  adminPassword: 'admin123',
  firebaseApiKey: 'AIzaSyB04qeNQo-a50_u8kkwPWfj-8O0E7TrvOQ',
  firebaseProjectId: 'landi-1b95a',
  firebaseDatabaseUrl: 'https://landi-1b95a-default-rtdb.firebaseio.com',
  firebaseAuthDomain: 'landi-1b95a.firebaseapp.com',
  bannerImage: 'logo.jpg',
  verifiedBadgeText: 'VERIFIED COMMUNITY',
  mainTitle: 'Join Our Premium Color Trading Community',
  subTitle: 'Daily Trading Signals • Expert Market Analysis • Fast Updates • Trusted Community',
  timerSeconds: 5,
  autoRedirect: true,
  telegramText: 'JOIN TELEGRAM NOW',
  telegramUrl: 'https://t.me/+1YTmls9cP444OGFl',
  statusText: 'ACTIVATED',
  stat1Value: '50K+',
  stat1Label: 'Members',
  stat2Value: '98%',
  stat2Label: 'Satisfaction',
  stat3Value: '10K+',
  stat3Label: 'Active Traders',
  stat4Value: '1500+',
  stat4Label: 'Signals',
  footerHeading: 'Start Your Trading Journey Today',
  managerName: 'DmFirst',
  copyrightText: '© 2026 All Rights Reserved'
};

let currentConfig = { ...defaultConfig };
let timerSecondsLeft = 5;
let timerInterval = null;
let hasRedirected = false;

// Apply configuration data to HTML elements
function renderPage(config) {
  currentConfig = { ...currentConfig, ...config };

  const bannerImgEl = document.getElementById('banner-img');
  if (bannerImgEl && currentConfig.bannerImage) {
    bannerImgEl.src = currentConfig.bannerImage;
  }

  const verifiedBadgeEl = document.getElementById('verified-text');
  if (verifiedBadgeEl) verifiedBadgeEl.textContent = currentConfig.verifiedBadgeText;

  const mainTitleEl = document.getElementById('main-title');
  if (mainTitleEl) mainTitleEl.textContent = currentConfig.mainTitle;

  const subTitleEl = document.getElementById('sub-title');
  if (subTitleEl) subTitleEl.textContent = currentConfig.subTitle;

  const telegramBtnEl = document.getElementById('telegram-btn');
  if (telegramBtnEl) {
    telegramBtnEl.textContent = currentConfig.telegramText;
    telegramBtnEl.href = currentConfig.telegramUrl;
  }

  const statusTextEl = document.getElementById('status-text');
  if (statusTextEl) statusTextEl.textContent = currentConfig.statusText;

  // Stats Grid
  const stat1ValueEl = document.getElementById('stat1-value');
  const stat1LabelEl = document.getElementById('stat1-label');
  if (stat1ValueEl) stat1ValueEl.textContent = currentConfig.stat1Value;
  if (stat1LabelEl) stat1LabelEl.textContent = currentConfig.stat1Label;

  const stat2ValueEl = document.getElementById('stat2-value');
  const stat2LabelEl = document.getElementById('stat2-label');
  if (stat2ValueEl) stat2ValueEl.textContent = currentConfig.stat2Value;
  if (stat2LabelEl) stat2LabelEl.textContent = currentConfig.stat2Label;

  const stat3ValueEl = document.getElementById('stat3-value');
  const stat3LabelEl = document.getElementById('stat3-label');
  if (stat3ValueEl) stat3ValueEl.textContent = currentConfig.stat3Value;
  if (stat3LabelEl) stat3LabelEl.textContent = currentConfig.stat3Label;

  const stat4ValueEl = document.getElementById('stat4-value');
  const stat4LabelEl = document.getElementById('stat4-label');
  if (stat4ValueEl) stat4ValueEl.textContent = currentConfig.stat4Value;
  if (stat4LabelEl) stat4LabelEl.textContent = currentConfig.stat4Label;

  // Footer
  const footerHeadingEl = document.getElementById('footer-heading');
  if (footerHeadingEl) footerHeadingEl.textContent = currentConfig.footerHeading;

  const managerNameEl = document.getElementById('manager-name');
  if (managerNameEl) managerNameEl.textContent = currentConfig.managerName;

  const copyrightTextEl = document.getElementById('copyright-text');
  if (copyrightTextEl) copyrightTextEl.textContent = currentConfig.copyrightText;
}

// Initialize Firebase & listen for live cloud updates across all devices
function initCloudSync() {
  try {
    const saved = localStorage.getItem('dmfirst_landing_config');
    if (saved) {
      renderPage(JSON.parse(saved));
    } else {
      renderPage(defaultConfig);
    }
  } catch (e) {
    renderPage(defaultConfig);
  }

  if (typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp({
          apiKey: defaultConfig.firebaseApiKey,
          projectId: defaultConfig.firebaseProjectId,
          databaseURL: defaultConfig.firebaseDatabaseUrl,
          authDomain: defaultConfig.firebaseAuthDomain
        });
      }

      if (firebase.firestore) {
        const db = firebase.firestore();
        db.collection('config').doc('dmfirst').onSnapshot((doc) => {
          if (doc.exists) {
            const cloudData = doc.data();
            renderPage(cloudData);
            localStorage.setItem('dmfirst_landing_config', JSON.stringify(cloudData));
          }
        }, (err) => console.warn('Firestore sync notice:', err));
      }

      if (firebase.database && defaultConfig.firebaseDatabaseUrl) {
        const dbRef = firebase.database().ref('dmfirst_config');
        dbRef.on('value', (snapshot) => {
          const cloudData = snapshot.val();
          if (cloudData) {
            renderPage(cloudData);
            localStorage.setItem('dmfirst_landing_config', JSON.stringify(cloudData));
          }
        }, (err) => console.warn('Realtime DB sync notice:', err));
      }
    } catch (err) {
      console.warn('Firebase sync error:', err);
    }
  }
}

// Track Meta Pixel Lead event on button click or redirect
function trackLeadEvent() {
  if (typeof fbq === 'function') {
    try {
      fbq('track', 'Lead');
    } catch (e) {
      console.warn('Meta Pixel track error:', e);
    }
  }
}

// Countdown Timer Logic
function startTimer() {
  const timerElement = document.getElementById('countdown-number');
  timerSecondsLeft = parseInt(currentConfig.timerSeconds, 10);
  if (isNaN(timerSecondsLeft) || timerSecondsLeft < 0) timerSecondsLeft = 5;

  if (timerInterval) clearInterval(timerInterval);

  const updateTimer = () => {
    if (timerSecondsLeft > 0) {
      if (timerElement) timerElement.textContent = String(timerSecondsLeft).padStart(2, '0');
      timerSecondsLeft--;
    } else if (timerSecondsLeft === 0) {
      if (timerElement) timerElement.textContent = '00';
      
      if (!hasRedirected && currentConfig.autoRedirect !== false && currentConfig.telegramUrl) {
        hasRedirected = true;
        trackLeadEvent();
        console.log('Redirecting to:', currentConfig.telegramUrl);
        window.location.href = currentConfig.telegramUrl;
      }
      timerSecondsLeft--;
    }
  };

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  initCloudSync();
  startTimer();

  const telegramBtn = document.getElementById('telegram-btn');
  if (telegramBtn) {
    telegramBtn.addEventListener('click', () => {
      trackLeadEvent();
    });
  }
});
