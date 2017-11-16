function ReduxSagaOfflineError() {
    this.name = 'ReduxSagaOfflineError';
    this.stack = (new Error()).stack;
}
ReduxSagaOfflineError.prototype = new Error;

export function RollbackableError() {
    this.shouldRollback = true;
}
RollbackableError.prototype = new ReduxSagaOfflineError;

export function AttemptsExceededError() {
    this.name = '[Redux-Saga-Offline] AttemptsExceededError';
    this.message = 'Number of attempts exceeded for this effect. Should rollback.';
}
AttemptsExceededError.prototype = new RollbackableError;
