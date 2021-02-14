import react, { useState, useEffect, useContext } from 'react'
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { changeEvent, submitEvent } from "../types";
import { RegisterContext } from "../context/register/RegisterContext"
import { validateEmail, validatePassword, validatePasswords, validateUsername } from "../utils/validate";

import Link from "next/link"

interface RegisterFormProps {
    
}

interface Errors {
    username: string,
    email: string,
    password: string,
    password2: string
}

const register: react.FC<RegisterFormProps> = ({}) => {
    const registerContext = useContext(RegisterContext);

    const [registerState, setRegister] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    })

    const onChange = (e: changeEvent) => {
        const { name, value } = e.target;
        setRegister({
            ...registerState,
            [name]: value
        })
    }

    const registerUser = async (e: submitEvent) => {
        e.preventDefault();
        const {username, email, password, password2} = registerState;
        const errors = {} as Errors;
        const userError = validateUsername(username);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const passwordsError = validatePasswords(password, password2);

        if (userError){
            errors.username = userError;
        }
        if (emailError){
            errors.email = emailError;
        }
        if (passwordError){
            errors.password = passwordError;
        }
        if (passwordsError){
            errors.password2 = passwordsError;
        }
        if (Object.keys(errors).length !== 0){
            registerContext.setErrors(errors);
        }
        else {
            await registerContext.createUser({username, email, password});
            Array.from(document.querySelectorAll('input[type="password"]')).forEach(input => 
                (input as HTMLInputElement).value = ''
            )
            setRegister({
                ...registerState,
                password: '',
                password2: ''
            })
        }
    }

    return (
        <>
        <form onSubmit={registerUser}>
            <InputField 
                type='text' 
                name='username' 
                placeholder='username' 
                label='Username' 
                value={registerState.username} 
                onChange={onChange}
                error={registerContext.errors?.username}
            />
            {registerState.username}
            <InputField
                type='email'
                name='email'
                placeholder='email'
                label='Email'
                value={registerState.email}
                onChange={onChange}
                error={registerContext.errors?.email}
            />
            {registerState.email}
            <InputField
                type='password'
                name='password'
                placeholder='password'
                label='Password'
                value={registerState.password}
                onChange={onChange}
                error={registerContext.errors?.password}
            />
            {registerState.password}
            <InputField
                type='password'
                name='password2'
                placeholder='password'
                label='Confirm Password'
                value={registerState.password2}
                onChange={onChange}
                error={registerContext.errors?.password2}
            />
            {registerState.password2}
            <input 
                type='submit'
                name='submit'
                value='Register'
            />
        </form>
        <span>
            Already have an account? Login
            <Link href="/">
                <a>here</a>                    
            </Link>
        </span>
        <br/>
        </>
    );
}

export default register;