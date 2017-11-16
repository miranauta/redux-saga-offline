import { filter } from 'lodash';

import { LIB_PREFIX } from './constants';
import {
    SEND,
    COMMIT,
    ROLLBACK,
    SCHEDULE_RETRY,
    RETRY,
    NETWORK_STATUS_CHANGE_ONLINE,
    NETWORK_STATUS_CHANGE_OFFLINE
} from './actions';


const incrementAttempt = ({ payload, meta }) => ({
    payload,
    meta : {
        ...meta,
        __rs_attempt__: meta.__rs_attempt__ + 1
    }
});

const toEffect = (payload, meta) => ({
    payload,
    meta
});

const initialState = {
    outbox: [],
    online: true,
    current: 0,
    busy: false
};

const reducer = (state = initialState, { type, payload, meta }) => {
    switch(type) {
        case SEND:
            return {
                ...state,
                outbox: [...state.outbox, toEffect(payload, meta)]
            };

        case COMMIT:
        case ROLLBACK:
            const searchId = meta.__rs_offline_id__;
            const newOutbox = filter(state.outbox, ({ __rs_offline_id__: currId }) => currId !== searchId);
            return {
                ...state,
                outbox: newOutbox,
                busy: false,
                current: state.current >= newOutbox.length - 1 ? 0 : state.current,
            };

        case SCHEDULE_RETRY:
            return {
                ...state,
                busy: false,
                outbox: [...state.outbox, incrementAttempt(toEffect(payload, meta))],
            };

        case RETRY:
            const {
                current,
                outbox
            } = state;

            return {
                ...state,
                busy: true,
                current: current < outbox.length - 1 ? current + 1  : 0,
            };

        case NETWORK_STATUS_CHANGE_ONLINE:
            return {
                ...state,
                online: true,
            };

        case NETWORK_STATUS_CHANGE_OFFLINE:
            return {
                ...state,
                online: false,
            };

        default:
            return state;
    }
};

export function getOfflineReducer() { 
    return { [LIB_PREFIX] : reducer };
}
