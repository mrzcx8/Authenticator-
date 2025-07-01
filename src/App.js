import React, { useState } from 'react';
import logo from './logo.svg';
import LoginUnlock from './components/LoginUnlock';
import OtpManager from './components/OtpManager';
import { loadEncryptedData, saveEncryptedData, clearData } from './utils/storage';
import { deriveKey, encryptData, decryptData } from './utils/crypto';
// import './styles/tailwind.css';

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [entries, setEntries] = useState([]);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [error, setError] = useState('');

  // Unlock: derive key, decrypt data
  const handleUnlock = async (password) => {
    setError('');
    const encrypted = loadEncryptedData();
    if (!encrypted) {
      setError('Tiada data. Sila cipta password baru.');
      return;
    }
    try {
      const key = await deriveKey(password, encrypted.salt);
      const data = await decryptData(key, encrypted.data);
      setEncryptionKey(key);
      setEntries(data.entries || []);
      setUnlocked(true);
    } catch {
      setError('Password salah atau data rosak.');
    }
  };

  // Create: derive key, simpan data kosong
  const handleCreate = async (password) => {
    setError('');
    const salt = crypto.getRandomValues(new Uint8Array(16)).join('-');
    const key = await deriveKey(password, salt);
    const data = { entries: [] };
    const encrypted = await encryptData(key, data);
    saveEncryptedData({ salt, data: encrypted });
    setEncryptionKey(key);
    setEntries([]);
    setUnlocked(true);
  };

  // Tambah OTP entry
  const handleAdd = async (entry) => {
    const newEntries = [...entries, entry];
    setEntries(newEntries);
    if (encryptionKey) {
      const encrypted = await encryptData(encryptionKey, { entries: newEntries });
      const encryptedData = loadEncryptedData();
      saveEncryptedData({ salt: encryptedData.salt, data: encrypted });
    }
  };

  // Padam OTP entry
  const handleDelete = async (idx) => {
    const newEntries = entries.filter((_, i) => i !== idx);
    setEntries(newEntries);
    if (encryptionKey) {
      const encrypted = await encryptData(encryptionKey, { entries: newEntries });
      const encryptedData = loadEncryptedData();
      saveEncryptedData({ salt: encryptedData.salt, data: encrypted });
    }
  };

  // Backup/export OTP terenkripsi
  const handleBackup = () => {
    const encrypted = loadEncryptedData();
    if (!encrypted) return;
    const blob = new Blob([JSON.stringify(encrypted)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'authenticator-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Restore/import OTP terenkripsi
  const handleRestore = async (json, password, setImportError) => {
    try {
      if (!json.salt || !json.data) throw new Error('Format fail tidak sah');
      const key = await deriveKey(password, json.salt);
      const data = await decryptData(key, json.data);
      if (!Array.isArray(data.entries)) throw new Error('Data tidak sah');
      setEncryptionKey(key);
      setEntries(data.entries);
      saveEncryptedData({ salt: json.salt, data: json.data });
      setUnlocked(true);
      setImportError && setImportError('');
    } catch {
      setImportError && setImportError('Password salah atau fail rosak.');
    }
  };

  // Logout: clear key, entries
  const handleLogout = () => {
    setUnlocked(false);
    setEncryptionKey(null);
    setEntries([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="flex flex-col items-center justify-center h-screen">
        <img src={logo} className="w-24 h-24 mb-4 animate-spin" alt="logo" />
        <h1 className="text-2xl font-bold mb-2">Authenticator Web App</h1>
        {!unlocked ? (
          <LoginUnlock onUnlock={handleUnlock} onCreate={handleCreate} error={error} />
        ) : (
          <OtpManager
            entries={entries}
            encryptionKey={encryptionKey}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onBackup={handleBackup}
            onRestore={handleRestore}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}

export default App;
