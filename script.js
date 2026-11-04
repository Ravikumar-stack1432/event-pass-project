// Global QR Code instance for Admin Preview
let qrCodeInstance = null;

// Form Elements
const inputEvent = document.getElementById('inputEvent');
const inputRole = document.getElementById('inputRole');
const inputPassId = document.getElementById('inputPassId');
const inputName = document.getElementById('inputName');
const inputDept = document.getElementById('inputDept');
const inputMobile = document.getElementById('inputMobile');
const inputDuty = document.getElementById('inputDuty');
const inputPhotoUrl = document.getElementById('inputPhotoUrl');
const inputEmergency = document.getElementById('inputEmergency');
const inputPhotoFile = document.getElementById('inputPhotoFile');

// Card Display Elements
const dispEvent = document.getElementById('dispEvent');
const dispRole = document.getElementById('dispRole');
const dispPassId = document.getElementById('dispPassId');
const dispName = document.getElementById('dispName');
const dispDept = document.getElementById('dispDept');
const dispMobile = document.getElementById('dispMobile');
const dispDuty = document.getElementById('dispDuty');
const dispPhoto = document.getElementById('dispPhoto');
const dispEmergency = document.getElementById('dispEmergency');
const qrContainer = document.getElementById('qrcode-container');

// Action Buttons / Link displays
const shareableLinkInput = document.getElementById('shareableLinkInput');
const btnOpenPass = document.getElementById('btnOpenPass');
const copyFeedback = document.getElementById('copyFeedback');

// Public Live Domain
const LIVE_BASE_URL = "https://ravikumar-stack1432.github.io/event-pass-project/";

// Function to generate the Public Pass URL (pointing to pass.html)
function getPublicPassUrl() {
  let baseUrl;
  // If running from local PC (file:// or localhost), ALWAYS use the live GitHub Pages URL so phones can open it!
  if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    baseUrl = LIVE_BASE_URL;
  } else {
    const currentUrl = window.location.href.split('?')[0].split('#')[0];
    baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
  }

  const passPage = baseUrl + 'pass.html';

  const params = new URLSearchParams({
    id: (inputPassId ? inputPassId.value.trim() : '') || 'G09-05739',
    name: (inputName ? inputName.value.trim() : '') || 'अंशुमन',
    role: (inputRole ? inputRole.value.trim() : '') || 'स्वयंसेवक',
    dept: (inputDept ? inputDept.value.trim() : '') || 'Dr Rammanohar Lohia Avadh University',
    duty: (inputDuty ? inputDuty.value.trim() : '') || 'राम की पैड़ी घाट नं : 9',
    mob: (inputMobile ? inputMobile.value.trim() : '') || '9161914850',
    event: (inputEvent ? inputEvent.value.trim() : '') || 'दीपोत्सव 2026, अयोध्या',
    emg: (inputEmergency ? inputEmergency.value.trim() : '') || '+91 8808160420 / +91 9170838005'
  });

  const photoUrl = inputPhotoUrl ? inputPhotoUrl.value.trim() : '';
  if (photoUrl && !photoUrl.startsWith('data:image')) {
    params.set('photo', photoUrl);
  }

  return `${passPage}?${params.toString()}`;
}

// Function to update preview and link
function updatePass() {
  const nameVal = (inputName ? inputName.value.trim() : '') || 'अंशुमन';
  const roleVal = (inputRole ? inputRole.value.trim() : '') || 'स्वयंसेवक';
  const idVal = (inputPassId ? inputPassId.value.trim() : '') || 'G09-05739';
  const deptVal = (inputDept ? inputDept.value.trim() : '') || 'Dr Rammanohar Lohia Avadh University';
  const mobVal = (inputMobile ? inputMobile.value.trim() : '') || '9161914850';
  const dutyVal = (inputDuty ? inputDuty.value.trim() : '') || 'राम की पैड़ी घाट नं : 9';
  const eventVal = (inputEvent ? inputEvent.value.trim() : '') || 'दीपोत्सव 2026, अयोध्या';
  const emgVal = (inputEmergency ? inputEmergency.value.trim() : '') || '+91 8808160420 / +91 9170838005';

  if (dispName) dispName.textContent = nameVal;
  if (dispRole) dispRole.textContent = roleVal.toUpperCase();
  if (dispPassId) dispPassId.textContent = 'क्र. ' + idVal;
  if (dispDept) dispDept.textContent = deptVal;
  if (dispMobile) dispMobile.textContent = mobVal;
  if (dispDuty) dispDuty.textContent = dutyVal;
  if (dispEvent) dispEvent.textContent = eventVal;
  if (dispEmergency) dispEmergency.textContent = 'आपात संपर्क सूत्र : ' + emgVal;

  if (inputPhotoUrl && inputPhotoUrl.value.trim() && dispPhoto) {
    dispPhoto.src = inputPhotoUrl.value.trim();
  }

  // Update public shareable link
  const publicUrl = getPublicPassUrl();
  if (shareableLinkInput) {
    shareableLinkInput.value = publicUrl;
  }
  if (btnOpenPass) {
    btnOpenPass.href = publicUrl;
  }

  // Generate QR code safely with fallback
  if (qrContainer) {
    qrContainer.innerHTML = '';
    try {
      if (typeof QRCode !== 'undefined') {
        qrCodeInstance = new QRCode(qrContainer, {
          text: publicUrl,
          width: 82,
          height: 82,
          colorDark: "#1e272e",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.L
        });
      } else {
        // Fallback to QR Server API if QRCode.js isn't loaded
        const img = document.createElement('img');
        img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=82x82&data=' + encodeURIComponent(publicUrl);
        img.alt = 'QR Code';
        img.width = 82;
        img.height = 82;
        qrContainer.appendChild(img);
      }
    } catch (err) {
      console.warn("QRCode local generation failed, using API fallback:", err);
      const img = document.createElement('img');
      img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=82x82&data=' + encodeURIComponent(publicUrl);
      img.alt = 'QR Code';
      img.width = 82;
      img.height = 82;
      qrContainer.appendChild(img);
    }
  }
}

// Show Copy Success Message
function showCopySuccess() {
  if (copyFeedback) {
    copyFeedback.style.display = 'block';
    setTimeout(() => {
      copyFeedback.style.display = 'none';
    }, 3000);
  }
}

// Copy link function (Works on both HTTPS and file:// protocols)
function copyShareLink() {
  const publicUrl = getPublicPassUrl();
  
  if (shareableLinkInput) {
    shareableLinkInput.value = publicUrl;
    shareableLinkInput.focus();
    shareableLinkInput.select();
    if (shareableLinkInput.setSelectionRange) {
      shareableLinkInput.setSelectionRange(0, 99999);
    }
  }

  // Try modern navigator.clipboard first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(publicUrl).then(() => {
      showCopySuccess();
    }).catch(() => {
      fallbackCopy();
    });
  } else {
    fallbackCopy();
  }
}

function fallbackCopy() {
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showCopySuccess();
    } else {
      prompt("Copy this link:", shareableLinkInput ? shareableLinkInput.value : getPublicPassUrl());
    }
  } catch (err) {
    prompt("Copy this link:", shareableLinkInput ? shareableLinkInput.value : getPublicPassUrl());
  }
}

// Handle Photo File Upload for local preview
if (inputPhotoFile) {
  inputPhotoFile.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        if (dispPhoto) {
          dispPhoto.src = event.target.result;
        }
        // Save to localStorage so pass.html on this machine can load it
        try {
          localStorage.setItem('local_pass_photo', event.target.result);
        } catch (e) {
          console.warn("Photo too large for localStorage");
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

// Attach input listeners
const allInputs = [inputEvent, inputRole, inputPassId, inputName, inputDept, inputMobile, inputDuty, inputPhotoUrl, inputEmergency];
allInputs.forEach(input => {
  if (input) {
    input.addEventListener('input', updatePass);
  }
});

// Select avatar presets
function setAvatar(url) {
  if (inputPhotoUrl) inputPhotoUrl.value = url;
  if (dispPhoto) dispPhoto.src = url;
  updatePass();
}

window.addEventListener('DOMContentLoaded', () => {
  updatePass();
});
