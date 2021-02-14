import react, { useState, useEffect } from 'react'
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { changeEvent, submitEvent } from "../types";

import Link from "next/link"


interface RegisterProps {
    
}

const register: react.FC<RegisterProps> = ({}) => {
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
        //do validation here?
        //if incorrect I could set an alert context state through here
        //If it's fine then I submit through here
        //when I submit I can set a loading context state until the data arrives?
        //await for the result before continuing, if there's an error then you can do the alert context state through here 
        //so now I guess I need some alert components
    }

    return (

        <Wrapper variant='small'>
            <form onSubmit={registerUser}>
                <InputField 
                    type='text' 
                    name='username' 
                    placeholder='username' 
                    label='Username' 
                    value={registerState.username} 
                    onChange={onChange}
                />
                {registerState.username}
                <InputField
                    type='email'
                    name='email'
                    placeholder='email'
                    label='Email'
                    value={registerState.email}
                    onChange={onChange}
                />
                {registerState.email}
                <InputField
                    type='password'
                    name='password'
                    placeholder='password'
                    label='Password'
                    value={registerState.password}
                    onChange={onChange}
                />
                {registerState.password}
                <InputField
                    type='password'
                    name='password2'
                    placeholder='password'
                    label='Confirm Password'
                    value={registerState.password2}
                    onChange={onChange}
                />
                {registerState.password2}
                <input 
                    type='button'
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
        </Wrapper>
    );
}

export default register;