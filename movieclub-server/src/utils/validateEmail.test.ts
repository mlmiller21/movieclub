import { validateEmail } from "./validateEmail";
import { CustomError } from "../interfaces/CustomError";

const field = 'email';
const messages = ["email can't be empty", 'email too long', 'local part must be less than 64', 'invalid email, try again']
const error: CustomError = {field, message: ''};
//emailRe = /^[^`'"@]+@[a-zA-Z0-9\-\.]+\.[a-zA-Z0-9\-\.]+$/;

describe('Validate emails', () => {
    it('Valid email', () => {
        expect(validateEmail('test@a1.-.a1.-')).toBeNull();
        expect(validateEmail('test@test.test')).toBeNull();
    })
    it('Email empty', () => {
        error.message = messages[0];
        expect(validateEmail('')).toStrictEqual(error);
    });
    it('Email too long', () => {
        error.message = messages[1];
        const email = 'a'.repeat(255);
        expect(validateEmail(email)).toStrictEqual(error)
    });
    it('Local part of email too long', () => {
        error.message = messages[2];
        const email = `${'a'.repeat(64)}@test.test`;
        expect(validateEmail(email)).toStrictEqual(error);
    })
    describe('Email regex validation', () => {
        beforeAll(() => {
            error.message = messages[3];
        })
        it('Email contains 2 parts, separated with an @ symbol', () => {
            expect(validateEmail('aa')).toStrictEqual(error);
            expect(validateEmail('test.ca')).toStrictEqual(error);
        })
        
        it('Local part of email does not contain dangeours characters(\`, \', ")', () => {
            expect(validateEmail('\`@test.test')).toStrictEqual(error);
            expect(validateEmail('\'@test.test')).toStrictEqual(error);
            expect(validateEmail('\"@test.test')).toStrictEqual(error);
        })
        it('Email local does not contain @ symbol', () => {
            expect(validateEmail('@@test.test')).toStrictEqual(error);
        })
        it('Email\'s domain part contains only letters, numbers, hyphens, and periods', () => {
            const characters = ['`', '~', '!', '@', '#', '$', '^', '&', '*', '(', ')', '+', '=', '[', ']', '{', '}', '\\', '|', ';', ':', '\'', '"', '>', ',', '<', ' ']
            characters.forEach((c) => {
                expect(validateEmail(`test@${c}.test`)).toStrictEqual(error);
                expect(validateEmail(`test@test.${c}`)).toStrictEqual(error);    
            })
        })
    })
})