import { Error } from "../interfaces/Error";

/**
 * Error factory
 * @param {string} field for error
 * @param {string} message describing error
 */
export const fieldError: (field: string, message: string) => Error = function(field: string, message: string): Error {
    return {field, message};
}