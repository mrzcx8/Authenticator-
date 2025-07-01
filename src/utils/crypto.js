// crypto.js - Web Crypto API helpers

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function deriveKey(password, salt) {
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
    );
    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

export async function encryptData(key, data) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = encoder.encode(JSON.stringify(data));
    const ciphertext = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoded
    );
    return {
        iv: Array.from(iv),
        ciphertext: Array.from(new Uint8Array(ciphertext)),
    };
}

export async function decryptData(key, { iv, ciphertext }) {
    const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(iv) },
        key,
        new Uint8Array(ciphertext)
    );
    return JSON.parse(decoder.decode(decrypted));
} 