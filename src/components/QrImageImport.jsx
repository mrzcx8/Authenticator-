import React from 'react';

function QrImageImport({ open, onImport, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>✕</button>
                <h2 className="text-xl font-semibold mb-4">Import QR Image</h2>
                <input type="file" accept="image/*" className="mb-4" onChange={e => onImport(e.target.files[0])} />
                <div className="text-gray-500 text-sm">Pilih gambar QR code untuk diimport.</div>
            </div>
        </div>
    );
}

export default QrImageImport; 