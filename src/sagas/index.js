import { all } from 'redux-saga/effects';

import sendWatcher from './send';
import networkWatcher from './network';
import retryWatcher from './retry';

export function* getOfflineSagas () {
    yield all([
        sendWatcher(),
        networkWatcher()
    ]);
}
