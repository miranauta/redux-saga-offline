import { eventChannel } from 'redux-saga';

export function getNetworkEventChannel() {
    return eventChannel((emit) => {
        const emitOnline = () => emit({ 'online': true });
        const emitOffline = () => emit({ 'online': false });

        if (typeof window !== 'undefined' && window.addEventListener) {
            window.addEventListener('online', emitOnline);
            window.addEventListener('offline', emitOffline);
        }

        return () => {
            window.removeEventListener('online', emitOnline);
            window.removeEventListener('offline', emitOffline);
        }
    });
}