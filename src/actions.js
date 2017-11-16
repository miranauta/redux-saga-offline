import { LIB_PREFIX } from './constants';

export const SEND = `${LIB_PREFIX}/SEND`;
export const COMMIT = `${LIB_PREFIX}/COMMIT`;
export const ROLLBACK = `${LIB_PREFIX}/ROLLBACK`;

export const RETRY = `${LIB_PREFIX}/RETRY`;
export const SCHEDULE_RETRY = `${LIB_PREFIX}/RETRY/SCHEDULE`;

export const NETWORK_STATUS_CHANGE_ONLINE = `${LIB_PREFIX}/NETWORK/STATUS/ONLINE`;
export const NETWORK_STATUS_CHANGE_OFFLINE = `${LIB_PREFIX}/NETWORK/STATUS/OFFLINE`;


function createAction(type) {
    return (payload, meta) => ({
        type,
        payload,
        meta
    });
}

export const send = createAction(SEND);
export const commit = createAction(COMMIT);
export const rollback = createAction(ROLLBACK);

export const retry = createAction(RETRY);
export const scheduleRetry = createAction(SCHEDULE_RETRY);

export const changeNetworkStatusToOnline = createAction(NETWORK_STATUS_CHANGE_ONLINE);
export const changeNetworkStatusToOffline = createAction(NETWORK_STATUS_CHANGE_OFFLINE);