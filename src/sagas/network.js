import { take, select, put, fork } from "redux-saga/effects";

import { getNetworkEventChannel } from '../channels/network';
import {
    changeNetworkStatusToOnline,
    changeNetworkStatusToOffline
} from '../actions';
import { networkStatusSelector } from "../selectors";

export default function* networkWatcher() {
    const networkStatusChannel = getNetworkEventChannel();
    
    yield fork(function* () {
        while(true) {
            const wasOnline = yield select(networkStatusSelector);
            const { online } = yield take(networkStatusChannel);
    
            if(online && !wasOnline) {
                yield put(changeNetworkStatusToOnline());
            } else if(!online && wasOnline) {
                yield put(changeNetworkStatusToOffline());
            }
        }
    });
}