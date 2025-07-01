import React from 'react';

function OtpEntryCard({ entry, otp, timeLeft, onCopy, onDelete }) {
    return (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded shadow p-4">
            <div>
                <div className="font-semibold text-lg">{entry.accountName}</div>
                <div className="text-sm text-gray-500">{entry.issuer}</div>
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-2xl font-mono tracking-widest">{otp}</span>
                    <span className="text-xs text-gray-400">{timeLeft}s</span>
                </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
                <button onClick={onCopy} className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">Copy</button>
                <button onClick={onDelete} className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">Delete</button>
            </div>
        </div>
    );
}

export default OtpEntryCard; 