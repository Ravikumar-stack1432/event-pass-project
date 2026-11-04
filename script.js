// Global QR Code instance
let qrCodeInstance = null;

// DOM Elements
const inputEvent = document.getElementById('inputEvent');
const inputRole = document.getElementById('inputRole');
const inputPassId = document.getElementById('inputPassId');
const inputName = document.getElementById('inputName');
const inputDept = document.getElementById('inputDept');
const inputMobile = document.getElementById('inputMobile');
const inputDuty = document.getElementById('inputDuty');
const inputPhoto = document.getElementById('inputPhoto');
const inputEmergency = document.getElementById('inputEmergency');

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
const btnTestVerify = document.getElementById('btnTestVerify');

// Function to get Verification URL
function getVerificationUrl() {
  const currentUrl = window.location.href.split('?')[0].split('#')[0];
  const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
  const verifyPage = baseUrl + 'verify.html';

  const params = new URLSearchParams({
    id: inputPassId.value.trim(),
    name: inputName.value.trim(),
    role: inputRole.value.trim(),
    dept: inputDept.value.trim(),
    duty: inputDuty.value.trim(),
    mob: inputMobile.value.trim(),
    event: inputEvent.value.trim()
  });

  return `${verifyPage}?${params.toString()}`;
}

// Function to update the ID Card and QR Code
function updateCard() {
  // Sync text fields
  dispEvent.textContent = inputEvent.value || 'COLLEGE EVENT 2026';
  dispRole.textContent = (inputRole.value || 'VOLUNTEER PASS').toUpperCase();
  dispPassId.textContent = 'ID: ' + (inputPassId.value || 'PASS-001');
  dispName.textContent = inputName.value || 'Student Name';
  dispDept.textContent = inputDept.value || 'Department Name';
  dispMobile.textContent = inputMobile.value || '9XXXXXXXXX';
  dispDuty.textContent = inputDuty.value || 'Assigned Zone';
  dispEmergency.textContent = 'EMERGENCY: ' + (inputEmergency.value || '+91 9876543210');

  // Update Verification URL & QR Code
  const verifyUrl = getVerificationUrl();

  if (btnTestVerify) {
    btnTestVerify.href = verifyUrl;
  }

  // Clear previous QR
  qrContainer.innerHTML = '';

  // Generate new QR Code
  if (typeof QRCode !== 'undefined') {
    qrCodeInstance = new QRCode(qrContainer, {
      text: verifyUrl,
      width: 80,
      height: 80,
      colorDark: "#2c3e50",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  }
}

// Handle Photo Upload (reads local image and updates preview)
if (inputPhoto) {
  inputPhoto.addEventListener('change', function (e) {
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

// Attach live input listeners to all input fields
const inputs = [inputEvent, inputRole, inputPassId, inputName, inputDept, inputMobile, inputDuty, inputEmergency];
inputs.forEach(input => {
  if (input) {
    input.addEventListener('input', updateCard);
  }
});

// Initial render when script loads
window.addEventListener('DOMContentLoaded', () => {
  updateCard();
});

