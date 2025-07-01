import { authenticator } from 'otplib';

export function generateOtp(secret) {
    return authenticator.generate(secret);
}

export function parseOtpauthUrl(url) {
    // otpauth://totp/Issuer:AccountName?secret=SECRETKEY&issuer=Issuer
    try {
        const u = new URL(url);
        if (u.protocol !== 'otpauth:') return null;
        const type = u.host;
        const label = decodeURIComponent(u.pathname.slice(1));
        const params = Object.fromEntries(u.searchParams.entries());
        let issuer = params.issuer || '';
        let accountName = label;
        if (label.includes(':')) {
            [issuer, accountName] = label.split(':');
        }
        return {
            type,
            issuer,
            accountName,
            secret: params.secret,
        };
    } catch {
        return null;
    }
}

export function isValidSecret(secret) {
    // Basic base32 check
    return /^[A-Z2-7]+=*$/i.test(secret.replace(/\s+/g, ''));
} 