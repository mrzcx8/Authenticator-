import React, { useRef, useState } from 'react';

function BackupRestoreModal({ open, onClose, onBackup, onRestore }) {
    const fileInput = useRef();
    const [importError, setImportError] = useState('');
    const [importPassword, setImportPassword] = useState('');
    const [importing, setImporting] = useState(false);

    const handleExport = () => {
        onBackup();
    };

    const handleImportClick = () => {
        fileInput.current.click();
    };

    const handleFileChange = async (e) => {
        setImportError('');
        setImporting(true);
        const file = e.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const json = JSON.parse(text);
            if (!importPassword) {
                setImportError('Sila masukkan password untuk decrypt.');
                setImporting(false);
                return;
            }
            await onRestore(json, importPassword, setImportError);
        } catch {
            setImportError('Fail tidak sah atau rosak.');
        }
        setImporting(false);
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>✕</button>
                <h2 className="text-xl font-semibold mb-4">Backup & Restore</h2>
                <div className="flex flex-col gap-4">
                    <button onClick={handleExport} className="py-2 bg-blue-500 text-white rounded">Export Backup</button>
                    <div className="flex flex-col gap-2">
                        <input
                            type="password"
                            className="px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700"
                            placeholder="Password untuk decrypt"
                            value={importPassword}
                            onChange={e => setImportPassword(e.target.value)}
                        />
                        <button onClick={handleImportClick} className="py-2 bg-green-500 text-white rounded">Import Backup</button>
                        <input
                            type="file"
                            accept="application/json"
                            className="hidden"
                            ref={fileInput}
                            onChange={handleFileChange}
                        />
                        {importing && <div className="text-blue-500 text-sm">Importing...</div>}
                        {importError && <div className="text-red-500 text-sm">{importError}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BackupRestoreModal; 