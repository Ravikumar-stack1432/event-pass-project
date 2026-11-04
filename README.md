# 🎓 Event Pass Generator & QR Verification System (College Project)

Yeh ek complete full-stack-ready **Digital ID Pass Generator** aur **QR Code Verification System** ka educational project hai.

---

## 📁 Project Structure (Files Overview)

```
event-pass-project/
├── index.html       -> Admin/User dashboard jahan pass details bhari jati hain aur live card banta hai
├── verify.html      -> Verification portal jo mobile se QR scan karne par open hota hai
├── style.css        -> Card ki layout styling aur Print media stylesheet
├── script.js        -> Dynamic update logic, image upload reader aur automatic QR generator
└── README.md        -> Roadmap aur documentation (yeh file)
```

---

## 🚀 Abhi Ise Run Kaise Karein (How to Run)

### Option 1: Direct Browser me Open Karein
1. Apne computer me `e:\passs\event-pass-project\` folder kholein.
2. `index.html` par double click karein.
3. Kisi bhi browser (Chrome / Edge / Firefox) me live generator khul jayega!

### Option 2: Live Server (Recommended for Mobile QR Testing)
1. Agar aap VS Code use karte hain, toh `Live Server` extension se `index.html` ko run karein (`http://127.0.0.1:5500/...`).
2. Details update karein aur **"🔗 Test QR Link"** button click karke verification test karein.

---

## 🎯 Yeh System Kaise Kaam Karta Hai? (Working Principle)

1. **User Input / Form:**
   Form me aap jo bhi Naam, ID, Duty aur Photo upload karte hain, `script.js` live ID card me render karta hai.

2. **Automatic QR Code Generation:**
   `QRCode.js` library verification URL create karti hai:
   `verify.html?id=VOL-2026-084&name=Rahul&role=Volunteer...`
   Yeh URL direct QR code ke andar encode ho jata hai.

3. **Scanner Flow:**
   Jab koi security guard ya phone camera is QR ko scan karta hai, toh browser direct `verify.html` page open karta hai aur parameters check karke **✅ VERIFIED & AUTHENTIC** display karta hai.

4. **Print / PDF Ready:**
   Jab aap **Print Pass** button click karte hain, toh `@media print` CSS ke zariye form gayab ho jata hai aur sirf print-ready ID card A4/badge size me nikalta hai.

---

## 🗺️ Step-by-Step Project Roadmap (Next Steps)

Agar aapko is project ko college me full viva/submission ke liye next level par le jana hai, toh yeh roadmap follow karein:

### Level 1: Basic Frontend (Abhi Complete Hai ✅)
- [x] Responsive ID card layout
- [x] Client-side photo upload preview
- [x] Live dynamic QR code generation
- [x] Client-side URL-based verification page (`verify.html`)
- [x] Print-to-PDF functionality

### Level 2: Backend + Database (Next Step)
- [ ] **Node.js (Express) ya Python (Flask/FastAPI)** backend setup karein.
- [ ] **Database (SQLite ya MongoDB):** Pass holders ka data (Name, Roll, Photo URL, Status) database me save karein.
- [ ] Database me har pass ka ek unique `uuid` ya `token` generate karein.

### Level 3: Security & Anti-Tampering (Advanced Viva Topic)
- [ ] **Digital Signature (HMAC / JWT):** URL me direct details bhejne ke bajay ek secret key se signed token bhejein.
- [ ] **One-time Entry Check:** Database me field add karein `isEntered: Boolean`. Ek baar QR scan hone par status "Already Checked In" show ho, taaki ek pass par 2 log enter na kar sakein.

### Level 4: Free Online Hosting (Live Deployment)
1. Is folder ko **GitHub** par upload karein.
2. Repository Settings -> **GitHub Pages** enable karein.
3. Ab aapka link ban jayega: `https://your-username.github.io/event-pass-project/`
4. Is live link ke baad aap apne mobile phone ke real camera se paper par print kiye hue pass ko scan karke real-world testing kar sakte hain!

