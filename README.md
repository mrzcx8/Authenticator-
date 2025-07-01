# Authenticator Web App

A secure, offline-first, client-side authenticator (TOTP) web app — inspired by Google Authenticator, built with React + Tailwind CSS.

## ✨ Features
- **100% Client-side**: No backend, all data stays in your browser
- **Encrypted Storage**: OTP entries are encrypted with your password (AES-GCM, PBKDF2)
- **TOTP Support**: Compatible with Google Authenticator, Authy, etc.
- **Add OTP**: Manual, scan QR (camera), import QR image, import file (.txt/.json)
- **Backup & Restore**: Export/import encrypted JSON backup
- **Copy OTP**: One-click copy to clipboard
- **Dark Mode**: Toggle light/dark theme
- **PWA**: Installable, works offline

## 🛠️ Tech Stack
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [otplib](https://github.com/yeojz/otplib) (TOTP)
- [react-qr-reader](https://github.com/JodusNodus/react-qr-reader) (QR camera)
- [jsQR](https://github.com/cozmo/jsQR) (QR image)
- Web Crypto API (AES-GCM, PBKDF2)

## 🚀 Getting Started

### 1. Clone & Install
```bash
npm install
```

### 2. Run Locally
```bash
npm start
```
App will be available at [http://localhost:3000](http://localhost:3000)

### 3. Build for Production
```bash
npm run build
```

### 4. Deploy (Netlify recommended)
- Connect your repo to [Netlify](https://app.netlify.com/)
- **Build command:** `npm run build`
- **Publish directory:** `build`
- For SPA routing, add `public/_redirects`:
  ```
  /*    /index.html   200
  ```
- Or drag & drop the `build/` folder to Netlify dashboard

## 🔒 Security Notes
- All OTP data is encrypted in your browser using your password (never stored or sent anywhere)
- **Do not lose your password!** There is no way to recover encrypted data without it
- No data is ever sent to any server

## 📱 PWA Support
- Install to home screen for app-like experience
- Works offline (service worker enabled)

## 📝 License
MIT

---

> © {new Date().getFullYear()} Di bangunkan oleh Mr.Syah Hak Cipta Terpelihara 