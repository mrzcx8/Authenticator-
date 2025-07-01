import React, { useState } from 'react';
import { isValidSecret, parseOtpauthUrl } from '../utils/otp';
import QrScanner from './QrScanner';
import QrImageImport from './QrImageImport';

function AddOtpModal({ open, onClose, onAdd }) {
    const [tab, setTab] = useState('manual');
    const [accountName, setAccountName] = useState('');
    const [issuer, setIssuer] = useState('');
    const [secret, setSecret] = useState('');
    const [error, setError] = useState('');
    const [showQrScanner, setShowQrScanner] = useState(false);
    const [showQrImage, setShowQrImage] = useState(false);
    const [importError, setImportError] = useState('');

    // Manual add
    const handleManualAdd = (e) => {
        e.preventDefault();
        if (!accountName.trim() || !issuer.trim() || !secret.trim()) {
            setError('Sila isi semua maklumat.');
            return;
        }
        if (!isValidSecret(secret)) {
            setError('Secret key tidak sah (base32).');
            return;
        }
        onAdd({ accountName: accountName.trim(), issuer: issuer.trim(), secret: secret.replace(/\s+/g, '') });
        setAccountName(''); setIssuer(''); setSecret(''); setError('');
        onClose();
    };

    // Auto-fill from otpauth URL
    const handleOtpauth = (url) => {
        const parsed = parseOtpauthUrl(url);
        if (!parsed || !parsed.secret) {
            setError('QR/URL tidak sah.');
            return;
        }
        setAccountName(parsed.accountName || '');
        setIssuer(parsed.issuer || '');
        setSecret(parsed.secret || '');
        setTab('manual');
        setError('');
    };

    // Scan QR
    const handleScanQr = (data) => {
        if (data) handleOtpauth(data);
        setShowQrScanner(false);
    };

    // Import QR Image
    const handleImportQrImage = async (file) => {
        setShowQrImage(false);
        if (!file) return;
        try {
            // Lazy import jsQR
            const jsQR = (await import('jsqr')).default;
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const code = jsQR(imageData.data, img.width, img.height);
                if (code && code.data) {
                    handleOtpauth(code.data);
                } else {
                    setImportError('QR tidak dapat dibaca.');
                }
            };
        } catch {
            setImportError('Gagal decode QR.');
        }
    };

    // Import File (txt/json)
    const handleImportFile = async (e) => {
        setImportError('');
        const file = e.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            let urls = [];
            if (file.name.endsWith('.json')) {
                const arr = JSON.parse(text);
                urls = Array.isArray(arr) ? arr : [];
            } else {
                urls = text.split(/\r?\n/).filter(Boolean);
            }
            let added = 0;
            urls.forEach(url => {
                const parsed = parseOtpauthUrl(url);
                if (parsed && parsed.secret) {
                    onAdd({ accountName: parsed.accountName, issuer: parsed.issuer, secret: parsed.secret });
                    added++;
                }
            });
            if (added === 0) setImportError('Tiada OTP valid dalam fail.');
            else onClose();
        } catch {
            setImportError('Fail tidak sah.');
        }
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>✕</button>
                <div className="flex gap-2 mb-4">
                    <button className={tab==='manual' ? 'font-bold underline' : ''} onClick={()=>setTab('manual')}>Manual</button>
                    <button className={tab==='scan' ? 'font-bold underline' : ''} onClick={()=>setTab('scan')}>Scan QR</button>
                    <button className={tab==='image' ? 'font-bold underline' : ''} onClick={()=>setTab('image')}>Import QR Image</button>
                    <button className={tab==='file' ? 'font-bold underline' : ''} onClick={()=>setTab('file')}>Import File</button>
                </div>
                <div>
                    {tab === 'manual' && (
                        <form onSubmit={handleManualAdd}>
                            <input
                                type="text"
                                className="w-full px-3 py-2 mb-2 border rounded bg-gray-100 dark:bg-gray-700"
                                placeholder="Nama Akaun"
                                value={accountName}
                                onChange={e => setAccountName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                className="w-full px-3 py-2 mb-2 border rounded bg-gray-100 dark:bg-gray-700"
                                placeholder="Issuer (Aplikasi)"
                                value={issuer}
                                onChange={e => setIssuer(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                className="w-full px-3 py-2 mb-2 border rounded bg-gray-100 dark:bg-gray-700 font-mono"
                                placeholder="Secret Key (Base32)"
                                value={secret}
                                onChange={e => setSecret(e.target.value)}
                                required
                            />
                            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded font-semibold">Tambah</button>
                        </form>
                    )}
                    {tab === 'scan' && (
                        <div>
                            <button className="py-2 px-4 bg-blue-500 text-white rounded mb-2" onClick={()=>setShowQrScanner(true)}>Buka Kamera</button>
                            {showQrScanner && (
                                <QrScanner open={showQrScanner} onScan={handleScanQr} onClose={()=>setShowQrScanner(false)} />
                            )}
                        </div>
                    )}
                    {tab === 'image' && (
                        <div>
                            <button className="py-2 px-4 bg-blue-500 text-white rounded mb-2" onClick={()=>setShowQrImage(true)}>Pilih Gambar</button>
                            {showQrImage && (
                                <QrImageImport open={showQrImage} onImport={handleImportQrImage} onClose={()=>setShowQrImage(false)} />
                            )}
                            {importError && <div className="text-red-500 text-sm mt-2">{importError}</div>}
                        </div>
                    )}
                    {tab === 'file' && (
                        <div>
                            <input type="file" accept=".txt,.json" onChange={handleImportFile} className="mb-2" />
                            {importError && <div className="text-red-500 text-sm mt-2">{importError}</div>}
                            <div className="text-gray-500 text-xs">Satu URL otpauth:// setiap baris (txt) atau array (json).</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddOtpModal; 