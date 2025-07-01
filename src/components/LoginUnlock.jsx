import React, { useState } from 'react';

function LoginUnlock({ onUnlock, onCreate, error }) {
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState('unlock'); // 'unlock' or 'create'

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'unlock') {
            onUnlock(password);
        } else {
            onCreate(password);
        }
    };

    return (
        <div className="w-full max-w-xs mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
                {mode === 'unlock' ? 'Unlock Authenticator' : 'Create Password'}
            </h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    className="w-full px-3 py-2 mb-3 border rounded focus:outline-none focus:ring focus:border-blue-400 bg-gray-100 dark:bg-gray-700"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold mb-2"
                >
                    {mode === 'unlock' ? 'Unlock' : 'Create'}
                </button>
            </form>
            <button
                className="w-full py-1 text-xs text-gray-500 hover:underline mt-2"
                onClick={() => setMode(mode === 'unlock' ? 'create' : 'unlock')}
            >
                {mode === 'unlock' ? 'Belum ada password? Cipta baru' : 'Sudah ada password? Unlock'}
            </button>
        </div>
    );
}

export default LoginUnlock; 