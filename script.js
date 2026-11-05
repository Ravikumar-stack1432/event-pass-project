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
const uploadStatus = document.getElementById('uploadStatus');

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
const savedPassesTableBody = document.getElementById('savedPassesTableBody');

// Function to generate clean, short, instant-scannable Pass URL
function getPublicPassUrl() {
  let baseUrl;
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

  const params = new URLSearchParams({
    id: idVal,
    n: nameVal,
    r: roleVal,
    d: dutyVal,
    m: mobVal
  });

  if (deptVal && deptVal !== 'Dr Rammanohar Lohia Awadh University Ayodhya') {
    params.set('dept', deptVal);
  }

  // Include photo URL
  const photoUrl = inputPhotoUrl ? inputPhotoUrl.value.trim() : '';
  if (photoUrl) {
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
  const photoVal = inputPhotoUrl ? inputPhotoUrl.value.trim() : '';

  if (dispSerial) dispSerial.textContent = 'क्र. ' + idVal;
  if (dispName) dispName.textContent = nameVal;
  if (dispRole) dispRole.textContent = roleVal;
  if (dispDuty) dispDuty.textContent = dutyVal;
  if (dispMob) dispMob.textContent = mobVal;
  if (dispDept) dispDept.textContent = deptVal;

  if (photoVal && dispPhoto) {
    dispPhoto.src = photoVal;
  }

  // Update public URL
  const publicUrl = getPublicPassUrl();
  if (shareableLinkInput) {
    shareableLinkInput.value = publicUrl;
  }
  if (btnOpenPass) {
    btnOpenPass.href = publicUrl;
  }

  // Generate High-Definition Crisp QR Code
  if (qrImage) {
    const qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=2&data=' + encodeURIComponent(publicUrl);
    qrImage.src = qrApiUrl;
  }

  // Auto-save form fields to localStorage
  saveCurrentFormToStorage();
}

// Upload Image to Free Cloud Hosting automatically
async function uploadImageFile(file) {
  if (!file) return;

  if (uploadStatus) {
    uploadStatus.style.display = 'block';
    uploadStatus.innerHTML = '⏳ Photo cloud par upload ho rahi hai... kripya 2 second wait karein.';
    uploadStatus.style.color = '#d97706';
  }

  // Show immediate local preview
  const localReader = new FileReader();
  localReader.onload = (e) => {
    if (dispPhoto) dispPhoto.src = e.target.result;
  };
  localReader.readAsDataURL(file);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (result && result.status === 'success' && result.data && result.data.url) {
      // Direct download/display URL replaces tmpfiles.org/ with tmpfiles.org/dl/
      const directUrl = result.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      if (inputPhotoUrl) {
        inputPhotoUrl.value = directUrl;
      }
      if (dispPhoto) {
        dispPhoto.src = directUrl;
      }

      if (uploadStatus) {
        uploadStatus.innerHTML = '✅ Photo successfully upload ho gayi! Ab mobile par bhi show hogi.';
        uploadStatus.style.color = '#16a34a';
      }

      // Refresh pass link & QR
      updatePass();
    } else {
      throw new Error('Upload response failed');
    }
  } catch (error) {
    console.error('Image upload failed:', error);
    if (uploadStatus) {
      uploadStatus.innerHTML = '⚠️ Cloud upload me samay lag raha hai. Aap photo URL direct paste bhi kar sakte hain.';
      uploadStatus.style.color = '#dc2626';
    }
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

// Local Photo File Input Handler
if (inputPhotoFile) {
  inputPhotoFile.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      uploadImageFile(file);
    }
  });
}

// Avatar Presets
function setAvatar(url) {
  if (inputPhotoUrl) inputPhotoUrl.value = url;
  if (dispPhoto) dispPhoto.src = url;
  if (uploadStatus) uploadStatus.style.display = 'none';
  updatePass();
}

// Save Current Form to Local Storage (Auto Persistence)
function saveCurrentFormToStorage() {
  const data = {
    id: inputPassId ? inputPassId.value : '',
    name: inputName ? inputName.value : '',
    role: inputRole ? inputRole.value : '',
    dept: inputDept ? inputDept.value : '',
    mob: inputMobile ? inputMobile.value : '',
    duty: inputDuty ? inputDuty.value : '',
    photo: inputPhotoUrl ? inputPhotoUrl.value : ''
  };
  localStorage.setItem('current_editing_pass', JSON.stringify(data));
}

// Restore Last Edited Pass on Page Load
function restoreFormFromStorage() {
  const saved = localStorage.getItem('current_editing_pass');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (inputPassId && data.id) inputPassId.value = data.id;
      if (inputName && data.name) inputName.value = data.name;
      if (inputRole && data.role) inputRole.value = data.role;
      if (inputDept && data.dept) inputDept.value = data.dept;
      if (inputMobile && data.mob) inputMobile.value = data.mob;
      if (inputDuty && data.duty) inputDuty.value = data.duty;
      if (inputPhotoUrl && data.photo) inputPhotoUrl.value = data.photo;
    } catch (e) {}
  }
}

// Save Pass into Pass Records List
function savePassRecord() {
  const record = {
    id: (inputPassId ? inputPassId.value.trim() : '') || 'G09-05739',
    name: (inputName ? inputName.value.trim() : '') || 'अंशुमन',
    role: (inputRole ? inputRole.value.trim() : '') || 'स्वयंसेवक',
    duty: (inputDuty ? inputDuty.value.trim() : '') || 'राम की पैड़ी घाट नं : 9',
    mob: (inputMobile ? inputMobile.value.trim() : '') || '9161914850',
    photo: (inputPhotoUrl ? inputPhotoUrl.value.trim() : '') || '',
    link: getPublicPassUrl(),
    createdAt: new Date().toLocaleTimeString('en-IN')
  };

  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('all_saved_passes')) || [];
  } catch (e) { list = []; }

  // Check if ID already exists, update or add
  const existingIndex = list.findIndex(item => item.id === record.id);
  if (existingIndex >= 0) {
    list[existingIndex] = record;
  } else {
    list.unshift(record);
  }

  localStorage.setItem('all_saved_passes', JSON.stringify(list));
  renderSavedPassesTable();
  alert(`✅ Pass [${record.id} - ${record.name}] successfully save ho gaya!`);
}

// Render Saved Passes Table in Admin Panel
function renderSavedPassesTable() {
  if (!savedPassesTableBody) return;
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('all_saved_passes')) || [];
  } catch (e) { list = []; }

  if (list.length === 0) {
    savedPassesTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:12px;">Abhi koi pass save nahi kiya gaya hai. "💾 Save Pass to Database" par click karein.</td></tr>`;
    return;
  }

  savedPassesTableBody.innerHTML = list.map((item, idx) => `
    <tr>
      <td><strong>${item.id}</strong></td>
      <td>${item.name}</td>
      <td>${item.role}</td>
      <td>${item.duty}</td>
      <td style="white-space:nowrap;">
        <a href="${item.link}" target="_blank" style="color:#0284c7; text-decoration:none; font-weight:700; margin-right:8px;">👁️ Open</a>
        <button onclick="copySpecificLink('${item.link}')" style="background:#16a34a; color:white; border:none; padding:3px 8px; border-radius:4px; cursor:pointer; font-size:11px;">📋 Copy</button>
        <button onclick="deletePassRecord(${idx})" style="background:#ef4444; color:white; border:none; padding:3px 8px; border-radius:4px; cursor:pointer; font-size:11px; margin-left:4px;">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function copySpecificLink(link) {
  navigator.clipboard.writeText(link).then(() => {
    alert("Link Copied!");
  });
}

function deletePassRecord(index) {
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('all_saved_passes')) || [];
    list.splice(index, 1);
    localStorage.setItem('all_saved_passes', JSON.stringify(list));
    renderSavedPassesTable();
  } catch (e) {}
}

// Attach input listeners
const allInputs = [inputEvent, inputRole, inputPassId, inputName, inputDept, inputMobile, inputDuty, inputPhotoUrl];
allInputs.forEach(inp => {
  if (inp) {
    inp.addEventListener('input', updatePass);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  restoreFormFromStorage();
  updatePass();
  renderSavedPassesTable();
});
