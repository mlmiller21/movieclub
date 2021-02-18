import { createPassword, comparePassword } from "./password";

const password = 'password';
const password2 = 'password2';

let hashedPassword: string;

describe('Password Tests', () => {
    it('Hash a password', async () => {
        hashedPassword = await createPassword(password);
        expect(typeof hashedPassword).toBe('string');
    });

    it('Compare an equivalent password', async () => {
        const result = await comparePassword(password, hashedPassword);
        expect(result).toBeTruthy();
    });

    it('Compare different passwords', async () => {
        const result = await comparePassword(password2, hashedPassword);
        expect(result).toBeFalsy();
    });
})