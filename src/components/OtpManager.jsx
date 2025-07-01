import React, { useState } from 'react';
import AddOtpModal from './AddOtpModal';
import BackupRestoreModal from './BackupRestoreModal';
import DarkModeToggle from './DarkModeToggle';
import OtpEntryCard from './OtpEntryCard';
import useOtpTimer from '../hooks/useOtpTimer';
import { generateOtp } from '../utils/otp';

function OtpManager({ entries, onAdd, onDelete, onBackup, onRestore, onLogout, encryptionKey }) {
    const [showAdd, setShowAdd] = useState(false);
    const [showBackup, setShowBackup] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState(null);
    const timeLeft = useOtpTimer(30);

    const handleCopy = (otp, idx) => {
        navigator.clipboard.writeText(otp);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1000);
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">OTP Manager</h1>
                <div className="flex items-center gap-2">
                    <DarkModeToggle />
                    <button onClick={onLogout} className="text-sm text-red-500 hover:underline">Logout</button>
                </div>
            </div>
            <div className="flex gap-2 mb-6">
                <button onClick={() => setShowAdd(true)} className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">+ Tambah OTP</button>
                <button onClick={() => setShowBackup(true)} className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700">Backup/Restore</button>
            </div>
            <div className="grid gap-4">
                {entries.length === 0 && (
                    <div className="text-center text-gray-400">Tiada OTP. Sila tambah.</div>
                )}
                {entries.map((entry, idx) => {
                    const otp = generateOtp(entry.secret);
                    return (
                        <OtpEntryCard
                            key={idx}
                            entry={entry}
                            otp={otp}
                            timeLeft={timeLeft}
                            onCopy={() => handleCopy(otp, idx)}
                            onDelete={() => onDelete(idx)}
                        >
                            {copiedIdx === idx && <span className="text-green-500 ml-2">Disalin!</span>}
                        </OtpEntryCard>
                    );
                })}
            </div>
            <AddOtpModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={onAdd} />
            <BackupRestoreModal open={showBackup} onClose={() => setShowBackup(false)} onBackup={onBackup} onRestore={onRestore} />
        </div>
    );
}

export default OtpManager; 