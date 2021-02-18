import { validateUsername } from "./validateUsername";
import { CustomError } from "../interfaces/CustomError";

const field = 'username';
const messages = ['length must be at least 3', 'length must be 50 or less', 'Letters, numbers, dashes, and underscores only']
const error: CustomError = {field, message: ''};

describe('Validate username', () => {
    it('Valid username', () => {
        expect(validateUsername('a1-_')).toBeNull();
    })
    it('Username too short', () => {
        error.message = messages[0];
        expect(validateUsername('')).toStrictEqual(error);
        expect(validateUsername('ab')).toStrictEqual(error);
    })
    it('Username too long', () => {
        error.message = messages[1];
        expect(validateUsername(`${'a'.repeat(51)}`)).toStrictEqual(error);
    })
    it('Username invalid characters', () => {
        error.message = messages[2];
        const characters = ['`', '~', '!', '@', '#', '$', '^', '&', '*', '(', ')', '+', '=', '[', ']', '{', '}', '\\', '|', ';', ':', '\'', '"', '>', ',', '<', '.', ' ']
        characters.forEach((c) => {
            expect(validateUsername(c.repeat(3))).toStrictEqual(error);
        })
    })
})