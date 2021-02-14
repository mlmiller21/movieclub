import react, {InputHTMLAttributes } from "react";
import styled from "styled-components";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    type: 'text' | 'email' | 'password',
    label: string,
    placeholder: string,
    error: string
}

const StyledInput = styled.div`
    input[type=text], input[type=email], input[type=password] {        
        width: 100%;
        box-sizing: border-box
    }
    p {
        color: red;
    }
`;

const InputField: react.FC<InputFieldProps> = (props) => {
    return(
        <StyledInput>
            <label htmlFor={props.name}>
                {props.label}
            </label>
            <br/>
            <input 
                type={props.type} 
                name={props.name} 
                placeholder={props.placeholder} 
                autoComplete={props.type === 'password' ? 'new-password' : 'off' }
                onChange={props.onChange} 
            />
            {props.error && <p>{props.error}</p>}
        </StyledInput>
    )
}

export default InputField;