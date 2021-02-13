import React, { useState, useEffect } from 'react'

interface RegisterProps {

}

const register: React.FC<RegisterProps> = ({}) => {
    const [username, setUsername] = useState('');

    const onSubmit = (e) => {
        
    }

    const onChange = (e) => {
        setUsername(e.target.value);
    }


    return (
        <div>
            <form>
                <input 
                    type='text'
                    name='username'
                    placeholder='username'
                    value={username}
                    onChange={onChange}

                />
                <input
                    type='text'
                    name='email'
                    placeholder='email'
                />
                <input
                    type='password'
                    name='password'
                    placeholder='password'
                />
                <input
                    type='password'
                    name=''
                    placeholder='Please enter password again'
                />
                <input 
                    type='button'
                    name='submit'
                    value='Register'
                />
            </form>
        </div>
    );
}

export default register;