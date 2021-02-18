import { validatePassword } from "./validatePassword";
import { CustomError } from "../interfaces/CustomError";

const field = 'password';
const message = 'password must be at least 8 characters'
const error: CustomError = {field, message};

describe('Validate password', () => {
    it('Password too short', () => {
        expect(validatePassword('')).toStrictEqual(error);
        expect(validatePassword('1234567')).toStrictEqual(error);
    })
    it('Valid password', () => {
        expect(validatePassword('123456789')).toBeNull();
        expect(validatePassword('cas/217$1][|a"')).toBeNull();
    })
})