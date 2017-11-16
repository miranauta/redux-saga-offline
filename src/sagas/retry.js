import { 
    select,
    takeEvery
} from 'redux-saga/effects';

import {
    NETWORK_STATUS_CHANGE_ONLINE,
    scheduleRetry,
    retry
} from '../actions';

import {
    networkStatusSelector,
    currentEffectOnOutboxSelector
} from '../selectors';

export function* networkChangeOnlineSaga() {
    const { payload, meta } = yield select(currentEffectOnOutboxSelector);
    const isOnline = yield select(networkStatusSelector);
    
    if(effect && isOnline) {
        yield put(send(payload, meta));
    }
}

export function* networkChangeOnlineWatcher() {
    yield takeEvery(NETWORK_STATUS_CHANGE_ONLINE, networkChangeOnlineSaga);
}