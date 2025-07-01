import React from 'react';

function CountdownBar({ timeLeft, duration = 30 }) {
    const percent = (timeLeft / duration) * 100;
    return (
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mt-2">
            <div
                className="h-2 bg-blue-500 rounded transition-all"
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}

export default CountdownBar; 