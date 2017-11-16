import { eventChannel, END } from 'redux-saga';
import { map, forEach } from 'lodash';

import { DELAYS_IN_SECONDS } from '../redux/constants';

import { AttemptsExceededError } from '../errors';


export function shouldReject(error, numberOfAttemps, attempt, shouldAccept) {
    return attempt >= numberOfAttemps && shouldAccept(error);
}

export function getEffectEventChannel(effect, meta, shouldAccept = () => true) {
    const { __rs_attempt__: madeAttempts } = meta; 
    const attempts = DELAYS_IN_SECONDS.length - madeAttempts;

    return eventChannel((emit) => {
        if(attempts <= 0) {
            emit({ error: new AttemptsExceededError() });
            emit(END);
        }


        const timers = [];
        Promise.race(map(DELAYS_IN_SECONDS.slice(madeAttempts), (delay, i) => {
            return new Promise((resolve, reject) => {
                    const t = setTimeout(() => effect()
                        .then(resolve)
                        .catch((e) => {
                            if(shouldReject(e, attempts, i + 1, shouldAccept)) {
                                reject(e);
                            }
                        }), delay * 1000);

                    timers.push(t);
                });
            }))
            .then(function() {
                const data = Array.from(arguments);
                emit({ data });
                emit(END);
            })
            .catch((e) => {
                emit({ error: e });
                emit(END);
            });

        return () => {
            forEach(timers, (t) => clearTimeout(t));
        }
    });
}