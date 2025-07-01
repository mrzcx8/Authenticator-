import { useEffect, useState } from 'react';

export default function useOtpTimer(duration = 30) {
    const [timeLeft, setTimeLeft] = useState(duration - (Math.floor(Date.now() / 1000) % duration));
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(duration - (Math.floor(Date.now() / 1000) % duration));
        }, 1000);
        return () => clearInterval(interval);
    }, [duration]);
    return timeLeft;
} 