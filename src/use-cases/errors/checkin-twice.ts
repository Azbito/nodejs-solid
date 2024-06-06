export class InvalidCheckInError extends Error {
    constructor() {
        super("It's not possible to check in twice in the same day.")
    }
}