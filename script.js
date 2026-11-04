// Live Base URL for GitHub Pages
const LIVE_BASE_URL = "https://ravikumar-stack1432.github.io/event-pass-project/";

// Form Elements
const inputEvent = document.getElementById('inputEvent');
const inputRole = document.getElementById('inputRole');
const inputPassId = document.getElementById('inputPassId');
const inputName = document.getElementById('inputName');
const inputDept = document.getElementById('inputDept');
const inputMobile = document.getElementById('inputMobile');
const inputDuty = document.getElementById('inputDuty');
const inputPhotoUrl = document.getElementById('inputPhotoUrl');
const inputPhotoFile = document.getElementById('inputPhotoFile');

// Preview Elements
const dispEvent = document.getElementById('dispEvent');
const dispRole = document.getElementById('dispRole');
const dispSerial = document.getElementById('dispSerial');
const dispName = document.getElementById('dispName');
const dispDept = document.getElementById('dispDept');
const dispMob = document.getElementById('dispMob');
const dispDuty = document.getElementById('dispDuty');
const dispPhoto = document.getElementById('dispPhoto');
const qrImage = document.getElementById('qrImage');

// Share input & buttons
const shareableLinkInput = document.getElementById('shareableLinkInput');
const btnOpenPass = document.getElementById('btnOpenPass');
const copyFeedback = document.getElementById('copyFeedback');

// Function to generate clean, short, instant-scannable Pass URL
function getPublicPassUrl() {
  let baseUrl;
  // If running locally on computer, use live GitHub Pages URL so phones can open it!
  if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    baseUrl = LIVE_BASE_URL;
  } else {
    const currentUrl = window.location.href.split('?')[0].split('#')[0];
    baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
  }

  const passPage = baseUrl + 'pass.html';

  const idVal = (inputPassId ? inputPassId.value.trim() : '') || 'G09-05739';
  const nameVal = (inputName ? inputName.value.trim() : '') || 'अंशुमन';
  const roleVal = (inputRole ? inputRole.value.trim() : '') || 'स्वयंसेवक';
  const dutyVal = (inputDuty ? inputDuty.value.trim() : '') || 'राम की पैड़ी घाट नं : 9';
  const mobVal = (inputMobile ? inputMobile.value.trim() : '') || '9161914850';
  const deptVal = (inputDept ? inputDept.value.trim() : '') || 'Dr Rammanohar Lohia Awadh University Ayodhya';

  // Using clean query parameters
  const params = new URLSearchParams({
    id: idVal,
    n: nameVal,
    r: roleVal,
    d: dutyVal,
    m: mobVal
  });

  // Only append dept if customized
  if (deptVal && deptVal !== 'Dr Rammanohar Lohia Awadh University Ayodhya') {
    params.set('dept', deptVal);
  }

  // Only append photo if an external URL is used
  const photoUrl = inputPhotoUrl ? inputPhotoUrl.value.trim() : '';
  if (photoUrl && !photoUrl.startsWith('data:image')) {
    params.set('photo', photoUrl);
  }

  return `${passPage}?${params.toString()}`;
}

// Update Card Preview & QR Code
function updatePass() {
  const idVal = (inputPassId ? inputPassId.value.trim() : '') || 'G09-05739';
  const nameVal = (inputName ? inputName.value.trim() : '') || 'अंशुमन';
  const roleVal = (inputRole ? inputRole.value.trim() : '') || 'स्वयंसेवक';
  const dutyVal = (inputDuty ? inputDuty.value.trim() : '') || 'राम की पैड़ी घाट नं : 9';
  const mobVal = (inputMobile ? inputMobile.value.trim() : '') || '9161914850';
  const deptVal = (inputDept ? inputDept.value.trim() : '') || 'Dr Rammanohar Lohia Awadh University Ayodhya';

  if (dispSerial) dispSerial.textContent = 'क्र. ' + idVal;
  if (dispName) dispName.textContent = nameVal;
  if (dispRole) dispRole.textContent = roleVal;
  if (dispDuty) dispDuty.textContent = dutyVal;
  if (dispMob) dispMob.textContent = mobVal;
  if (dispDept) dispDept.textContent = deptVal;

  if (inputPhotoUrl && inputPhotoUrl.value.trim() && dispPhoto) {
    dispPhoto.src = inputPhotoUrl.value.trim();
  }

  // Update public URL
  const publicUrl = getPublicPassUrl();
  if (shareableLinkInput) {
    shareableLinkInput.value = publicUrl;
  }
  if (btnOpenPass) {
    btnOpenPass.href = publicUrl;
  }

  // Generate High-Definition Crisp QR Code (Instant Scan)
  if (qrImage) {
    // 300x300 resolution with margin=2 ensures instant scanning on any camera
    const qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=2&data=' + encodeURIComponent(publicUrl);
    qrImage.src = qrApiUrl;
  }
}

// Copy Shareable Link to Clipboard
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

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(publicUrl).then(() => {
      showCopyToast();
    }).catch(() => {
      fallbackCopy();
    });
  } else {
    fallbackCopy();
  }
}

function fallbackCopy() {
  try {
    const success = document.execCommand('copy');
    if (success) {
      showCopyToast();
    } else {
      prompt("Copy this pass link:", shareableLinkInput ? shareableLinkInput.value : getPublicPassUrl());
    }
  } catch (e) {
    prompt("Copy this pass link:", shareableLinkInput ? shareableLinkInput.value : getPublicPassUrl());
  }
}

function showCopyToast() {
  if (copyFeedback) {
    copyFeedback.style.display = 'block';
    setTimeout(() => {
      copyFeedback.style.display = 'none';
    }, 3000);
  }
}

// Local Photo File Upload
if (inputPhotoFile) {
  inputPhotoFile.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        if (dispPhoto) {
          dispPhoto.src = event.target.result;
        }
        try {
          localStorage.setItem('local_pass_photo', event.target.result);
        } catch (err) {}
      };
      reader.readAsDataURL(file);
    }
  });
}

// Avatar Presets
function setAvatar(url) {
  if (inputPhotoUrl) inputPhotoUrl.value = url;
  if (dispPhoto) dispPhoto.src = url;
  updatePass();
}

// Attach input listeners
const allInputs = [inputEvent, inputRole, inputPassId, inputName, inputDept, inputMobile, inputDuty, inputPhotoUrl];
allInputs.forEach(inp => {
  if (inp) {
    inp.addEventListener('input', updatePass);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  updatePass();
});
