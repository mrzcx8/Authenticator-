import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

function QrScanner({ open, onScan, onError, onClose }) {
    const [error, setError] = useState('');

    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>✕</button>
                <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
                <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-700 rounded">
                    <div className="w-full">
                        <QrReader
                            constraints={{ facingMode: 'environment' }}
                            onResult={(result, err) => {
                                if (!!result) {
                                    onScan(result?.text);
                                }
                                if (!!err && err.name !== 'NotFoundException') {
                                    setError('Kamera gagal: ' + err.message);
                                    onError && onError(err);
                                }
                            }}
                            style={{ width: '100%' }}
                        />
                        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QrScanner; 