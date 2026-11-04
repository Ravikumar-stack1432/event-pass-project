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

// Default fallback photo
const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&auto=format&fit=crop&q=80";

// Function to generate the Public Pass URL (pointing to pass.html)
function getPublicPassUrl() {
  const currentUrl = window.location.href.split('?')[0].split('#')[0];
  const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
  const passPage = baseUrl + 'pass.html';

  const params = new URLSearchParams({
    id: inputPassId.value.trim() || 'VOL-2026-001',
    name: inputName.value.trim() || 'Student Name',
    role: inputRole.value.trim() || 'Volunteer',
    dept: inputDept.value.trim() || 'University Campus',
    duty: inputDuty.value.trim() || 'Main Gate',
    mob: inputMobile.value.trim() || '9XXXXXXXXX',
    event: inputEvent.value.trim() || 'Annual Event 2026',
    emg: inputEmergency.value.trim() || '+91 8808160420'
  });

  // If a photo URL is specified
  const photoUrl = inputPhotoUrl.value.trim();
  if (photoUrl) {
    params.set('photo', photoUrl);
  }

  return `${passPage}?${params.toString()}`;
}

// Function to update preview and link
function updatePass() {
  const nameVal = inputName.value.trim() || 'Student Name';
  const roleVal = inputRole.value.trim() || 'VOLUNTEER PASS';
  const idVal = inputPassId.value.trim() || 'VOL-2026-001';
  const deptVal = inputDept.value.trim() || 'Department Name';
  const mobVal = inputMobile.value.trim() || '9XXXXXXXXX';
  const dutyVal = inputDuty.value.trim() || 'Main Gate Area';
  const eventVal = inputEvent.value.trim() || 'EVENT PASS 2026';
  const emgVal = inputEmergency.value.trim() || '+91 8808160420';

  dispName.textContent = nameVal;
  dispRole.textContent = roleVal.toUpperCase();
  dispPassId.textContent = 'क्र. ' + idVal;
  dispDept.textContent = deptVal;
  dispMobile.textContent = mobVal;
  dispDuty.textContent = dutyVal;
  dispEvent.textContent = eventVal;
  dispEmergency.textContent = 'आपात संपर्क सूत्र : ' + emgVal;

  if (inputPhotoUrl.value.trim()) {
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

  // Generate QR code pointing to pass.html
  qrContainer.innerHTML = '';
  if (typeof QRCode !== 'undefined') {
    qrCodeInstance = new QRCode(qrContainer, {
      text: publicUrl,
      width: 82,
      height: 82,
      colorDark: "#1e272e",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  }
}

// Copy link function
function copyShareLink() {
  const publicUrl = getPublicPassUrl();
  navigator.clipboard.writeText(publicUrl).then(() => {
    if (copyFeedback) {
      copyFeedback.style.display = 'block';
      setTimeout(() => {
        copyFeedback.style.display = 'none';
      }, 3000);
    }
  }).catch(err => {
    // Fallback
    shareableLinkInput.select();
    document.execCommand('copy');
    alert('Link Copied to Clipboard!');
  });
}

// Handle Photo File Upload for local preview
if (inputPhotoFile) {
  inputPhotoFile.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        dispPhoto.src = event.target.result;
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
  inputPhotoUrl.value = url;
  dispPhoto.src = url;
  updatePass();
}

window.addEventListener('DOMContentLoaded', () => {
  updatePass();
});
