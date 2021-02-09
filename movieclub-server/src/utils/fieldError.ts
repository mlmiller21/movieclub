import { CustomError } from "../interfaces/CustomError";

/**
 * Error factory
 * @param {string} field for error
 * @param {string} message describing error
 */
export const fieldError: (field: string, message: string) => CustomError = function(field: string, message: string): CustomError {
    return {field, message};
}