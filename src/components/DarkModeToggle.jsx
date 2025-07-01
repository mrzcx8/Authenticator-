import React, { useEffect, useState } from 'react';

function DarkModeToggle() {
    const [dark, setDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [dark]);

    return (
        <button
            className="ml-2 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs"
            onClick={() => setDark(d => !d)}
            aria-label="Toggle dark mode"
        >
            {dark ? '☾ Dark' : '☀️ Light'}
        </button>
    );
}

export default DarkModeToggle; 