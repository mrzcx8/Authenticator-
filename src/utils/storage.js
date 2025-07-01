const STORAGE_KEY = 'authenticator_data';

export function saveEncryptedData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadEncryptedData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function clearData() {
    localStorage.removeItem(STORAGE_KEY);
} 