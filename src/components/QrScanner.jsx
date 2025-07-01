import React, { useEffect, useRef } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';

function QrScanner({ open, onScan, onClose }) {
    const videoRef = useRef();

    useEffect(() => {
        if (!open) return;
        const codeReader = new BrowserQRCodeReader();
        let active = true;
        codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
            if (result && active) {
                onScan(result.getText());
                onClose();
                active = false;
                codeReader.reset();
            }
        });
        return () => {
            active = false;
            codeReader.reset();
        };
    }, [open, onScan, onClose]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>✕</button>
                <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
                <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-700 rounded">
                    <video ref={videoRef} style={{ width: '100%' }} />
                </div>
            </div>
        </div>
    );
}

export default QrScanner; 