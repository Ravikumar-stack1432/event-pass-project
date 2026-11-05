// Live Base URL for GitHub Pages
const LIVE_BASE_URL = "https://ravikumar-stack1432.github.io/event-pass-project/";

// Form Elements
const inputPassId = document.getElementById('inputPassId');
const inputRole = document.getElementById('inputRole');
const inputName = document.getElementById('inputName');
const inputMobile = document.getElementById('inputMobile');
const inputDept = document.getElementById('inputDept');
const inputDuty = document.getElementById('inputDuty');
const inputPhotoUrl = document.getElementById('inputPhotoUrl');
const inputPhotoFile = document.getElementById('inputPhotoFile');
const uploadStatus = document.getElementById('uploadStatus');

// Preview Display Elements
const dispSerial = document.getElementById('dispSerial');
const dispName = document.getElementById('dispName');
const dispRole = document.getElementById('dispRole');
const dispDuty = document.getElementById('dispDuty');
const dispMob = document.getElementById('dispMob');
const dispDept = document.getElementById('dispDept');
const dispPhoto = document.getElementById('dispPhoto');
const qrImage = document.getElementById('qrImage');

// Share & Actions
const shareableLinkInput = document.getElementById('shareableLinkInput');
const btnOpenPass = document.getElementById('btnOpenPass');
const copyFeedback = document.getElementById('copyFeedback');
const savedPassesTableBody = document.getElementById('savedPassesTableBody');

// Debounce timer for QR code
let qrDebounceTimer = null;

// Free Permanent Image Host API Key (Freeimage.host / iili.io)
const FREEIMAGE_API_KEY = "6d207e02198a847aa98d0a2a901485a5";

// Default Avatar
const DEFAULT_AVATAR = "profile.jpg";

// Construct public pass URL
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

  const photoUrl = inputPhotoUrl ? inputPhotoUrl.value.trim() : '';
  if (photoUrl && photoUrl !== 'profile.jpg' && !photoUrl.startsWith('data:image') && !photoUrl.includes('tmpfiles.org')) {
    params.set('photo', photoUrl);
  }

  return `${passPage}?${params.toString()}`;
}

// Update the live preview card and debounced QR code
function updatePass() {
  const idVal = (inputPassId ? inputPassId.value.trim() : '') || 'G09-05739';
  const nameVal = (inputName ? inputName.value.trim() : '') || 'अंशुमन';
  const roleVal = (inputRole ? inputRole.value.trim() : '') || 'स्वयंसेवक';
  const dutyVal = (inputDuty ? inputDuty.value.trim() : '') || 'राम की पैड़ी घाट नं : 9';
  const mobVal = (inputMobile ? inputMobile.value.trim() : '') || '9161914850';
  const deptVal = (inputDept ? inputDept.value.trim() : '') || 'Dr Rammanohar Lohia Awadh University Ayodhya';
  const photoVal = inputPhotoUrl ? inputPhotoUrl.value.trim() : '';

  if (dispSerial) dispSerial.textContent = 'क्र.' + idVal;
  if (dispName) dispName.textContent = nameVal;
  if (dispRole) dispRole.textContent = roleVal;
  if (dispDuty) dispDuty.textContent = dutyVal;
  if (dispMob) dispMob.textContent = mobVal;
  if (dispDept) dispDept.textContent = deptVal;

  if (dispPhoto) {
    dispPhoto.onerror = function() {
      if (this.src !== 'profile.jpg') this.src = 'profile.jpg';
    };

    if (photoVal && !photoVal.includes('tmpfiles.org')) {
      dispPhoto.src = photoVal;
    } else {
      dispPhoto.src = DEFAULT_AVATAR;
    }
  }

  const publicUrl = getPublicPassUrl();
  if (shareableLinkInput) {
    shareableLinkInput.value = publicUrl;
  }
  if (btnOpenPass) {
    btnOpenPass.href = publicUrl;
  }

  // Debounced QR code generation
  clearTimeout(qrDebounceTimer);
  qrDebounceTimer = setTimeout(() => {
    if (qrImage) {
      const qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=2&data=' + encodeURIComponent(publicUrl);
      qrImage.src = qrApiUrl;
    }
  }, 250);

  saveFormState();
}

// UPLOAD PHOTO TO PERMANENT CLOUD HOST (Freeimage.host / iili.io CDN)
async function uploadImageFile(file) {
  if (!file) return;

  if (uploadStatus) {
    uploadStatus.style.display = 'block';
    uploadStatus.innerHTML = '⏳ Photo Cloud par upload ho rahi hai... kripya 2 second rukhein.';
    uploadStatus.style.color = '#d97706';
  }

  // 1. Show immediate local preview
  const localReader = new FileReader();
  localReader.onload = function(evt) {
    const base64Local = evt.target.result;
    if (dispPhoto) dispPhoto.src = base64Local;
    const passId = (inputPassId ? inputPassId.value.trim() : '') || 'G09-05739';
    try {
      localStorage.setItem('pass_photo_' + passId, base64Local);
    } catch (e) {}
  };
  localReader.readAsDataURL(file);

  // 2. Upload to permanent CDN
  try {
    const formData = new FormData();
    formData.append('key', FREEIMAGE_API_KEY);
    formData.append('action', 'upload');
    formData.append('source', file);
    formData.append('format', 'json');

    const res = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (data && data.image && data.image.url) {
      const permanentUrl = data.image.url;
      if (inputPhotoUrl) inputPhotoUrl.value = permanentUrl;
      if (dispPhoto) dispPhoto.src = permanentUrl;

      const passId = (inputPassId ? inputPassId.value.trim() : '') || 'G09-05739';
      localStorage.setItem('pass_photo_' + passId, permanentUrl);

      if (uploadStatus) {
        uploadStatus.innerHTML = '✅ Photo cloud par save ho gayi! Mobile QR scan par direct show hogi.';
        uploadStatus.style.color = '#16a34a';
      }

      updatePass();
      return;
    }
  } catch (err) {
    console.warn("Direct upload error:", err);
  }

  // Fallback: Upload as base64 string via secondary API endpoint
  try {
    const base64 = await fileToBase64(file);
    const cleanBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');

    const form = new URLSearchParams();
    form.append('key', FREEIMAGE_API_KEY);
    form.append('action', 'upload');
    form.append('source', cleanBase64);
    form.append('format', 'json');

    const res = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: form
    });
    const data = await res.json();
    if (data && data.image && data.image.url) {
      const permanentUrl = data.image.url;
      if (inputPhotoUrl) inputPhotoUrl.value = permanentUrl;
      if (dispPhoto) dispPhoto.src = permanentUrl;

      if (uploadStatus) {
        uploadStatus.innerHTML = '✅ Photo cloud par save ho gayi! Mobile QR scan par direct show hogi.';
        uploadStatus.style.color = '#16a34a';
      }
      updatePass();
      return;
    }
  } catch (err2) {
    console.warn("Base64 upload error:", err2);
  }

  // If both cloud uploads fail, keep local preview and inform user
  if (uploadStatus) {
    uploadStatus.innerHTML = '⚠️ Local preview set ho gayi hai. Link me default photo display hoga.';
    uploadStatus.style.color = '#2563eb';
  }
  updatePass();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Photo file input handler
if (inputPhotoFile) {
  inputPhotoFile.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      uploadImageFile(file);
    }
  });
}

// Select Avatar Preset
function setAvatar(url) {
  if (inputPhotoUrl) inputPhotoUrl.value = url;
  if (dispPhoto) dispPhoto.src = url;
  if (uploadStatus) uploadStatus.style.display = 'none';

  const passId = (inputPassId ? inputPassId.value.trim() : '') || 'G09-05739';
  localStorage.setItem('pass_photo_' + passId, url);
  updatePass();
}

// Save Current Form State
function saveFormState() {
  const data = {
    id: inputPassId ? inputPassId.value : '',
    role: inputRole ? inputRole.value : '',
    name: inputName ? inputName.value : '',
    mob: inputMobile ? inputMobile.value : '',
    dept: inputDept ? inputDept.value : '',
    duty: inputDuty ? inputDuty.value : '',
    photo: inputPhotoUrl ? inputPhotoUrl.value : ''
  };
  localStorage.setItem('admin_form_state', JSON.stringify(data));
}

// Restore Form State
function restoreFormState() {
  const saved = localStorage.getItem('admin_form_state');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (inputPassId && data.id) inputPassId.value = data.id;
      if (inputRole && data.role) inputRole.value = data.role;
      if (inputName && data.name) inputName.value = data.name;
      if (inputMobile && data.mob) inputMobile.value = data.mob;
      if (inputDept && data.dept) inputDept.value = data.dept;
      if (inputDuty && data.duty) inputDuty.value = data.duty;

      // Clean up legacy expired tmpfiles.org URLs
      if (inputPhotoUrl) {
        if (data.photo && !data.photo.includes('tmpfiles.org') && !data.photo.includes('undefined')) {
          inputPhotoUrl.value = data.photo;
        } else {
          inputPhotoUrl.value = DEFAULT_AVATAR;
        }
      }
    } catch (e) {}
  } else {
    if (inputPhotoUrl) inputPhotoUrl.value = DEFAULT_AVATAR;
  }
}

// Save Pass Record to Database
function savePassRecord() {
  const passId = (inputPassId ? inputPassId.value.trim() : '') || 'G09-05739';
  const nameVal = (inputName ? inputName.value.trim() : '') || 'अंशुमन';
  const roleVal = (inputRole ? inputRole.value.trim() : '') || 'स्वयंसेवक';
  const dutyVal = (inputDuty ? inputDuty.value.trim() : '') || 'राम की पैड़ी घाट नं : 9';
  const mobVal = (inputMobile ? inputMobile.value.trim() : '') || '9161914850';
  const deptVal = (inputDept ? inputDept.value.trim() : '') || 'Dr Rammanohar Lohia Awadh University Ayodhya';
  const photoVal = (inputPhotoUrl ? inputPhotoUrl.value.trim() : '') || DEFAULT_AVATAR;

  const record = {
    id: passId,
    name: nameVal,
    role: roleVal,
    duty: dutyVal,
    mob: mobVal,
    dept: deptVal,
    photo: photoVal,
    link: getPublicPassUrl(),
    savedAt: new Date().toLocaleTimeString('en-IN')
  };

  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('all_saved_passes')) || [];
  } catch (e) { list = []; }

  const existingIdx = list.findIndex(item => item.id === passId);
  if (existingIdx >= 0) {
    list[existingIdx] = record;
  } else {
    list.unshift(record);
  }

  localStorage.setItem('all_saved_passes', JSON.stringify(list));
  renderSavedPassesTable();
  copyShareLink();
  alert(`✅ Pass [${passId} - ${nameVal}] successfully save ho gaya aur link copy ho gaya!`);
}

// Render Saved Passes Table
function renderSavedPassesTable() {
  if (!savedPassesTableBody) return;
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('all_saved_passes')) || [];
  } catch (e) { list = []; }

  if (list.length === 0) {
    savedPassesTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:14px;">Abhi koi pass save nahi hai. Form bhar kar "💾 Save Pass" click karein.</td></tr>`;
    return;
  }

  savedPassesTableBody.innerHTML = list.map((item, idx) => `
    <tr>
      <td><strong>${item.id}</strong></td>
      <td>${item.name}</td>
      <td>${item.role}</td>
      <td>${item.duty}</td>
      <td style="white-space:nowrap;">
        <button onclick="loadPassToForm(${idx})" style="background:#0284c7; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:700;">✏️ Edit</button>
        <a href="${item.link}" target="_blank" style="background:#2563eb; color:white; text-decoration:none; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:700; margin-left:4px;">👁️ View</a>
        <button onclick="copySpecificLink('${item.link}')" style="background:#16a34a; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:700; margin-left:4px;">📋 Copy</button>
        <button onclick="deletePassRecord(${idx})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:700; margin-left:4px;">🗑️</button>
      </td>
    </tr>
  `).join('');
}

// Load a saved pass back into the form
function loadPassToForm(idx) {
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('all_saved_passes')) || [];
    const item = list[idx];
    if (item) {
      if (inputPassId) inputPassId.value = item.id;
      if (inputName) inputName.value = item.name;
      if (inputRole) inputRole.value = item.role;
      if (inputDuty) inputDuty.value = item.duty;
      if (inputMobile) inputMobile.value = item.mob;
      if (inputDept) inputDept.value = item.dept || '';
      if (inputPhotoUrl) inputPhotoUrl.value = item.photo || DEFAULT_AVATAR;
      updatePass();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } catch (e) {}
}

function copySpecificLink(link) {
  navigator.clipboard.writeText(link).then(() => {
    alert("Pass Link Copied!");
  }).catch(() => {
    prompt("Copy this link:", link);
  });
}

function deletePassRecord(idx) {
  if (!confirm("Kya aap is pass ko delete karna chahte hain?")) return;
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('all_saved_passes')) || [];
    list.splice(idx, 1);
    localStorage.setItem('all_saved_passes', JSON.stringify(list));
    renderSavedPassesTable();
  } catch (e) {}
}

// Copy link function
function copyShareLink() {
  const publicUrl = getPublicPassUrl();
  if (shareableLinkInput) {
    shareableLinkInput.value = publicUrl;
    shareableLinkInput.focus();
    shareableLinkInput.select();
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(publicUrl).then(() => {
      showCopyToast();
    }).catch(() => {
      fallbackCopy(publicUrl);
    });
  } else {
    fallbackCopy(publicUrl);
  }
}

function fallbackCopy(url) {
  try {
    document.execCommand('copy');
    showCopyToast();
  } catch (e) {
    prompt("Copy this pass link:", url);
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

// Attach input listeners
const allInputFields = [inputPassId, inputRole, inputName, inputMobile, inputDept, inputDuty, inputPhotoUrl];
allInputFields.forEach(inp => {
  if (inp) {
    inp.addEventListener('input', updatePass);
  }
});

// Initialize on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  restoreFormState();
  updatePass();
  renderSavedPassesTable();
});
