// Default configuration definition for DmFirst
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
let isAuthenticated = false;

function loadConfig() {
  try {
    const saved = localStorage.getItem('dmfirst_landing_config');
    if (saved) {
      currentConfig = { ...defaultConfig, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading config:', e);
  }
  
  initFirebaseIfConfigured();
  populateForm();
}

function initFirebaseIfConfigured() {
  if (currentConfig.firebaseApiKey && currentConfig.firebaseProjectId && typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp({
          apiKey: currentConfig.firebaseApiKey,
          projectId: currentConfig.firebaseProjectId,
          databaseURL: currentConfig.firebaseDatabaseUrl,
          authDomain: currentConfig.firebaseAuthDomain
        });
        console.log('Firebase initialized successfully!');
      }

      // 1. Listen to Cloud Firestore
      if (firebase.firestore) {
        const db = firebase.firestore();
        db.collection('config').doc('dmfirst').onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data();
            currentConfig = { ...currentConfig, ...data };
            localStorage.setItem('dmfirst_landing_config', JSON.stringify(currentConfig));
            populateForm();
          }
        }, (err) => console.warn('Firestore sync notice:', err));
      }

      // 2. Listen to Realtime Database
      if (currentConfig.firebaseDatabaseUrl && firebase.database) {
        const dbRef = firebase.database().ref('dmfirst_config');
        dbRef.on('value', (snapshot) => {
          const data = snapshot.val();
          if (data) {
            currentConfig = { ...currentConfig, ...data };
            localStorage.setItem('dmfirst_landing_config', JSON.stringify(currentConfig));
            populateForm();
          }
        }, (err) => console.warn('Realtime DB sync notice:', err));
      }

    } catch (err) {
      console.warn('Firebase init notice:', err);
    }
  }
}

function populateForm() {
  document.getElementById('adminPasscode').value = currentConfig.adminPassword || 'admin123';
  document.getElementById('firebaseApiKey').value = currentConfig.firebaseApiKey || '';
  document.getElementById('firebaseProjectId').value = currentConfig.firebaseProjectId || '';
  document.getElementById('firebaseDatabaseUrl').value = currentConfig.firebaseDatabaseUrl || '';
  document.getElementById('firebaseAuthDomain').value = currentConfig.firebaseAuthDomain || '';

  document.getElementById('banner-preview').src = currentConfig.bannerImage;
  document.getElementById('verifiedBadgeText').value = currentConfig.verifiedBadgeText;
  document.getElementById('mainTitle').value = currentConfig.mainTitle;
  document.getElementById('subTitle').value = currentConfig.subTitle;
  document.getElementById('timerSeconds').value = currentConfig.timerSeconds;
  document.getElementById('autoRedirect').checked = currentConfig.autoRedirect !== false;
  document.getElementById('telegramText').value = currentConfig.telegramText;
  document.getElementById('telegramUrl').value = currentConfig.telegramUrl;
  document.getElementById('statusText').value = currentConfig.statusText;
  document.getElementById('stat1Value').value = currentConfig.stat1Value;
  document.getElementById('stat1Label').value = currentConfig.stat1Label;
  document.getElementById('stat2Value').value = currentConfig.stat2Value;
  document.getElementById('stat2Label').value = currentConfig.stat2Label;
  document.getElementById('stat3Value').value = currentConfig.stat3Value;
  document.getElementById('stat3Label').value = currentConfig.stat3Label;
  document.getElementById('stat4Value').value = currentConfig.stat4Value;
  document.getElementById('stat4Label').value = currentConfig.stat4Label;
  document.getElementById('footerHeading').value = currentConfig.footerHeading;
  document.getElementById('managerName').value = currentConfig.managerName;
  document.getElementById('copyrightText').value = currentConfig.copyrightText;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadConfig();

  const loginModal = document.getElementById('login-modal');
  const adminContent = document.getElementById('admin-content');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const passwordInput = document.getElementById('admin-password-input');
  const logoutBtn = document.getElementById('logout-btn');

  // Handle Login Submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredPassword = passwordInput.value.trim();
    const targetPassword = currentConfig.adminPassword || 'admin123';

    if (enteredPassword === targetPassword) {
      isAuthenticated = true;
      loginModal.style.display = 'none';
      adminContent.style.display = 'block';
      loginError.style.display = 'none';
      showToast('🔓 Panel Unlocked');
    } else {
      loginError.style.display = 'block';
      passwordInput.value = '';
      passwordInput.focus();
    }
  });

  // Handle Logout / Lock
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      isAuthenticated = false;
      adminContent.style.display = 'none';
      loginModal.style.display = 'flex';
      passwordInput.value = '';
      showToast('🔒 Panel Locked');
    });
  }

  // Handle Image Upload with Canvas Optimization
  const imageUploadInput = document.getElementById('image-upload');
  imageUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const maxDim = 320;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > maxDim) { h *= maxDim / w; w = maxDim; }
          } else {
            if (h > maxDim) { w *= maxDim / h; h = maxDim; }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          currentConfig.bannerImage = compressedDataUrl;
          document.getElementById('banner-preview').src = compressedDataUrl;
          showToast('Image uploaded & optimized! Click Save.');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Save Settings to Local Storage & Firebase Cloud
  const adminForm = document.getElementById('admin-form');
  adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPasscode = document.getElementById('adminPasscode').value.trim();
    if (newPasscode) {
      currentConfig.adminPassword = newPasscode;
    }

    currentConfig.firebaseApiKey = document.getElementById('firebaseApiKey').value.trim();
    currentConfig.firebaseProjectId = document.getElementById('firebaseProjectId').value.trim();
    currentConfig.firebaseDatabaseUrl = document.getElementById('firebaseDatabaseUrl').value.trim();
    currentConfig.firebaseAuthDomain = document.getElementById('firebaseAuthDomain').value.trim();

    currentConfig.verifiedBadgeText = document.getElementById('verifiedBadgeText').value;
    currentConfig.mainTitle = document.getElementById('mainTitle').value;
    currentConfig.subTitle = document.getElementById('subTitle').value;
    currentConfig.timerSeconds = document.getElementById('timerSeconds').value;
    currentConfig.autoRedirect = document.getElementById('autoRedirect').checked;
    currentConfig.telegramText = document.getElementById('telegramText').value;
    currentConfig.telegramUrl = document.getElementById('telegramUrl').value;
    currentConfig.statusText = document.getElementById('statusText').value;
    currentConfig.stat1Value = document.getElementById('stat1Value').value;
    currentConfig.stat1Label = document.getElementById('stat1Label').value;
    currentConfig.stat2Value = document.getElementById('stat2Value').value;
    currentConfig.stat2Label = document.getElementById('stat2Label').value;
    currentConfig.stat3Value = document.getElementById('stat3Value').value;
    currentConfig.stat3Label = document.getElementById('stat3Label').value;
    currentConfig.stat4Value = document.getElementById('stat4Value').value;
    currentConfig.stat4Label = document.getElementById('stat4Label').value;
    currentConfig.footerHeading = document.getElementById('footerHeading').value;
    currentConfig.managerName = document.getElementById('managerName').value;
    currentConfig.copyrightText = document.getElementById('copyrightText').value;

    try {
      localStorage.setItem('dmfirst_landing_config', JSON.stringify(currentConfig));

      let cloudSaved = false;

      if (typeof firebase !== 'undefined' && firebase.apps.length && firebase.firestore) {
        try {
          await firebase.firestore().collection('config').doc('dmfirst').set(currentConfig);
          cloudSaved = true;
          console.log('☁️ Successfully saved to Firestore!');
        } catch (fsErr) {
          console.warn('Firestore save notice:', fsErr);
        }
      }

      if (currentConfig.firebaseDatabaseUrl && typeof firebase !== 'undefined' && firebase.apps.length && firebase.database) {
        try {
          await firebase.database().ref('dmfirst_config').set(currentConfig);
          cloudSaved = true;
          console.log('☁️ Successfully saved to Realtime DB!');
        } catch (rtdbErr) {
          console.warn('Realtime DB save notice:', rtdbErr);
        }
      }

      if (cloudSaved) {
        showToast('☁️ Saved to Firebase Cloud (Synced to all devices!)');
      } else {
        showToast('✅ Saved locally');
      }

    } catch (err) {
      console.error('Save failed:', err);
      showToast('❌ Save error');
    }
  });

  // Reset Defaults
  const resetBtn = document.getElementById('reset-btn');
  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      localStorage.removeItem('dmfirst_landing_config');
      currentConfig = { ...defaultConfig };
      populateForm();
      showToast('🔄 Settings reset to default!');
    }
  });
});
