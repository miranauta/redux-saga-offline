import {
    call,
    take,
    takeEvery,
    put
} from 'redux-saga/effects';

import uuid from '../utils/uuid';

import {
    SEND,
    commit,
    rollback
} from '../actions';

import {
    getEffectEventChannel
} from '../channels/effect';

import {
    RollbackableError
} from '../errors';

export function* sendSaga({ payload: effect, meta: effectMeta }) {
    const {
        commit: doCommit,
        rollback: doRollback,
    } = effectMeta;

    const __rs_offline_id__ = effectMeta.__rs_offline_id__ || uuid();
    const __rs_attempt__ = effectMeta.__rs_attempt__ || 0;
    const meta = {
        ...effectMeta,
        __rs_offline_id__,
        __rs_attempt__
    };

    const effectChannel =  yield call(getEffectEventChannel, effect, meta);
    try {
        while(true) {
            const {
                data,
                error
            } = yield take(effectChannel);
            
            if(data) {
                yield put(commit(effect, meta));
                if(doCommit) {
                    yield put(doCommit(...data, meta));
                }
            } else if(error) {
                throw error;
            }
        }
    } catch(e) {
        if(e instanceof RollbackableError) {
            yield put(rollback(e, meta));
            
            if(doRollback) {
                yield put(doRollback(e, meta));
            }
        }
    }
}

export default function* sendWatcher() {
    yield takeEvery(SEND, sendSaga);
}