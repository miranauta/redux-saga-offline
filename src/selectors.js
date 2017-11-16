import { LIB_PREFIX } from './constants';

export const selectStateImmutableJS = (state) => state.toJS ? state.toJS() : state;
export const libStateSelector = (state) => selectStateImmutableJS(state)[LIB_PREFIX];
export const networkStatusSelector = (state) => libStateSelector(state).online;
export const outboxSelector = (state) => libStateSelector(state).outbox;
export const currentEffectOnOutboxSelector = (state) => {
    const {
        outbox,
        current
    } = libStateSelector(state);

    return outbox[current];
}